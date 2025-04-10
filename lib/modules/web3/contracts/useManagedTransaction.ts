/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { getGlobalChain } from "@/lib/configs/app.config";
import { SupportedChainId } from "@/lib/configs/config.types";
import { useNetworkConfig } from "@/lib/configs/useNetworkConfig";
import {
  ManagedResult,
  TransactionLabels,
} from "@/lib/modules/transactions/lib";
import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useChainSwitch } from "../useChainSwitch";
import { AbiMap } from "./AbiMap";
import {
  TransactionExecution,
  TransactionSimulation,
  WriteAbiMutability,
} from "./contract.types";
import { useOnTransactionConfirmation } from "./useOnTransactionConfirmation";
import { useOnTransactionSubmission } from "./useOnTransactionSubmission";
import { captureWagmiExecutionError } from "@/lib/utils/query-errors";
import { getWaitForReceiptTimeout } from "./wagmi-helpers";
import { onlyExplicitRefetch } from "@/lib/utils/queries";
import { useMockedTxHash } from "@/lib/modules/web3/contracts/useMockedTxHash";

/**
 * Allows to skip transaction confirmation step in the wallet and go directly to success state
 * Mostly used for testing cross-chain sync
 */
const allowSkipTransaction = false;

type IAbiMap = typeof AbiMap;
type AbiMapKey = keyof typeof AbiMap;

export interface ManagedTransactionInput {
  contractAddress: string;
  contractId: AbiMapKey;
  functionName: ContractFunctionName<IAbiMap[AbiMapKey], WriteAbiMutability>;
  labels: TransactionLabels;
  chainId: SupportedChainId;
  args?: ContractFunctionArgs<IAbiMap[AbiMapKey], WriteAbiMutability> | null;
  txSimulationMeta?: Record<string, unknown>;
  enabled: boolean;
  value?: bigint;
}

export function useManagedTransaction({
  contractAddress,
  contractId,
  functionName,
  labels,
  chainId,
  args,
  txSimulationMeta,
  enabled = true,
  value,
}: ManagedTransactionInput) {
  const { minConfirmations } = useNetworkConfig();
  const { shouldChangeNetwork } = useChainSwitch(chainId);

  const simulateQuery = useSimulateContract({
    abi: AbiMap[contractId] as Abi,
    address: contractAddress as Address,
    functionName: functionName as ContractFunctionName<any, WriteAbiMutability>,
    // This any is 'safe'. The type provided to any is the same type for args that is inferred via the functionName
    args: args as any,
    chainId,
    query: {
      enabled: enabled && !shouldChangeNetwork,
      meta: txSimulationMeta,
      // In chains like polygon, we don't want background refetches while waiting for min block confirmations
      ...onlyExplicitRefetch,
    },
    value,
  });

  const { mockedTxHash, setMockedTxHash } = useMockedTxHash();

  const writeQuery = useWriteContract();

  const txHash = mockedTxHash ?? writeQuery.data;

  const transactionStatusQuery = useWaitForTransactionReceipt({
    chainId,
    hash: txHash,
    confirmations: minConfirmations,
    timeout: getWaitForReceiptTimeout(chainId),
  });

  const bundle = {
    chainId,
    simulation: simulateQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
  };

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels,
    hash: txHash,
    chain: getGlobalChain(chainId as SupportedChainId),
  });

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation({
    labels,
    status: bundle.result.data?.status,
    hash: bundle.result.data?.transactionHash,
  });

  const managedWriteAsync = async () => {
    if (!simulateQuery.data) return;

    if (allowSkipTransaction) {
      const txHash = setMockedTxHash();
      if (txHash) return;
    }

    try {
      return await writeQuery.writeContractAsync({
        ...simulateQuery.data.request,
        chainId: chainId,
      });
    } catch (e: unknown) {
      captureWagmiExecutionError(e, "Error in managed transaction execution", {
        chainId,
        request: simulateQuery.data.request,
      });
      throw e;
    }
  };

  return {
    ...bundle,
    executeAsync: managedWriteAsync,
  } satisfies ManagedResult;
}
