import { GqlChain } from "@/lib/services/api/generated/graphql";
import { NetworkConfig } from "../config.types";

const networkConfig: NetworkConfig = {
  chainId: 42161,
  name: "Arbitrum One",
  shortName: "Arbitrum",
  chain: GqlChain.Arbitrum,
  iconPath: "/images/chains/ARBITRUM.svg",
  blockExplorer: {
    baseUrl: "https://arbiscan.io",
    name: "Arbiscan",
  },
  tokens: {
    addresses: {
      wNative: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
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
      "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "WETH",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "USDC",
      "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8": "PENDLE",
      "0x5979D7b546E38E414F7E9822514be443A4800529": "wstETH",
      "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe": "weETH",
    },
  },
  contracts: {
    router: "0xb32C79a25291265eF240Eb32E9faBbc6DcEE3cE3",
    balancer: {
      vaultV2: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    },
  },
};

export default networkConfig;
