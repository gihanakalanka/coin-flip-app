import React, { useEffect, useState } from 'react';
import type { CoinSide } from '../utils/coinLogic';
import { Trophy, Flame, Sparkles, X } from 'lucide-react';

interface CelebrationProps {
  streak: number;
  side: CoinSide | null;
  onDismiss: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  dx: number;
  dy: number;
  dRot: number;
  shape: 'rect' | 'circle' | 'star';
}

export const Celebration: React.FC<CelebrationProps> = ({
  streak,
  side,
  onDismiss,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 60 celebratory confetti and golden sparkle particles
    const colors = ['#F59E0B', '#FBBF24', '#FCD34D', '#F43F5E', '#10B981', '#6366F1', '#EC4899'];
    const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'circle', 'star'];

    const newParticles: Particle[] = Array.from({ length: 55 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 55 + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 9;
      return {
        id: i,
        x: 50, // center %
        y: 45, // center %
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 3, // upward bias
        dRot: (Math.random() - 0.5) * 18,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    });

    setParticles(newParticles);

    // Auto dismiss after 4 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 4200);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      data-testid="winning-celebration"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={onDismiss}
    >
      {/* Floating Confetti Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-confettiFall"
            style={{
              left: `calc(${p.x}% + ${p.dx * 18}px)`,
              top: `calc(${p.y}% + ${p.dy * 18}px)`,
              width: `${p.size}px`,
              height: p.shape === 'rect' ? `${p.size * 1.5}px` : `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '9999px' : p.shape === 'star' ? '2px' : '3px',
              transform: `rotate(${p.rotation + p.dRot * 10}deg)`,
              opacity: 0.9,
              boxShadow: `0 0 8px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Floating Victory Card */}
      <div
        className="relative z-10 w-full max-w-[320px] bg-gradient-to-b from-white via-amber-50/80 to-white rounded-3xl p-6 shadow-2xl border-2 border-amber-400 text-center flex flex-col items-center animate-bounceIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss X button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss celebration"
          className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Crown / Trophy Halo */}
        <div className="relative mb-3">
          <div className="absolute -inset-3 rounded-full bg-amber-400/30 blur-lg animate-pulse" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center text-amber-950 shadow-lg shadow-amber-500/40">
            <Trophy className="w-8 h-8 drop-shadow-md text-amber-950" />
          </div>
        </div>

        {/* Victory Headline */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-500 text-white shadow-xs mb-2">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>STREAK UNLOCKED</span>
          <Sparkles className="w-3.5 h-3.5" />
        </span>

        <h3 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">
          3 IN A ROW!
        </h3>

        <p className="text-xs font-bold text-amber-800 mt-1 uppercase tracking-wider">
          {streak} {side?.toUpperCase()} CONSECUTIVE HITS
        </p>

        <p className="text-[11px] text-stone-500 mt-2 px-2 leading-relaxed">
          Incredible luck! The streak counter is now glowing on fire at the bottom!
        </p>

        {/* Action Button to Continue */}
        <button
          type="button"
          onClick={onDismiss}
          className="mt-4 w-full py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black tracking-widest uppercase shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Keep Flipping
        </button>
      </div>
    </div>
  );
};
