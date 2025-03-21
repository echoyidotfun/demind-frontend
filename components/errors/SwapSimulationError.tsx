/* eslint-disable react/no-unescaped-entities */
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { ErrorAlert } from "@/components/errors/ErrorAlert";
import { parseSwapError } from "@/lib/modules/swap/swap.helper";
import { useSwap } from "@/lib/modules/swap/SwapProvider";
import { swapApolloNetworkErrorMessage } from "@/lib/utils/errors";

type Props = {
  errorMessage?: string;
};
export function SwapSimulationError({ errorMessage }: Props) {
  const { tokenIn, tokenOut, selectedChain } = useSwap();

  if (errorMessage?.includes("must contain at least 1 path")) {
    return (
      <ErrorAlert
        title={`Not enough liquidity on ${PROJECT_CONFIG.projectName}`}
      >
        Your swap amount is too high to find a route through the available
        liquidity on {PROJECT_CONFIG.projectName}. Try reducing your swap size.
      </ErrorAlert>
    );
  }

  if (errorMessage === swapApolloNetworkErrorMessage) {
    return (
      <ErrorAlert title="Network error">
        It looks like there was a network error while fetching the swap. Please
        check your internet connection and try again.
      </ErrorAlert>
    );
  }

  return (
    <ErrorAlert title="Error fetching swap">
      {parseSwapError(errorMessage)}
    </ErrorAlert>
  );
}
