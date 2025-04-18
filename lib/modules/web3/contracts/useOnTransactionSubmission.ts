import { useEffect } from "react";
import { Address } from "viem";
import { useRecentTransactions } from "@/lib/modules/transactions/RecentTransactionsProvider";
import { TransactionLabels } from "@/lib/modules/transactions/lib";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";

type NewTrackedTransactionRequest = {
  labels: TransactionLabels;
  chain: GlobalChain;
  hash?: Address;
  isConfirmed?: boolean;
};

export function useOnTransactionSubmission({
  labels,
  hash,
  chain,
  isConfirmed = false,
}: NewTrackedTransactionRequest) {
  const { addTrackedTransaction } = useRecentTransactions();

  // on successful submission to chain, add tx to cache
  useEffect(() => {
    if (hash) {
      addTrackedTransaction({
        hash,
        chain,
        label: labels.confirming || "Confirming transaction",
        description: labels.description,
        status: isConfirmed ? "confirmed" : "confirming",
        timestamp: Date.now(),
        init: labels.init,
        poolId: labels.poolId,
      });
    }
  }, [hash]);
}
