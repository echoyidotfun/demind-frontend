"use client";

import { Chain } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, sonic } from "wagmi/chains";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { keyBy } from "lodash";
import { getBaseUrl } from "@/lib/utils/urls";

export const rpcFallbacks: Record<GlobalChain, string> = {
  [GlobalChain.Ethereum]: "https://eth.llamarpc.com",
  [GlobalChain.Base]: "https://base.llamarpc.com",
  [GlobalChain.Sonic]: "https://rpc.soniclabs.com",
  [GlobalChain.Arbitrum]: "https://arbitrum.llamarpc.com",
};

const baseUrl = getBaseUrl();
const getPrivateRpcUrl = (chain: GlobalChain) => `${baseUrl}/api/rpc/${chain}`;

export const rpcOverrides: Record<GlobalChain, string | undefined> = {
  [GlobalChain.Ethereum]: getPrivateRpcUrl(GlobalChain.Ethereum),
  [GlobalChain.Base]: getPrivateRpcUrl(GlobalChain.Base),
  [GlobalChain.Sonic]: getPrivateRpcUrl(GlobalChain.Sonic),
  [GlobalChain.Arbitrum]: getPrivateRpcUrl(GlobalChain.Arbitrum),
};

const apiChainToWagmiChainMap = {
  [GlobalChain.Ethereum]: {
    iconUrl: "/images/chains/MAINNET.svg",
    ...mainnet,
  },
  [GlobalChain.Base]: { iconUrl: "/images/chains/BASE.svg", ...base },
  [GlobalChain.Sonic]: { iconUrl: "/images/chains/SONIC.svg", ...sonic },
  [GlobalChain.Arbitrum]: {
    iconUrl: "/images/chains/ARBITRUM.svg",
    ...arbitrum,
  },
} as const satisfies Record<GlobalChain, Chain>;

export const supportedNetworks = PROJECT_CONFIG.supportedNetworks;
const chainToFilter = PROJECT_CONFIG.defaultNetwork;
const customChain = apiChainToWagmiChainMap[chainToFilter];

export const chains: readonly [Chain, ...Chain[]] = [
  customChain,
  ...supportedNetworks
    .filter((network) => network !== chainToFilter)
    .map((network) => apiChainToWagmiChainMap[network]),
];

export const chainsByKey = keyBy(chains, (chain) => chain.id);
export function getDefaultRpcUrl(chainId: number) {
  return chainsByKey[chainId].rpcUrls.default.http[0];
}
