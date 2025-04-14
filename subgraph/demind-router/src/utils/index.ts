import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

// 将BigInt转换为BigDecimal，便于聚合
export function convertToDecimal(amount: BigInt, decimals: i32): BigDecimal {
  let decimalFactor = BigInt.fromI32(10)
    .pow(decimals as u8)
    .toBigDecimal();
  return amount.toBigDecimal().div(decimalFactor);
}

// 获取日期字符串 YYYY-MM-DD
export function getDayId(timestamp: BigInt): string {
  let dayTimestamp = (timestamp.toI32() / 86400) * 86400; // 截断到天
  return dayTimestamp.toString();
}
