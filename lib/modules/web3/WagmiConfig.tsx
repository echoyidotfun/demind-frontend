"use client";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { createConfig } from "wagmi";
import { chains } from "./ChainConfig";
import { transports } from "./transports";
import { createWalletConnectConnector } from "./wallet-connect/createWalletConnectConnector";
import { isConnectedToWC } from "./wallet-connect/useWCConnectionLocalStorage";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
if (!walletConnectProjectId)
  throw new Error("Missing NEXT_PUBLIC_WALLET_CONNECT_ID env");

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        walletConnectWallet,
        metaMaskWallet,
        okxWallet,
        rabbyWallet,
        coinbaseWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: PROJECT_CONFIG.projectName,
    projectId: walletConnectProjectId,
  }
);

/*
  Only adding a new WC Connector if the user is not already connected to WC
  This fixes this rainbowkit issue:
  https://github.com/rainbow-me/rainbowkit/issues/2232
*/
if (!isConnectedToWC()) {
  const lastConnector = connectors[connectors.length - 1];
  if (lastConnector({} as any).id !== "walletConnect") {
    connectors.push(
      createWalletConnectConnector({
        index: connectors.length,
        walletConnectProjectId,
      })
    );
  }
}

export const wagmiConfig = createConfig({
  chains,
  transports,
  connectors,
  ssr: true,
});
