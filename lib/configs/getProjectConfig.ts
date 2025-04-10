import { ProjectConfig } from "./config.types";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";

export const supportedNetworks = [GlobalChain.Sonic];

export const projectConfig: ProjectConfig = {
  projectId: "demind",
  projectName: "DeMind",
  projectUrl: "https://demind.fun",
  projectLogo: "https://demind.fun/images/icons/logo.png",
  supportedNetworks: supportedNetworks,
  defaultNetwork: GlobalChain.Sonic,
  delegateOwner: "0xaaaaaaaaaa",

  links: {
    appLinks: [],
    socialLinks: [
      { iconType: "x", href: "https://x.com/echoyidotfun" },
      {
        iconType: "github",
        href: "https://github.com/echoyidotfun/demind-contracts",
      },
      { iconType: "telegram", href: "https://t.me/echoyidotfun" },
    ],
  },
};
export const PROJECT_CONFIG = projectConfig;
