"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { UserAccountProvider } from "./UserAccountProvider";
import { useWagmiConfig } from "./WagmiConfigProvider";
import { PropsWithChildren } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export function Web3Provider({ children }: PropsWithChildren) {
  const { wagmiConfig } = useWagmiConfig();
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UserAccountProvider>{children}</UserAccountProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
