"use client";

import {
  Box,
  BoxProps,
  Button,
  HStack,
  Input,
  InputGroup,
  InputProps,
  InputRightAddon,
  Skeleton,
  Text,
  VStack,
  forwardRef,
  useTheme,
} from "@chakra-ui/react";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { useTokenBalances } from "../../../lib/modules/tokens/TokenBalancesProvider";
import { useTokenInput } from "@/lib/modules/tokens/TokenInput/useTokenInput";
import { blockInvalidNumberInput, bn, fNum } from "@/lib/utils/numbers";
import { TokenIcon } from "@/components/common/icons/TokenIcon";
import { useTokenInputsValidation } from "../../../lib/modules/tokens/TokenInputsValidationProvider";
import { GoChevronDown } from "react-icons/go";
import { WalletIcon } from "@/components/common/icons/WalletIcon";
import { usePriceImpact } from "@/lib/modules/price-impact/PriceImpactProvider";
import { useEffect, useState } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { isNativeAsset } from "@/lib/utils/addresses";
import { getPriceImpactLabel } from "../../../lib/modules/price-impact/price-impact.utils";
import { GlobalToken } from "../../../lib/modules/tokens/token.types";
import { useUserAccount } from "../../../lib/modules/web3/UserAccountProvider";

type TokenInputSelectorProps = {
  token: GlobalToken | undefined;
  weight?: string;
  onToggleTokenClicked?: () => void;
};

type TokenConfigProps = {
  label: string;
  variant: string;
  showIcon: boolean;
};

function TokenInputSelector({
  token,
  weight,
  onToggleTokenClicked,
}: TokenInputSelectorProps) {
  const [tokenConfig, setTokenConfig] = useState<TokenConfigProps | undefined>(
    undefined
  );

  useEffect(() => {
    if (token) {
      setTokenConfig({
        label: token.symbol,
        variant: "tertiary",
        showIcon: true,
      });
    } else if (onToggleTokenClicked) {
      setTokenConfig({
        label: "Select token",
        variant: "secondary",
        showIcon: false,
      });
    }
  }, [token]);

  return tokenConfig ? (
    <Button
      cursor={onToggleTokenClicked ? "pointer" : "default"}
      onClick={() => onToggleTokenClicked?.()}
      variant={tokenConfig.variant}
    >
      {tokenConfig && tokenConfig.showIcon && (
        <Box mr="sm">
          <TokenIcon
            alt={tokenConfig.label}
            loading="lazy"
            logoURI={token?.logoUrl}
            size={22}
          />
        </Box>
      )}
      {tokenConfig && tokenConfig.label}
      {/* {weight && (
        <Text fontSize="sm" fontWeight="normal" ml="sm">
          {fNum("weight", weight)}
        </Text>
      )} */}
      {onToggleTokenClicked && (
        <Box ml="sm">
          <GoChevronDown size={16} />
        </Box>
      )}
    </Button>
  ) : (
    <Skeleton height="40px" width="110px" />
  );
}

type TokenInputFooterProps = {
  token: GlobalToken | undefined;
  value?: string;
  updateValue: (value: string) => void;
  hasPriceImpact?: boolean;
  isLoadingPriceImpact?: boolean;
};

function TokenInputFooter({
  token,
  value,
  updateValue,
  hasPriceImpact,
  isLoadingPriceImpact,
}: TokenInputFooterProps) {
  const { balanceFor, isBalancesLoading } = useTokenBalances();
  const { usdValueForToken } = useTokens();
  const { hasValidationError, getValidationError } = useTokenInputsValidation();
  const { priceImpact, priceImpactColor, priceImpactLevel } = usePriceImpact();
  const isMounted = useIsMounted();

  const hasError = hasValidationError(token);
  const inputLabelColor = hasError ? "input.fontHintError" : "grayText";

  const balance = token ? balanceFor(token?.address) : undefined;
  const userBalance = token ? balance?.formatted || "0" : "0";
  const usdValue = value && token ? usdValueForToken(token, value) : "0";

  const noBalance = !token || bn(userBalance).isZero();
  const _isNativeAsset = token && isNativeAsset(token.chain, token.address);

  const showPriceImpact =
    !isLoadingPriceImpact && hasPriceImpact && priceImpact;

  function handleBalanceClick() {
    // We return for _isNativeAsset because you can't use your full native asset
    // balance, you need to save some for a swap.
    if (noBalance || _isNativeAsset) return;

    if (value && bn(value).eq(userBalance)) {
      updateValue("");
    } else {
      updateValue(userBalance);
    }
  }

  return (
    <HStack h="4" justify="space-between" w="full">
      {isBalancesLoading || !isMounted ? (
        <Skeleton h="full" w="12" />
      ) : (
        <Text
          color={showPriceImpact ? priceImpactColor : "font.secondary"}
          fontSize="sm"
          variant="secondary"
        >
          {fNum("fiat", usdValue, { abbreviated: false })}
          {showPriceImpact &&
            priceImpactLevel !== "unknown" &&
            getPriceImpactLabel(priceImpact)}
        </Text>
      )}
      {isBalancesLoading || !isMounted ? (
        <Skeleton h="full" w="12" />
      ) : (
        <HStack
          _hover={
            noBalance || _isNativeAsset ? {} : { color: "font.highlight" }
          }
          color={inputLabelColor}
          cursor={noBalance || _isNativeAsset ? "default" : "pointer"}
          onClick={handleBalanceClick}
          title="Use wallet balance"
        >
          {hasError && (
            <Text color="inherit" fontSize="sm">
              {getValidationError(token)}
            </Text>
          )}
          <Text color="inherit" fontSize="sm">
            {fNum("token", userBalance, { abbreviated: false })}
          </Text>
          <Box>
            <WalletIcon size={16} />
          </Box>
        </HStack>
      )}
    </HStack>
  );
}

type Props = {
  address?: string;
  apiToken?: GlobalToken;
  chain?: GlobalChain | number;
  weight?: string;
  value?: string;
  hideFooter?: boolean;
  boxProps?: BoxProps;
  onChange?: (event: { currentTarget: { value: string } }) => void;
  onToggleTokenClicked?: () => void;
  hasPriceImpact?: boolean;
  isLoadingPriceImpact?: boolean;
  disableBalanceValidation?: boolean;
};

export const TokenInput = forwardRef(
  (
    {
      address,
      apiToken,
      chain,
      weight,
      value,
      boxProps,
      onChange,
      onToggleTokenClicked,
      hideFooter = false,
      hasPriceImpact = false,
      isLoadingPriceImpact = false,
      disableBalanceValidation = false,
      ...inputProps
    }: InputProps & Props,
    ref
  ) => {
    const { userAddress } = useUserAccount();
    const { isBalancesLoading } = useTokenBalances();

    const [inputTitle, setInputTitle] = useState<string>("");

    const { colors } = useTheme();
    const { getToken } = useTokens();
    const tokenFromAddress =
      address && chain ? getToken(address, chain) : undefined;

    const token = apiToken || tokenFromAddress;
    const { hasValidationError } = useTokenInputsValidation();

    const { handleOnChange, updateValue, validateInput } = useTokenInput({
      token,
      onChange,
      disableBalanceValidation,
    });

    const tokenInputSelector = TokenInputSelector({
      token,
      weight,
      onToggleTokenClicked,
    });

    const footer = hideFooter
      ? undefined
      : TokenInputFooter({
          token,
          value,
          updateValue,
          hasPriceImpact,
          isLoadingPriceImpact,
        });

    const boxShadow = hasValidationError(token)
      ? `0 0 0 1px ${colors.red[500]}`
      : undefined;

    useEffect(() => {
      if (!isBalancesLoading) {
        validateInput(value || "");
        setInputTitle(value || "");
      }
    }, [value, token?.address, isBalancesLoading, userAddress]);

    return (
      <Box
        bg="background.level0"
        border="white"
        borderRadius="md"
        boxShadow={boxShadow}
        p={["ms", "md"]}
        shadow="innerBase"
        w="full"
        {...boxProps}
      >
        <VStack align="start" spacing="md">
          <InputGroup background="transparent" border="transparent">
            <Box position="relative" w="full">
              <Input
                _focus={{
                  outline: "none",
                  border: "0px solid transparent",
                  boxShadow: "none",
                }}
                _hover={{
                  border: "0px solid transparent",
                  boxShadow: "none",
                }}
                autoComplete="off"
                autoCorrect="off"
                bg="transparent"
                border="0px solid transparent"
                boxShadow="none"
                fontSize="2xl"
                fontWeight="medium"
                isDisabled={!token}
                min={0}
                onChange={handleOnChange}
                onKeyDown={blockInvalidNumberInput}
                onWheel={(e) => {
                  // Avoid changing the input value when scrolling
                  return e.currentTarget.blur();
                }}
                outline="none"
                p="0"
                placeholder="0.00"
                ref={ref}
                shadow="none"
                title={inputTitle}
                type="number"
                value={value}
                {...inputProps}
              />
              {token && (
                <Box
                  bgGradient="linear(to-r, transparent, background.level0 70%)"
                  h="full"
                  position="absolute"
                  right={0}
                  top={0}
                  w="8"
                  zIndex={9999}
                />
              )}
            </Box>

            {tokenInputSelector && (
              <InputRightAddon bg="transparent" border="none" p="0" pl="1">
                {tokenInputSelector}
              </InputRightAddon>
            )}
          </InputGroup>
          {footer && footer}
        </VStack>
      </Box>
    );
  }
);
