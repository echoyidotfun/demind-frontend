import { isHash } from "viem";
import { PathParams } from "@/lib/modules/swap/SwapProvider";

export function getSwapPathParams(slug?: string[]): PathParams {
  const [chain, ...rest] = slug ?? [];
  if (!rest?.length) {
    return {
      chain,
    };
  }
  const maybeTxhash = rest[0];
  const urlTxHash = isHash(maybeTxhash) ? maybeTxhash : undefined;

  const [tokenIn, tokenOut, amountIn, amountOut] = rest ?? [];
  return { chain, tokenIn, tokenOut, amountIn, amountOut };
}
