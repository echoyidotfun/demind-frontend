import { GqlChain } from "@/lib/services/api/generated/graphql";
import base from "./base";
import sepolia from "./sepolia";
import mainnet from "./mainnet";
import sonic from "./sonic";
import arbitrum from "./arbitrum";

const networkConfigs = {
  [GqlChain.Base]: base,
  [GqlChain.Mainnet]: mainnet,
  [GqlChain.Sepolia]: sepolia,
  [GqlChain.Sonic]: sonic,
  [GqlChain.Arbitrum]: arbitrum,
};

export default networkConfigs;
