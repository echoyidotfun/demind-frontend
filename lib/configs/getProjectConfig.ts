import { ProjectConfig } from "./config.types";
import { GqlChain } from "../services/api/generated/graphql";

export const supportedNetworks = [GqlChain.Sonic];

export const projectConfig: ProjectConfig = {
  projectId: "demind",
  projectName: "DeMind",
  projectUrl: "https://demind.fun",
  projectLogo: "https://demind.fun/images/icons/logo.png",
  supportedNetworks: supportedNetworks,
  defaultNetwork: GqlChain.Sonic,
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
