"use client";

import { WagmiProvider } from "wagmi";
import { UserAccountProvider } from "./UserAccountProvider";
import { useWagmiConfig } from "./WagmiConfigProvider";
import { PropsWithChildren } from "react";
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useTheme } from "@chakra-ui/react";
import { merge } from "lodash";
import { UserSettingsProvider } from "../settings/UserSettingsProvider";
import { ReactQueryClientProvider } from "./react-query.provider";

export function Web3Provider({ children }: PropsWithChildren) {
  const isMounted = useIsMounted();
  const { colors, radii, shadows, semanticTokens, fonts } = useTheme();
  const { wagmiConfig } = useWagmiConfig();

  const colorModeKey = "_dark";

  if (!isMounted) {
    return null;
  }

  const sharedConfig = {
    fonts: {
      body: fonts.body,
    },
    radii: {
      connectButton: radii.md,
      actionButton: radii.md,
      menuButton: radii.md,
      modal: radii.md,
      modalMobile: radii.md,
    },
    shadows: {
      connectButton: shadows.md,
      dialog: shadows.xl,
      profileDetailsAction: shadows.md,
      selectedOption: shadows.md,
      selectedWallet: shadows.md,
      walletLogo: shadows.md,
    },
    colors: {
      accentColor: colors.purple[500],
      // accentColorForeground: '...',
      // actionButtonBorder: '...',
      // actionButtonBorderMobile: '...',
      // actionButtonSecondaryBackground: '...',
      // closeButton: '...',
      // closeButtonBackground: '...',
      // connectButtonBackground: "#000000",
      // connectButtonBackgroundError: '...',
      // connectButtonInnerBackground: '#000000',
      // connectButtonText: '...',
      // connectButtonTextError: '...',
      // connectionIndicator: '...',
      // downloadBottomCardBackground: '...',
      // downloadTopCardBackground: '...',
      // error: '...',
      // generalBorder: '...',
      // generalBorderDim: '...',
      // menuItemBackground: '...',
      // modalBackdrop: '...',
      // modalBackground: semanticTokens.colors.background.level0[colorModeKey],
      // modalBorder: '...',
      // modalText: semanticTokens.colors.font.primary[colorModeKey],
      // modalTextDim: '...',
      // modalTextSecondary: '...',
      // profileAction: '...',
      // profileActionHover: '...',
      // profileForeground: '...',
      // selectedOptionBorder: '...',
      // standby: '...',
    },
  };

  const _lightTheme = merge(lightTheme(), {
    ...sharedConfig,
  } as Theme);

  const _darkTheme = merge(darkTheme(), {
    ...sharedConfig,
  } as Theme);

  const customTheme = _lightTheme;

  return (
    <ReactQueryClientProvider>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider theme={customTheme}>
          <UserAccountProvider>
            <UserSettingsProvider
              initEnableSignatures={undefined}
              initSlippage={undefined}
              initAcceptedPolicies={undefined}
            >
              {children}
            </UserSettingsProvider>
          </UserAccountProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </ReactQueryClientProvider>
  );
}
