"use client";

import { Chain } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, sepolia, sonic } from "wagmi/chains";
import { GqlChain } from "@/lib/services/api/generated/graphql";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { keyBy } from "lodash";
import { getBaseUrl } from "@/lib/utils/urls";

export const rpcFallbacks: Record<GqlChain, string> = {
  [GqlChain.Mainnet]: "https://eth.llamarpc.com",
  [GqlChain.Base]: "https://base.llamarpc.com",
  [GqlChain.Sepolia]: "https://sepolia.gateway.tenderly.co",
  [GqlChain.Sonic]: "https://rpc.soniclabs.com",
  [GqlChain.Arbitrum]: "https://arbitrum.llamarpc.com",
};

const baseUrl = getBaseUrl();
const getPrivateRpcUrl = (chain: GqlChain) => `${baseUrl}/api/rpc/${chain}`;

export const rpcOverrides: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: getPrivateRpcUrl(GqlChain.Mainnet),
  [GqlChain.Base]: getPrivateRpcUrl(GqlChain.Base),
  [GqlChain.Sepolia]: getPrivateRpcUrl(GqlChain.Sepolia),
  [GqlChain.Sonic]: getPrivateRpcUrl(GqlChain.Sonic),
  [GqlChain.Arbitrum]: getPrivateRpcUrl(GqlChain.Arbitrum),
};

const gqlChainToWagmiChainMap = {
  [GqlChain.Mainnet]: { iconUrl: "/images/chains/MAINNET.svg", ...mainnet },
  [GqlChain.Base]: { iconUrl: "/images/chains/BASE.svg", ...base },
  [GqlChain.Sepolia]: { iconUrl: "/images/chains/SEPOLIA.svg", ...sepolia },
  [GqlChain.Sonic]: { iconUrl: "/images/chains/SONIC.svg", ...sonic },
  [GqlChain.Arbitrum]: { iconUrl: "/images/chains/ARBITRUM.svg", ...arbitrum },
} as const satisfies Record<GqlChain, Chain>;

export const supportedNetworks = PROJECT_CONFIG.supportedNetworks;
const chainToFilter = PROJECT_CONFIG.defaultNetwork;
const customChain = gqlChainToWagmiChainMap[chainToFilter];

export const chains: readonly [Chain, ...Chain[]] = [
  customChain,
  ...supportedNetworks
    .filter((network) => network !== chainToFilter)
    .map((network) => gqlChainToWagmiChainMap[network]),
];

export const chainsByKey = keyBy(chains, (chain) => chain.id);
export function getDefaultRpcUrl(chainId: number) {
  return chainsByKey[chainId].rpcUrls.default.http[0];
}
