import { useEffect } from "react";
import { Address } from "viem";
import { useRecentTransactions } from "@/lib/modules/transactions/RecentTransactionsProvider";
import { TransactionLabels } from "@/lib/modules/transactions/lib";
import { AnalyticsEvent, trackEvent } from "@/lib/services/fathom/Fathom";

export type TrackedTransactionStatus = "success" | "reverted" | undefined;
type updateTrackedTransactionRequest = {
  labels: TransactionLabels;
  status?: TrackedTransactionStatus;
  hash?: Address;
};

export function useOnTransactionConfirmation({
  labels,
  hash,
  status,
}: updateTrackedTransactionRequest) {
  const { updateTrackedTransaction } = useRecentTransactions();

  // on confirmation, update tx in tx cache
  useEffect(() => {
    if (hash) {
      if (status === "reverted") {
        trackEvent(AnalyticsEvent.TransactionReverted);
        updateTrackedTransaction(hash, {
          label: labels.reverted,
          status: "reverted",
        });
      } else {
        trackEvent(AnalyticsEvent.TransactionConfirmed);
        updateTrackedTransaction(hash, {
          label: labels.confirmed,
          status: "confirmed",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);
}
