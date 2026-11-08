import React from 'react';
import type { CoinSide } from '../utils/coinLogic';
import { Flame, Zap, Award } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  streakSide: CoinSide | null;
  bestStreak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  streakSide,
  bestStreak,
}) => {
  const isThreeOrMore = streak >= 3;

  return (
    <div
      data-testid="streak-counter-container"
      className={`relative w-full rounded-2xl p-4 transition-all duration-300 border ${
        isThreeOrMore
          ? 'streak-flashing'
          : streak > 0
          ? 'bg-white/80 backdrop-blur-sm border-stone-200 shadow-sm'
          : 'bg-white/50 border-stone-200/70 shadow-sm'
      }`}
    >
      {/* Flashing Aura Indicator when Streak >= 3 */}
      {isThreeOrMore && (
        <div
          data-testid="streak-flashing-indicator"
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/30 via-yellow-300/40 to-amber-500/30 blur-sm pointer-events-none animate-pulse"
        />
      )}

      <div className="relative z-10 flex flex-col items-center">
        {/* Streak Header Row */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isThreeOrMore
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/40 scale-110'
                  : streak > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              {isThreeOrMore ? (
                <Flame className="w-4 h-4 animate-bounce" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-stone-400 block leading-tight">
                {isThreeOrMore ? 'HOT STREAK' : 'STREAK TRACKER'}
              </span>
              <span
                data-testid="streak-status-label"
                className={`text-xs font-black tracking-wide ${
                  isThreeOrMore
                    ? 'text-amber-800 font-extrabold'
                    : streak > 0
                    ? 'text-stone-800'
                    : 'text-stone-500'
                }`}
              >
                {streak > 0 && streakSide
                  ? `${streak} ${streakSide.toUpperCase()} IN A ROW`
                  : 'Flip to ignite a streak'}
              </span>
            </div>
          </div>

          {/* Best Streak Badge */}
          <div className="flex items-center gap-1.5 bg-stone-100/90 px-2.5 py-1 rounded-full border border-stone-200">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
              BEST: <strong className="text-stone-900">{bestStreak}</strong>
            </span>
          </div>
        </div>

        {/* Milestone Indicator Beads (1, 2, 3...) */}
        <div className="flex items-center justify-center gap-3 w-full py-1">
          {[1, 2, 3].map((step) => {
            const isFilled = streak >= step;
            const isTargetBead = step === 3 && isThreeOrMore;

            return (
              <div
                key={step}
                data-testid={`streak-bead-${step}`}
                className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
                  isTargetBead
                    ? 'bg-amber-500 border-amber-300 text-white shadow-md shadow-amber-500/50 scale-110'
                    : isFilled
                    ? 'bg-amber-400 border-amber-500 text-amber-950 font-black'
                    : 'bg-stone-100 border-stone-200 text-stone-400'
                }`}
              >
                <span className="text-xs font-black">{step}</span>
                {step === 3 && (
                  <span className="absolute -top-1 -right-1 text-[9px]">⭐</span>
                )}
              </div>
            );
          })}

          {streak > 3 && (
            <div className="flex items-center justify-center px-2.5 h-9 rounded-full bg-amber-500 border-2 border-amber-300 text-white font-black text-xs shadow-md shadow-amber-500/40">
              +{streak - 3}
            </div>
          )}
        </div>

        {/* Milestone Alert Banner */}
        {isThreeOrMore ? (
          <div
            data-testid="streak-alert-banner"
            className="mt-2.5 px-3 py-1 bg-amber-500 text-amber-950 text-[11px] font-black tracking-wider uppercase rounded-full flex items-center gap-1.5 shadow-sm"
          >
            <span>🔥</span>
            <span>3-IN-A-ROW FLASH UNLOCKED!</span>
            <span>🔥</span>
          </div>
        ) : (
          <div className="mt-2 text-[10px] font-semibold text-stone-400 tracking-wider uppercase">
            {streak === 2
              ? '⚡ 1 more for 3-in-a-row flash!'
              : 'Hit 3 consecutive flips to activate flash'}
          </div>
        )}
      </div>
    </div>
  );
};
