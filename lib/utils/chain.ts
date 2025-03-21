import { getChainId } from "@/lib/configs/app.config";
import { GqlChain } from "@/lib/services/api/generated/graphql";

export function isMainnet(chain: GqlChain | number): boolean {
  return chain === GqlChain.Mainnet || chain === getChainId(GqlChain.Mainnet);
}

export function isNotMainnet(chain: GqlChain | number): boolean {
  return !isMainnet(chain);
}
