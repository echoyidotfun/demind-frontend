"use client";

import { Card, Box, Divider, HStack, Heading, VStack } from "@chakra-ui/react";
import { Steps } from "./Steps";
import { GasPriceCard } from "@/hooks/useGasPrice";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { TransactionStepsResponse } from "@/lib/modules/transactions/useTransactionSteps";

type Props = {
  chain: GlobalChain;
  transactionSteps: TransactionStepsResponse;
  isTxBatch?: boolean;
};

export function DesktopStepTracker({
  chain,
  transactionSteps,
  isTxBatch,
}: Props) {
  return (
    <Card padding={0} position="absolute" right="-274px" width="250px">
      <VStack alignItems="flex-start" w="full">
        <HStack justify="space-between" p="sm" pb="0" w="full">
          <Heading fontWeight="medium" size="h6">
            Steps
          </Heading>
          <GasPriceCard chain={chain} />
        </HStack>
        <Divider p="0" />
        <Box p="sm" pb="md">
          <Steps isTxBatch={isTxBatch} transactionSteps={transactionSteps} />
        </Box>
      </VStack>
    </Card>
  );
}
