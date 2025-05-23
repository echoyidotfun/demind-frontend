import {
  ManagedResult,
  TransactionState,
  TransactionStep,
  getTransactionState,
} from "./lib";
import { ColorMode } from "@/lib/services/chakra/useThemeColorMode";

type StepStatus = "active" | "complete" | "incomplete";

export type StepProps = {
  step: TransactionStep;
  index: number;
  currentIndex: number;
  colorMode: ColorMode;
  isLastStep: boolean;
  isTxBatch?: boolean;
};

/*
    Generates an object used to render the UI state of a given step in the context of a multi-step flow
    It handles title, colors, loading states, etc
  */
export function getStepSettings(
  { step, currentIndex, index, colorMode, isLastStep }: StepProps,
  transaction?: ManagedResult
) {
  const isActive = index === currentIndex;

  const color = getColor(colorMode, getStatus(index), transaction);

  const stepNumber = index + 1;

  function getStatus(index: number): StepStatus {
    if (index < currentIndex) return "complete";
    if (step.isComplete()) return "complete";
    // When the last step is complete
    if (isActive && isLastStep && transaction?.result.isSuccess)
      return "complete";
    if (isActive) return "active";
    return "incomplete";
  }

  const status = getStatus(index);

  const isActiveLoading = isLoading(status, transaction);

  return {
    title: step.labels.title,
    color,
    isActive,
    status,
    stepNumber,
    isActiveLoading,
  };
}

function getColor(
  colorMode: ColorMode,
  status: StepStatus,
  transaction?: ManagedResult
) {
  if (status === "active") {
    return getActiveColor(transaction)[colorMode];
  }
  if (status === "complete") {
    return completeColor[colorMode];
  }
  if (status === "incomplete") {
    return incompleteColor[colorMode];
  }

  return "primary";
}

function getActiveColor(transaction?: ManagedResult) {
  if (isLoading("active", transaction)) return activeConfirmingColor;
  return activeColor;
}

function isLoading(status: StepStatus, transaction?: ManagedResult): boolean {
  if (!transaction) return false;
  if (status !== "active") return false;
  if (getTransactionState(transaction) === TransactionState.Loading) {
    return true;
  }
  if (getTransactionState(transaction) === TransactionState.Confirming) {
    return true;
  }

  return false;
}

/*
    Step Status Colors
    We show different colors depending on the step status and other variables like the step flow state
  */
const completeColor = {
  dark: "font.highlight",
  light: "font.highlight",
};

const incompleteColor = {
  dark: "gray",
  light: "gray",
};

const activeColor = {
  dark: "font.primary",
  light: "font.primary",
};

// When the current step tx is waiting for wallet confirmation
const activeConfirmingColor = {
  dark: "font.link",
  light: "font.link",
};
