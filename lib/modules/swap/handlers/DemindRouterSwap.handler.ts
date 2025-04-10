import { Path, Slippage, TokenApi } from "@balancer/sdk";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { SorSwapType } from "../swap.types";
import {
  DemindRouterBuildSwapInputs,
  DemindRouterSimulateSwapResponse,
  SimulateSwapInputs,
} from "../swap.types";
import { demindRouterAbi } from "../../web3/contracts/abi/demind";
import {
  getChainId,
  getNetworkConfig,
  getWrappedNativeAssetAddress,
} from "@/lib/configs/app.config";
import { Address, encodeFunctionData, formatUnits } from "viem";
import { getViemClient } from "@/lib/services/viem/viem.client";
import { bn } from "@/lib/utils/numbers";
import { TransactionConfig } from "../../web3/contracts/contract.types";
import { isNativeAsset } from "../../tokens/tokenHelper";
import { SwapHandler } from "./Swap.handler";
import { GlobalToken } from "../../tokens/token.types";

type TradeSummary = {
  amountIn: bigint;
  amountOut: bigint;
  path: Address[];
  executors: Address[];
};

type AllowableSwapFunction =
  | "swapNoSplit"
  | "swapNoSplitFromNative"
  | "swapNoSplitToNative";

type validMaxHops = 1 | 2 | 3 | 4;

export class DemindRouterSwapHandler implements SwapHandler {
  name = "DemindRouterSwapHandler";

  private inPathExecutors: Address[] = [];
  private getToken: (
    address: Address,
    chain: GlobalChain
  ) => GlobalToken | undefined;

  constructor(
    getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined
  ) {
    this.getToken = getToken;
  }

  async simulate({
    chain,
    tokenIn,
    tokenOut,
    swapType,
    swapAmount,
    swapScaledAmount,
  }: SimulateSwapInputs): Promise<DemindRouterSimulateSwapResponse> {
    const networkConfig = getNetworkConfig(chain);
    const routerAddress = networkConfig.contracts.router as Address;

    const publicClient = getViemClient(chain);

    // 处理 tokenIn 或 tokenOut 是native token的情况, 对报价函数来说, 需要将native token转换为wrapped native token
    if (isNativeAsset(tokenIn, chain)) {
      tokenIn = getWrappedNativeAssetAddress(chain) as Address;
    }
    if (isNativeAsset(tokenOut, chain)) {
      tokenOut = getWrappedNativeAssetAddress(chain) as Address;
    }

    const maxHops: validMaxHops = 4;
    console.log("tokenIn: ", tokenIn);
    console.log("tokenOut: ", tokenOut);
    console.log("swapScaledAmount: ", swapScaledAmount);

    const bestPath = await publicClient.readContract({
      address: routerAddress,
      abi: demindRouterAbi,
      functionName: "findBestPath",
      args: [
        swapScaledAmount,
        tokenIn,
        tokenOut,
        BigInt(maxHops), // 最大跳数指swap路径中经过executors的最大数量
      ],
    });

    const { amounts, path, executors } = bestPath;
    if (executors.length === 0)
      throw new Error("No router found in swap query output");

    const hasBestPath = executors.length > 0;
    const inputAmount = amounts[0];
    const outputAmount = hasBestPath ? amounts[amounts.length - 1] : BigInt(0);
    const hopCount: number = executors.length;

    this.inPathExecutors = executors as Address[];

    const sdkPath: Path = {
      tokens: path.map((address) => {
        const apiToken = this.getToken(address, chain);
        return {
          address: address,
          decimals: apiToken?.decimals,
        } as TokenApi;
      }),
      inputAmountRaw: inputAmount,
      outputAmountRaw: outputAmount,
      pools: [],
      protocolVersion: 1,
    };

    const tokenOutDecimals = sdkPath.tokens[sdkPath.tokens.length - 1].decimals;
    const returnAmount = formatUnits(outputAmount, tokenOutDecimals);

    return {
      protocolVersion: 2,
      hopCount,
      swapType,
      returnAmount,
      paths: [sdkPath],
      effectivePrice: bn(swapAmount).div(returnAmount).toString(),
      effectivePriceReversed: bn(returnAmount).div(swapAmount).toString(),
      router: routerAddress,
    };
  }

  // tokenIn,
  // tokenOut,
  // swapType,
  // account: userAddress,
  // slippagePercent: slippage,
  // selectedChain,
  // simulateResponse,
  build({
    tokenIn,
    tokenOut,
    simulateResponse: { paths, swapType },
    slippagePercent,
    account,
    selectedChain,
  }: DemindRouterBuildSwapInputs): TransactionConfig {
    const networkConfig = getNetworkConfig(selectedChain);
    const routerAddress = networkConfig.contracts.router as Address;

    // const { paths, swapType } = simulateResponse;
    const path = paths[0];

    const amountIn = path.inputAmountRaw;
    const amountOut = path.outputAmountRaw;

    const slippage = Slippage.fromPercentage(slippagePercent as `${number}`);
    const minAmountOut =
      swapType === SorSwapType.ExactIn
        ? slippage.applyTo(amountOut, -1)
        : amountOut;

    // 从报价函数得到的模拟路径(paths)是不考虑native token的,
    // 涉及到native token的交易，合约处理的paths需要以wrapped native token为起点/终点
    // 在合约swapNoSplitFromNative函数内部会将发送的native token包装成wrapped native token
    // 在合约swapNoSplitToNative函数内部会将输出的wrapped native token解包装成native token并发送给用户
    const isNativeIn = isNativeAsset(tokenIn.address, selectedChain);
    const isNativeOut = isNativeAsset(tokenOut.address, selectedChain);

    const trade = {
      amountIn,
      amountOut: minAmountOut,
      path: path.tokens.map((token) => token.address),
      executors: this.inPathExecutors,
    } as TradeSummary;

    let functionName: AllowableSwapFunction = "swapNoSplit";
    let value = 0n;
    if (isNativeIn) {
      functionName = "swapNoSplitFromNative";
      value = amountIn;
    } else if (isNativeOut) {
      functionName = "swapNoSplitToNative";
    }

    console.log("executors: ", this.inPathExecutors);

    return {
      account,
      chainId: getChainId(selectedChain),
      to: routerAddress,
      data: this.encodeSwapFunction(functionName, trade, account, 0),
      value,
    };
  }

  private encodeSwapFunction(
    functionName: AllowableSwapFunction,
    trade: TradeSummary,
    recipient: Address,
    fee: number
  ) {
    return encodeFunctionData({
      abi: demindRouterAbi,
      functionName: functionName,
      args: [trade, recipient, BigInt(fee)],
    });
  }
}
