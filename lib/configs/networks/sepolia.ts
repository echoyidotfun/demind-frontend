import { GqlChain } from "@/lib/services/api/generated/graphql";
import { NetworkConfig } from "../config.types";

const networkConfig: NetworkConfig = {
  chainId: 11155111,
  name: "Ethereum Testnet Sepolia",
  shortName: "Sepolia",
  chain: GqlChain.Sepolia,
  iconPath: "/images/chains/MAINNET.svg",
  blockExplorer: {
    baseUrl: "https://sepolia.etherscan.io",
    name: "Etherscan",
  },
  tokens: {
    addresses: {
      wNative: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
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
  },
  contracts: {
    router: "0xba12222222228d8ba445958a75a0704d566bf2c8",
    balancer: {
      vaultV2: "0xba12222222228d8ba445958a75a0704d566bf2c8",
    },
  },
};

export default networkConfig;
