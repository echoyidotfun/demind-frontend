import { Chain as GqlChain } from "@/lib/configs/constants";
import base from "./base";
import sepolia from "./sepolia";
import mainnet from "./mainnet";
import sonic from "./sonic";

const networkConfigs = {
  [GqlChain.Base]: base,
  [GqlChain.Mainnet]: mainnet,
  [GqlChain.Sepolia]: sepolia,
  [GqlChain.Sonic]: sonic,
};

export default networkConfigs;
