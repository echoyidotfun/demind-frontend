import { ApolloClient } from "@apollo/client";
import { TransactionConfig } from "../../web3/contracts/contract.types";
import {
  BuildSwapInputs,
  SimulateSwapResponse,
  SimulateSwapInputs,
  RouterApiSimulateSwapResponse,
} from "../swap.types";
import { GlobalToken } from "../../tokens/token.types";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";

export type AnySwapHandler = SwapHandler | AggregatorSwapHandler;

/**
 * SwapHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 */
export interface SwapHandler {
  apolloClient?: ApolloClient<object>;
  tokens?: GlobalToken[];
  name: string;
  isAvailable?(chain: GlobalChain): boolean | Promise<boolean>;

  simulate(inputs: SimulateSwapInputs): Promise<SimulateSwapResponse>;
  build(inputs: BuildSwapInputs): TransactionConfig;
}

/**
 * AggregatorSwapHandler 扩展了SwapHandler接口，
 * 适用于需要异步构建交易的聚合器（如需要API调用获取calldata）
 */
export interface AggregatorSwapHandler extends Omit<SwapHandler, "build"> {
  /**
   * 异步构建交易数据
   * 用于需要额外API调用的聚合器
   */
  simulate(inputs: SimulateSwapInputs): Promise<RouterApiSimulateSwapResponse>;
  build(inputs: BuildSwapInputs): Promise<TransactionConfig>;

  /**
   * 判断当前handler是否为聚合器处理程序
   */
  isAggregator: true;
}
