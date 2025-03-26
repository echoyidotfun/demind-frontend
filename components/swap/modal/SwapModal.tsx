/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalProps,
} from "@chakra-ui/react";
import { RefObject, useEffect, useRef } from "react";
import { DesktopStepTracker } from "../transactions/transaction-steps/DesktopStepTracker";
import { useSwap } from "@/lib/modules/swap/SwapProvider";
import { SwapTimeout } from "./SwapTimeout";
import { capitalize } from "lodash";
import { ActionModalFooter } from "./ActionModalFooter";
import { TransactionModalHeader } from "./TransactionModalHeader";
import { chainToSlugMap } from "@/lib/utils/urls";
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from "@/lib/modules/transactions/step-tracker/step-tracker.utils";
import { SuccessOverlay } from "@/components/swap/modal/SuccessOverlay";
import { useOnUserAccountChanged } from "@/lib/modules/web3/useOnUserAccountChanged";
import { SwapSummary } from "./SwapSummary";
import { useSwapReceipt } from "@/lib/modules/transactions/receipts/receipt.hooks";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { useResetStepIndexOnOpen } from "@/lib/modules/transactions/useResetStepIndexOnOpen";

type Props = {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  finalFocusRef?: RefObject<HTMLInputElement>;
};

export function SwapPreviewModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, "children">) {
  const initialFocusRef = useRef(null!);
  const { userAddress } = useUserAccount();
  const { stopTokenPricePolling } = useTokens();

  const {
    transactionSteps,
    swapAction,
    isWrap,
    selectedChain,
    swapTxHash,
    urlTxHash,
    hasQuoteContext,
  } = useSwap();

  const swapReceipt = useSwapReceipt({
    txHash: swapTxHash,
    userAddress,
    chain: selectedChain,
  });

  useResetStepIndexOnOpen(isOpen, transactionSteps);

  useEffect(() => {
    if (
      !isWrap &&
      swapTxHash &&
      !window.location.pathname.includes(swapTxHash)
    ) {
      const url = `/swap/${chainToSlugMap[selectedChain]}/${swapTxHash}`;
      window.history.pushState({}, "", url);
    }
  }, [swapTxHash]);

  useEffect(() => {
    if (isOpen) {
      // stop polling for token prices when modal is opened to prevent unwanted re-renders
      stopTokenPricePolling();
    }
  }, [isOpen]);

  useOnUserAccountChanged(onClose);

  const isSuccess = !!swapTxHash && !swapReceipt.isLoading;

  return (
    <Modal
      finalFocusRef={finalFocusRef}
      initialFocusRef={initialFocusRef}
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      preserveScrollBarGap
      trapFocus={!isSuccess}
      {...rest}
    >
      <SuccessOverlay startAnimation={!!swapTxHash && hasQuoteContext} />

      <ModalContent {...getStylesForModalContentWithStepTracker()}>
        {hasQuoteContext && (
          <DesktopStepTracker
            chain={selectedChain}
            transactionSteps={transactionSteps}
          />
        )}
        <TransactionModalHeader
          chain={selectedChain}
          isReceiptLoading={swapReceipt.isLoading}
          label={`Review ${capitalize(swapAction)}`}
          timeout={<SwapTimeout />}
          txHash={swapTxHash}
        />
        <ModalCloseButton />
        <ModalBody>
          <SwapSummary {...swapReceipt} />
        </ModalBody>
        <ActionModalFooter
          currentStep={transactionSteps.currentStep}
          isSuccess={isSuccess}
          returnAction={onClose}
          returnLabel={"Swap again"}
          urlTxHash={urlTxHash}
        />
      </ModalContent>
    </Modal>
  );
}
