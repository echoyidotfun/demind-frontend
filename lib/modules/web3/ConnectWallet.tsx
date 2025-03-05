import { ConnectButton, WalletButton } from "@rainbow-me/rainbowkit";
import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Image,
  Show,
} from "@chakra-ui/react";
import { useUserAccount } from "./UserAccountProvider";

export function ConnectWallet({
  connectLabel = "Connect wallet",
  showCreateWalletButton = false,
  ...rest
}: { connectLabel?: string; showCreateWalletButton?: boolean } & ButtonProps) {
  const { isLoading: isLoadingAccount, isConnected: isConnectedAccount } =
    useUserAccount();

  return (
    <ConnectButton.Custom>
      {({
        mounted,
        openConnectModal,
        authenticationStatus,
        account,
        chain,
        openChainModal,
        openAccountModal,
      }) => {
        const isReady = mounted && authenticationStatus !== "loading";
        const isLoading =
          authenticationStatus === "loading" || isLoadingAccount;
        const isConnected =
          isReady &&
          account &&
          chain &&
          isConnectedAccount &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!isConnected) {
          return (
            <HStack width="full">
              {showCreateWalletButton && (
                <WalletButton.Custom wallet="coinbase">
                  {({ ready, connect }) => {
                    return (
                      <Button
                        disabled={!ready || !mounted || isLoading}
                        onClick={connect}
                        type="button"
                        variant="surface"
                      >
                        Create wallet
                      </Button>
                    );
                  }}
                </WalletButton.Custom>
              )}
              <Button
                disabled={isLoading || !mounted}
                loadingText={connectLabel}
                onClick={openConnectModal}
                type="button"
                variant="surface"
                {...rest}
              >
                {connectLabel}
              </Button>
            </HStack>
          );
        }

        if (chain.unsupported) {
          return (
            <Button
              onClick={openChainModal}
              type="button"
              variant="surface"
              {...rest}
            >
              Unsupported network
            </Button>
          );
        }

        return (
          <HStack className="space-x-2">
            <Button
              alignItems="center"
              display="flex"
              onClick={openChainModal}
              type="button"
              variant="surface"
              {...rest}
            >
              {chain.hasIcon && (
                <Box
                  borderRadius="full"
                  height={6}
                  mr={{ base: "0", sm: "sm" }}
                  overflow="hidden"
                  width={6}
                >
                  {chain.iconUrl && (
                    <Image
                      alt={chain.name ?? "Chain icon"}
                      height={6}
                      src={chain.iconUrl}
                      width={6}
                    />
                  )}
                </Box>
              )}
              <Box display={{ base: "none", sm: "block" }}>{chain.name}</Box>
            </Button>
            <Button onClick={openAccountModal} variant="surface" {...rest}>
              <Box display={{ base: "none", sm: "block" }}>
                {account.displayName}
              </Box>
            </Button>
          </HStack>
        );
      }}
    </ConnectButton.Custom>
  );
}
