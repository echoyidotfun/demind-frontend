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
  useRef,
} from "react";
import { Address } from "viem";
import {
  getNativeAssetAddress,
  getWrappedNativeAssetAddress,
} from "@/lib/configs/app.config";
import { mins } from "@/lib/utils/time";
import { GlobalToken } from "./token.types";
import { useQuery } from "@tanstack/react-query";

export type UseTokensResult = ReturnType<typeof _useTokens>;
export const TokensContext = createContext<UseTokensResult | null>(null);

export type GetTokenFn = (
  address: string,
  chain: GlobalChain
) => GlobalToken | undefined;

// 从API获取代币数据
const fetchTokens = async (
  variables: MagpieTokenApiVariables
): Promise<GlobalToken[]> => {
  // 在SSR环境下返回空数组，避免服务端请求
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const response = await fetch("/api/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables),
      cache: "no-store",
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
  const pollInterval = mins(1).toMs();
  const [isPolling, setIsPolling] = useState(false);
  const isClient = typeof window !== "undefined";

  // 初始化标记，确保数据加载只尝试一次
  const initialLoadAttempted = useRef(false);

  // 使用React Query获取数据
  const {
    data: tokens = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tokens", variables],
    queryFn: () => fetchTokens(variables),
    // 仅在客户端环境启用查询
    enabled: isClient,
    // 仅在启用轮询时设置轮询间隔
    refetchInterval: isPolling ? pollInterval : false,
    initialData: initTokenData,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: mins(1).toMs(),
  });

  // 确保在挂载后获取一次数据
  useEffect(() => {
    if (isClient && !initialLoadAttempted.current) {
      initialLoadAttempted.current = true;
      // 无论初始数据是否为空，都主动获取一次最新数据
      refetch();
    }
  }, [isClient, refetch]);

  // 从tokens计算prices
  const prices: TokenPrice[] = tokens.map((token) => ({
    price: parseFloat(token.usdPrice),
    address: token.address,
    chain: token.chain,
  }));

  // 启动轮询
  const startTokenPricePolling = useCallback(() => {
    if (isClient) {
      setIsPolling(true);
    }
  }, [isClient]);

  // 停止轮询
  const stopTokenPricePolling = useCallback(() => {
    if (isClient) {
      setIsPolling(false);
    }
  }, [isClient]);

  // 当轮询状态变化时刷新数据
  useEffect(() => {
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

  // 添加延迟渲染逻辑，当代币数据为空且仍在加载时不渲染子组件
  // 这可以防止像SwapProvider这样的组件因为空数据而进入无限循环
  const isLoading = tokens.isLoadingTokenPrices && tokens.tokens.length === 0;

  return (
    <TokensContext.Provider value={tokens}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <div>Loading Tokens metadata...</div>
        </div>
      ) : (
        children
      )}
    </TokensContext.Provider>
  );
}

export const useTokens = (): UseTokensResult =>
  useMandatoryContext(TokensContext, "Tokens");
