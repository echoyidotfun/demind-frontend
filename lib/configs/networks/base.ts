import { NetworkConfig } from "../config.types";
import { GqlChain } from "@/lib/services/api/generated/graphql";

const networkConfig: NetworkConfig = {
  chainId: 8453,
  name: "Base Mainnet",
  shortName: "Base",
  chain: GqlChain.Base,
  iconPath: "/images/chains/BASE.svg",
  blockExplorer: {
    baseUrl: "https://basescan.org",
    name: "BaseScan",
  },
  tokens: {
    addresses: {
      wNative: "0x4200000000000000000000000000000000000006",
    },
    nativeAsset: {
      name: "Ether",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "ETH",
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    },
    popularTokens: {
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "ETH",
      "0x4200000000000000000000000000000000000006": "WETH",
      "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": "USDC",
      "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca": "USDbC",
      "0x50c5725949a6f0c72e6c4a641f24049a917db0cb": "DAI",
    },
  },
  contracts: {
    router: "0xba12222222228d8ba445958a75a0704d566bf2c8",
    balancer: {
      vaultV2: "0xba12222222228d8ba445958a75a0704d566bf2c8",
    },
  },
};

export default networkConfig;
