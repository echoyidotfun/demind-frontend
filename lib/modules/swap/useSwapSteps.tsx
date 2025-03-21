import { getChainId } from "@/lib/configs/app.config";
import { useMemo } from "react";
import { Address, parseUnits } from "viem";
import { ApprovalAction } from "@/lib/modules/tokens/approvals/approval-labels";
import { RawAmount } from "@/lib/modules/tokens/approvals/approval-rules";
import { useTokenApprovalSteps } from "@/lib/modules/tokens/approvals/useTokenApprovalSteps";
import { orderRouteVersion } from "@/lib/modules/swap/swap.helper";
import { OSwapAction } from "./swap.types";
// import { useSignPermit2SwapStep } from './usePermit2SwapStep'
import { SwapStepParams, useSwapStep } from "./useSwapStep";
// import { permit2Address } from '../tokens/approvals/permit2/permit2.helpers'
import { isNativeAsset } from "../tokens/tokenHelper";

type Params = SwapStepParams & {
  routerAddress: Address;
  // TODO: remove this field once we refactor to use:
  // https://github.com/balancer/b-sdk/issues/462
};

export function useSwapSteps({
  routerAddress,
  swapState,
  handler,
  wethIsEth,
  simulationQuery,
  swapAction,
  tokenInInfo,
  tokenOutInfo,
}: Params) {
  const chain = swapState.selectedChain;

  const hasSimulationQuery = !!simulationQuery;

  const humanAmountIn = swapState.tokenIn.amount;
  const tokenInAmounts = useMemo(() => {
    if (!tokenInInfo) return [] as RawAmount[];
    return [
      {
        address: tokenInInfo.address as Address,
        rawAmount: parseUnits(humanAmountIn, tokenInInfo.decimals),
      },
    ];
  }, [humanAmountIn, tokenInInfo]);

  const approvalActionType: ApprovalAction =
    swapAction === OSwapAction.UNWRAP ? "Unwrapping" : "Swapping";

  const { isLoading: isLoadingTokenApprovalSteps, steps: tokenApprovalSteps } =
    useTokenApprovalSteps({
      spenderAddress: routerAddress,
      chain,
      approvalAmounts: tokenInAmounts,
      actionType: approvalActionType,
      wethIsEth,
      enabled: hasSimulationQuery,
    });

  const swapStep = useSwapStep({
    handler,
    wethIsEth,
    swapState,
    simulationQuery,
    swapAction,
    tokenInInfo,
    tokenOutInfo,
  });

  // native tokenIn does not require permit2 signature
  const isNativeTokenIn =
    tokenInInfo && isNativeAsset(tokenInInfo?.address, chain);

  const steps = useMemo(() => {
    const swapSteps = [swapStep];

    return [...tokenApprovalSteps, ...swapSteps];
  }, [tokenApprovalSteps, swapStep, isNativeTokenIn]);

  return {
    isLoadingSteps: isLoadingTokenApprovalSteps,
    steps,
  };
}
