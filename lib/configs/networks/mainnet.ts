import { Chain as GqlChain } from "@/lib/configs/constants";
import { NetworkConfig } from "../config.types";

const networkConfig: NetworkConfig = {
  chainId: 1,
  name: "Ethereum Mainnet",
  shortName: "Ethereum",
  chain: GqlChain.Mainnet,
  iconPath: "/images/chains/MAINNET.svg",
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
    // supportedWrappers: [
    //   {
    //     // stETH/wstETH
    //     baseToken: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    //     wrappedToken: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    //     swapHandler: SupportedWrapHandler.LIDO,
    //   },
    // ],
    defaultSwapTokens: {
      tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    },
  },
  contracts: {
    router: "0xa",
  },
};

export default networkConfig;
