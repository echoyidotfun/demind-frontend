import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { AggregatorSwapHandler } from "./Swap.handler";
import {
  BuildSwapInputs,
  SimulateSwapInputs,
  RouterApiSimulateSwapResponse,
} from "../swap.types";
import { TransactionConfig } from "../../web3/contracts/contract.types";
import { Address, formatUnits } from "viem";
import { getChainId, getNetworkConfig } from "@/lib/configs/app.config";
import { isNativeAsset } from "../../tokens/tokenHelper";
import { bn } from "@/lib/utils/numbers";
import { GlobalToken } from "../../tokens/token.types";

// Navi API使用的原生代币S地址
const NAVI_NATIVE_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export class NaviRouterSwapHandler implements AggregatorSwapHandler {
  name = "Navi-X";
  isAggregator = true as const;
  getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined;

  constructor(
    getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined
  ) {
    this.getToken = getToken;
  }

  isAvailable(chain: GlobalChain): boolean {
    // Navi目前只支持Sonic链
    return chain === GlobalChain.Sonic;
  }

  // 处理原生代币地址转换
  private convertNativeTokenAddress(
    address: Address,
    chain: GlobalChain
  ): Address {
    const networkConfig = getNetworkConfig(chain);
    if (
      address.toLowerCase() ===
      networkConfig.tokens.nativeAsset.address.toLowerCase()
    ) {
      return NAVI_NATIVE_TOKEN_ADDRESS as Address;
    }
    return address;
  }

  async simulate({
    chain,
    tokenIn,
    tokenOut,
    swapType,
    swapAmount,
    swapScaledAmount,
  }: SimulateSwapInputs): Promise<RouterApiSimulateSwapResponse> {
    // 检查链是否支持
    if (!this.isAvailable(chain)) {
      throw new Error(`${this.name} does not support ${chain}`);
    }

    // 转换原生代币地址为Navi期望的格式
    const naviTokenIn = this.convertNativeTokenAddress(tokenIn, chain);
    const naviTokenOut = this.convertNativeTokenAddress(tokenOut, chain);

    // 构建route API请求 (用于获取报价，不包含交易数据)
    const slippage = 0.5; // 默认滑点0.5%

    // 调用route API
    const response = await fetch(
      `https://swap-api.navigator.exchange/sonic/v2/route?` +
        `amount=${swapScaledAmount}&` +
        `from=${naviTokenIn}&` +
        `to=${naviTokenOut}&` +
        `slippage=${slippage}&` +
        `source=microswap`
    );

    if (!response.ok) {
      throw new Error(`Navi route API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const tokenOutDecimals = this.getToken(tokenOut, chain)?.decimals || 18;

    // 计算human-readable的returnAmount
    const scaledReturnAmount = data.totalTo;
    const returnAmount = formatUnits(
      BigInt(scaledReturnAmount),
      tokenOutDecimals
    );

    // 确定是否需要发送原生代币
    const value = isNativeAsset(tokenIn, chain)
      ? BigInt(data.totalFrom || "0")
      : BigInt(0);

    // 获取路由地址 - 从配置中获取或使用固定地址
    const networkConfig = getNetworkConfig(chain);
    const routerAddress = networkConfig.contracts.naviXRouter as Address;

    // 转换为统一格式
    return {
      provider: this.name,
      returnAmount,
      effectivePrice: bn(swapAmount).div(returnAmount).toString(),
      effectivePriceReversed: bn(returnAmount).div(swapAmount).toString(),
      swapType,
      hopCount: data.paths[0]?.swaps.length || 0,
      router: routerAddress,
      calldata: "0x", // 在simulate阶段不需要实际的calldata
      value,
      paths: data.paths,
    };
  }

  async build({
    tokenIn,
    tokenOut,
    account,
    slippagePercent,
    selectedChain,
  }: BuildSwapInputs): Promise<TransactionConfig> {
    // 现在build方法是异步的，可以直接调用API获取交易数据
    const slippage = parseFloat(slippagePercent) / 100; // 转换为小数
    const swapAmount = tokenIn.scaledAmount.toString();

    // 转换原生代币地址为Navi期望的格式
    const naviTokenInAddress = this.convertNativeTokenAddress(
      tokenIn.address,
      selectedChain
    );
    const naviTokenOutAddress = this.convertNativeTokenAddress(
      tokenOut.address,
      selectedChain
    );

    // 调用swap API
    const response = await fetch(
      `https://swap-api.navigator.exchange/sonic/v2/swap?` +
        `amount=${swapAmount}&` +
        `receiver=${account}&` +
        `from=${naviTokenInAddress}&` +
        `to=${naviTokenOutAddress}&` +
        `slippage=${slippage}&` +
        `source=microswap`
    );

    if (!response.ok) {
      throw new Error(`Navi swap API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Navi swap data:", data);

    // 确定是否需要发送原生代币
    const value = isNativeAsset(tokenIn.address, selectedChain)
      ? BigInt(data.quote.totalFrom || "0")
      : BigInt(0);

    return {
      account,
      chainId: getChainId(selectedChain),
      to: data.encodedData.router as Address,
      data: data.encodedData.data,
      value,
    };
  }
}
