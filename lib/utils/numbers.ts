"use client";

import { MAX_UINT256 } from "@balancer/sdk";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import { KeyboardEvent } from "react";
import { formatUnits } from "viem";
import { isNumber, toNumber } from "lodash";

// Allows calling JSON.stringify with bigints
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const MAX_BIGINT = BigInt(MAX_UINT256);

export const INTEGER_FORMAT = "0,0";
export const FIAT_FORMAT_A = "0,0.00a";
export const FIAT_FORMAT_3_DECIMALS = "0,0.000a";
export const FIAT_FORMAT = "0,0.00";
export const FIAT_FORMAT_WITHOUT_DECIMALS = "0,0";
export const TOKEN_FORMAT_A = "0,0.[0000]a";
// Uses 2 decimals then value is > thousand
export const TOKEN_FORMAT_A_BIG = "0,0.[00]a";
export const TOKEN_FORMAT = "0,0.[0000]";
export const APR_FORMAT = "0,0.00%";
export const SLIPPAGE_FORMAT = "0.00%";
export const FEE_FORMAT = "0.[0000]%";
export const WEIGHT_FORMAT = "(%0,0)";
export const WEIGHT_FORMAT_TWO_DECIMALS = "(%0,0.00)";
export const PRICE_IMPACT_FORMAT = "0.00%";
export const INTEGER_PERCENTAGE_FORMAT = "0%";
export const BOOST_FORMAT = "0.000";

// APY格式化的自定义阈值
export const APY_MIN_THRESHOLD = 0.1; // 最小显示阈值0.1%
export const APY_MAX_THRESHOLD = 10000; // 最大显示阈值10K%
export const APY_K_THRESHOLD = 1000; // K表示的阈值

// Do not display bn values lower than this amount; they are likely to generate NaN results
export const BN_LOWER_THRESHOLD = 0.000001;

// Display <0.001 for small amounts
export const AMOUNT_LOWER_THRESHOLD = 0.001;
export const SMALL_AMOUNT_LABEL = "<0.001";
// Display <0.01% for small percentages)
export const PERCENTAGE_LOWER_THRESHOLD = 0.0001;
export const SMALL_PERCENTAGE_LABEL = "<0.01%";

// fiat value threshold for displaying the fiat format without cents
export const FIAT_CENTS_THRESHOLD = "100000";

export const USD_LOWER_THRESHOLD = 0.009;

const NUMERAL_DECIMAL_LIMIT = 9;

export type Numberish = string | number | bigint | BigNumber;
export type NumberFormatter = (val: Numberish) => string;

export function bn(val: Numberish): BigNumber {
  if (val === null || val === undefined) {
    return new BigNumber(0);
  }
  return new BigNumber(val.toString());
}

type FormatOpts = { abbreviated?: boolean };

/**
 * Converts a number to a string format within the decimal limit that numeral
 * can handle. Numeral is only used for display purposes, so we don't need to
 * worry about precision.
 */
function toSafeValue(val: Numberish): string {
  return bn(val).toFixed(NUMERAL_DECIMAL_LIMIT);
}

// Formats an integer value.
function integerFormat(val: Numberish): string {
  if (isSmallAmount(val)) return "0";
  return numeral(toSafeValue(val)).format(INTEGER_FORMAT);
}

// Formats a fiat value.
function fiatFormat(
  val: Numberish,
  { abbreviated = true }: FormatOpts = {}
): string {
  if (isSmallAmount(val)) return SMALL_AMOUNT_LABEL;
  if (requiresThreeDecimals(val)) return formatWith3Decimals(val);
  const format = abbreviated
    ? FIAT_FORMAT_A
    : isMoreThanOrEqualToAmount(val, FIAT_CENTS_THRESHOLD)
      ? FIAT_FORMAT_WITHOUT_DECIMALS
      : FIAT_FORMAT;
  return numeral(toSafeValue(val)).format(format);
}

// Formats a token value.
function tokenFormat(
  val: Numberish,
  { abbreviated = true }: FormatOpts = {}
): string {
  const bnVal = bn(val);

  if (!bnVal.isZero() && bnVal.lte(bn("0.00001"))) return "< 0.00001";
  if (!bnVal.isZero() && bnVal.lt(bn("0.0001"))) return "< 0.0001";

  // Uses 2 decimals then value is > thousand
  const TOKEN_FORMAT_ABBREVIATED = bnVal.gte(bn("1000"))
    ? TOKEN_FORMAT_A_BIG
    : TOKEN_FORMAT_A;
  const format = abbreviated ? TOKEN_FORMAT_ABBREVIATED : TOKEN_FORMAT;

  return numeral(toSafeValue(val)).format(format);
}

// Formats an APR value as a percentage.
function aprFormat(apr: Numberish): string {
  const aprValue = bn(apr);

  // 如果APR小于最小显示阈值，显示"<0.1%"
  if (aprValue.gt(0) && aprValue.lt(APY_MIN_THRESHOLD)) return "<0.1%";

  // 如果APR大于最大显示阈值，显示">10K%"
  if (aprValue.gt(APY_MAX_THRESHOLD)) return ">10K%";

  // 如果APR在1000到10K之间，使用K表示
  if (aprValue.gte(APY_K_THRESHOLD) && aprValue.lte(APY_MAX_THRESHOLD)) {
    return `${(aprValue.toNumber() / 1000).toFixed(2)}K%`;
  }

  // 其他情况使用两位小数
  return `${aprValue.toFixed(2)}%`;
}

// Formats a slippage value as a percentage.
function slippageFormat(slippage: Numberish): string {
  if (isSmallPercentage(slippage, { isPercentage: true }))
    return SMALL_PERCENTAGE_LABEL;
  return numeral(bn(slippage).div(100)).format(SLIPPAGE_FORMAT);
}

// Formats a fee value as a percentage.
function feePercentFormat(fee: Numberish): string {
  if (isSmallPercentage(fee)) return SMALL_PERCENTAGE_LABEL;
  return numeral(fee.toString()).format(FEE_FORMAT);
}

// Formats a weight value as a percentage.
function weightFormat(
  val: Numberish,
  { abbreviated = true }: FormatOpts = {}
): string {
  if (isSmallPercentage(val)) return SMALL_PERCENTAGE_LABEL;
  const format = abbreviated ? WEIGHT_FORMAT : WEIGHT_FORMAT_TWO_DECIMALS;
  return numeral(val.toString()).format(format);
}

// Formats a price impact value as a percentage.
function priceImpactFormat(val: Numberish): string {
  if (isSmallPercentage(val)) return SMALL_PERCENTAGE_LABEL;
  return numeral(val.toString()).format(PRICE_IMPACT_FORMAT);
}

// Formats an integer value as a percentage.
function integerPercentageFormat(val: Numberish): string {
  return numeral(val.toString()).format(INTEGER_PERCENTAGE_FORMAT);
}

function boostFormat(val: Numberish): string {
  return numeral(val.toString()).format(BOOST_FORMAT);
}

// Sums an array of numbers safely using bignumber.js.
export function safeSum(amounts: Numberish[]): string {
  return amounts.reduce((a, b) => bn(a).plus(b.toString()), bn(0)).toString();
}

// Prevents invalid characters from being entered into a number input.
export function blockInvalidNumberInput(
  event: KeyboardEvent<HTMLInputElement>
): void {
  ["e", "E", "+", "-"].includes(event.key) && event.preventDefault();
}

type NumberFormat =
  | "integer"
  | "fiat"
  | "token"
  | "apr"
  | "feePercent"
  | "weight"
  | "priceImpact"
  | "percentage"
  | "slippage"
  | "sharePercent"
  | "stakedPercentage"
  | "boost";

// General number formatting function.
export function fNum(
  format: NumberFormat,
  val: Numberish,
  opts?: FormatOpts
): string {
  switch (format) {
    case "integer":
      return integerFormat(val);
    case "fiat":
      return fiatFormat(val, opts);
    case "token":
      return tokenFormat(val, opts);
    case "apr":
      return aprFormat(val);
    case "feePercent":
    case "sharePercent":
      return feePercentFormat(val);
    case "weight":
      return weightFormat(val, opts);
    case "stakedPercentage":
    case "priceImpact":
      return priceImpactFormat(val);
    case "percentage":
      return integerPercentageFormat(val);
    case "slippage":
      return slippageFormat(val);
    case "boost":
      return boostFormat(val);
    default:
      throw new Error(`Number format not implemented: ${format}`);
  }
}

export function fNumCustom(val: Numberish, format: string): string {
  return numeral(toSafeValue(val)).format(format);
}

// Edge case where we need to display 3 decimals for small amounts between 0.001 and 0.01
function requiresThreeDecimals(value: Numberish): boolean {
  return !isZero(value) && bn(value).gte(0.001) && bn(value).lte(0.009);
}

function formatWith3Decimals(value: Numberish): string {
  return numeral(toSafeValue(value)).format(FIAT_FORMAT_3_DECIMALS);
}

function isSmallAmount(value: Numberish): boolean {
  return !isZero(value) && bn(value).lt(AMOUNT_LOWER_THRESHOLD);
}

function isMoreThanOrEqualToAmount(
  value: Numberish,
  amount: Numberish
): boolean {
  return !isZero(value) && bn(value).gte(bn(amount));
}

function isSmallPercentage(
  value: Numberish,
  { isPercentage = false }: { isPercentage?: boolean } = {}
): boolean {
  // if the value is already a percentage (like in slippageFormat) we divide by 100 so that slippageFormat('10') is '10%'
  const val = isPercentage ? bn(value).div(100) : bn(value);
  return !isZero(value) && val.lt(PERCENTAGE_LOWER_THRESHOLD);
}

export function isSuperSmallAmount(value: Numberish): boolean {
  return bn(value).lte(BN_LOWER_THRESHOLD);
}

// Returns dash if token amount is null, otherwise returns humanized token amount in token display format.
export function safeTokenFormat(
  amount: bigint | null | undefined,
  decimals: number,
  opts?: FormatOpts
): string {
  if (!amount) return "-";

  return fNum("token", formatUnits(amount, decimals), opts);
}

export function isZero(amount: Numberish): boolean {
  return bn(amount).isZero();
}

export function isNegative(amount: Numberish): boolean {
  return bn(amount).isNegative();
}

export function isSmallUsd(value: Numberish): boolean {
  return !isZero(value) && bn(value).lt(USD_LOWER_THRESHOLD);
}

/*
  Small USD amounts crashes the the SDK remove queries,
  so we set this threshold to disable removes
 */
export function isTooSmallToRemoveUsd(value: Numberish): boolean {
  const USD_LOWER_THRESHOLD = 0.03;
  return !isZero(value) && bn(value).lt(USD_LOWER_THRESHOLD);
}

export const isValidNumber = (value: string): boolean =>
  isNumber(toNumber(value)) && !isNaN(toNumber(value));
