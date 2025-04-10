import { NumberText } from "@/components/common/typography/NumberText";
import { bn, fNum } from "@/lib/utils/numbers";
import {
  HStack,
  VStack,
  Text,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import { useSwap } from "@/lib/modules/swap/SwapProvider";
import { useUserSettings } from "@/lib/modules/settings/UserSettingsProvider";
import { usePriceImpact } from "@/lib/modules/price-impact/PriceImpactProvider";
import {
  SdkSimulateSwapResponse,
  SorSwapType,
} from "@/lib/modules/swap/swap.types";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { NativeWrapHandler } from "@/lib/modules/swap/handlers/NativeWrap.handler";
import { InfoIcon } from "@/components/common/icons/InfoIcon";
import {
  getFullPriceImpactLabel,
  getMaxSlippageLabel,
} from "@/lib/modules/price-impact/price-impact.utils";
import { DemindRouterSwapHandler } from "@/lib/modules/swap/handlers/DemindRouterSwap.handler";

export function OrderRoute() {
  const { simulationQuery } = useSwap();

  const queryData = simulationQuery.data as SdkSimulateSwapResponse;
  const hopCount = queryData ? queryData.hopCount : 0;

  function getRouteHopsLabel() {
    if (hopCount === 0) return "Unknown";
    return `${hopCount} ${hopCount > 1 ? "hops" : "hop"}`;
  }

  return (
    <HStack justify="space-between" w="full">
      <Text color="grayText">Order route</Text>
      <HStack>
        <Text color="grayText">{getRouteHopsLabel()}</Text>
        <Popover trigger="hover">
          <PopoverTrigger>
            <Box
              _hover={{ opacity: 1 }}
              opacity="0.5"
              transition="opacity 0.2s var(--ease-out-cubic)"
            >
              <InfoIcon />
            </Box>
          </PopoverTrigger>
          <PopoverContent maxW="300px" p="sm" w="auto">
            <Text fontSize="sm" variant="primary">
              Number of swap hops
            </Text>
          </PopoverContent>
        </Popover>
      </HStack>
    </HStack>
  );
}

export function SwapDetails() {
  const { slippage, slippageDecimal } = useUserSettings();
  const { usdValueForToken } = useTokens();
  const { tokenInInfo, tokenOutInfo, swapType, tokenIn, tokenOut, handler } =
    useSwap();

  const { priceImpactLevel, priceImpactColor, PriceImpactIcon, priceImpact } =
    usePriceImpact();

  const isDefaultSwap = handler instanceof DemindRouterSwapHandler;
  const isNativeWrapOrUnwrap = handler instanceof NativeWrapHandler;

  const _slippage = isNativeWrapOrUnwrap ? 0 : slippage;
  const _slippageDecimal = isNativeWrapOrUnwrap ? 0 : slippageDecimal;

  const returnAmountUsd =
    swapType === SorSwapType.ExactIn
      ? usdValueForToken(tokenOutInfo, tokenOut.amount)
      : usdValueForToken(tokenInInfo, tokenIn.amount);

  const priceImpactUsd = bn(priceImpact || 0).times(returnAmountUsd);
  const fullPriceImpactLabel = getFullPriceImpactLabel(
    priceImpact,
    fNum("fiat", priceImpactUsd, { abbreviated: false })
  );

  const maxSlippageUsd = bn(_slippage).div(100).times(returnAmountUsd);
  const fullMaxSlippageLabel = getMaxSlippageLabel(
    _slippage,
    fNum("fiat", maxSlippageUsd, { abbreviated: false })
  );

  const isExactIn = swapType === SorSwapType.ExactIn;

  const limitLabel = isExactIn ? "You'll get at least" : "You'll pay at most";
  const limitToken = isExactIn ? tokenOutInfo : tokenInInfo;
  const limitValue = isExactIn
    ? bn(tokenOut.amount)
        .minus(bn(tokenOut.amount).times(_slippageDecimal))
        .toString()
    : bn(tokenIn.amount)
        .plus(bn(tokenIn.amount).times(_slippageDecimal))
        .toString();
  const limitTooltip = isExactIn
    ? "You will get at least this amount, even if you suffer maximum slippage " +
      "from unfavorable market price movements before your transaction executes on-chain."
    : "At most, you will spend this amount, even if you suffer maximum slippage " +
      "from unfavortable market price movements before your transaction executes on-chain.";

  const slippageLabel = isExactIn
    ? `This is the maximum slippage that the swap will allow.
        It is based on the quoted amount out minus your slippage tolerance, using current market prices.
        You can change your slippage tolerance in your settings.`
    : `This is the maximum slippage that the swap will allow.
        It is based on the quoted amount in plus your slippage tolerance, using current market prices.
        You can change your slippage tolerance in your settings.`;

  return (
    <VStack align="start" fontSize="sm" spacing="sm" w="full">
      <HStack justify="space-between" w="full">
        <Text color={priceImpactColor}>Price impact</Text>
        <HStack>
          {priceImpactLevel === "unknown" ? (
            <Text>Unknown</Text>
          ) : (
            <NumberText color={priceImpactColor}>
              {fullPriceImpactLabel}
            </NumberText>
          )}
          <Popover trigger="hover">
            <PopoverTrigger>
              {priceImpactLevel === "low" ? (
                <Box
                  _hover={{ opacity: 1 }}
                  opacity="0.5"
                  transition="opacity 0.2s var(--ease-out-cubic)"
                >
                  <InfoIcon />
                </Box>
              ) : (
                <Box>
                  <PriceImpactIcon priceImpactLevel={priceImpactLevel} />
                </Box>
              )}
            </PopoverTrigger>
            <PopoverContent p="sm">
              <Text fontSize="sm" variant="primary">
                This is the negative price impact of the swap based on the
                current market prices of the token in vs token out.
              </Text>
            </PopoverContent>
          </Popover>
        </HStack>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text color="grayText">Max slippage</Text>
        <HStack>
          <NumberText color="grayText">{fullMaxSlippageLabel}</NumberText>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Box
                _hover={{ opacity: 1 }}
                opacity="0.5"
                transition="opacity 0.2s var(--ease-out-cubic)"
              >
                <InfoIcon />
              </Box>
            </PopoverTrigger>
            <PopoverContent p="sm">
              <Text fontSize="sm" variant="primary">
                {slippageLabel}
              </Text>
            </PopoverContent>
          </Popover>
        </HStack>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text color="grayText">{limitLabel}</Text>
        <HStack>
          <NumberText color="grayText">
            {fNum("token", limitValue, { abbreviated: false })}{" "}
            {limitToken?.symbol}
          </NumberText>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Box
                _hover={{ opacity: 1 }}
                opacity="0.5"
                transition="opacity 0.2s var(--ease-out-cubic)"
              >
                <InfoIcon />
              </Box>
            </PopoverTrigger>
            <PopoverContent p="sm">
              <Text fontSize="sm" variant="primary">
                {limitTooltip}
              </Text>
            </PopoverContent>
          </Popover>
        </HStack>
      </HStack>

      {isDefaultSwap ? <OrderRoute /> : null}
    </VStack>
  );
}
