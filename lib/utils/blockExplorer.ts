import { getNetworkConfig } from "@/lib/configs/app.config";
import { GlobalChain } from "../services/api/magpie/api.types";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";

const defaultChain = PROJECT_CONFIG.defaultNetwork;

export function getBlockExplorerName(chain?: GlobalChain) {
  const _chain = chain || defaultChain;
  return getNetworkConfig(_chain).blockExplorer.name;
}

export function getBlockExplorerTxUrl(txHash: string, chain: GlobalChain) {
  return `${getBlockExplorerUrl(chain)}/tx/${txHash}`;
}

export function getBlockExplorerAddressUrl(
  address: string,
  chain: GlobalChain
) {
  return `${getBlockExplorerUrl(chain)}/address/${address}`;
}

export function getBlockExplorerTokenUrl(
  tokenAddress: string,
  chain: GlobalChain
) {
  return `${getBlockExplorerUrl(chain)}/token/${tokenAddress}`;
}

export function getBlockExplorerBlockUrl(block: number, chain: GlobalChain) {
  return `${getBlockExplorerUrl(chain)}/block/${block}`;
}

function getBlockExplorerUrl(chain: GlobalChain) {
  return `${getNetworkConfig(chain).blockExplorer.baseUrl}`;
}
