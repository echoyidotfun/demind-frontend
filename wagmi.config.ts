import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";
import { Abi, erc20Abi } from "viem";
import yakRouterAbi from "./lib/modules/web3/contracts/abi/YakRouter.json";

export default defineConfig({
  out: "lib/modules/web3/contracts/abi/demind.ts",
  contracts: [
    {
      name: "erc20",
      abi: erc20Abi,
    },
  ],
  plugins: [
    foundry({
      project: "../demind-contracts",
      include: ["DemindRouter.sol/**"],
    }),
    react(),
  ],
});
