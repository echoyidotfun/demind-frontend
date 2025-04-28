"use client";

import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMakeVarPersisted } from "@/hooks/useMakeVarPersisted";
import { Address, Hash, isAddress, parseUnits } from "viem";
import {
  OSwapAction,
  SimulateSwapResponse,
  SwapAction,
  SwapState,
} from "./swap.types";
import { emptyAddress } from "../web3/contracts/wagmi-helpers";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { SorSwapType } from "./swap.types";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { useReactiveVar } from "@apollo/client";
import { useUserAccount } from "../web3/UserAccountProvider";
import { useNetworkConfig } from "@/lib/configs/useNetworkConfig";
import { useTokens } from "../tokens/TokensProvider";
import { useTokenBalances } from "../tokens/TokenBalancesProvider";
import { useTokenInputsValidation } from "../tokens/TokenInputsValidationProvider";
import { usePriceImpact } from "../price-impact/PriceImpactProvider";
import { useDisclosure } from "@chakra-ui/react";
import { GlobalToken } from "../tokens/token.types";
import { AnySwapHandler } from "./handlers/Swap.handler";
import {
  getWrapperForBaseToken,
  getWrapType,
  isWrapOrUnwrap,
} from "./wrap.helper";
import { bn } from "@/lib/utils/numbers";
import { useSimulateSwapQuery } from "./queries/useSimulateSwapQuery";
import { HumanAmount, isSameAddress } from "@balancer/sdk";
import { getNetworkConfig } from "@/lib/configs/app.config";
import { ChainSlug, chainToSlugMap, getChainSlug } from "@/lib/utils/urls";
import { selectByAddress } from "@/lib/utils/addresses";
import { calcMarketPriceImpact } from "../price-impact/price-impact.utils";
import { useSwapSteps } from "./useSwapSteps";
import { invert } from "lodash";
import { isDisabledWithReason } from "@/lib/utils/functions";
import { LABELS } from "@/lib/utils/labels";
import { useMandatoryContext } from "@/lib/utils/contexts";
import { useTransactionSteps } from "../transactions/useTransactionSteps";
import { selectSwapHandler as factorySelectSwapHandler } from "./handlers/SwapHandlerFactory";

export type UseSwapResponse = ReturnType<typeof _useSwap>;
export const SwapContext = createContext<UseSwapResponse | null>(null);

export type PathParams = {
  chain?: string;
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: string;
  amountOut?: string;
  urlTxHash?: Hash;
};

function selectSwapHandler(
  tokenInAddress: Address,
  tokenOutAddress: Address,
  chain: GlobalChain,
  getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined
): AnySwapHandler {
  return factorySelectSwapHandler(
    tokenInAddress,
    tokenOutAddress,
    chain,
    getToken
  );
}

export type SwapProviderProps = {
  pathParams: PathParams;
};

export function _useSwap({ pathParams }: SwapProviderProps) {
  const urlTxHash = pathParams.urlTxHash;

  const shouldDiscardOldPersistedValue = false;
  const swapStateVar = useMakeVarPersisted<SwapState>(
    {
      tokenIn: {
        address: emptyAddress,
        amount: "",
        scaledAmount: BigInt(0),
      },
      tokenOut: {
        address: emptyAddress,
        amount: "",
        scaledAmount: BigInt(0),
      },
      swapType: SorSwapType.ExactIn,
      selectedChain: PROJECT_CONFIG.defaultNetwork,
    },
    "swapState",
    shouldDiscardOldPersistedValue
  );
  const swapState = useReactiveVar(swapStateVar);

  const [needsToAcceptHighPI, setNeedsToAcceptHighPI] = useState(false);
  const [tokenSelectKey, setTokenSelectKey] = useState<"tokenIn" | "tokenOut">(
    "tokenIn"
  );
  const [initUserChain, setInitUserChain] = useState<GlobalChain | undefined>(
    undefined
  );

  const { isConnected } = useUserAccount();
  const { chain: walletChain } = useNetworkConfig();
  const { getToken, getTokensByChain, usdValueForToken } = useTokens();
  const { tokens, setTokens } = useTokenBalances();
  const { hasValidationErrors } = useTokenInputsValidation();
  const { setPriceImpact, setPriceImpactLevel } = usePriceImpact();

  const selectedChain = swapState.selectedChain;
  const previewModalDisclosure = useDisclosure();

  const handler = useMemo(() => {
    return selectSwapHandler(
      swapState.tokenIn.address,
      swapState.tokenOut.address,
      selectedChain,
      getToken
    );
  }, [swapState.tokenIn.address, swapState.tokenOut.address, selectedChain]);

  const isTokenInSet = swapState.tokenIn.address !== emptyAddress;
  const isTokenOutSet = swapState.tokenOut.address !== emptyAddress;

  const tokenInInfo = getToken(swapState.tokenIn.address, selectedChain);
  const tokenOutInfo = getToken(swapState.tokenOut.address, selectedChain);

  // 检查是否有可用的token数据
  const hasAvailableTokens = getTokensByChain(selectedChain).length > 0;

  // 仅在有token数据可用时才尝试设置默认token
  if (
    hasAvailableTokens &&
    ((isTokenInSet && !tokenInInfo) || (isTokenOutSet && !tokenOutInfo))
  ) {
    try {
      setDefaultTokens();
    } catch (error) {
      console.error("Token metadata not found", error);
      // 出错时不要抛出异常，避免中断渲染
    }
  }

  const tokenInUsd = usdValueForToken(tokenInInfo, swapState.tokenIn.amount);
  const tokenOutUsd = usdValueForToken(tokenOutInfo, swapState.tokenOut.amount);

  const getSwapAmount = () => {
    const swapState = swapStateVar();
    return (
      (swapState.swapType === SorSwapType.ExactIn
        ? swapState.tokenIn.amount
        : swapState.tokenOut.amount) || "0"
    );
  };

  const getSwapScaledAmount = () => {
    const swapState = swapStateVar();
    return swapState.swapType === SorSwapType.ExactIn
      ? swapState.tokenIn.scaledAmount
      : swapState.tokenOut.scaledAmount;
  };

  const shouldFetchSwap = (state: SwapState, urlTxHash?: Hash) => {
    if (urlTxHash) return false;
    return (
      isAddress(state.tokenIn.address) &&
      isAddress(state.tokenOut.address) &&
      !!state.swapType &&
      bn(getSwapAmount()).gt(0)
    );
  };

  // function getPoolSwapPoolsIds(): string[] | undefined {
  //   if (!isPoolSwap) return undefined;

  //   const tokensNestedPools = pool.poolTokens
  //     .map((poolToken) => poolToken.nestedPool?.id)
  //     .filter(Boolean) as string[];

  //   return [pool.id, ...tokensNestedPools];
  // }

  const simulationQuery = useSimulateSwapQuery({
    handler,
    swapInputs: {
      chain: selectedChain,
      tokenIn: swapState.tokenIn.address,
      tokenOut: swapState.tokenOut.address,
      swapType: swapState.swapType,
      swapAmount: getSwapAmount(),
      swapScaledAmount: getSwapScaledAmount(),
    },
    enabled: shouldFetchSwap(swapState, urlTxHash),
  });

  function handleSimulationResponse({
    returnAmount,
    swapType,
  }: SimulateSwapResponse) {
    const swapState = swapStateVar();
    swapStateVar({
      ...swapState,
      swapType,
    });

    if (swapType === SorSwapType.ExactIn) {
      setTokenOutAmount(returnAmount, { userTriggered: false });
    } else {
      setTokenInAmount(returnAmount, { userTriggered: false });
    }
  }

  function setSelectedChain(_selectedChain: GlobalChain) {
    const defaultTokenState = getDefaultTokenState(_selectedChain);
    swapStateVar(defaultTokenState);
  }

  function setTokenIn(tokenAddress: Address) {
    const swapState = swapStateVar();
    const isSameAsTokenOut = isSameAddress(
      tokenAddress,
      swapState.tokenOut.address
    );

    swapStateVar({
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        address: tokenAddress,
      },
      tokenOut: isSameAsTokenOut
        ? { ...swapState.tokenOut, address: emptyAddress }
        : swapState.tokenOut,
    });
  }

  function setTokenOut(tokenAddress: Address) {
    const swapState = swapStateVar();
    const isSameAsTokenIn = isSameAddress(
      tokenAddress,
      swapState.tokenIn.address
    );

    swapStateVar({
      ...swapState,
      tokenOut: {
        ...swapState.tokenOut,
        address: tokenAddress,
      },
      tokenIn: isSameAsTokenIn
        ? { ...swapState.tokenIn, address: emptyAddress }
        : swapState.tokenIn,
    });
  }

  function switchTokens() {
    const swapState = swapStateVar();
    swapStateVar({
      ...swapState,
      tokenIn: swapState.tokenOut,
      tokenOut: swapState.tokenIn,
      swapType: SorSwapType.ExactIn,
    });
    setTokenInAmount("", { userTriggered: false });
    setTokenOutAmount("", { userTriggered: false });
  }

  function setTokenInAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    const state = swapStateVar();
    const newState = {
      ...state,
      tokenIn: {
        ...state.tokenIn,
        /*
          When copy-pasting a swap URL with a token amount, the tokenInInfo can be undefined
          so we set amount as zero instead of crashing the app
        */
        amount: tokenInInfo ? amount : "0",
        scaledAmount: tokenInInfo ? scaleTokenAmount(amount, tokenInInfo) : 0n,
      },
    };

    if (userTriggered) {
      swapStateVar({
        ...newState,
        swapType: SorSwapType.ExactIn,
      });
      setTokenOutAmount("", { userTriggered: false });
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from the other input.
      swapStateVar(newState);
    }
  }

  function setTokenOutAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    const state = swapStateVar();
    const newState = {
      ...state,
      tokenOut: {
        ...state.tokenOut,
        /*
          When copy-pasting a swap URL with a token amount, the tokenOutInfo can be undefined
          so we set amount as zero instead of crashing the app
        */
        amount: tokenOutInfo ? amount : "0",
        scaledAmount: tokenOutInfo
          ? scaleTokenAmount(amount, tokenOutInfo)
          : 0n,
      },
    };

    if (userTriggered) {
      swapStateVar({
        ...newState,
        swapType: SorSwapType.ExactOut,
      });
      setTokenInAmount("", { userTriggered: false });
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from
      // the other input.
      swapStateVar(newState);
    }
  }

  function getDefaultTokenState(chain: GlobalChain) {
    const swapState = swapStateVar();
    const {
      tokens: { defaultSwapTokens },
    } = getNetworkConfig(chain);
    const { tokenIn, tokenOut } = defaultSwapTokens || {};

    return {
      swapType: SorSwapType.ExactIn,
      selectedChain: chain,
      tokenIn: {
        ...swapState.tokenIn,
        address: tokenIn ? tokenIn : emptyAddress,
      },
      tokenOut: {
        ...swapState.tokenOut,
        address: tokenOut ? tokenOut : emptyAddress,
      },
    };
  }

  function resetSwapAmounts() {
    const state = swapStateVar();

    swapStateVar({
      ...state,
      tokenIn: {
        ...state.tokenIn,
        amount: "",
        scaledAmount: BigInt(0),
      },
      tokenOut: {
        ...state.tokenOut,
        amount: "",
        scaledAmount: BigInt(0),
      },
    });
  }

  function setDefaultTokens() {
    swapStateVar(getDefaultTokenState(selectedChain));
  }

  function replaceUrlPath() {
    const { selectedChain, tokenIn, tokenOut, swapType } = swapState;
    const networkConfig = getNetworkConfig(selectedChain);
    const { popularTokens } = networkConfig.tokens;
    const chainSlug = chainToSlugMap[selectedChain];
    const newPath = ["/swap"];

    const _tokenIn =
      selectByAddress(popularTokens || {}, tokenIn.address) || tokenIn.address;
    const _tokenOut =
      selectByAddress(popularTokens || {}, tokenOut.address) ||
      tokenOut.address;

    if (chainSlug) newPath.push(`/${chainSlug}`);
    if (_tokenIn) newPath.push(`/${_tokenIn}`);
    if (_tokenIn && _tokenOut) newPath.push(`/${_tokenOut}`);
    if (
      _tokenIn &&
      _tokenOut &&
      tokenIn.amount &&
      swapType === SorSwapType.ExactIn
    ) {
      newPath.push(`/${tokenIn.amount}`);
    }
    if (
      _tokenIn &&
      _tokenOut &&
      tokenOut.amount &&
      swapType === SorSwapType.ExactOut
    ) {
      newPath.push(`/0/${tokenOut.amount}`);
    }

    window.history.replaceState({}, "", newPath.join(""));
  }

  function scaleTokenAmount(amount: string, token: GlobalToken): bigint {
    if (amount === "") return parseUnits("0", 18);
    return parseUnits(amount, token.decimals);
  }

  function calcPriceImpact() {
    if (!bn(tokenInUsd).isZero() && !bn(tokenOutUsd).isZero()) {
      setPriceImpact(calcMarketPriceImpact(tokenInUsd, tokenOutUsd));
    } else if (simulationQuery.data) {
      setPriceImpact(undefined);
      setPriceImpactLevel("unknown");
    }
  }

  const networkConfig = getNetworkConfig(selectedChain);
  const wethIsEth =
    isSameAddress(
      swapState.tokenIn.address,
      networkConfig.tokens.nativeAsset.address
    ) ||
    isSameAddress(
      swapState.tokenOut.address,
      networkConfig.tokens.nativeAsset.address
    );
  const validAmountOut = bn(swapState.tokenOut.amount).gt(0);

  const routerAddress = simulationQuery.data?.router as Address;

  const swapAction: SwapAction = useMemo(() => {
    if (
      isWrapOrUnwrap(
        swapState.tokenIn.address,
        swapState.tokenOut.address,
        selectedChain
      )
    ) {
      const wrapType = getWrapType(
        swapState.tokenIn.address,
        swapState.tokenOut.address,
        selectedChain
      );
      return wrapType ? wrapType : OSwapAction.SWAP;
    }

    return OSwapAction.SWAP;
  }, [swapState.tokenIn.address, swapState.tokenOut.address, selectedChain]);

  const isWrap = swapAction === "wrap" || swapAction === "unwrap";

  /**
   * Step construction
   */
  const { steps, isLoadingSteps } = useSwapSteps({
    routerAddress,
    swapState,
    handler,
    simulationQuery,
    wethIsEth,
    swapAction,
    tokenInInfo,
    tokenOutInfo,
  });

  const transactionSteps = useTransactionSteps(steps, isLoadingSteps);

  const swapTxHash =
    urlTxHash ||
    transactionSteps.lastTransaction?.result?.data?.transactionHash;
  const swapTxConfirmed = transactionSteps.lastTransactionConfirmed;

  const hasQuoteContext = !!simulationQuery.data;

  function setInitialTokenIn(slugTokenIn?: string) {
    const { popularTokens } = getInitialNetworkConfig().tokens;
    const symbolToAddressMap = invert(popularTokens || {}) as Record<
      string,
      Address
    >;
    if (slugTokenIn) {
      if (isAddress(slugTokenIn)) {
        setTokenIn(slugTokenIn as Address);
      } else if (
        symbolToAddressMap[slugTokenIn] &&
        isAddress(symbolToAddressMap[slugTokenIn])
      ) {
        setTokenIn(symbolToAddressMap[slugTokenIn]);
      }
    }
  }

  function setInitialTokenOut(slugTokenOut?: string) {
    const { popularTokens } = getInitialNetworkConfig().tokens;
    const symbolToAddressMap = invert(popularTokens || {}) as Record<
      string,
      Address
    >;
    if (slugTokenOut) {
      if (isAddress(slugTokenOut)) setTokenOut(slugTokenOut as Address);
      else if (
        symbolToAddressMap[slugTokenOut] &&
        isAddress(symbolToAddressMap[slugTokenOut])
      ) {
        setTokenOut(symbolToAddressMap[slugTokenOut]);
      }
    }
  }

  function setInitialChain(slugChain?: string) {
    const _chain =
      slugChain && getChainSlug(slugChain as ChainSlug)
        ? getChainSlug(slugChain as ChainSlug)
        : walletChain;

    setSelectedChain(_chain);
  }

  function setInitialAmounts(slugAmountIn?: string, slugAmountOut?: string) {
    if (slugAmountIn && !slugAmountOut && bn(slugAmountIn).gt(0)) {
      setTokenInAmount(slugAmountIn as HumanAmount);
    } else if (slugAmountOut && bn(slugAmountOut).gt(0)) {
      setTokenOutAmount(slugAmountOut as HumanAmount);
    } else resetSwapAmounts();
  }

  // Returns networkConfig to be used in the initial load
  function getInitialNetworkConfig() {
    const swapState = swapStateVar();
    return getNetworkConfig(swapState.selectedChain);
  }

  // Set state on initial load
  useEffect(() => {
    if (urlTxHash) return;

    const { chain, tokenIn, tokenOut, amountIn, amountOut } = pathParams;

    setInitialChain(chain);
    setInitialTokenIn(tokenIn);
    setInitialTokenOut(tokenOut);
    setInitialAmounts(amountIn, amountOut);

    if (!swapState.tokenIn.address && !swapState.tokenOut.address)
      setDefaultTokens();
  }, []);

  // When wallet chain changes, update the swap form chain
  useEffect(() => {
    if (isConnected && initUserChain && walletChain !== selectedChain) {
      setSelectedChain(walletChain);
    } else if (isConnected) {
      setInitUserChain(walletChain);
    }
  }, [walletChain]);

  // When a new simulation is triggered, update the state
  useEffect(() => {
    if (simulationQuery.data) {
      handleSimulationResponse(simulationQuery.data);
    }
  }, [simulationQuery.data]);

  // Check if tokenIn is a base wrap token and set tokenOut as the wrapped token.
  useEffect(() => {
    const wrapper = getWrapperForBaseToken(
      swapState.tokenIn.address,
      selectedChain
    );
    if (wrapper) setTokenOut(wrapper.wrappedToken);

    // If the token in address changes we should reset tx step index because
    // the first approval will be different.
    transactionSteps.setCurrentStepIndex(0);
  }, [swapState.tokenIn.address]);

  // Check if tokenOut is a base wrap token and set tokenIn as the wrapped token.
  useEffect(() => {
    const wrapper = getWrapperForBaseToken(
      swapState.tokenOut.address,
      selectedChain
    );
    if (wrapper) setTokenIn(wrapper.wrappedToken);
  }, [swapState.tokenOut.address]);

  // Update the URL path when the tokens change
  useEffect(() => {
    if (!swapTxHash) replaceUrlPath();
  }, [
    selectedChain,
    swapState.tokenIn,
    swapState.tokenOut,
    swapState.tokenIn.amount,
  ]);

  // Update selectable tokens when the chain changes
  useEffect(() => {
    setTokens(getTokensByChain(selectedChain));
  }, [selectedChain]);

  // Open the preview modal when a swap tx hash is present
  useEffect(() => {
    if (swapTxHash) {
      previewModalDisclosure.onOpen();
    }
  }, [swapTxHash]);

  // If token out value changes when swapping exact in, recalculate price impact.
  useEffect(() => {
    if (swapState.swapType === SorSwapType.ExactIn) {
      calcPriceImpact();
    }
  }, [tokenOutUsd]);

  // If token in value changes when swapping exact out, recalculate price impact.
  useEffect(() => {
    if (swapState.swapType === SorSwapType.ExactOut) {
      calcPriceImpact();
    }
  }, [tokenInUsd]);

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [!validAmountOut, "Invalid amount out"],
    [needsToAcceptHighPI, "Accept high price impact first"],
    [hasValidationErrors, "Invalid input"],
    [simulationQuery.isError, "Error fetching swap"],
    [simulationQuery.isLoading, "Fetching swap..."]
  );

  return {
    ...swapState,
    selectedChain,
    transactionSteps,
    tokens,
    tokenInInfo,
    tokenOutInfo,
    tokenSelectKey,
    simulationQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    handler,
    wethIsEth,
    swapAction,
    urlTxHash,
    swapTxHash,
    hasQuoteContext,
    isWrap,
    swapTxConfirmed,
    replaceUrlPath,
    resetSwapAmounts,
    setTokenSelectKey,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenIn,
    setTokenOut,
    switchTokens,
    setNeedsToAcceptHighPI,
  };
}

type Props = PropsWithChildren<{
  params: SwapProviderProps;
}>;

export function SwapProvider({ params, children }: Props) {
  const hooks = _useSwap(params);
  return <SwapContext.Provider value={hooks}>{children}</SwapContext.Provider>;
}

export const useSwap = (): UseSwapResponse =>
  useMandatoryContext(SwapContext, "Swap");
