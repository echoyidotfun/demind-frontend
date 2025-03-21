/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  GetTokenPricesDocument,
  GetTokenPricesQuery,
  GetTokensDocument,
  GetTokensQuery,
  GetTokensQueryVariables,
  GqlChain,
  GqlToken,
} from "@/lib/services/api/generated/graphql";
import { isSameAddress } from "@/lib/utils/addresses";
import { useMandatoryContext } from "@/lib/utils/contexts";
import { bn, fNum, Numberish } from "@/lib/utils/numbers";
import { useQuery } from "@apollo/client";
import { Dictionary, zipObject } from "lodash";
import { createContext, PropsWithChildren, useCallback } from "react";
import { Address } from "viem";
import { useSkipInitialQuery } from "@/hooks/useSkipInitialQuery";
import {
  getNativeAssetAddress,
  getWrappedNativeAssetAddress,
} from "@/lib/configs/app.config";
import { mins } from "@/lib/utils/time";
import mainnetNetworkConfig from "@/lib/configs/networks/mainnet";
import { ApiToken } from "./token.types";

export type UseTokensResult = ReturnType<typeof _useTokens>;
export const TokensContext = createContext<UseTokensResult | null>(null);

export type GetTokenFn = (
  address: string,
  chain: GqlChain
) => ApiToken | undefined;

export function _useTokens(
  initTokenData: GetTokensQuery,
  initTokenPricesData: GetTokenPricesQuery,
  variables: GetTokensQueryVariables
) {
  const skipQuery = useSkipInitialQuery(variables);
  const pollInterval = mins(3).toMs();

  // skip initial fetch on mount so that initialData is used
  const { data: tokensData } = useQuery(GetTokensDocument, {
    variables,
    skip: skipQuery,
  });

  const {
    data: tokenPricesData,
    loading: isLoadingTokenPrices,
    startPolling,
    stopPolling,
  } = useQuery(GetTokenPricesDocument, {
    variables,
    // The server provides us with an initial data set, but we immediately reload the potentially
    // stale data to ensure the prices we show are up to date. Every 3 mins, we requery token prices
    initialFetchPolicy: "no-cache",
    nextFetchPolicy: "cache-and-network",
    pollInterval,
    notifyOnNetworkStatusChange: true,
  });

  const tokens = tokensData?.tokens || initTokenData.tokens;
  const prices =
    tokenPricesData?.tokenPrices || initTokenPricesData.tokenPrices;

  /*
    It can return undefined when the token address belongs to a pool token (not included in the provided tokens)
    // TODO: should we avoid calling getToken with pool tokens?
   */
  function getToken(
    address: string,
    chain: GqlChain | number
  ): ApiToken | undefined {
    const chainKey = typeof chain === "number" ? "chainId" : "chain";
    return tokens.find(
      (token) =>
        isSameAddress(token.address, address) && token[chainKey] === chain
    );
  }

  function getNativeAssetToken(chain: GqlChain | number) {
    return getToken(getNativeAssetAddress(chain), chain);
  }

  function getWrappedNativeAssetToken(chain: GqlChain | number) {
    return getToken(getWrappedNativeAssetAddress(chain), chain);
  }

  const getTokensByChain = useCallback(
    (chain: number | GqlChain): GqlToken[] => {
      const chainKey = typeof chain === "number" ? "chainId" : "chain";
      return tokens.filter((token) => token[chainKey] === chain);
    },
    [tokens]
  );

  const getPricesForChain = useCallback(
    (chain: GqlChain): GetTokenPricesQuery["tokenPrices"] => {
      return prices.filter((price) => price.chain === chain);
    },
    [prices]
  );

  function getTokensByTokenAddress(
    tokenAddresses: Address[],
    chain: GqlChain
  ): Dictionary<GqlToken> {
    return zipObject(
      tokenAddresses,
      tokenAddresses.map((t) => getToken(t, chain) as GqlToken)
    );
  }

  function priceForToken(token: ApiToken): number {
    const price = getPricesForChain(token.chain).find((price) =>
      isSameAddress(price.address, token.address)
    );
    if (!price) return 0;

    return price.price;
  }

  function priceForAddress(address: string, chain: GqlChain): number {
    const price = getPricesForChain(chain).find((price) =>
      isSameAddress(price.address, address)
    );
    if (!price) return 0;

    return price.price;
  }

  function usdValueForToken(token: ApiToken | undefined, amount: Numberish) {
    if (!token) return "0";
    if (amount === "") return "0";
    return bn(amount).times(priceForToken(token)).toFixed();
  }

  function displayUsdValueForToken(
    usdValue: Numberish,
    { abbreviated = true }: { abbreviated?: boolean } = {}
  ) {
    const symbol = "$";
    const formattedAmount = fNum("fiat", usdValue, { abbreviated });
    if (formattedAmount.startsWith("<")) {
      return "<" + symbol + formattedAmount.substring(1);
    }
    return symbol + formattedAmount;
  }

  function priceFor(address: string, chain: GqlChain): number {
    const token = getToken(address, chain);

    if (token) {
      return priceForToken(token);
    } else {
      return priceForAddress(address, chain);
    }
  }

  //   const calcWeightForBalance = useCallback(
  //     (
  //       tokenAddress: Address | string,
  //       tokenBalance: string,
  //       totalLiquidity: string,
  //       chain: GqlChain
  //     ): string => {
  //       const tokenPrice = priceFor(tokenAddress, chain);

  //       return bn(tokenPrice).times(tokenBalance).div(totalLiquidity).toString();
  //     },
  //     []
  //   );

  //   const calcTotalUsdValue = useCallback(
  //     (poolTokens: PoolToken[], chain: GqlChain) => {
  //       return poolTokens
  //         .reduce((total, token) => {
  //           return total.plus(
  //             bn(priceFor(token.address, chain)).times(token.balance)
  //           );
  //         }, bn(0))
  //         .toString();
  //     },
  //     []
  //   );

  //   const vebalBptToken = tokens.find(
  //     (t) => t.address === mainnetNetworkConfig.tokens.addresses.veBalBpt
  //   );

  return {
    tokens,
    prices,
    isLoadingTokenPrices,
    getToken,
    getNativeAssetToken,
    getWrappedNativeAssetToken,
    priceFor,
    priceForToken,
    getTokensByChain,
    getTokensByTokenAddress,
    usdValueForToken,
    startTokenPricePolling: () => startPolling(pollInterval),
    stopTokenPricePolling: stopPolling,
    priceForAddress,
    displayUsdValueForToken,
  };
}

export function TokensProvider({
  children,
  tokensData,
  tokenPricesData,
  variables,
}: PropsWithChildren & {
  tokensData: GetTokensQuery;
  tokenPricesData: GetTokenPricesQuery;
  variables: GetTokensQueryVariables;
}) {
  const tokens = _useTokens(tokensData, tokenPricesData, variables);

  return (
    <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
  );
}

export const useTokens = (): UseTokensResult =>
  useMandatoryContext(TokensContext, "Tokens");
