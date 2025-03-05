import { Chain as GqlChain } from "@/lib/configs/constants";
import { NetworkConfig } from "../config.types";

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
