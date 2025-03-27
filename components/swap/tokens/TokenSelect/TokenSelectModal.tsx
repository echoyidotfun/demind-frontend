"use client";

import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from "@chakra-ui/react";
import { RefObject, useState } from "react";
import { TokenSelectList } from "./TokenSelectList";
import { GqlChain } from "@/lib/services/api/generated/graphql";
import { TokenSelectPopular } from "./TokenSelectPopular";
import { SearchInput } from "@/components/swap/inputs/SearchInput";
import { Address } from "viem";
import { ApiToken } from "@/lib/modules/tokens/token.types";

type Props = {
  tokens: ApiToken[];
  chain: GqlChain;
  currentToken?: Address;
  excludeNativeAsset?: boolean;
  pinNativeAsset?: boolean;
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  finalFocusRef?: RefObject<HTMLInputElement>;
  onTokenSelect: (token: ApiToken) => void;
  tokenSelectKey: "tokenIn" | "tokenOut";
};

export function TokenSelectModal({
  tokens,
  chain,
  currentToken,
  excludeNativeAsset = false,
  pinNativeAsset = false,
  isOpen,
  onClose,
  finalFocusRef,
  onTokenSelect,
  tokenSelectKey,
  ...rest
}: Props & Omit<ModalProps, "children">) {
  const [searchTerm, setSearchTerm] = useState("");

  const headerPrefix = tokenSelectKey === "tokenIn" ? "Swap from " : "Swap to";

  function closeOnSelect(token: ApiToken) {
    onTokenSelect(token);
    closeModal();
  }

  function closeModal() {
    setSearchTerm("");
    onClose();
  }

  return (
    <Modal
      finalFocusRef={finalFocusRef}
      isCentered
      isOpen={isOpen}
      onClose={closeModal}
      preserveScrollBarGap
      {...rest}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="font.primary">{headerPrefix}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <VStack align="start" spacing="md" w="full">
            <Box px="md" w="full">
              <SearchInput
                ariaLabel="search for a token"
                placeholder="Search by name, symbol or address"
                search={searchTerm}
                setSearch={setSearchTerm}
                tabIndex={0}
              />
            </Box>
            {!searchTerm && (
              <Box px="md" w="full">
                <TokenSelectPopular
                  chain={chain}
                  currentToken={currentToken}
                  excludeNativeAsset={excludeNativeAsset}
                  onTokenSelect={closeOnSelect}
                />
              </Box>
            )}
            <Box pr="0" w="full">
              <TokenSelectList
                chain={chain}
                currentToken={currentToken}
                excludeNativeAsset={excludeNativeAsset}
                listHeight={500}
                onTokenSelect={closeOnSelect}
                pinNativeAsset={pinNativeAsset}
                searchTerm={searchTerm}
                tokens={tokens}
              />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
