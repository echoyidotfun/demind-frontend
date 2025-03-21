import { demindRouterAbi, yakRouterAbi } from "./abi/demind";

export const AbiMap = {
  demindRouter: demindRouterAbi,
  yakRouter: yakRouterAbi,
};

export type AbiMapType = keyof typeof AbiMap | undefined;
