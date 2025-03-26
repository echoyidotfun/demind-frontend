import { PathParams } from "@/lib/modules/swap/SwapProvider";

export function getSwapPathParams(slug?: string[]): PathParams {
  const [chain, ...rest] = slug ?? [];
  if (!rest?.length) {
    return {
      chain,
    };
  }
  const [tokenIn, tokenOut, amountIn, amountOut] = rest ?? [];
  return { chain, tokenIn, tokenOut, amountIn, amountOut };
}
