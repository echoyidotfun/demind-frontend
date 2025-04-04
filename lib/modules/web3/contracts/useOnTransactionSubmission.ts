import { useEffect } from "react";
import { Address } from "viem";
import { useRecentTransactions } from "@/lib/modules/transactions/RecentTransactionsProvider";
import { TransactionLabels } from "@/lib/modules/transactions/lib";
import { GqlChain } from "@/lib/services/api/generated/graphql";

type NewTrackedTransactionRequest = {
  labels: TransactionLabels;
  chain: GqlChain;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);
}
