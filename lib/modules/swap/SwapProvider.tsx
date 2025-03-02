"use client";

import { createContext, PropsWithChildren } from "react";
import { Hash } from "viem";

export const SwapContext = createContext<SwapProviderProps | null>(null);

export type PathParams = {
  chain?: string;
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: string;
  amountOut?: string;
  urlTxHash?: Hash;
};

export type SwapProviderProps = {
  pathParams: PathParams;
};

type Props = PropsWithChildren<{
  params: SwapProviderProps;
}>;

export function SwapProvider({ params, children }: Props) {
  return <SwapContext.Provider value={params}>{children}</SwapContext.Provider>;
}
