"use client";

import {
  Button,
  HStack,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
  Text,
  ButtonProps,
  Box,
} from "@chakra-ui/react";
import { useUserSettings } from "@/lib/modules/settings/UserSettingsProvider";
import { fNum } from "@/lib/utils/numbers";
import { FiSettings } from "react-icons/fi";
import {
  EnableSignaturesSelect,
  SlippageInput,
} from "@/lib/modules/settings/UserSettings";

export function TransactionSettings(props: ButtonProps) {
  const { slippage, setSlippage } = useUserSettings();

  return (
    <Popover isLazy placement="bottom-end">
      <PopoverTrigger>
        <Button color="grayText" variant="tertiary" {...props}>
          <HStack spacing={2}>
            <Text color="inherit" fontSize="xs">
              {fNum("slippage", slippage)}
            </Text>
            <FiSettings size={16} />
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        willChange="transform, opacity"
        style={{
          transformOrigin: "var(--popper-transform-origin)",
          transitionProperty: "transform, opacity",
          transitionDuration: "100ms",
        }}
      >
        <PopoverArrow bg="background.level3" />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Transaction settings</Heading>
        </PopoverHeader>
        <PopoverBody p="md">
          <VStack align="start" spacing="lg" w="full">
            <VStack align="start" w="full">
              <Heading size="sm">Slippage</Heading>
              <SlippageInput setSlippage={setSlippage} slippage={slippage} />
            </VStack>
            <Box w="full">
              <Heading pb="xs" size="sm">
                Use Signatures
              </Heading>
              <Text color="font.secondary" fontSize="sm" pb="sm">
                Signatures allow for gas-free transactions, where possible. If
                your wallet doesn&apos;t support signatures, you can turn it
                off.
              </Text>
              <EnableSignaturesSelect />
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
