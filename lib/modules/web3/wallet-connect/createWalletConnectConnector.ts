import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { walletConnect, WalletConnectParameters } from "wagmi/connectors";
import { CreateConnectorFn } from "wagmi";

type Params = { index: number; walletConnectProjectId: string };

type RainbowKitDetails = {
  id: string;
  name: string;
  iconUrl: (() => Promise<string>) | string;
  iconBackground?: string;
  installed?: boolean;
  showQrModal?: boolean;
  index: number;
  groupIndex: number;
  groupName: string;
  isRainbowKitConnector: boolean;
  isWalletConnectModalConnector: boolean;
};

export function createWalletConnectConnector({
  index,
  walletConnectProjectId,
}: Params) {
  // Default WC RkDetails
  const rkDetails: RainbowKitDetails = {
    id: "walletConnect",
    name: "WalletConnect",
    iconBackground: "#3b99fc",
    iconUrl: async () => "/images/icons/walletConnect.svg",
    showQrModal: true,
    index,
    groupIndex: 1,
    groupName: "Recommended",
    isRainbowKitConnector: true,
    isWalletConnectModalConnector: false,
  };

  const walletConnectParameters: WalletConnectParameters = {
    projectId: walletConnectProjectId,
    showQrModal: true,
    metadata: {
      name: PROJECT_CONFIG.projectName,
      description: "",
      url: PROJECT_CONFIG.projectUrl,
      icons: [PROJECT_CONFIG.projectLogo],
    },
    // Enforce wallet connect popup always on top
    // More info: https://github.com/wevm/wagmi/discussions/2775
    qrModalOptions: {
      themeMode: "dark",
      themeVariables: {
        "--wcm-z-index": "9999999",
      },
    },
  };

  const wcConnector: CreateConnectorFn = (config: any) => {
    return {
      ...walletConnect(walletConnectParameters)(config),
      rkDetails,
    };
  };

  return wcConnector;
}
