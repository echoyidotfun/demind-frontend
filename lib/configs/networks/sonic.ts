import { GqlChain } from "@/lib/services/api/generated/graphql";
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
    defaultSwapTokens: {
      tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    },
    popularTokens: {
      "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38": "wS",
      "0xe5da20f15420ad15de0fa650600afc998bbe3955": "stS",
      "0x29219dd400f2bf60e5a23d13be72b486d4038894": "USDC.e",
      "0xd3dce716f3ef535c5ff8d041c1a41c3bd89b97ae": "scUSD",
    },
  },
  contracts: {
    router: "0x50663d063b7c61c9917a87353a8584077fa89796",
    balancer: {
      vaultV2: "0xba12222222228d8ba445958a75a0704d566bf2c8",
    },
  },
};

export default networkConfig;
