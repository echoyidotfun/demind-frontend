"use client";

import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { PriceImpactProvider } from "@/lib/modules/price-impact/PriceImpactProvider";
import {
  SwapProvider,
  SwapProviderProps,
} from "@/lib/modules/swap/SwapProvider";
import { TokenBalancesProvider } from "@/lib/modules/tokens/TokenBalancesProvider";
import { TokenInputsValidationProvider } from "@/lib/modules/tokens/TokenInputsValidationProvider";
import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { TransactionStateProvider } from "@/lib/modules/transactions/TransactionStateProvider";
import { ChainSlug, getChainSlug } from "@/lib/utils/urls";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  props: SwapProviderProps;
}>;

export default function SwapLayout({ props, children }: Props) {
  const { getTokensByChain } = useTokens();

  const chain = props.pathParams.chain;
  const initChain = chain
    ? getChainSlug(chain as ChainSlug)
    : PROJECT_CONFIG.defaultNetwork;
  const initTokens = getTokensByChain(initChain);
  if (!initTokens) {
    return null;
  }

  return (
    <TransactionStateProvider>
      <TokenBalancesProvider initTokens={initTokens}>
        <TokenInputsValidationProvider>
          <PriceImpactProvider>
            <SwapProvider params={props}>{children}</SwapProvider>
          </PriceImpactProvider>
        </TokenInputsValidationProvider>
      </TokenBalancesProvider>
    </TransactionStateProvider>
  );
}
