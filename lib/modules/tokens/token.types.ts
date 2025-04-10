import {
  GlobalChain,
  MagpieApiToken,
} from "@/lib/services/api/magpie/api.types";
import { Address, HumanAmount } from "@balancer/sdk";

export type TokenBase = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
};

export interface TokenAmount {
  address: string;
  chainId: number;
  decimals: number;
  amount: bigint;
  formatted: string;
}

export interface TokenAmountHumanReadable {
  address: string;
  amount: string;
}

export type HumanTokenAmount = {
  humanAmount: HumanAmount | "";
  tokenAddress: Address;
};

export type HumanTokenAmountWithAddress = {
  humanAmount: HumanAmount | "";
  tokenAddress: Address;
  symbol: string;
};

export interface TokenAmountScaled {
  address: string;
  amount: bigint;
}
export interface TokenBaseWithAmount extends TokenBase {
  amount: string;
}

export type AmountHumanReadable = string;
export type AmountScaled = bigint;
export type AmountScaledString = string;

export type BalanceMap = Map<string, AmountHumanReadable>;

export interface AmountHumanReadableMap {
  [address: string]: AmountHumanReadable;
}

export type BalanceForFn = (
  token: TokenBase | string
) => TokenAmount | undefined;

export type GlobalToken = MagpieApiToken & {
  chain: GlobalChain;
  chainId: number;
};
