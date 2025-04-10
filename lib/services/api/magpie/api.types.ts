export type MagpieApiToken = {
  id: string;
  name: string;
  symbol: string;
  contractName: string;
  contractSymbol: string;
  permit: string;
  address: string;
  decimals: number;
  displayDecimals: number;
  isReliable: boolean;
  logoUrl: string | null;
  usdPrice: string;
  highestPriority: number;
  network: MagpieApiNetwork;
};

type MagpieApiNetwork = {
  id: number;
  name: string;
  chainId: number;
  logoUrl: string;
};

export type TokenPrice = { price: number; address: string; chain: GlobalChain };

export type MagpieTokenApiVariables = {
  networkNames: string[];
  searchValue: string;
  exact?: boolean;
  offset?: number;
};

export enum GlobalChain {
  Ethereum = "ETHEREUM",
  Base = "BASE",
  Arbitrum = "ARBITRUM",
  Sonic = "SONIC",
}

export const GlobalChainToMagpieNetworkMap: Record<GlobalChain, string> = {
  [GlobalChain.Ethereum]: "ethereum",
  [GlobalChain.Base]: "base",
  [GlobalChain.Arbitrum]: "arbitrum",
  [GlobalChain.Sonic]: "sonic",
};

export const MagpieNetworkToGlobalChainMap: Record<string, GlobalChain> = {
  ethereum: GlobalChain.Ethereum,
  base: GlobalChain.Base,
  arbitrum: GlobalChain.Arbitrum,
  sonic: GlobalChain.Sonic,
};
