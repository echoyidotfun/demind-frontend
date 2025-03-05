import { Address, Chain } from "viem";
import { Chain as GqlChain } from "./constants";
import { chains } from "@/lib/modules/web3/ChainConfig";

export interface TokensConfig {
  addresses: {
    wNative: Address;
  };
  nativeAsset: {
    name: string;
    symbol: string;
    address: Address;
    decimals: number;
  };
  trustedTokens?: Record<Address, string>;
  defaultSwapTokens?: {
    tokenIn?: Address;
    tokenOut?: Address;
  };
}

export interface ContractsConfig {
  router: Address;
}

export interface BlockExplorerConfig {
  baseUrl: string;
  name: string;
}

export type SupportedChainId = (typeof chains)[number]["id"];

export interface NetworkConfig {
  chainId: SupportedChainId;
  name: string;
  shortName: string;
  chain: GqlChain;
  iconPath: string;
  rpcUrl?: string;
  blockExplorer: BlockExplorerConfig;
  tokens: TokensConfig;
  contracts: ContractsConfig;
  minConfirmations?: number;
}

export interface Config {
  appEnv: "dev" | "prod" | "staging";
  networks: {
    [key in GqlChain]: NetworkConfig;
  };
}

export type AppLink = {
  href: string;
  label?: string;
  iconType?: string;
  isExternal?: boolean;
};

type Options = {
  allowCreateWallet: boolean;
  isOnSafeAppList: boolean;
};

type Links = {
  appLinks: AppLink[];
  socialLinks: AppLink[];
};

export interface ProjectConfig {
  projectId: "demind";
  projectUrl: string;
  projectName: string;
  projectLogo: string;
  supportedNetworks: GqlChain[];
  defaultNetwork: GqlChain;
  delegateOwner: Address;
  options: Options;
  links: Links;
}
