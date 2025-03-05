import { PropsWithChildren } from "react";
import { Web3Provider } from "@/lib/modules/web3/Web3Provider";
import { WagmiConfigProvider } from "@/lib/modules/web3/WagmiConfigProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiConfigProvider>
      <Web3Provider>{children}</Web3Provider>
    </WagmiConfigProvider>
  );
}
