"use client";

import { createContext, PropsWithChildren, useContext } from "react";

interface ThemeSettings {
  hideDarkModeToggle: boolean;
}

const defaultSettings: ThemeSettings = {
  hideDarkModeToggle: false,
};

const ThemeSettingsContext = createContext<ThemeSettings | null>(null);

export function useThemeSettings() {
  const settings = useContext(ThemeSettingsContext);
  return settings ?? defaultSettings;
}

export function ThemeSettingsProvider({
  children,
  settings,
}: PropsWithChildren<{ settings: ThemeSettings }>) {
  const mergeSettings = { ...defaultSettings, ...settings };
  return (
    <ThemeSettingsContext.Provider value={mergeSettings}>
      {children}
    </ThemeSettingsContext.Provider>
  );
}
