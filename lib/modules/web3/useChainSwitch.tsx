/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSwitchChain } from "wagmi";
import { Button } from "@chakra-ui/react";
import { getChainShortName } from "@/lib/configs/app.config";
import { SupportedChainId } from "@/lib/configs/config.types";
import { useUserAccount } from "./UserAccountProvider";

export function useChainSwitch(chainId: SupportedChainId) {
  const { chain: connectedChain } = useUserAccount();
  const { isPending, switchChain } = useSwitchChain();

  const shouldChangeNetwork = chainId !== connectedChain?.id;

  const networkSwitchButtonProps = {
    name: getChainShortName(chainId),
    switchChain,
    chainId,
    isPending,
  };

  return {
    shouldChangeNetwork,
    networkSwitchButtonProps,
  };
}

export interface NetworkSwitchButtonProps {
  name: string;
  switchChain?: (variables: { chainId: SupportedChainId }) => void;
  chainId: SupportedChainId;
  isPending: boolean;
}

type Props = { chainId: SupportedChainId };
export function NetworkSwitchButton({ chainId }: Props) {
  const { shouldChangeNetwork, networkSwitchButtonProps } =
    useChainSwitch(chainId);

  if (!shouldChangeNetwork) return;

  return (
    <Button
      isLoading={networkSwitchButtonProps.isPending}
      onClick={() =>
        networkSwitchButtonProps.switchChain?.({
          chainId: networkSwitchButtonProps.chainId,
        })
      }
      size="lg"
      variant="primary"
      w="full"
    >
      Switch network to {networkSwitchButtonProps.name}
    </Button>
  );
}
