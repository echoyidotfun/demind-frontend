import { useTokens } from "@/lib/modules/tokens/TokensProvider";
import { isSameAddress } from "@/lib/utils/addresses";
import { safeSum } from "@/lib/utils/numbers";
import { useCallback } from "react";
import { HumanTokenAmount } from "./token.types";
import { GlobalToken } from "./token.types";

export function useTotalUsdValue(tokens: GlobalToken[]) {
  const { usdValueForToken } = useTokens();
  const calculateUsdAmountsIn = useCallback(
    (humanAmountsIn: HumanTokenAmount[]) =>
      humanAmountsIn.map((amountIn) => {
        const token = tokens.find((token) =>
          isSameAddress(token?.address, amountIn.tokenAddress)
        );

        if (!token) return "0";

        return usdValueForToken(token, amountIn.humanAmount);
      }),
    [usdValueForToken, tokens]
  );

  function usdValueFor(humanAmountsIn: HumanTokenAmount[]) {
    return safeSum(calculateUsdAmountsIn(humanAmountsIn));
  }

  return { usdValueFor };
}
