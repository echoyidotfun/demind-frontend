"use client";

import { Box, BoxProps, Center, Text } from "@chakra-ui/react";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useTokenBalances } from "@/lib/modules/tokens/TokenBalancesProvider";
import { TokenSelectListRow } from "./TokenSelectListRow";
import { ApiToken } from "@/lib/modules/tokens/token.types";

type Props = {
  tokens: ApiToken[];
  onTokenSelect: (token: ApiToken) => void;
};

export function CompactTokenSelectList({
  tokens,
  onTokenSelect,
  ...rest
}: Props & BoxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { balanceFor, isBalancesLoading } = useTokenBalances();
  const { isConnected } = useUserAccount();

  function keyFor(token: ApiToken, index: number) {
    return `${token.address}:${token.chain}:${index}`;
  }

  const style = { height: `${tokens.length * 75}px` };

  function renderRow(index: number) {
    const token = tokens[index];
    const userBalance = isConnected ? balanceFor(token) : undefined;

    return (
      <TokenSelectListRow
        active={index === activeIndex}
        isBalancesLoading={isBalancesLoading}
        key={keyFor(token, index)}
        onClick={() => onTokenSelect(token)}
        token={token}
        userBalance={userBalance}
      />
    );
  }

  return (
    <Box {...rest}>
      {tokens.length === 0 ? (
        <Center h="60">
          <Text color="gray.500" fontSize="sm">
            No tokens found
          </Text>
        </Center>
      ) : (
        <Virtuoso data={tokens} itemContent={renderRow} style={style} />
      )}
    </Box>
  );
}
