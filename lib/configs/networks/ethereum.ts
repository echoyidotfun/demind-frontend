import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { NetworkConfig } from "../config.types";

const networkConfig: NetworkConfig = {
  chainId: 1,
  name: "Ethereum Mainnet",
  shortName: "Ethereum",
  chain: GlobalChain.Ethereum,
  iconPath: "/images/chains/ETHEREUM.svg",
  blockExplorer: {
    baseUrl: "https://etherscan.io",
    name: "Etherscan",
  },
  tokens: {
    addresses: {
      wNative: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
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
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": "WETH",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "USDC",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT",
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": "WBTC",
      "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee": "weETH",
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
