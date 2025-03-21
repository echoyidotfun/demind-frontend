import { zipObject } from "lodash";
import { Address, ReadContractParameters, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";
import { Erc20Abi } from "./contracts/contract.types";
import { SupportedChainId } from "@/lib/configs/config.types";
import { useCallback, useMemo } from "react";
import { onlyExplicitRefetch } from "@/lib/utils/queries";

export type TokenAllowances = Record<Address, bigint>;

export type UseTokenAllowancesResponse = ReturnType<typeof useTokenAllowances>;

type Props = {
  chainId: SupportedChainId;
  userAddress: Address;
  spenderAddress: Address;
  tokenAddresses: Address[];
  enabled?: boolean;
};

type AllowanceContracts = ReadContractParameters<Erc20Abi, "allowance"> & {
  chainId: number;
};

export function useTokenAllowances({
  chainId,
  userAddress,
  spenderAddress,
  tokenAddresses,
  enabled = true,
}: Props) {
  const contracts = tokenAddresses.map(
    (tokenAddress) =>
      ({
        chainId,
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [userAddress, spenderAddress],
      } satisfies AllowanceContracts)
  );

  const { data, isLoading, isRefetching, refetch } = useReadContracts({
    contracts,
    allowFailure: false,
    query: {
      enabled:
        enabled &&
        !!spenderAddress &&
        !!userAddress &&
        tokenAddresses.length > 0,
      ...onlyExplicitRefetch,
    },
  });

  const allowancesByTokenAddress = useMemo(
    () => (data ? zipObject(tokenAddresses, data) : {}),
    [data, tokenAddresses]
  );

  const allowanceFor = useCallback(
    (tokenAddress: Address): bigint => {
      // We don't need isSameAddress cause we use the same tokensAddresses source
      return allowancesByTokenAddress[tokenAddress] ?? 0n;
    },
    [allowancesByTokenAddress]
  );

  return {
    isAllowancesLoading: isLoading,
    isAllowancesRefetching: isRefetching,
    allowances: allowancesByTokenAddress,
    spenderAddress,
    refetchAllowances: refetch,
    allowanceFor,
  };
}
