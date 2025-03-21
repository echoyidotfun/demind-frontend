/**
 * Apollo Global Data Provider
 *
 * This component is used to fetch data that is needed for the entire
 * application during the RSC render pass. The data is then passed to the client
 * providers that should then call `useSeedApolloCache` to seed the apollo cache
 * prior to the useQuery call, ensuring the data is already present on the first
 * client render pass.
 */
import { getApolloServerClient } from "./apollo-server.client";
import {
  GetTokenPricesDocument,
  GetTokensDocument,
} from "@/lib/services/api/generated/graphql";
import { TokensProvider } from "@/lib/modules/tokens/TokensProvider";
import { mins } from "@/lib/utils/time";
import { PropsWithChildren } from "react";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";

export const revalidate = 60;

export async function ApolloGlobalDataProvider({
  children,
}: PropsWithChildren) {
  const client = getApolloServerClient();

  const tokensQueryVariables = {
    chains: PROJECT_CONFIG.supportedNetworks,
  };

  const { data: tokensQueryData } = await client.query({
    query: GetTokensDocument,
    variables: tokensQueryVariables,
    context: {
      fetchOptions: {
        next: { revalidate: mins(20).toSecs() },
      },
    },
  });

  const { data: tokenPricesQueryData } = await client.query({
    query: GetTokenPricesDocument,
    variables: {
      chains: PROJECT_CONFIG.supportedNetworks,
    },
    context: {
      fetchOptions: {
        next: { revalidate: mins(10).toSecs() },
      },
    },
  });

  return (
    <TokensProvider
      tokenPricesData={tokenPricesQueryData}
      tokensData={tokensQueryData}
      variables={tokensQueryVariables}
    >
      {children}
    </TokensProvider>
  );
}
