import { Address } from "viem";
import { Chain } from "./constants";
export interface TokenConfig {
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
}

export type AppLink = {
  href: string;
  label?: string;
  iconType?: string;
  isExternal?: boolean;
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
  supportedNetworks: Chain[];
  defaultNetwork: Chain;
  delegateOwner: Address;
  links: Links;
}
