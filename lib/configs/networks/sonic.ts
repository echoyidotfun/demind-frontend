import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { NetworkConfig } from "../config.types";

const networkConfig: NetworkConfig = {
  chainId: 146,
  name: "Sonic",
  shortName: "SONIC",
  chain: GlobalChain.Sonic,
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
      address: "0x0000000000000000000000000000000000000000",
      symbol: "S",
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: "0x0000000000000000000000000000000000000000",
    },
    popularTokens: {
      "0x0000000000000000000000000000000000000000": "S",
      "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38": "wS",
      "0xe5da20f15420ad15de0fa650600afc998bbe3955": "stS",
      "0x29219dd400f2bf60e5a23d13be72b486d4038894": "USDC.e",
      "0xd3dce716f3ef535c5ff8d041c1a41c3bd89b97ae": "scUSD",
    },
  },
  contracts: {
    router: "0x045de71e35D0909ab518F9d262008493524ec620",
    naviXRouter: "0x097DF2e7a99633EFEa9560E1B6873AE9DB6669EB",
    balancer: {
      vaultV2: "0xba12222222228d8ba445958a75a0704d566bf2c8",
    },
  },
};

export default networkConfig;
