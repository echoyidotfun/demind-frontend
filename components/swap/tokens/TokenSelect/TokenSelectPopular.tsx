/* eslint-disable react-hooks/exhaustive-deps */
import { getNetworkConfig } from "@/lib/configs/app.config";
import { GqlChain, GqlToken } from "@/lib/services/api/generated/graphql";
import { HStack, Tag, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { useMemo } from "react";
import { TokenIcon } from "@/components/common/icons/TokenIcon";
import { nativeAssetFilter } from "@/lib/modules/tokens/tokenHelper";
import { Address } from "viem";
import { isSameAddress } from "@/lib/utils/addresses";

type Props = {
  chain: GqlChain;
  currentToken?: Address;
  excludeNativeAsset?: boolean;
  onTokenSelect: (token: GqlToken) => void;
};

export function TokenSelectPopular({
  chain,
  currentToken,
  excludeNativeAsset,
  onTokenSelect,
}: Props) {
  const {
    tokens: { popularTokens },
  } = getNetworkConfig(chain);
  const { getToken } = useTokens();

  const tokens = useMemo(() => {
    const tokens = Object.keys(popularTokens || {})
      .slice(0, 7)
      ?.map((token) => getToken(token, chain))
      .filter(Boolean) as GqlToken[];
    return excludeNativeAsset
      ? tokens.filter((token) => !nativeAssetFilter(chain)(token))
      : tokens;
  }, [popularTokens, excludeNativeAsset, chain]);

  const isCurrentToken = (token: GqlToken) =>
    currentToken && isSameAddress(token.address, currentToken);

  return (
    <Wrap>
      {tokens?.map((token) => (
        <WrapItem key={token.address}>
          <Tag
            _hover={
              isCurrentToken(token)
                ? {}
                : { bg: "background.level4", shadow: "none" }
            }
            cursor={isCurrentToken(token) ? "not-allowed" : "pointer"}
            key={token.address}
            onClick={() => !isCurrentToken(token) && onTokenSelect(token)}
            opacity={isCurrentToken(token) ? 0.5 : 1}
            pl="xs"
            role="group"
            shadow="sm"
            size="lg"
            transition="all 0.2s var(--ease-out-cubic)"
          >
            <HStack>
              <TokenIcon
                address={token.address}
                alt={token.symbol}
                chain={chain}
                size={20}
              />
              <Text fontSize="sm">{token.symbol}</Text>
            </HStack>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  );
}
