"use client";

import { Chain } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";
import { getGlobalChain } from "@/lib/configs/app.config";
import { SupportedChainId } from "@/lib/configs/config.types";
import {
  chains,
  getDefaultRpcUrl,
  rpcFallbacks,
  rpcOverrides,
} from "./ChainConfig";

export function getTransports(chain: Chain) {
  const apiChain = getGlobalChain(chain.id as SupportedChainId);
  const overrideRpcUrl = rpcOverrides[apiChain];
  const fallbackRpcUrl = rpcFallbacks[apiChain];
  if (overrideRpcUrl)
    return fallback([http(overrideRpcUrl), http(fallbackRpcUrl), http()]);
  return fallback([http(), http(fallbackRpcUrl)]);
}

export const transports = Object.fromEntries(
  chains.map((chain) => [chain.id, getTransports(chain)])
) as Record<number, ReturnType<typeof getTransports>>;

export function getRpcUrl(chainId: number): string {
  const apiChain = getGlobalChain(chainId);
  return (
    rpcOverrides[apiChain] ||
    rpcFallbacks[apiChain] ||
    getDefaultRpcUrl(chainId)
  );
}
