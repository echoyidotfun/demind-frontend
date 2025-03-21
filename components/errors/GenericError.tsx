"use client";

import { AlertProps, Text } from "@chakra-ui/react";
import { ErrorAlert } from "./ErrorAlert";
import {
  isNotEnoughGasError,
  isTooManyRequestsError,
  isUserRejectedError,
  isViemHttpFetchError,
} from "@/lib/utils/error-filters";
import { ensureError } from "@/lib/utils/errors";

type ErrorWithOptionalShortMessage = Error & { shortMessage?: string };
type Props = AlertProps & {
  error: ErrorWithOptionalShortMessage;
  customErrorName?: string;
  skipError?: boolean;
};

export function GenericError({
  error: _error,
  customErrorName,
  skipError,
  ...rest
}: Props) {
  if (skipError) return;
  const error = ensureError(_error);
  if (isUserRejectedError(error)) return null;
  const errorName = customErrorName
    ? `${customErrorName} (${error.name})`
    : error.name;

  if (isViemHttpFetchError(_error)) {
    return (
      <ErrorAlert title={customErrorName} {...rest}>
        <Text color="black" variant="secondary">
          It looks like there was a network issue. Check your connection and try
          again.
        </Text>
      </ErrorAlert>
    );
  }

  if (isTooManyRequestsError(_error)) {
    return (
      <ErrorAlert title={customErrorName} {...rest}>
        <Text color="black" variant="secondary">
          Too many RPC requests. Please try again in some minutes.
        </Text>
      </ErrorAlert>
    );
  }

  if (isNotEnoughGasError(_error)) {
    return (
      <ErrorAlert title={customErrorName} {...rest}>
        <Text color="black" variant="secondary">
          It looks like you don&apos;t have enough gas to complete this
          transaction.
        </Text>
      </ErrorAlert>
    );
  }

  const errorMessage = error?.shortMessage || error.message;

  if (
    errorMessage === "RPC Request failed." ||
    errorMessage === "An unknown RPC error occurred."
  ) {
    return (
      <ErrorAlert title={errorMessage} {...rest}>
        <Text color="black" variant="secondary">
          It looks like there was an RPC Request issue.
        </Text>
      </ErrorAlert>
    );
  }

  return (
    <ErrorAlert title={errorName} {...rest}>
      <Text color="black" variant="secondary">
        Error details: {errorMessage}
      </Text>
    </ErrorAlert>
  );
}
