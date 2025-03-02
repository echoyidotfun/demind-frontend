import { useIsMounted } from "@/hooks/useIsMounted";
import { Context, createContext, useContext, useEffect } from "react";
import { Address } from "viem";
import {
  useAccount,
  useAccountEffect,
  useConnect,
  useDisconnect,
  Connector,
} from "wagmi";

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

export function useMandatoryContext<T>(
  context: Context<T>,
  providedResourceName: string
) {
  const cxt = useContext(context);
  if (!cxt) {
    throw new Error(
      `use${providedResourceName} must be used within a ${providedResourceName}Provider context`
    );
  }
  return cxt;
}

export function useSafeAppConnectionGuard(
  newConnector?: Connector,
  chainId?: number
) {
  const { connect, connectors } = useConnect();
  useEffect(() => {
    const safeConnector = connectors.find((c) => c.id === "safe");
    if (
      isSafeApp() &&
      newConnector &&
      newConnector?.id !== "safe" &&
      safeConnector
    ) {
      connect({ chainId, connector: safeConnector });
    }
  }, [newConnector]);
}

/*
    There are some edge-cases where the `window.location.ancestorOrigins` is not available.
    We ignore the errors so the guard will not work in those edge-cases.
   */
function isSafeApp() {
  try {
    return window.location.ancestorOrigins[0] === "https://app.safe.global";
  } catch (e) {
    return false;
  }
}
