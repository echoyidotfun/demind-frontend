import { useEffect, useContext, Context } from "react";
import { useConnect, Connector } from "wagmi";

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
