import { Metadata } from "next";
import { Inter } from "next/font/google"; // fonts
import { Providers } from "@/components/providers/providers";
import "@/styles/globals.css";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider } from "@/lib/services/chakra/ThemeProvider";
import { ThemeSettingsProvider } from "@/lib/services/themes/useThemeSettings";
import { DEFAULT_THEME_COLOR_MODE } from "@/lib/services/chakra/themes/base/foundations";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "ReMind Exchange",
  description: "swap tokens driven by aggragation router",
  icons: [{ rel: "icon", type: "image/x-icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NextThemeProvider defaultTheme={DEFAULT_THEME_COLOR_MODE}>
          <ThemeProvider>
            <ThemeSettingsProvider settings={{ hideDarkModeToggle: false }}>
              <Providers>{children}</Providers>
            </ThemeSettingsProvider>
          </ThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
