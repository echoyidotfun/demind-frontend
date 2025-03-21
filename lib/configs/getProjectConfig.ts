import { ProjectConfig } from "./config.types";
import { GqlChain } from "../services/api/generated/graphql";

export const supportedNetworks = [
  GqlChain.Sonic,
  GqlChain.Base,
  GqlChain.Arbitrum,
];

export const projectConfig: ProjectConfig = {
  projectId: "demind",
  projectUrl: "https://demind.xyz",
  projectName: "DeMind",
  projectLogo: "https://demind.xyz/logo.png",
  supportedNetworks: supportedNetworks,
  defaultNetwork: GqlChain.Sonic,
  delegateOwner: "0xaaaaaaaaaa",

  options: {
    allowCreateWallet: false,
    isOnSafeAppList: false,
  },

  links: {
    appLinks: [
      {
        href: "/defai",
        label: "DeFAI",
      },
    ],
    socialLinks: [
      { iconType: "x", href: "https://x.com/echoyidotfun" },
      { iconType: "Blog", href: "https://echoyi.fun" },
      {
        iconType: "github",
        href: "https://github.com/echoyidotfun/demind-contracts",
      },
    ],
  },
};
export const PROJECT_CONFIG = projectConfig;
