import { getChainId, getNativeAssetAddress } from "@/lib/configs/app.config";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { isSameAddress } from "@/lib/utils/addresses";
import { sentryMetaForWagmiSimulation } from "@/lib/utils/query-errors";
import { useMemo } from "react";
import { Address, encodeFunctionData, erc20Abi } from "viem";
import { ManagedErc20TransactionButton } from "../../transactions//TransactionButton";
import { TransactionStep, TxCall } from "../../transactions/lib";
import { ManagedErc20TransactionInput } from "../../web3/contracts/useManagedErc20Transaction";
import { useTokenAllowances } from "@/lib/modules/web3/useTokenAllowances";
import { useUserAccount } from "../../web3/UserAccountProvider";
import { useTokens } from "../TokensProvider";
import { ApprovalAction, buildTokenApprovalLabels } from "./approval-labels";
import {
  RawAmount,
  areEmptyRawAmounts,
  getRequiredTokenApprovals,
} from "./approval-rules";
import { requiresDoubleApproval } from "../tokenHelper";

export type Params = {
  spenderAddress: Address;
  chain: GlobalChain;
  approvalAmounts: RawAmount[];
  actionType: ApprovalAction;
  isPermit2?: boolean;
  bptSymbol?: string; //Edge-case for approving
  lpToken?: string;
  enabled?: boolean;
  wethIsEth?: boolean;
};

/*
  Generic hook to create a Token Approval Step Config for different flows defined by the actionType property
*/
export function useTokenApprovalSteps({
  spenderAddress,
  chain,
  approvalAmounts,
  actionType,
  bptSymbol,
  isPermit2 = false,
  enabled = true,
  lpToken,
  wethIsEth,
}: Params): { isLoading: boolean; steps: TransactionStep[] } {
  const { userAddress } = useUserAccount();
  const { getToken } = useTokens();
  const nativeAssetAddress = getNativeAssetAddress(chain);

  // Unwraps of wrapped native assets do not require approval
  const isUnwrappingNative = wethIsEth && actionType === "Unwrapping";

  const _approvalAmounts = useMemo(
    () =>
      approvalAmounts.filter(
        (amount) => !isSameAddress(amount.address, nativeAssetAddress)
      ),
    [approvalAmounts]
  );

  const approvalTokenAddresses = useMemo(
    () => _approvalAmounts.map((amount) => amount.address),
    [_approvalAmounts]
  );

  const tokenAllowances = useTokenAllowances({
    chainId: getChainId(chain),
    userAddress,
    spenderAddress,
    tokenAddresses: approvalTokenAddresses,
    enabled:
      enabled &&
      !areEmptyRawAmounts(_approvalAmounts) &&
      !!spenderAddress &&
      !isUnwrappingNative,
  });

  const tokenAmountsToApprove = getRequiredTokenApprovals({
    chainId: chain,
    rawAmounts: _approvalAmounts,
    allowanceFor: tokenAllowances.allowanceFor,
    isPermit2,
    skipAllowanceCheck: isUnwrappingNative,
  });

  const steps = useMemo(() => {
    return tokenAmountsToApprove.map((tokenAmountToApprove, index) => {
      const {
        tokenAddress,
        requiredRawAmount,
        requestedRawAmount,
        symbol: approvalSymbol,
      } = tokenAmountToApprove;
      // USDT edge-case: requires setting approval to 0n before adjusting the value up again
      const isApprovingZeroForDoubleApproval =
        requiresDoubleApproval(chain, tokenAddress) && requiredRawAmount === 0n;
      const id = isApprovingZeroForDoubleApproval
        ? `${tokenAddress}-0`
        : tokenAddress;
      const token = getToken(tokenAddress, chain);

      const getSymbol = () => {
        if (approvalSymbol && approvalSymbol !== "Unknown")
          return approvalSymbol;
        if (bptSymbol) return bptSymbol;
        return token?.symbol || "Unknown";
      };

      const labels = buildTokenApprovalLabels({
        actionType,
        symbol: getSymbol(),
        isPermit2,
        lpToken,
      });

      const isComplete = () => {
        const isAllowed =
          tokenAllowances.allowanceFor(tokenAddress) >= requiredRawAmount;
        if (isApprovingZeroForDoubleApproval) {
          // Edge case USDT case is completed if:
          // - The allowance is 0n
          // - The allowance is greater than the required amount (of the next step)
          return (
            tokenAllowances.allowanceFor(tokenAddress) === 0n ||
            tokenAllowances.allowanceFor(tokenAddress) >=
              tokenAmountsToApprove[index + 1].requiredRawAmount
          );
        }
        return requiredRawAmount > 0n && isAllowed;
      };

      const isTxEnabled =
        !!spenderAddress && !tokenAllowances.isAllowancesLoading;
      const props: ManagedErc20TransactionInput = {
        tokenAddress,
        functionName: "approve",
        labels,
        chainId: getChainId(chain),
        args: [spenderAddress, requestedRawAmount],
        enabled: isTxEnabled,
        simulationMeta: sentryMetaForWagmiSimulation(
          "Error in wagmi tx simulation: Approving token",
          tokenAmountToApprove
        ),
      };

      const args = props.args as [Address, bigint];

      return {
        id,
        stepType: "tokenApproval",
        labels,
        isComplete,
        renderAction: () => (
          <ManagedErc20TransactionButton id={id} key={id} {...props} />
        ),
        onSuccess: () => tokenAllowances.refetchAllowances(),
      } as const satisfies TransactionStep;
    });
  }, [tokenAllowances.allowances, userAddress, tokenAmountsToApprove]);

  return {
    isLoading: tokenAllowances.isAllowancesLoading,
    steps,
  };
}

// // Only used when wallet supports atomic bath (smart accounts like Gnosis Safe)
// function buildBatchableTxCall({
//   tokenAddress,
//   args,
// }: {
//   tokenAddress: Address;
//   args: readonly [Address, bigint];
// }): TxCall {
//   const data = encodeFunctionData({
//     abi: erc20Abi, // TODO: support usdtAbi
//     functionName: "approve",
//     args,
//   });
//   return {
//     to: tokenAddress,
//     data: data,
//   };
// }
