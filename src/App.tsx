import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  type CoinSide,
  calculateStreak,
  computeTargetAngle,
  flipCoinOutcome,
} from './utils/coinLogic';
import { sound } from './utils/audio';
import { Coin3D } from './components/Coin3D';
import { StreakCounter } from './components/StreakCounter';
import { Celebration } from './components/Celebration';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Coin state
  const [side, setSide] = useState<CoinSide>('heads');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [angle, setAngle] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  // Streaks & Celebration
  const [streak, setStreak] = useState<number>(0);
  const [streakSide, setStreakSide] = useState<CoinSide | null>(null);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalFlips, setTotalFlips] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const streakRef = useRef(streak);
  const streakSideRef = useRef(streakSide);
  const bestStreakRef = useRef(bestStreak);

  useEffect(() => {
    streakRef.current = streak;
    streakSideRef.current = streakSide;
    bestStreakRef.current = bestStreak;
  }, [streak, streakSide, bestStreak]);

  const animFrameRef = useRef<number | null>(null);

  // Sync sound setting
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Execute realistic 3D Coin Flip animation matching React Native Animated curves
  const triggerFlip = useCallback((
    forcedSide?: CoinSide,
    startStreakOverride?: number,
    startSideOverride?: CoinSide
  ) => {
    if (isFlipping) return;

    setIsFlipping(true);
    sound.playFlipStart();

    const outcome: CoinSide = forcedSide ?? flipCoinOutcome(0.5);
    const startAngle = angle;
    const targetAngle = computeTargetAngle(startAngle, outcome, 6);
    const totalRotation = targetAngle - startAngle;

    const duration = 1250; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Bezier-like cubic deceleration for rotation
      const easeRot = 1 - Math.pow(1 - progress, 3);
      setAngle(startAngle + totalRotation * easeRot);

      // Parabolic vertical trajectory: 4 * p * (1 - p) -> peaks around mid-flight
      const arcHeight = -135 * Math.sin(progress * Math.PI);
      setHeight(arcHeight);

      // Scale up in air, settling on landing
      const currentScale = 1 + 0.16 * Math.sin(progress * Math.PI);
      setScale(currentScale);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Complete flip
        setAngle(targetAngle % 360);
        setHeight(0);
        setScale(1);
        setSide(outcome);
        setIsFlipping(false);

        // Sound on landing
        sound.playLand();

        // Streak calculation using refs / override
        const prevCount = startStreakOverride !== undefined ? startStreakOverride : streakRef.current;
        const prevSide = startSideOverride !== undefined ? startSideOverride : streakSideRef.current;

        const streakResult = calculateStreak(prevCount, prevSide, outcome, bestStreakRef.current);
        setStreak(streakResult.count);
        setStreakSide(streakResult.side);
        setBestStreak(streakResult.bestStreak);
        setTotalFlips((prev) => prev + 1);

        // Celebratory fanfare & winning animation on hitting 3 in a row
        if (streakResult.hitThreeMilestone || streakResult.count === 3) {
          setShowCelebration(true);
          setTimeout(() => sound.playStreakChime(), 150);
        } else if (streakResult.isThreeOrMore) {
          setTimeout(() => sound.playStreakChime(), 150);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [angle, isFlipping]);

  // Hook for testing streak celebration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __triggerStreakCelebration?: () => void }).__triggerStreakCelebration = () => {
        triggerFlip('heads', 2, 'heads');
      };
    }
  }, [triggerFlip]);

  // Keyboard shortcut: Spacebar to flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isFlipping) {
        e.preventDefault();
        triggerFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerFlip, isFlipping]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Quick reset
  const handleReset = () => {
    setStreak(0);
    setStreakSide(null);
    setTotalFlips(0);
    setAngle(0);
    setSide('heads');
    setShowCelebration(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F3] text-stone-900 flex justify-center items-center p-0 sm:p-4 select-none">
      {/* Strictly the Mobile App UI */}
      <div className="relative w-full max-w-[420px] min-h-screen sm:min-h-[820px] sm:max-h-[860px] bg-[#FAFAF9] flex flex-col justify-between p-5 sm:rounded-[42px] sm:shadow-2xl sm:border border-stone-200/90 overflow-hidden">
        {/* Subtle Luxury Ambient Radial Light */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-amber-100/40 via-yellow-50/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-stone-100/70 to-transparent pointer-events-none" />

        {/* Top Mobile Bar: Brand Title, Sound Toggle & Reset */}
        <header className="relative z-10 flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-950" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-widest text-stone-900 leading-none">
                  COIN FLIP
                </h1>
                <p className="text-[10px] font-extrabold tracking-widest uppercase text-stone-400 mt-0.5">
                  PREMIUM GOLD COIN
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
                className={`p-2 rounded-xl border transition-colors ${
                  soundEnabled
                    ? 'bg-white border-stone-200 text-amber-600 shadow-xs'
                    : 'bg-stone-100 border-stone-200 text-stone-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset flip session"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Minimalist Stats Ribbon */}
          <div className="grid grid-cols-3 bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs text-center divide-x divide-stone-100">
            <div className="px-1">
              <span className="text-[9px] font-black tracking-widest uppercase text-stone-400 block">
                FLIPS
              </span>
              <span data-testid="stat-total-flips" className="text-sm font-black text-stone-900">
                {totalFlips}
              </span>
            </div>

            <div className="px-1">
              <span className="text-[9px] font-black tracking-widest uppercase text-stone-400 block">
                BEST STREAK
              </span>
              <span data-testid="stat-best-streak" className="text-sm font-black text-amber-700">
                {bestStreak}
              </span>
            </div>

            <div className="px-1">
              <span className="text-[9px] font-black tracking-widest uppercase text-stone-400 block">
                CURRENT
              </span>
              <span data-testid="stat-current-streak" className="text-sm font-black text-stone-900">
                {streakSide ? `${streakSide[0].toUpperCase()} ×${streak}` : '—'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Stage: Realistic Gold Coin with Curved Text */}
        <main className="relative z-10 my-auto flex flex-col items-center justify-center py-4">
          <Coin3D
            side={side}
            isFlipping={isFlipping}
            angle={angle}
            height={height}
            scale={scale}
            onClick={() => triggerFlip()}
          />
        </main>

        {/* Bottom Section: Primary Flip Button & Flashing Streak Counter */}
        <footer className="relative z-10 flex flex-col gap-3 pb-2">
          {/* Tactile Flip Coin Button */}
          <button
            type="button"
            data-testid="flip-button"
            onClick={() => triggerFlip()}
            disabled={isFlipping}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
              isFlipping
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-stone-900/20 hover:shadow-xl hover:shadow-stone-900/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isFlipping ? 'COIN IN FLIGHT...' : 'FLIP COIN'}</span>
          </button>

          {/* The Flashing Streak Counter at the bottom */}
          <StreakCounter
            streak={streak}
            streakSide={streakSide}
            bestStreak={bestStreak}
          />
        </footer>

        {/* 3-in-a-Row Winning Celebration Modal Overlay */}
        {showCelebration && (
          <Celebration
            streak={streak}
            side={streakSide}
            onDismiss={() => setShowCelebration(false)}
          />
        )}
      </div>
    </div>
  );
}
