"use client";

import { useIsMounted } from "@/hooks/useIsMounted";
import { createContext } from "react";
import { Address } from "viem";
import { useAccount, useAccountEffect, useDisconnect } from "wagmi";
import {
  useMandatoryContext,
  useSafeAppConnectionGuard,
} from "@/lib/utils/contexts";

export const emptyAddress = "" as Address;

export function _useUserAccount() {
  const isMounted = useIsMounted();
  const query = useAccount();
  const { disconnect } = useDisconnect();
  const { address, ...queryWithoutAddress } = query;

  const result = {
    ...queryWithoutAddress,
    isLoading: !isMounted || query.isConnecting,
    isConnecting: !isMounted || query.isConnecting,
    isConnected: isMounted && !!query.address,
    userAddress: isMounted ? query.address || emptyAddress : emptyAddress,
    connector: isMounted ? query.connector : undefined,
    isWCConnector: isMounted ? query.connector?.id === "walletConnect" : false,
  };

  useSafeAppConnectionGuard(result.connector, result.chainId);

  useAccountEffect({
    onDisconnect: () => {
      // When disconnecting from WC connector we need a full page reload to enforce a new WC connector instance created
      console.log("Full page reload on WC disconnection");
      window.location.reload();
    },
  });

  return result;
}

export type UseUserAccountResponse = ReturnType<typeof _useUserAccount>;
export const UserAccountContext = createContext<UseUserAccountResponse | null>(
  null
);

export function UserAccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hook = _useUserAccount();

  return (
    <UserAccountContext.Provider value={hook}>
      {children}
    </UserAccountContext.Provider>
  );
}

export const useUserAccount = (): UseUserAccountResponse =>
  useMandatoryContext(UserAccountContext, "UserAccount");
