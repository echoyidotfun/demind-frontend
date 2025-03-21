import { getNetworkConfig } from "@/lib/configs/app.config";
import { GqlChain } from "../services/api/generated/graphql";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";

const defaultChain = PROJECT_CONFIG.defaultNetwork;

export function getBlockExplorerName(chain?: GqlChain) {
  const _chain = chain || defaultChain;
  return getNetworkConfig(_chain).blockExplorer.name;
}

export function getBlockExplorerTxUrl(txHash: string, chain: GqlChain) {
  return `${getBlockExplorerUrl(chain)}/tx/${txHash}`;
}

export function getBlockExplorerAddressUrl(address: string, chain: GqlChain) {
  return `${getBlockExplorerUrl(chain)}/address/${address}`;
}

export function getBlockExplorerTokenUrl(
  tokenAddress: string,
  chain: GqlChain
) {
  return `${getBlockExplorerUrl(chain)}/token/${tokenAddress}`;
}

export function getBlockExplorerBlockUrl(block: number, chain: GqlChain) {
  return `${getBlockExplorerUrl(chain)}/block/${block}`;
}

function getBlockExplorerUrl(chain: GqlChain) {
  return `${getNetworkConfig(chain).blockExplorer.baseUrl}`;
}
