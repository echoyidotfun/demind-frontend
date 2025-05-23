import { getChainId } from "@/lib/configs/app.config";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { Address, Hex } from "viem";
import { useTransaction, useWaitForTransactionReceipt } from "wagmi";
import { ParseReceipt, parseSwapReceipt } from "./receipt-parsers";

type BaseReceiptProps = {
  txHash?: Hex;
  userAddress: Address;
  chain: GlobalChain;
};

export type ReceiptProps = BaseReceiptProps & { parseReceipt: ParseReceipt };

export type SwapReceiptResult = ReturnType<typeof useSwapReceipt>;

export function useSwapReceipt(props: BaseReceiptProps) {
  const result = useTxReceipt({ ...props, parseReceipt: parseSwapReceipt });
  const data = result.data as ReturnType<typeof parseSwapReceipt> | undefined;

  return {
    ...result,
    sentToken: data?.sentToken,
    receivedToken: data?.receivedToken,
  };
}

function useTxReceipt({
  txHash,
  chain,
  userAddress,
  parseReceipt,
}: ReceiptProps) {
  const { getToken, isLoadingTokenPrices } = useTokens();
  const chainId = getChainId(chain);
  // These queries will be cached if we are in the context of a transaction flow
  // or will be fetched if the user is visiting an historic transaction receipt
  const receiptQuery = useWaitForTransactionReceipt({
    chainId,
    hash: txHash,
  });
  const transactionQuery = useTransaction({
    chainId,
    hash: txHash,
    query: {
      enabled: !!txHash,
    },
  });

  const receiptLogs = receiptQuery.data?.logs || [];
  const txValue = transactionQuery.data?.value || 0n;

  const isLoading =
    isLoadingTokenPrices ||
    receiptQuery.isLoading ||
    transactionQuery.isLoading;
  const error = receiptQuery.error || transactionQuery.error;

  const data =
    !isLoading && !error
      ? parseReceipt({
          chain,
          receiptLogs,
          userAddress,
          txValue,
          getToken,
        })
      : undefined;

  return {
    isLoading,
    error,
    data,
  };
}
