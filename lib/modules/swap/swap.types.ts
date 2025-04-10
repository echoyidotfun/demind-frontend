import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import {
  AuraBalSwapQueryOutput,
  ExactInQueryOutput,
  ExactOutQueryOutput,
  Path,
  Permit2,
  Swap,
} from "@balancer/sdk";
import { Address, Hex } from "viem";

export type SwapTokenInput = {
  address: Address;
  amount: string;
  scaledAmount: bigint;
};

export enum SorSwapType {
  ExactIn = "EXACT_IN",
  ExactOut = "EXACT_OUT",
}

export type SwapState = {
  tokenIn: SwapTokenInput;
  tokenOut: SwapTokenInput;
  swapType: SorSwapType;
  selectedChain: GlobalChain;
};

export type SimulateSwapInputs = {
  chain: GlobalChain;
  tokenIn: Address;
  tokenOut: Address;
  swapType: SorSwapType;
  swapAmount: string;
  swapScaledAmount: bigint;
  permit2?: Permit2;
  poolIds?: string[];
};

export type SimulateSwapResponse = {
  effectivePrice: string;
  effectivePriceReversed: string;
  returnAmount: string;
  swapType: SorSwapType;
};

export interface SdkSimulateSwapResponse extends SimulateSwapResponse {
  swap: Swap;
  queryOutput: ExactInQueryOutput | ExactOutQueryOutput;
  protocolVersion: number;
  hopCount: number;
}

export interface DemindRouterSimulateSwapResponse extends SimulateSwapResponse {
  paths: Path[];
  protocolVersion: number;
  hopCount: number;
  router: Address;
}

export interface SimulateSinglePoolSwapResponse extends SimulateSwapResponse {
  swap: Swap;
  queryOutput: ExactInQueryOutput | ExactOutQueryOutput;
}

export interface AuraBalSimulateSwapResponse extends SimulateSwapResponse {
  queryOutput: AuraBalSwapQueryOutput;
}

export interface BuildSwapInputs extends SwapState {
  account: Address;
  slippagePercent: string;
  simulateResponse: SimulateSwapResponse;
  wethIsEth?: boolean;
  relayerApprovalSignature?: Hex;
  permit2?: Permit2; // only used by v3 swaps
}

export interface SdkBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: SdkSimulateSwapResponse;
}

export interface DemindRouterBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: DemindRouterSimulateSwapResponse;
}

export interface AuraBalBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: AuraBalSimulateSwapResponse;
}

export enum SupportedWrapHandler {
  LIDO = "LIDO",
}

export const OWrapType = {
  WRAP: "wrap",
  UNWRAP: "unwrap",
} as const;

export type WrapType = (typeof OWrapType)[keyof typeof OWrapType];

export const OSwapAction = {
  ...OWrapType,
  SWAP: "swap",
} as const;

export type SwapAction = (typeof OSwapAction)[keyof typeof OSwapAction];
