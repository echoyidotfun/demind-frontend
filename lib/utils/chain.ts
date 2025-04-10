import { getChainId } from "@/lib/configs/app.config";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";

export function isMainnet(chain: GlobalChain | number): boolean {
  return (
    chain === GlobalChain.Ethereum || chain === getChainId(GlobalChain.Ethereum)
  );
}

export function isNotMainnet(chain: GlobalChain | number): boolean {
  return !isMainnet(chain);
}
