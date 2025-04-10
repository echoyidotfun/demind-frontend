import { createPublicClient } from "viem";
import { GlobalChain } from "../api/magpie/api.types";
import { getNetworkConfig } from "@/lib/configs/app.config";
import { chains, chainsByKey } from "@/lib/modules/web3/ChainConfig";
import { Chain } from "viem";
import { getTransports } from "@/lib/modules/web3/transports";

function getViemChain(chainId: number): Chain {
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) throw new Error("Chain not supported");
  return chain;
}

export function getViemClient(chain: GlobalChain) {
  const { chainId } = getNetworkConfig(chain);

  return createPublicClient({
    chain: getViemChain(chainId),
    transport: getTransports(chainsByKey[chainId]),
  });
}
