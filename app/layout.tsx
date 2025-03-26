import { Metadata } from "next";
import { Providers } from "@/components/providers/providers";
import { poppinsFont } from "@/lib/assets/fonts/poppins/poppins";
import "@/styles/globals.css";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider } from "@/lib/services/chakra/ThemeProvider";
import { ThemeSettingsProvider } from "@/lib/services/themes/useThemeSettings";
import { DEFAULT_THEME_COLOR_MODE } from "@/lib/services/chakra/themes/base/foundations";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "DeMind",
  description: "AI driven onchain trading",
  icons: [{ rel: "icon", type: "image/png", url: "/favicon.png" }],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={poppinsFont.className}
        style={{ marginRight: "0px !important" }}
        suppressHydrationWarning
      >
        <NextThemeProvider defaultTheme={DEFAULT_THEME_COLOR_MODE}>
          <ThemeProvider>
            <ThemeSettingsProvider settings={{ hideDarkModeToggle: true }}>
              <Providers>{children}</Providers>
            </ThemeSettingsProvider>
          </ThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
