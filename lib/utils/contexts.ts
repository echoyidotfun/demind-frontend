import { Context, useContext } from "react";

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
