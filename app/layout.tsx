import { Metadata } from "next";
import { Inter } from "next/font/google"; // fonts
import { Providers } from "@/components/providers/providers";
import "@/styles/globals.css";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider } from "@/lib/services/chakra/ThemeProvider";
import { ThemeSettingsProvider } from "@/lib/services/themes/useThemeSettings";
import { DEFAULT_THEME_COLOR_MODE } from "@/lib/services/chakra/themes/base/foundations";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "DeMind",
  description: "AI driven onchain trading",
  icons: [{ rel: "icon", type: "image/x-icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ marginRight: "0px !important" }} suppressHydrationWarning>
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
