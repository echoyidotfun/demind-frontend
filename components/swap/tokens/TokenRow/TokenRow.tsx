"use client";
import {
  Box,
  Button,
  HStack,
  Heading,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Address } from "viem";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { GqlChain } from "@/lib/services/api/generated/graphql";
import { ReactNode, useEffect, useState } from "react";
import { TokenIcon } from "@/components/common/icons/TokenIcon";
import { Numberish, fNum, isZero } from "@/lib/utils/numbers";
import { TokenInfoPopover } from "@/lib/modules/tokens/TokenInfoPopover";
import { FiChevronDown } from "react-icons/fi";
import { ApiToken } from "@/lib/modules/tokens/token.types";

export type TokenInfoProps = {
  address: Address;
  symbol?: string;
  chain: GqlChain;
  token?: ApiToken;
  disabled?: boolean;
  showSelect?: boolean;
  showInfoPopover?: boolean;
  iconSize?: number;
  logoURI?: string;
};

function TokenInfo({
  address,
  chain,
  token,
  symbol,
  disabled,
  showSelect = false,
  showInfoPopover = true,
  iconSize = 40,
  logoURI,
}: TokenInfoProps) {
  const tokenSymbol = token?.symbol || symbol;
  const tokenName = token?.name;

  const headingProps = {
    as: "h6" as const,
    fontSize: "lg",
    fontWeight: "bold",
    lineHeight: "24px",
    variant: disabled ? "secondary" : "primary",
  };

  const tokenNameProps = {
    fontSize: "md",
    fontWeight: "medium",
    lineHeight: "24px",
    variant: "secondary",
  };

  return (
    <HStack spacing="sm">
      <TokenIcon
        address={address}
        alt={token?.symbol || address}
        chain={chain}
        logoURI={logoURI}
        size={iconSize}
      />
      <VStack alignItems="flex-start" spacing="none">
        <HStack spacing="none">
          <Heading {...headingProps}>{tokenSymbol}</Heading>
          {showInfoPopover && (
            <TokenInfoPopover chain={chain} tokenAddress={address} />
          )}
        </HStack>
        <Text {...tokenNameProps}>{tokenName}</Text>
      </VStack>
      {showSelect && (
        <Box ml="sm">
          <FiChevronDown size={16} />
        </Box>
      )}
    </HStack>
  );
}

export type TokenRowProps = {
  label?: string | ReactNode;
  address: Address;
  symbol?: string;
  chain: GqlChain;
  value: Numberish;
  actualWeight?: string;
  targetWeight?: string;
  usdValue?: string;
  disabled?: boolean;
  isLoading?: boolean;
  abbreviated?: boolean;
  showZeroAmountAsDash?: boolean;
  toggleTokenSelect?: () => void;
  iconSize?: number;
  logoURI?: string;
};

// abbreviated={false}
//         address={tokenAddress as Address}
//         chain={chain}
//         value={tokenAmount}
export default function TokenRow({
  label,
  address,
  symbol,
  value,
  chain,
  disabled,
  isLoading,
  abbreviated = true,
  toggleTokenSelect,
  iconSize,
  logoURI,
}: TokenRowProps) {
  const { getToken, usdValueForToken } = useTokens();
  const [amount, setAmount] = useState<string>("");
  const [usdValue, setUsdValue] = useState<string | undefined>(undefined);
  const token = getToken(address, chain);

  // TokenRowTemplate default props
  const props: TokenInfoProps = {
    address,
    chain,
    token,
    disabled,
    iconSize,
    symbol,
    logoURI,
  };

  useEffect(() => {
    if (value) {
      if (token) {
        setUsdValue(usdValueForToken(token, value));
      }
      setAmount(fNum("token", value, { abbreviated }));
    }
  }, [value]);

  const headingProps = {
    as: "h6" as const,
    fontSize: "lg",
    fontWeight: "bold",
    lineHeight: "24px",
  };

  const subTextProps = {
    fontSize: "md",
    fontWeight: "medium",
    lineHeight: "24px",
    variant: "secondary",
  };

  return (
    <VStack align="start" spacing="md" w="full">
      {label && typeof label === "string" ? (
        <Text color="grayText">{label}</Text>
      ) : (
        label
      )}
      <HStack justifyContent="space-between" width="full">
        {toggleTokenSelect ? (
          <Button
            cursor="pointer"
            onClick={toggleTokenSelect}
            p="2"
            size="xl"
            variant="tertiary"
          >
            <TokenInfo {...props} showInfoPopover={false} showSelect />
          </Button>
        ) : (
          <TokenInfo {...props} />
        )}
        <HStack align="start" spacing="none">
          <VStack alignItems="flex-end" spacing="xs" textAlign="right">
            {isLoading ? (
              <>
                <Skeleton h="4" w="10" />
                <Skeleton h="4" w="10" />
              </>
            ) : (
              <>
                <Heading {...headingProps} title={value.toString()}>
                  {amount ? amount : "0"}
                </Heading>
                <Text {...subTextProps}>
                  {usdValue && isZero(usdValue)
                    ? "-"
                    : fNum("fiat", usdValue ?? "0", { abbreviated })}
                </Text>
              </>
            )}
          </VStack>
        </HStack>
      </HStack>
    </VStack>
  );
}
