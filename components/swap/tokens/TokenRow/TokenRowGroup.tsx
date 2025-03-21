import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { GqlChain } from "@/lib/services/api/generated/graphql";
import { ApiToken } from "@/lib/modules/tokens/token.types";
import { HumanTokenAmount } from "@/lib/modules/tokens/token.types";
import { useTotalUsdValue } from "@/lib/modules/tokens/useTotalUsdValue";
import TokenRow from "./TokenRow";
import { fNum } from "@/lib/utils/numbers";

type HumanTokenAmountWithSymbol = HumanTokenAmount & { symbol?: string };

export function TokenRowGroup({
  label,
  amounts,
  chain,
  tokens = [],
  totalUSDValue,
  isLoading = false,
}: {
  label: string;
  amounts: HumanTokenAmountWithSymbol[];
  chain: GqlChain;
  totalUSDValue?: string;
  tokens?: ApiToken[];
  isLoading?: boolean;
}) {
  const { usdValueFor } = useTotalUsdValue(tokens);
  const _totalUSDValue = usdValueFor(amounts);

  const usdValue = totalUSDValue || _totalUSDValue;

  const hasMultipleAmounts = amounts.length > 1;

  return (
    <VStack align="start" spacing="md">
      <HStack justify="space-between" w="full">
        <Text color="grayText">{label}</Text>
        {isLoading ? (
          <Skeleton h="5" w="12" />
        ) : (
          hasMultipleAmounts && (
            <Text>{fNum("fiat", usdValue, { abbreviated: false })}</Text>
          )
        )}
      </HStack>
      {amounts.map((amount) => {
        if (!amount.tokenAddress)
          return <div key={JSON.stringify(amount)}>Missing token</div>;

        return (
          <TokenRow
            abbreviated={false}
            address={amount.tokenAddress}
            chain={chain}
            isLoading={isLoading}
            key={`${amount.tokenAddress}-${amount.humanAmount}`}
            symbol={amount?.symbol}
            value={amount.humanAmount}
          />
        );
      })}
    </VStack>
  );
}
