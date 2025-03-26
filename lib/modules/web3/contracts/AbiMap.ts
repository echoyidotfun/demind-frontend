import { demindRouterAbi } from "./abi/demind";

export const AbiMap = {
  demindRouter: demindRouterAbi,
};

export type AbiMapType = keyof typeof AbiMap | undefined;
