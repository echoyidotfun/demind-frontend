"use client";

import { defaultDebounceMs, onlyExplicitRefetch } from "@/lib/utils/queries";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { AnySwapHandler, SwapHandler } from "../handlers/Swap.handler";
import { swapQueryKeys } from "./swapQueryKeys";
import {
  SdkSimulateSwapResponse,
  SimulateSwapInputs,
  SimulateSwapResponse,
} from "../swap.types";
import { sentryMetaForSwapHandler } from "@/lib/utils/query-errors";
import { isZero } from "@/lib/utils/numbers";
import { getChainId } from "@/lib/configs/app.config";
import { useBlockNumber } from "wagmi";
import { Address } from "viem";
import { isWrapWithTooSmallAmount } from "@/lib/utils/error-filters";

export type SwapSimulationQueryResult = ReturnType<typeof useSimulateSwapQuery>;
export type SdkSimulationResponseWithRouter = SdkSimulateSwapResponse & {
  router: Address;
};

export type SimulateSwapParams = {
  handler: AnySwapHandler;
  swapInputs: SimulateSwapInputs;
  enabled: boolean;
};

export function useSimulateSwapQuery({
  handler,
  swapInputs: {
    swapAmount,
    chain,
    tokenIn,
    tokenOut,
    swapType,
    swapScaledAmount,
  },
  enabled = true,
}: SimulateSwapParams) {
  const debouncedSwapAmount = useDebounce(swapAmount, defaultDebounceMs)[0];

  const inputs = {
    swapAmount: debouncedSwapAmount,
    swapType,
    tokenIn,
    tokenOut,
    chain,
    swapScaledAmount,
  };

  const chainId = getChainId(chain);
  const { data: blockNumber } = useBlockNumber({ chainId });

  const queryKey = swapQueryKeys.simulation(inputs);

  const queryFn = async () => handler.simulate(inputs);

  return useQuery<SimulateSwapResponse, Error>({
    queryKey,
    queryFn,
    enabled: enabled && !isZero(debouncedSwapAmount),
    gcTime: 0,
    retry(failureCount, error) {
      if (isWrapWithTooSmallAmount(error?.message)) {
        // Avoid more retries
        return false;
      }
      // 2 retries by default
      return failureCount < 2;
    },
    meta: sentryMetaForSwapHandler("Error in swap simulation query", {
      chainId: getChainId(chain),
      blockNumber,
      handler,
      swapInputs: inputs,
      enabled,
    }),
    ...onlyExplicitRefetch,
  });
}
