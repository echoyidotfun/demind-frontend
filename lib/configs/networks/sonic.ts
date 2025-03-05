import { Chain as GqlChain } from "@/lib/configs/constants";
import { NetworkConfig } from "../config.types";

const networkConfig: NetworkConfig = {
  chainId: 146,
  name: "Sonic",
  shortName: "Sonic",
  chain: GqlChain.Sonic,
  iconPath: "/images/chains/SONIC.svg",
  blockExplorer: {
    baseUrl: "https://sonicscan.org",
    name: "SonicScan",
  },
  tokens: {
    addresses: {
      wNative: "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38",
    },
    nativeAsset: {
      name: "Sonic",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "S",
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
