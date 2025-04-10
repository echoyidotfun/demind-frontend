"use client";

import { ConnectWallet } from "@/lib/modules/web3/ConnectWallet";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";
import { Button, VStack } from "@chakra-ui/react";
import {
  ManagedResult,
  TransactionLabels,
  TransactionState,
  getTransactionState,
} from "./lib";
import {
  NetworkSwitchButton,
  useChainSwitch,
} from "@/lib/modules/web3/useChainSwitch";
import { GenericError } from "@/components/errors/GenericError";
import { getGlobalChain } from "@/lib/configs/app.config";
import { TransactionTimeoutError } from "@/components/errors/TransactionTimeoutError";
import { useState } from "react";
import { ensureError } from "@/lib/utils/errors";
import { LabelWithIcon } from "@/components/common/btns/LabelWithIcon";
import { getTransactionButtonLabel } from "./transaction-button.helper";

interface Props {
  step: { labels: TransactionLabels } & ManagedResult;
}

export function TransactionStepButton({ step }: Props) {
  const { chainId, simulation, labels, executeAsync } = step;
  const [executionError, setExecutionError] = useState<Error>();
  const { isConnected } = useUserAccount();
  const { shouldChangeNetwork } = useChainSwitch(chainId);
  const isTransactButtonVisible = isConnected;
  const transactionState = getTransactionState(step);
  const isButtonLoading =
    transactionState === TransactionState.Loading ||
    transactionState === TransactionState.Confirming ||
    transactionState === TransactionState.Preparing;

  const isComplete = transactionState === TransactionState.Completed;
  const hasSimulationError = simulation.isError;
  const isIdle = isConnected && simulation.isStale && !simulation.data;
  const isButtonDisabled =
    transactionState === TransactionState.Loading ||
    hasSimulationError ||
    isIdle ||
    isComplete ||
    !executeAsync; // no executeAsync is undefined while the txConfig is being built

  async function handleOnClick() {
    setExecutionError(undefined);
    try {
      if (!executeAsync) return;
      return await executeAsync();
    } catch (e: unknown) {
      setExecutionError(ensureError(e));
    }
  }

  function getButtonLabel() {
    if (executionError) return labels.init;
    return getTransactionButtonLabel({ transactionState, labels });
  }

  return (
    <VStack width="full" paddingTop="sm">
      {transactionState === TransactionState.Error && (
        <TransactionError step={step} />
      )}
      {!isTransactButtonVisible && <ConnectWallet width="full" />}
      {isTransactButtonVisible && shouldChangeNetwork && (
        <NetworkSwitchButton chainId={chainId} />
      )}
      {!shouldChangeNetwork && isTransactButtonVisible && (
        <Button
          isDisabled={isButtonDisabled}
          isLoading={isButtonLoading}
          loadingText={getButtonLabel()}
          onClick={handleOnClick}
          size="lg"
          variant="primary"
          w="full"
          width="full"
          py="lg"
        >
          <LabelWithIcon icon="gas">{getButtonLabel()}</LabelWithIcon>
        </Button>
      )}
    </VStack>
  );
}

function TransactionError({ step }: Props) {
  if (step.simulation.error) {
    return <GenericError error={step.simulation.error} />;
  }

  const executionError = step.execution.error;
  if (executionError) return <GenericError error={executionError} />;

  const resultError = step.result.error;
  if (resultError) {
    const isTimeoutError = resultError.name === "TimeoutError";
    const transactionHash = step.execution.data;
    if (isTimeoutError && transactionHash) {
      const chain = getGlobalChain(step.chainId);
      return (
        <TransactionTimeoutError
          chain={chain}
          transactionHash={transactionHash}
        />
      );
    }
    return <GenericError error={resultError} />;
  }

  return null;
}

export function DisabledTransactionButton() {
  return (
    <Button
      isDisabled
      isLoading
      size="lg"
      variant="primary"
      w="full"
      width="full"
    />
  );
}
