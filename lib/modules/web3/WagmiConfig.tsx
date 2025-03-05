"use client";

import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { createConfig } from "wagmi";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  rabbyWallet,
  okxWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { chains } from "./ChainConfig";
import { transports } from "./transports";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
if (!walletConnectProjectId)
  throw new Error("Missing NEXT_PUBLIC_WALLET_CONNECT_ID env");

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        // metaMaskWallet must appear above injectedWallet to avoid random disconnection issues
        metaMaskWallet,
        safeWallet,
        rabbyWallet,
        okxWallet,
        rainbowWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: PROJECT_CONFIG.projectName,
    projectId: walletConnectProjectId,
  }
);

export const wagmiConfig = createConfig({
  chains,
  transports,
  connectors,
  ssr: true,
});
