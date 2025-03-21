import { invert } from "lodash";
import { GqlChain } from "../services/api/generated/graphql";

export function getBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:3000";
  }

  if (window.location.origin) {
    return window.location.origin;
  }

  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? ":" + port : ""}`;
}

export function isValidUrl(maybeUrl?: string): string | true {
  if (!maybeUrl) return true;

  let url;

  try {
    url = new URL(maybeUrl);
  } catch (_) {
    return "Invalid URL";
  }

  return url.protocol === "http:" || url.protocol === "https:"
    ? true
    : "Invalid URL";
}

// URL slug for each chain
export enum ChainSlug {
  Ethereum = "eth",
  Base = "base",
  Sepolia = "sepolia",
  Sonic = "sonic",
  Arbitrum = "arb",
}

// Maps GraphQL chain enum to URL slug
export const chainToSlugMap: Record<GqlChain, ChainSlug> = {
  [GqlChain.Mainnet]: ChainSlug.Ethereum,
  [GqlChain.Base]: ChainSlug.Base,
  [GqlChain.Sepolia]: ChainSlug.Sepolia,
  [GqlChain.Sonic]: ChainSlug.Sonic,
  [GqlChain.Arbitrum]: ChainSlug.Arbitrum,
};

export function getChainSlug(chainSlug: ChainSlug): GqlChain {
  const slugToChainMap = invert(chainToSlugMap) as Record<ChainSlug, GqlChain>;
  const chain = slugToChainMap[chainSlug];
  if (!chain) throw new Error(`Chain ${chainSlug} is not a valid chainName`);
  return chain;
}
