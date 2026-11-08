export type CoinSide = 'heads' | 'tails';

export interface FlipResult {
  id: string;
  side: CoinSide;
  timestamp: number;
  flipNumber: number;
  streakCount: number;
}

export interface StreakState {
  count: number;
  side: CoinSide | null;
  bestStreak: number;
  isFlashing: boolean;
}

/**
 * Calculates new streak based on the latest outcome and previous state.
 */
export function calculateStreak(
  currentStreakCount: number,
  currentStreakSide: CoinSide | null,
  newSide: CoinSide,
  currentBestStreak: number = 0
): {
  count: number;
  side: CoinSide;
  bestStreak: number;
  isThreeOrMore: boolean;
  hitThreeMilestone: boolean;
} {
  const isContinuation = currentStreakSide === newSide;
  const newCount = isContinuation ? currentStreakCount + 1 : 1;
  const best = Math.max(currentBestStreak, newCount);
  const isThreeOrMore = newCount >= 3;
  const hitThreeMilestone = newCount === 3;

  return {
    count: newCount,
    side: newSide,
    bestStreak: best,
    isThreeOrMore,
    hitThreeMilestone,
  };
}

/**
 * Calculates total statistics for a flip history.
 */
export function calculateStats(history: FlipResult[]) {
  const total = history.length;
  if (total === 0) {
    return {
      total: 0,
      headsCount: 0,
      tailsCount: 0,
      headsPercentage: 0,
      tailsPercentage: 0,
    };
  }

  const headsCount = history.filter((h) => h.side === 'heads').length;
  const tailsCount = total - headsCount;

  return {
    total,
    headsCount,
    tailsCount,
    headsPercentage: Math.round((headsCount / total) * 100),
    tailsPercentage: Math.round((tailsCount / total) * 100),
  };
}

/**
 * Computes exact target rotation angle (in degrees) to ensure smooth 3D flip.
 * Heads corresponds to 0° (mod 360°), Tails corresponds to 180° (mod 360°).
 */
export function computeTargetAngle(
  currentAngle: number,
  targetSide: CoinSide,
  minRotations = 5
): number {
  const baseSpins = minRotations * 360;
  // Round currentAngle to nearest 360
  const normalizedBase = Math.floor(currentAngle / 360) * 360;
  const targetOffset = targetSide === 'heads' ? 0 : 180;
  return normalizedBase + baseSpins + targetOffset;
}

/**
 * Chooses a random side with an optional seed or custom probability.
 */
export function flipCoinOutcome(customProbabilityHeads = 0.5): CoinSide {
  return Math.random() < customProbabilityHeads ? 'heads' : 'tails';
}
