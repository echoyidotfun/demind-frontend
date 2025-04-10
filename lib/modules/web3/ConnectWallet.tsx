import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Box,
  Button,
  ButtonProps,
  HStack,
  Image,
  Show,
} from "@chakra-ui/react";
import { useUserAccount } from "./UserAccountProvider";
import { GasPriceCard } from "@/hooks/useGasPrice";
import { getGlobalChain } from "@/lib/configs/app.config";

export function ConnectWallet({
  connectLabel = "Connect wallet",
  ...rest
}: { connectLabel?: string } & ButtonProps) {
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
              <Button
                disabled={isLoading || !mounted}
                loadingText={connectLabel}
                onClick={openConnectModal}
                type="button"
                variant="primary"
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
              variant="tertiary"
              {...rest}
            >
              Wrong network
            </Button>
          );
        }

        const apiChain = getGlobalChain(chain.id);

        return (
          <HStack spacing="sm">
            <GasPriceCard chain={apiChain} inConnectWallect={true} />
            <Button
              alignItems="center"
              display="flex"
              onClick={openChainModal}
              type="button"
              variant="tertiary"
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
              <Show above="sm">{chain.name}</Show>
            </Button>
            <Button onClick={openAccountModal} variant="tertiary" {...rest}>
              <Show above="sm">{account.displayName}</Show>
            </Button>
          </HStack>
        );
      }}
    </ConnectButton.Custom>
  );
}
