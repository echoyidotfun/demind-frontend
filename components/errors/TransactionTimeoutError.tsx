"use client";

import { AlertProps, Text } from "@chakra-ui/react";
import { Address } from "viem";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { BlockExplorerLink } from "../common/BlockExplorerLink";
import { ErrorAlert } from "./ErrorAlert";

type Props = AlertProps & { transactionHash?: Address; chain: GlobalChain };

export function TransactionTimeoutError({
  transactionHash,
  chain,
  ...rest
}: Props) {
  return (
    <ErrorAlert title="Error: Transaction timeout" {...rest}>
      <Text color="font.maxContrast">
        {`An unexpected timeout occurred while waiting for your transaction to confirm. It's
            possible that it was successful. To ensure you don't accidentally repeat the
            transaction, please check its status using the link below:`}
        {transactionHash && (
          <BlockExplorerLink chain={chain} transactionHash={transactionHash} />
        )}
      </Text>
    </ErrorAlert>
  );
}
