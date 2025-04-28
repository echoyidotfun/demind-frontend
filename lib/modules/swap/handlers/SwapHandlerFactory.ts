import { SwapHandler, AggregatorSwapHandler } from "./Swap.handler";
import { NaviRouterSwapHandler } from "./NaviRouterSwap.handler";
import { NativeWrapHandler } from "./NativeWrap.handler";
import { AggregatorCoordinator } from "../AggregatorCoordinator";
import { GlobalToken } from "../../tokens/token.types";
import { Address } from "viem";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { isNativeWrap } from "../wrap.helper";

/**
 * 创建所有可用的聚合器处理器
 */
export function createSwapHandlers(
  getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined
): AggregatorSwapHandler[] {
  return [new NaviRouterSwapHandler(getToken)];
}

/**
 * 创建聚合器协调器
 */
export function createAggregatorCoordinator(
  getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined
): AggregatorCoordinator {
  const handlers = createSwapHandlers(getToken);
  return new AggregatorCoordinator(handlers);
}

/**
 * 根据交易的token和链选择合适的处理器
 */
export function selectSwapHandler(
  tokenInAddress: Address,
  tokenOutAddress: Address,
  chain: GlobalChain,
  getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined
): AggregatorSwapHandler | SwapHandler {
  // 原生代币包装/解包操作使用特殊处理器
  if (isNativeWrap(tokenInAddress, tokenOutAddress, chain)) {
    return new NativeWrapHandler();
  }

  // 使用聚合器协调器处理其他所有交易
  return createAggregatorCoordinator(getToken);
}
