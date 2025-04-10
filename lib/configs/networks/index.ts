import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import base from "./base";
import sonic from "./sonic";
import arbitrum from "./arbitrum";
import ethereum from "./ethereum";

const networkConfigs = {
  [GlobalChain.Base]: base,
  [GlobalChain.Ethereum]: ethereum,
  [GlobalChain.Sonic]: sonic,
  [GlobalChain.Arbitrum]: arbitrum,
};

export default networkConfigs;
