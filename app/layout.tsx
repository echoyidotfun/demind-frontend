import { Metadata } from "next";
// import { Inter } from "next/font/google"; // fonts
import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { DEFAULT_THEME } from "@/lib/services/themes/config";
import { ChakraProvider } from "@chakra-ui/react";
// const inter = Inter({ subsets: ["latin"] });

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
    <html
      lang="en"
      // className={inter.className}
    >
      <body>
        <NextThemeProvider defaultTheme={DEFAULT_THEME}>
          {/* <ChakraProvider > */}
          <Providers>{children}</Providers>
          {/* </ChakraProvider> */}
        </NextThemeProvider>
      </body>
    </html>
  );
}
