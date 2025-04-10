import { TokensProvider } from "@/lib/modules/tokens/TokensProvider";
import { PropsWithChildren } from "react";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import {
  MagpieApiToken,
  MagpieNetworkToGlobalChainMap,
  MagpieTokenApiVariables,
} from "@/lib/services/api/magpie/api.types";
import { GlobalChainToMagpieNetworkMap } from "@/lib/services/api/magpie/api.types";
import { GlobalToken } from "@/lib/modules/tokens/token.types";

export const revalidate = 60;

export async function GlobalDataProvider({ children }: PropsWithChildren) {
  const variables: MagpieTokenApiVariables = {
    networkNames: PROJECT_CONFIG.supportedNetworks.map(
      (network) => GlobalChainToMagpieNetworkMap[network]
    ),
    searchValue: "",
    exact: false,
    offset: 0,
  };

  const tokensData = await fetch(
    `${process.env.NEXT_PUBLIC_MAGPIE_TOKENS_API}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables),
      next: {
        revalidate: 60,
      },
    }
  );

  const initTokensData = await tokensData.json();

  const tokens: GlobalToken[] = initTokensData.map((token: MagpieApiToken) => {
    return {
      ...token,
      chain: MagpieNetworkToGlobalChainMap[token.network.name],
      chainId: token.network.chainId,
    };
  });

  return (
    <TokensProvider tokensData={tokens} variables={variables}>
      {children}
    </TokensProvider>
  );
}
