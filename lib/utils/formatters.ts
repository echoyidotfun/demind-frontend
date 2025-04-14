// 格式化数字，添加千位分隔符
export function formatNumber(num: number, decimals = 2): string {
  if (num === undefined || num === null) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

// 格式化日期，将时间戳转换为日期字符串
export function formatDate(timestamp: string | number): string {
  if (!timestamp) return "";

  const date = new Date(parseInt(timestamp.toString()) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
