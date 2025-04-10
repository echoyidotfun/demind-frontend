"use client";

import {
  TokenPrice,
  MagpieTokenApiVariables,
  MagpieNetworkToGlobalChainMap,
} from "@/lib/services/api/magpie/api.types";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { isSameAddress } from "@/lib/utils/addresses";
import { useMandatoryContext } from "@/lib/utils/contexts";
import { bn, fNum, Numberish } from "@/lib/utils/numbers";
import { Dictionary, zipObject } from "lodash";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Address } from "viem";
import { useSkipInitialQuery } from "@/hooks/useSkipInitialQuery";
import {
  getNativeAssetAddress,
  getWrappedNativeAssetAddress,
} from "@/lib/configs/app.config";
import { mins } from "@/lib/utils/time";
import { GlobalToken } from "./token.types";
import { useQuery } from "@tanstack/react-query";

export type UseTokensResult = ReturnType<typeof _useTokens>;
export const TokensContext = createContext<UseTokensResult | null>(null);

// 从API获取代币数据
const fetchTokens = async (
  variables: MagpieTokenApiVariables
): Promise<GlobalToken[]> => {
  // 在SSR环境下返回空数组，避免服务端请求
  if (typeof window === "undefined") {
    console.log("Running on server, skipping token fetch");
    return [];
  }

  try {
    const response = await fetch("/api/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.status}`);
    }

    const tokensData = await response.json();
    return tokensData.map((token: any) => ({
      ...token,
      chain: token.network?.name
        ? MagpieNetworkToGlobalChainMap[token.network.name]
        : undefined,
      chainId: token.network?.chainId,
    }));
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return []; // 返回空数组而不是抛出错误，避免中断渲染
  }
};

export function _useTokens(
  initTokenData: GlobalToken[],
  variables: MagpieTokenApiVariables
) {
  const skipInitialQuery = useSkipInitialQuery(variables);
  const pollInterval = mins(1).toMs();
  const [isPolling, setIsPolling] = useState(false);

  const {
    data: tokens = initTokenData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tokens", variables],
    queryFn: () => fetchTokens(variables),
    enabled: typeof window !== "undefined" && !skipInitialQuery,
    refetchInterval: isPolling ? pollInterval : false,
    initialData: initTokenData,
    meta: {
      source: "token-service",
      context: {
        extra: {
          variables,
        },
      },
    },
    staleTime: mins(1).toMs(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 从tokens直接计算prices，保持数据一致性
  const prices: TokenPrice[] = tokens.map((token) => ({
    price: parseFloat(token.usdPrice),
    address: token.address,
    chain: token.chain,
  }));

  // 启动轮询
  const startTokenPricePolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  // 停止轮询
  const stopTokenPricePolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  useEffect(() => {
    // 当isPolling变为true时，立即触发一次refetch
    if (isPolling) {
      refetch();
    }
  }, [isPolling, refetch]);

  function getToken(
    address: string,
    chain: GlobalChain | number
  ): GlobalToken | undefined {
    const chainKey = typeof chain === "number" ? "chainId" : "chain";
    return tokens.find(
      (token) =>
        isSameAddress(token.address, address) && token[chainKey] === chain
    );
  }

  function getNativeAssetToken(chain: GlobalChain | number) {
    return getToken(getNativeAssetAddress(chain), chain);
  }

  function getWrappedNativeAssetToken(chain: GlobalChain | number) {
    return getToken(getWrappedNativeAssetAddress(chain), chain);
  }

  const getTokensByChain = useCallback(
    (chain: number | GlobalChain): GlobalToken[] => {
      const chainKey = typeof chain === "number" ? "chainId" : "chain";
      return tokens.filter((token) => token[chainKey] === chain);
    },
    [tokens]
  );

  const getPricesForChain = useCallback(
    (chain: GlobalChain): TokenPrice[] => {
      return prices.filter((price) => price.chain === chain);
    },
    [prices]
  );

  function getTokensByTokenAddress(
    tokenAddresses: Address[],
    chain: GlobalChain
  ): Dictionary<GlobalToken> {
    return zipObject(
      tokenAddresses,
      tokenAddresses.map((t) => getToken(t, chain) as GlobalToken)
    );
  }

  function priceForToken(token: GlobalToken): number {
    const price = getPricesForChain(token.chain).find((price) =>
      isSameAddress(price.address, token.address)
    );
    if (!price) return 0;

    return price.price;
  }

  function priceForAddress(address: string, chain: GlobalChain): number {
    const price = getPricesForChain(chain).find((price) =>
      isSameAddress(price.address, address)
    );
    if (!price) return 0;

    return price.price;
  }

  function usdValueForToken(token: GlobalToken | undefined, amount: Numberish) {
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

  function priceFor(address: string, chain: GlobalChain): number {
    const token = getToken(address, chain);

    if (token) {
      return priceForToken(token);
    } else {
      return priceForAddress(address, chain);
    }
  }

  // 手动更新token数据的函数
  const updateTokens = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    tokens,
    prices,
    isLoadingTokenPrices: isLoading,
    getToken,
    getNativeAssetToken,
    getWrappedNativeAssetToken,
    priceFor,
    priceForToken,
    getTokensByChain,
    getTokensByTokenAddress,
    usdValueForToken,
    startTokenPricePolling,
    stopTokenPricePolling,
    priceForAddress,
    displayUsdValueForToken,
    updateTokens,
    isError,
    error,
  };
}

export function TokensProvider({
  children,
  tokensData,
  variables,
}: PropsWithChildren & {
  tokensData: GlobalToken[];
  variables: MagpieTokenApiVariables;
}) {
  const tokens = _useTokens(tokensData, variables);

  return (
    <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
  );
}

export const useTokens = (): UseTokensResult =>
  useMandatoryContext(TokensContext, "Tokens");
