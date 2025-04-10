import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { keyBy } from "lodash";
import { Config, NetworkConfig, SupportedChainId } from "./config.types";
import networks from "./networks";

export const config: Config = {
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV as Config["appEnv"]) || "dev",
  apiUrl: process.env.NEXT_PUBLIC_BALANCER_API_URL || "",
  networks,
};

export const isDev = process.env.NEXT_PUBLIC_APP_ENV === "dev";
export const isProd = process.env.NEXT_PUBLIC_APP_ENV === "prod";
export const isStaging = process.env.NEXT_PUBLIC_APP_ENV === "staging";

const networksByChainId = keyBy(config.networks, "chainId");

/**
 * Fetches network config by chainId or network name type from API. If chain
 * param is not provided or incorrect, it will return the defaultNetwork config.
 */
export function getNetworkConfig(
  chain?: GlobalChain | number,
  defaultNetwork?: GlobalChain
): NetworkConfig {
  // cannot get default network directly from config here
  if (!chain) return config.networks[defaultNetwork || GlobalChain.Ethereum];

  if (typeof chain === "number") {
    return networksByChainId[chain] || config.networks.ETHEREUM;
  }

  return config.networks[chain];
}

export function getChainId(chain: GlobalChain): SupportedChainId {
  return getNetworkConfig(chain).chainId as SupportedChainId;
}

export function getGlobalChain(chainId: SupportedChainId): GlobalChain {
  return getNetworkConfig(chainId).chain;
}

export function getNativeAsset(chainId: GlobalChain | SupportedChainId) {
  return getNetworkConfig(chainId).tokens.nativeAsset;
}

export function getNativeAssetAddress(chainId: GlobalChain | SupportedChainId) {
  return getNetworkConfig(chainId).tokens.nativeAsset.address;
}

export function getWrappedNativeAssetAddress(
  chainId: GlobalChain | SupportedChainId
) {
  return getNetworkConfig(chainId).tokens.addresses.wNative;
}

export function getChainName(chainId: GlobalChain | SupportedChainId) {
  return getNetworkConfig(chainId).name;
}

export function getChainShortName(chainId: GlobalChain | SupportedChainId) {
  return getNetworkConfig(chainId).shortName;
}
