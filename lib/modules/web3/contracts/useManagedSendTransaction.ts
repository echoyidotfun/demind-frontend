/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import {
  ManagedResult,
  TransactionLabels,
} from "@/lib/modules/transactions/lib";
import { useEffect } from "react";
import {
  useEstimateGas,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  TransactionConfig,
  TransactionExecution,
  TransactionSimulation,
} from "./contract.types";
import { useOnTransactionConfirmation } from "./useOnTransactionConfirmation";
import { useOnTransactionSubmission } from "./useOnTransactionSubmission";
import { getGlobalChain } from "@/lib/configs/app.config";
import { useChainSwitch } from "../useChainSwitch";
import {
  captureWagmiExecutionError,
  sentryMetaForWagmiExecution,
} from "@/lib/utils/query-errors";
import { useNetworkConfig } from "@/lib/configs/useNetworkConfig";
import { useRecentTransactions } from "../../transactions/RecentTransactionsProvider";
import { getWaitForReceiptTimeout } from "./wagmi-helpers";
import { onlyExplicitRefetch } from "@/lib/utils/queries";

export type ManagedSendTransactionInput = {
  labels: TransactionLabels;
  txConfig: TransactionConfig;
  gasEstimationMeta?: Record<string, unknown>;
};

export function useManagedSendTransaction({
  labels,
  txConfig,
  gasEstimationMeta,
}: ManagedSendTransactionInput) {
  const chainId = txConfig.chainId;
  const { shouldChangeNetwork } = useChainSwitch(chainId);
  const { minConfirmations } = useNetworkConfig();
  const { updateTrackedTransaction } = useRecentTransactions();

  const estimateGasQuery = useEstimateGas({
    ...txConfig,
    query: {
      enabled: !!txConfig && !shouldChangeNetwork,
      meta: gasEstimationMeta,
      // In chains like polygon, we don't want background refetches while waiting for min block confirmations
      ...onlyExplicitRefetch,
    },
  });

  const writeMutation = useSendTransaction({
    mutation: {
      meta: sentryMetaForWagmiExecution("Error sending transaction", {
        txConfig,
        estimatedGas: estimateGasQuery.data,
        tenderlyUrl: gasEstimationMeta?.tenderlyUrl,
      }),
    },
  });

  const txHash = writeMutation.data;

  const transactionStatusQuery = useWaitForTransactionReceipt({
    chainId,
    hash: txHash,
    confirmations: minConfirmations,
    timeout: getWaitForReceiptTimeout(chainId),
    query: {
      ...onlyExplicitRefetch,
    },
  });

  const bundle = {
    chainId,
    simulation: estimateGasQuery as TransactionSimulation,
    execution: writeMutation as TransactionExecution,
    result: transactionStatusQuery,
  };

  useEffect(() => {
    if (transactionStatusQuery.error) {
      if (txHash) {
        updateTrackedTransaction(txHash, {
          status: "timeout",
          label: "Transaction timeout",
          duration: null,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatusQuery.error]);

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels,
    hash: txHash,
    chain: getGlobalChain(chainId),
  });

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation({
    labels,
    status: bundle.result.data?.status,
    hash: bundle.result.data?.transactionHash,
  });

  const managedSendAsync = txConfig
    ? async () => {
        if (!estimateGasQuery.data) return;
        if (!txConfig?.to) return;
        try {
          return writeMutation.sendTransactionAsync({
            chainId,
            to: txConfig.to,
            data: txConfig.data,
            value: txConfig.value,
            gas: estimateGasQuery.data,
          });
        } catch (e: unknown) {
          captureWagmiExecutionError(e, "Error in send transaction execution", {
            chainId,
            txConfig,
            gas: estimateGasQuery.data,
          });
          throw e;
        }
      }
    : undefined;

  return {
    ...bundle,
    executeAsync: managedSendAsync,
  } satisfies ManagedResult;
}
