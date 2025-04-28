import { OSwapAction, SdkSimulateSwapResponse, SwapAction } from "./swap.types";
import { SwapSimulationQueryResult } from "./queries/useSimulateSwapQuery";

export function swapActionPastTense(action: SwapAction): string {
  switch (action) {
    case OSwapAction.WRAP:
      return "Wrapped";
    case OSwapAction.UNWRAP:
      return "Unwrapped";
    case OSwapAction.SWAP:
      return "Swapped";
    default:
      throw new Error("Unsupported swap action");
  }
}

const swapErrorPatterns = [
  {
    pattern: /WrapAmountTooSmall/,
    message: "Your input is too small, please try a bigger amount.",
  },
];

export function parseSwapError(msg?: string): string {
  if (!msg) return "Unknown error";
  const pattern = swapErrorPatterns.find((p) => p.pattern.test(msg));
  return pattern ? pattern.message : msg;
}
