import { PropsWithChildren } from "react";
import { Web3Provider } from "@/lib/modules/web3/Web3Provider";
import { WagmiConfigProvider } from "@/lib/modules/web3/WagmiConfigProvider";
import { ApolloClientProvider } from "@/lib/services/api/apollo-client-provider";
import { ApolloGlobalDataProvider } from "@/lib/services/api/apollo-global-data.provider";
import { RecentTransactionsProvider } from "@/lib/modules/transactions/RecentTransactionsProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiConfigProvider>
      <Web3Provider>
        <ApolloClientProvider>
          <ApolloGlobalDataProvider>
            <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
          </ApolloGlobalDataProvider>
        </ApolloClientProvider>
      </Web3Provider>
    </WagmiConfigProvider>
  );
}
