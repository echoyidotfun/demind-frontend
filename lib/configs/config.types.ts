import { Address } from "viem";
import { GqlChain } from "@/lib/services/api/generated/graphql";
import { chains } from "@/lib/modules/web3/ChainConfig";
import { ReactNode } from "react";
import { IconType } from "@/components/common/icons/SocialIcon";

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
  popularTokens?: Record<Address, string>;
  defaultSwapTokens?: {
    tokenIn?: Address;
    tokenOut?: Address;
  };
  supportedWrappers?: {
    baseToken: Address;
    wrappedToken: Address;
  }[];
  doubleApprovalRequired?: string[];
}

export interface ContractsConfig {
  router: Address;
  balancer: {
    vaultV2: Address;
  };
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
  apiUrl: string;
  networks: {
    [key in GqlChain]: NetworkConfig;
  };
}

export type AppLink = {
  href: string;
  label?: string;
  icon?: ReactNode;
  iconType?: IconType;
  isExternal?: boolean;
};

type Links = {
  appLinks: AppLink[];
  socialLinks: AppLink[];
};

export interface ProjectConfig {
  projectId: string;
  projectUrl: string;
  projectName: string;
  projectLogo: string;
  supportedNetworks: GqlChain[];
  defaultNetwork: GqlChain;
  delegateOwner: Address;
  links: Links;
}
