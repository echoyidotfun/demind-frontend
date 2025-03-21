import { GqlChain } from "@/lib/services/api/generated/graphql";
import { Address } from "viem";
import { isNativeAsset, isWrappedNativeAsset } from "../tokens/tokenHelper";
import { getNetworkConfig } from "@/lib/configs/app.config";
import { isSameAddress, sameAddresses } from "@/lib/utils/addresses";
import { SwapHandler } from "./handlers/Swap.handler";
import { OWrapType, SupportedWrapHandler, WrapType } from "./swap.types";

export function isNativeWrap(
  tokenIn: Address,
  tokenOut: Address,
  chain: GqlChain
) {
  const tokenInIsNative =
    isNativeAsset(tokenIn, chain) || isWrappedNativeAsset(tokenIn, chain);
  const tokenOutIsNative =
    isNativeAsset(tokenOut, chain) || isWrappedNativeAsset(tokenOut, chain);

  return tokenInIsNative && tokenOutIsNative;
}

export function isSupportedWrap(
  tokenIn: Address,
  tokenOut: Address,
  chain: GqlChain
) {
  const networkConfig = getNetworkConfig(chain);
  const supportedWrappers = networkConfig.tokens.supportedWrappers || [];
  return supportedWrappers.some((wrapper) =>
    sameAddresses(
      [wrapper.baseToken, wrapper.wrappedToken],
      [tokenIn, tokenOut]
    )
  );
}

export function isWrapOrUnwrap(
  tokenIn: Address,
  tokenOut: Address,
  chain: GqlChain
) {
  return (
    isNativeWrap(tokenIn, tokenOut, chain) ||
    isSupportedWrap(tokenIn, tokenOut, chain)
  );
}

export function getWrapType(
  tokenIn: Address,
  tokenOut: Address,
  chain: GqlChain
): WrapType | null {
  if (isNativeAsset(tokenIn, chain) && isWrappedNativeAsset(tokenOut, chain)) {
    return OWrapType.WRAP;
  } else if (
    isWrappedNativeAsset(tokenIn, chain) &&
    isNativeAsset(tokenOut, chain)
  ) {
    return OWrapType.UNWRAP;
  }

  return null;
}

export function getWrapperForBaseToken(baseToken: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain);
  const supportedWrappers = networkConfig.tokens.supportedWrappers || [];
  return supportedWrappers.find((wrapper) =>
    isSameAddress(wrapper.baseToken, baseToken)
  );
}
