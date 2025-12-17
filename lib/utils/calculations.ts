/**
 * 推定飛距離を計算
 * @param startWeight 開始時体重 (kg)
 * @param currentWeight 現在体重 (kg)
 * @param startDistance 開始時飛距離 (yd)
 * @param kgToYdRatio 変換係数 (デフォルト: 4yd/kg)
 * @returns 推定飛距離 (yd)
 */
export function calculateEstimatedDistance(
  startWeight: number,
  currentWeight: number,
  startDistance: number,
  kgToYdRatio: number = 4
): number {
  const weightGain = currentWeight - startWeight;
  return Math.round(startDistance + weightGain * kgToYdRatio);
}

/**
 * 目標までの残り体重を計算
 */
export function calculateRemainingWeight(
  currentWeight: number,
  targetWeight: number
): number {
  return Math.max(0, targetWeight - currentWeight);
}

/**
 * 目標までの残り飛距離を計算
 */
export function calculateRemainingDistance(
  estimatedDistance: number,
  targetDistance: number = 300
): number {
  return Math.max(0, targetDistance - estimatedDistance);
}

/**
 * 進捗率を計算 (0-100)
 */
export function calculateProgress(
  startValue: number,
  currentValue: number,
  targetValue: number
): number {
  if (targetValue === startValue) return 100;
  const progress = ((currentValue - startValue) / (targetValue - startValue)) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * 日別カロリー目標達成率を計算
 */
export function calculateCalorieProgress(
  consumedCalories: number,
  targetCalories: number
): number {
  if (targetCalories <= 0) return 0;
  return Math.round((consumedCalories / targetCalories) * 100);
}
