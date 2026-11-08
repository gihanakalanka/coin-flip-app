import React from 'react';
import type { CoinSide } from '../utils/coinLogic';

interface Coin3DProps {
  side: CoinSide;
  isFlipping: boolean;
  angle: number;
  height: number;
  scale: number;
  onClick: () => void;
}

export const Coin3D: React.FC<Coin3DProps> = ({
  side,
  isFlipping,
  angle,
  height,
  scale,
  onClick,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Dynamic Golden Ambient Aura */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.48) 0%, rgba(217,119,6,0.2) 55%, transparent 75%)',
          transform: `scale(${isFlipping ? 1.35 : 1.05})`,
          opacity: isFlipping ? 0.95 : 0.65,
        }}
      />

      {/* Dynamic Ground Shadow */}
      <div
        className="absolute bottom-0 h-5 rounded-full transition-transform duration-75 pointer-events-none"
        style={{
          width: '150px',
          backgroundColor: 'rgba(28, 25, 23, 0.24)',
          filter: `blur(${Math.max(4, Math.abs(height) / 8)}px)`,
          transform: `scaleX(${1 + Math.abs(height) / 110}) scaleY(${Math.max(
            0.25,
            1 - Math.abs(height) / 150
          )})`,
          opacity: Math.max(0.18, 1 - Math.abs(height) / 135),
        }}
      />

      {/* 3D Coin Container */}
      <button
        type="button"
        onClick={onClick}
        disabled={isFlipping}
        aria-label={`Interactive gold coin currently showing ${side}. Click to flip.`}
        className="relative group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/60 rounded-full"
        style={{
          perspective: '1200px',
          width: '210px',
          height: '210px',
        }}
      >
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateY(${height}px) scale(${scale}) rotateX(${angle}deg)`,
            transition: isFlipping ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* ==================== FRONT FACE (HEADS - Authentic Gold Coin) ==================== */}
          <div
            className="absolute inset-0 rounded-full shadow-2xl flex flex-col items-center justify-center overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'radial-gradient(circle at 35% 30%, #FEF08A 0%, #F59E0B 45%, #D97706 75%, #92400E 100%)',
              border: '4.5px solid #FCD34D',
              boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.9), inset 0 -4px 10px rgba(120,53,15,0.7), 0 14px 28px -4px rgba(217,119,6,0.45)',
            }}
          >
            {/* Outer Reeded Milled Edge Simulation */}
            <div
              className="absolute inset-1 rounded-full pointer-events-none"
              style={{
                border: '2px dashed rgba(146, 64, 14, 0.6)',
                boxShadow: 'inset 0 0 4px rgba(120,53,15,0.4)',
              }}
            />

            {/* Specular Sheen Stripe */}
            <div
              className="absolute -top-16 -left-16 w-36 h-64 bg-gradient-to-r from-transparent via-white/45 to-transparent rotate-35 pointer-events-none z-10"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* SVG Medallion with Curved Rounded Text */}
            <svg className="w-full h-full relative z-0" viewBox="0 0 200 200">
              <defs>
                {/* Curved Top Arch for LIBERTY */}
                <path id="headsTopArc" d="M 28 100 A 72 72 0 1 1 172 100" fill="none" />
                {/* Curved Bottom Arch for IN GOD WE TRUST • 2026 */}
                <path id="headsBottomArc" d="M 32 100 A 68 68 0 0 0 168 100" fill="none" />
              </defs>

              {/* Inner Rim Circle */}
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="rgba(254, 240, 138, 0.65)"
                strokeWidth="1.5"
                strokeDasharray="2.5 3.5"
              />

              {/* Center Medallion Plate */}
              <circle
                cx="100"
                cy="100"
                r="56"
                fill="url(#headsCenterGrad)"
                stroke="rgba(120, 53, 15, 0.4)"
                strokeWidth="1.5"
              />
              <radialGradient id="headsCenterGrad" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </radialGradient>

              {/* CURVED TEXT: LIBERTY */}
              <text
                fill="#78350F"
                fontSize="12"
                fontWeight="900"
                letterSpacing="4.5"
                style={{ textShadow: '0 1px 1px rgba(254,240,138,0.7)' }}
              >
                <textPath
                  href="#headsTopArc"
                  xlinkHref="#headsTopArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  • LIBERTY •
                </textPath>
              </text>

              {/* CURVED TEXT: IN GOD WE TRUST • 2026 */}
              <text
                fill="#78350F"
                fontSize="8.5"
                fontWeight="900"
                letterSpacing="2.2"
                style={{ textShadow: '0 1px 1px rgba(254,240,138,0.7)' }}
              >
                <textPath
                  href="#headsBottomArc"
                  xlinkHref="#headsBottomArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  IN GOD WE TRUST • 2026
                </textPath>
              </text>

              {/* Center Lady Liberty Bust Artwork */}
              <g transform="translate(100, 88) scale(1.15)">
                {/* Lady Liberty Star Crown */}
                <path
                  d="M0 -18 L2 -12 L7 -11 L3 -7 L4 -2 L0 -5 L-4 -2 L-3 -7 L-7 -11 L-2 -12 Z"
                  fill="#78350F"
                />
                {/* Classical Head Profile Silhouette */}
                <circle cx="0" cy="-3" r="10" fill="#78350F" />
                <path
                  d="M-8 4 C-8 4, -4 14, 0 14 C4 14, 8 4, 8 4 Z"
                  fill="#78350F"
                />
              </g>

              {/* HEADS Label in center */}
              <text
                x="100"
                y="126"
                textAnchor="middle"
                fill="#78350F"
                fontSize="14"
                fontWeight="900"
                letterSpacing="2.5"
                fontFamily="serif"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.7)' }}
              >
                HEADS
              </text>
            </svg>
          </div>

          {/* ==================== BACK FACE (TAILS - Authentic Gold Eagle) ==================== */}
          <div
            className="absolute inset-0 rounded-full shadow-2xl flex flex-col items-center justify-center overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
              background: 'radial-gradient(circle at 40% 35%, #FEF08A 0%, #D97706 50%, #B45309 80%, #78350F 100%)',
              border: '4.5px solid #FCD34D',
              boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.9), inset 0 -4px 10px rgba(120,53,15,0.7), 0 14px 28px -4px rgba(217,119,6,0.45)',
            }}
          >
            {/* Outer Reeded Milled Edge */}
            <div
              className="absolute inset-1 rounded-full pointer-events-none"
              style={{
                border: '2px dashed rgba(146, 64, 14, 0.6)',
                boxShadow: 'inset 0 0 4px rgba(120,53,15,0.4)',
              }}
            />

            {/* Specular Sheen Stripe */}
            <div
              className="absolute -top-16 -left-16 w-36 h-64 bg-gradient-to-r from-transparent via-white/45 to-transparent rotate-35 pointer-events-none z-10"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* SVG Medallion with Curved Rounded Text */}
            <svg className="w-full h-full relative z-0" viewBox="0 0 200 200">
              <defs>
                {/* Curved Top Arch for UNITED STATES OF AMERICA */}
                <path id="tailsTopArc" d="M 24 100 A 76 76 0 1 1 176 100" fill="none" />
                {/* Curved Bottom Arch for E PLURIBUS UNUM • TEN DOLLARS */}
                <path id="tailsBottomArc" d="M 30 100 A 70 70 0 0 0 170 100" fill="none" />
              </defs>

              {/* Inner Rim Circle */}
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="rgba(254, 240, 138, 0.65)"
                strokeWidth="1.5"
                strokeDasharray="2.5 3.5"
              />

              {/* Center Medallion Plate */}
              <circle
                cx="100"
                cy="100"
                r="56"
                fill="url(#tailsCenterGrad)"
                stroke="rgba(120, 53, 15, 0.4)"
                strokeWidth="1.5"
              />
              <radialGradient id="tailsCenterGrad" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>

              {/* CURVED TEXT: UNITED STATES OF AMERICA */}
              <text
                fill="#FEF08A"
                fontSize="9.2"
                fontWeight="900"
                letterSpacing="1.8"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
              >
                <textPath
                  href="#tailsTopArc"
                  xlinkHref="#tailsTopArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  UNITED STATES OF AMERICA
                </textPath>
              </text>

              {/* CURVED TEXT: E PLURIBUS UNUM • TEN DOLLARS */}
              <text
                fill="#FEF08A"
                fontSize="8"
                fontWeight="900"
                letterSpacing="1.6"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
              >
                <textPath
                  href="#tailsBottomArc"
                  xlinkHref="#tailsBottomArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  • E PLURIBUS UNUM • TEN DOLLARS •
                </textPath>
              </text>

              {/* Center Majestic Eagle Emblem */}
              <g transform="translate(100, 88) scale(1.15)">
                <path
                  d="M0 -15 C-4 -12, -14 -8, -18 2 C-14 3, -8 4, -4 0 L-2 8 L0 5 L2 8 L4 0 C8 4, 14 3, 18 2 C14 -8, 4 -12, 0 -15 Z"
                  fill="#FEF08A"
                />
                <circle cx="0" cy="-10" r="4.5" fill="#FEF08A" />
                <path
                  d="M-7 9 L7 9 L5 13 L-5 13 Z"
                  fill="#FCD34D"
                />
              </g>

              {/* TAILS Label in center */}
              <text
                x="100"
                y="126"
                textAnchor="middle"
                fill="#FEF08A"
                fontSize="14"
                fontWeight="900"
                letterSpacing="2.5"
                fontFamily="serif"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                TAILS
              </text>
            </svg>
          </div>
        </div>
      </button>

      {/* Outcome Status Banner */}
      <div className="mt-2 text-center">
        <p
          data-testid="coin-status-text"
          className="text-xs font-black tracking-widest uppercase text-stone-500 transition-colors"
        >
          {isFlipping ? (
            <span className="inline-flex items-center gap-1.5 text-amber-600 font-extrabold animate-pulse">
              <span>●</span> Flipping in mid-air...
            </span>
          ) : (
            <span>
              Landed on <strong className="text-stone-900 font-black text-sm">{side.toUpperCase()}</strong>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
