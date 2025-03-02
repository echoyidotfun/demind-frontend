import { ProjectConfig } from "./config.types";
import { Chain } from "./constants";

export const supportedNetworks = [Chain.Sonic, Chain.Base];

export const projectConfig: ProjectConfig = {
  projectId: "demind",
  projectUrl: "https://demind.xyz",
  projectName: "DeMind",
  projectLogo: "https://demind.xyz/logo.png",
  supportedNetworks: supportedNetworks,
  defaultNetwork: Chain.Sonic,
  delegateOwner: "0xaaaaaaaaaa",

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
