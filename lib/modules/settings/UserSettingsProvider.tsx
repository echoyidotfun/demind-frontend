"use client";

import { useMandatoryContext } from "@/lib/utils/contexts";
import { PropsWithChildren, createContext } from "react";
import { bn } from "@/lib//utils/numbers";
import { useLocalStorage } from "usehooks-ts";
import { LS_KEYS } from "@/lib/modules/local-storage/local-storage.constants";
import { useIsMounted } from "@/hooks/useIsMounted";

export type YesNo = "yes" | "no";

const DEFAULT_SLIPPAGE = "0.5"; // 0.5%
const DEFAULT_ENABLE_SIGNATURES: YesNo = "yes";
const DEFAULT_ACCEPTED_POLICIES: string[] = [];

export type UseUserSettingsResult = ReturnType<typeof _useUserSettings>;
export const UserSettingsContext = createContext<UseUserSettingsResult | null>(
  null
);

export function _useUserSettings({
  initSlippage,
  initEnableSignatures,
  initAcceptedPolicies,
}: {
  initSlippage: string;
  initEnableSignatures: YesNo;
  initAcceptedPolicies: string[];
}) {
  const isMounted = useIsMounted();

  const [_slippage, setSlippage] = useLocalStorage<string>(
    LS_KEYS.UserSettings.Slippage,
    initSlippage
  );

  const [_enableSignatures, setEnableSignatures] = useLocalStorage<YesNo>(
    LS_KEYS.UserSettings.EnableSignatures,
    initEnableSignatures
  );
  const enableSignatures = isMounted ? _enableSignatures : initEnableSignatures;
  const shouldUseSignatures = enableSignatures === "yes";

  const slippage = isMounted ? _slippage : initSlippage;
  const slippageDecimal = bn(slippage).div(100).toString();
  const slippageBps = bn(slippage).times(100).toString();

  const [_acceptedPolicies, setAcceptedPolicies] = useLocalStorage<string[]>(
    LS_KEYS.UserSettings.AcceptedPolicies,
    initAcceptedPolicies
  );
  const acceptedPolicies = isMounted ? _acceptedPolicies : initAcceptedPolicies;

  return {
    slippage,
    slippageDecimal,
    slippageBps,
    enableSignatures,
    shouldUseSignatures,
    acceptedPolicies,
    setSlippage,
    setEnableSignatures,
    setAcceptedPolicies,
  };
}

type ProviderProps = PropsWithChildren<{
  initCurrency?: string;
  initSlippage?: string;
  initPoolListView?: string;
  initEnableSignatures?: string;
  initAcceptedPolicies?: string[];
  initAllowSounds?: string;
}>;

export function UserSettingsProvider({
  initSlippage,
  initEnableSignatures,
  initAcceptedPolicies,
  children,
}: ProviderProps) {
  const _initSlippage = (initSlippage as string) || DEFAULT_SLIPPAGE;
  const _initEnableSignatures =
    (initEnableSignatures as YesNo) || DEFAULT_ENABLE_SIGNATURES;
  const _initAcceptedPolicies =
    initAcceptedPolicies || DEFAULT_ACCEPTED_POLICIES;

  const hook = _useUserSettings({
    initSlippage: _initSlippage,
    initEnableSignatures: _initEnableSignatures,
    initAcceptedPolicies: _initAcceptedPolicies,
  });
  return (
    <UserSettingsContext.Provider value={hook}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export const useUserSettings = (): UseUserSettingsResult =>
  useMandatoryContext(UserSettingsContext, "UserSettings");
