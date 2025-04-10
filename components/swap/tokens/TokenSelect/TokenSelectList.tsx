"use client";

import { Box, BoxProps, Button, HStack, Text, Divider } from "@chakra-ui/react";
import { TokenSelectListRow } from "./TokenSelectListRow";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { useTokenBalances } from "@/lib/modules/tokens/TokenBalancesProvider";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";
import { useRef } from "react";
import { useTokenSelectList } from "@/lib/modules/tokens/useTokenSelectList";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { CoinsIcon } from "@/components/common/icons/CoinsIcon";
import { WalletIcon } from "@/components/common/icons/WalletIcon";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { Address } from "viem";
import { isSameAddress } from "@/lib/utils/addresses";
import { GlobalToken } from "@/lib/modules/tokens/token.types";

type Props = {
  chain: GlobalChain;
  tokens: GlobalToken[];
  excludeNativeAsset?: boolean;
  pinNativeAsset?: boolean;
  listHeight: number;
  searchTerm?: string;
  currentToken?: Address;
  onTokenSelect: (token: GlobalToken) => void;
};
function OtherTokens() {
  return (
    <Box bg="background.level1">
      <Divider />
      <HStack pt="sm" px="md">
        <Box color="font.secondary">
          <CoinsIcon size={20} />
        </Box>
        <Text color="font.secondary" fontSize="sm">
          Other tokens
        </Text>
      </HStack>
      <Divider pt="2" />
    </Box>
  );
}

interface InYourWalletProps {
  isConnected: boolean;
  openConnectModal: (() => void) | undefined;
  hasNoTokensInWallet: boolean;
}

function InYourWallet({
  isConnected,
  openConnectModal,
  hasNoTokensInWallet,
}: InYourWalletProps) {
  return (
    <Box mr="0" pb="0">
      <Divider />
      <Box bg="background.level1" px="md" py="sm">
        <HStack zIndex="1">
          <Box color="font.secondary">
            <WalletIcon size={20} />
          </Box>
          <Text color="font.secondary" fontSize="sm">
            In your wallet
          </Text>
          {!isConnected && (
            <Button
              _hover={{ color: "font.linkHover" }}
              color="font.link"
              height="24px !important"
              ml="auto"
              onClick={openConnectModal}
              padding="0"
              size="sm"
              variant="link"
            >
              Connect wallet
            </Button>
          )}
          {isConnected && hasNoTokensInWallet && (
            <Box ml="auto">
              <Text color="red.500" fontSize="sm" fontWeight="bold">
                No tokens on this network
              </Text>
            </Box>
          )}
        </HStack>
      </Box>
      {isConnected && !hasNoTokensInWallet && <Divider />}
    </Box>
  );
}

interface TokenRowProps {
  index: number;
  token: GlobalToken;
  isConnected: boolean;
  balanceFor: (token: GlobalToken) => any;
  isBalancesLoading: boolean;
  isLoadingTokenPrices: boolean;
  isCurrentToken: (token: GlobalToken) => boolean;
  onTokenSelect: (token: GlobalToken) => void;
}

function TokenRow({
  index,
  token,
  isConnected,
  balanceFor,
  isBalancesLoading,
  isLoadingTokenPrices,
  isCurrentToken,
  onTokenSelect,
}: TokenRowProps) {
  const userBalance = isConnected ? balanceFor(token) : undefined;

  return (
    <TokenSelectListRow
      isBalancesLoading={isBalancesLoading || isLoadingTokenPrices}
      isCurrentToken={isCurrentToken(token)}
      onClick={() => !isCurrentToken(token) && onTokenSelect(token)}
      token={token}
      userBalance={userBalance}
    />
  );
}

function renderTokenRow(
  index: number,
  balanceFor: (token: GlobalToken) => any,
  isBalancesLoading: boolean,
  isConnected: boolean,
  isCurrentToken: (token: GlobalToken) => boolean,
  isLoadingTokenPrices: boolean,
  onTokenSelect: (token: GlobalToken) => void,
  tokensToShow: GlobalToken[]
) {
  return (
    <TokenRow
      balanceFor={balanceFor}
      index={index}
      isBalancesLoading={isBalancesLoading}
      isConnected={isConnected}
      isCurrentToken={isCurrentToken}
      isLoadingTokenPrices={isLoadingTokenPrices}
      onTokenSelect={onTokenSelect}
      token={tokensToShow[index]}
    />
  );
}

export function TokenSelectList({
  chain,
  tokens,
  excludeNativeAsset = false,
  pinNativeAsset = false,
  listHeight,
  searchTerm,
  currentToken,
  onTokenSelect,
  ...rest
}: Props & BoxProps) {
  const ref = useRef<GroupedVirtuosoHandle>(null);
  const { balanceFor, isBalancesLoading } = useTokenBalances();
  const { isLoadingTokenPrices } = useTokens();
  const { isConnected } = useUserAccount();
  const { orderedTokens } = useTokenSelectList(
    chain,
    tokens,
    excludeNativeAsset,
    pinNativeAsset,
    searchTerm
  );
  const { openConnectModal } = useConnectModal();

  const tokensWithBalance = isConnected
    ? orderedTokens.filter((token) => balanceFor(token)?.amount)
    : [];
  const tokensWithoutBalance = orderedTokens.filter(
    (token) => !tokensWithBalance.includes(token)
  );
  const tokensToShow = [...tokensWithBalance, ...tokensWithoutBalance];

  const isCurrentToken = (token: GlobalToken) =>
    !!currentToken && isSameAddress(token.address, currentToken);

  const groups = [
    <InYourWallet
      hasNoTokensInWallet={!tokensWithBalance.length}
      isConnected={isConnected}
      key="in-your-wallet"
      openConnectModal={openConnectModal}
    />,
    <OtherTokens key="other-tokens" />,
  ];
  const groupCounts = [tokensWithBalance.length, tokensWithoutBalance.length];

  return (
    <Box height={listHeight} {...rest}>
      {tokensToShow.length === 0 ? (
        <Box p="lg">
          <Text color="font.error" fontWeight="bold" mb="xxs">
            No tokens found
          </Text>
          <Text color="font.secondary" fontSize="sm">
            Are you sure this token is on this network?
          </Text>
          <Text color="font.secondary" fontSize="sm">
            You can search by token name, symbol or address
          </Text>
        </Box>
      ) : (
        <GroupedVirtuoso
          groupContent={(index) => groups[index]}
          groupCounts={groupCounts}
          itemContent={(index) =>
            renderTokenRow(
              index,
              balanceFor,
              isBalancesLoading,
              isConnected,
              isCurrentToken,
              isLoadingTokenPrices,
              onTokenSelect,
              tokensToShow
            )
          }
          style={{ height: listHeight }}
        />
      )}
    </Box>
  );
}
