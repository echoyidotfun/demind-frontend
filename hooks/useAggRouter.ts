import { useContractAddress } from "@/lib/modules/web3/useContractAddress";

export type VaultVersion = 2 | 3;

export function useAggRouter(version: VaultVersion | number) {
  const routerAddress = useContractAddress("router");

  return {
    routerAddress,
  };
}
