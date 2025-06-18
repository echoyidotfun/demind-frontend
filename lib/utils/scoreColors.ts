/**
 * 评分颜色工具函数
 * 实现从蓝色(#6464FA)到金色(#F8D458)的平滑渐变
 */

/**
 * 获取评分对应的颜色
 * @param score 评分值
 * @param alpha 透明度，默认为1
 * @param isTokenScore 是否为token评分(10分制)，默认为false(5分制)
 * @returns 颜色值，CSS格式
 */
export function getScoreColor(
  score?: number,
  alpha: number = 1,
  isTokenScore: boolean = false
): string {
  // 如果分数未定义或为null，返回灰色
  if (score === undefined || score === null) {
    return `rgba(160, 160, 160, ${alpha})`;
  }

  // 根据评分类型确定最大值
  const maxScore = isTokenScore ? 10 : 5;

  // 确保分数在0-maxScore的范围内
  const normalizedScore = Math.max(0, Math.min(maxScore, score));

  // 将分数标准化到0-1范围，用于颜色插值
  const normalizedRatio = normalizedScore / maxScore;

  // 定义颜色节点 - 从蓝色到金色的渐变
  const colorStops = [
    { ratio: 0, color: { r: 100, g: 100, b: 250 } }, // 较暗的蓝色 (#6464FA)
    { ratio: 0.2, color: { r: 120, g: 120, b: 245 } }, // 蓝色
    { ratio: 0.4, color: { r: 140, g: 140, b: 240 } }, // 蓝紫色
    { ratio: 0.6, color: { r: 180, g: 160, b: 220 } }, // 紫色
    { ratio: 0.7, color: { r: 200, g: 180, b: 180 } }, // 过渡色
    { ratio: 0.8, color: { r: 220, g: 200, b: 130 } }, // 浅金色
    { ratio: 1.0, color: { r: 248, g: 212, b: 88 } }, // 金色 (#F8D458)
  ];

  // 找到分数所在的区间
  let lowerIndex = 0;
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (
      normalizedRatio >= colorStops[i].ratio &&
      normalizedRatio <= colorStops[i + 1].ratio
    ) {
      lowerIndex = i;
      break;
    }
  }

  const lowerStop = colorStops[lowerIndex];
  const upperStop = colorStops[lowerIndex + 1];

  // 计算在区间内的位置比例
  const range = upperStop.ratio - lowerStop.ratio;
  const valueInRange = normalizedRatio - lowerStop.ratio;
  const ratio = range === 0 ? 0 : valueInRange / range;

  // 线性插值计算RGB值
  const r = Math.round(
    lowerStop.color.r + ratio * (upperStop.color.r - lowerStop.color.r)
  );
  const g = Math.round(
    lowerStop.color.g + ratio * (upperStop.color.g - lowerStop.color.g)
  );
  const b = Math.round(
    lowerStop.color.b + ratio * (upperStop.color.b - lowerStop.color.b)
  );

  // 返回RGBA格式的颜色
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 获取评分对应的背景颜色（带透明度）
 * @param score 评分值
 * @param isTokenScore 是否为token评分(10分制)，默认为false(5分制)
 * @returns 背景颜色值，CSS格式
 */
export function getScoreBackgroundColor(
  score?: number,
  isTokenScore: boolean = false
): string {
  return getScoreColor(score, 0.15, isTokenScore); // 使用较低的透明度作为背景色
}

/**
 * 获取评分对应的文本颜色
 * @param score 评分值
 * @param isTokenScore 是否为token评分(10分制)，默认为false(5分制)
 * @returns 文本颜色值，CSS格式
 */
export function getScoreTextColor(
  score?: number,
  isTokenScore: boolean = false
): string {
  // 高分使用深色，低分使用亮色，提高对比度
  if (score === undefined || score === null) {
    return "rgba(100, 100, 100, 1)";
  }

  // 根据评分类型确定阈值
  const threshold = isTokenScore ? 7 : 3.5;

  return score >= threshold
    ? "rgba(50, 50, 50, 0.9)" // 深色文本，适合浅色背景
    : "rgba(255, 255, 255, 0.9)"; // 浅色文本，适合深色背景
}
