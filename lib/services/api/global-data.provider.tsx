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
import { getBaseUrl } from "@/lib/utils/urls";

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

  const baseUrl = getBaseUrl();
  const tokensData = await fetch(`${baseUrl}/api/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(variables),
    next: {
      revalidate: 60,
    },
  });

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
