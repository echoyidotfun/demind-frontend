import { PropsWithChildren } from "react";
import { Web3Provider } from "@/lib/modules/web3/Web3Provider";
import { WagmiConfigProvider } from "@/lib/modules/web3/WagmiConfigProvider";
import { GlobalDataProvider } from "@/lib/services/api/global-data.provider";
import { RecentTransactionsProvider } from "@/lib/modules/transactions/RecentTransactionsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiConfigProvider>
      <Web3Provider>
        <GlobalDataProvider>
          <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
        </GlobalDataProvider>
      </Web3Provider>
    </WagmiConfigProvider>
  );
}
