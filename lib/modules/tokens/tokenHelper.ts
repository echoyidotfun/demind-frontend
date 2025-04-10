import {
  getNativeAssetAddress,
  getNetworkConfig,
  getWrappedNativeAssetAddress,
} from "@/lib/configs/app.config";
import { SupportedChainId } from "@/lib/configs/config.types";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { includesAddress, isSameAddress } from "@/lib/utils/addresses";
import { Address } from "viem";
import { HumanTokenAmountWithAddress, TokenBase } from "./token.types";
import { InputAmount } from "@balancer/sdk";

export function isNativeAsset(
  token: TokenBase | string,
  chain: GlobalChain | SupportedChainId
) {
  return nativeAssetFilter(chain)(token);
}

export function isWrappedNativeAsset(
  token: TokenBase | string,
  chain: GlobalChain | SupportedChainId
) {
  return wrappedNativeAssetFilter(chain)(token);
}

export function isNativeOrWrappedNative(
  token: TokenBase | string,
  chain: GlobalChain | SupportedChainId
) {
  return isWrappedNativeAsset(token, chain) || isNativeAsset(token, chain);
}

export function nativeAssetFilter(chain: GlobalChain | SupportedChainId) {
  return (token: TokenBase | string) => {
    const nativeAssetAddress = getNativeAssetAddress(chain);
    if (typeof token === "string") {
      return isSameAddress(token, nativeAssetAddress);
    }
    return isSameAddress(token.address, nativeAssetAddress);
  };
}

export function wrappedNativeAssetFilter(
  chain: GlobalChain | SupportedChainId
) {
  return (token: TokenBase | string) => {
    const wNativeAssetAddress = getWrappedNativeAssetAddress(chain);
    if (typeof token === "string") {
      return isSameAddress(token, wNativeAssetAddress);
    }
    return isSameAddress(token.address, wNativeAssetAddress);
  };
}

export function exclNativeAssetFilter(chain: GlobalChain | SupportedChainId) {
  return (token: TokenBase | string) => {
    const nativeAssetAddress = getNativeAssetAddress(chain);
    if (typeof token === "string") {
      return !isSameAddress(token, nativeAssetAddress);
    }
    return !isSameAddress(token.address, nativeAssetAddress);
  };
}

export function exclWrappedNativeAssetFilter(
  chain: GlobalChain | SupportedChainId
) {
  return (token: TokenBase | string) => {
    const wNativeAssetAddress = getWrappedNativeAssetAddress(chain);
    if (typeof token === "string") {
      return !isSameAddress(token, wNativeAssetAddress);
    }
    return !isSameAddress(token.address, wNativeAssetAddress);
  };
}

/*
    If the given array contains the native asset, it is replaced with the wrapped native asset
  */
export function swapNativeWithWrapped(
  inputAmounts: InputAmount[],
  chain: GlobalChain
) {
  return inputAmounts.map((inputAmount) => {
    if (isNativeAsset(inputAmount.address, chain)) {
      return {
        ...inputAmount,
        address: getWrappedNativeAssetAddress(chain),
      };
    }
    return inputAmount;
  });
}

/*
    If the given array contains the wrapped native asset, it is replaced with the native asset
  */
export function swapWrappedWithNative(
  inputAmounts: HumanTokenAmountWithAddress[],
  chain: GlobalChain
) {
  return inputAmounts.map((inputAmount) => {
    if (isWrappedNativeAsset(inputAmount.tokenAddress, chain)) {
      return {
        ...inputAmount,
        tokenAddress: getNativeAssetAddress(chain),
      } as HumanTokenAmountWithAddress;
    }
    return inputAmount;
  });
}

export function requiresDoubleApproval(
  chainId: GlobalChain | SupportedChainId,
  tokenAddress: Address
) {
  return includesAddress(
    getNetworkConfig(chainId).tokens.doubleApprovalRequired || [],
    tokenAddress
  );
}
