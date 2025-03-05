"use client";

import { createContext, useContext } from "react";

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
