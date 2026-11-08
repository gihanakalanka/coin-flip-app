import React, { useState } from 'react';
import { Copy, Check, Download, Smartphone, Zap, Sparkles, Terminal } from 'lucide-react';

interface CodeViewerProps {
  code: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 text-stone-800">
      {/* Code Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-100 text-amber-900 border border-amber-200">
              Single-File Architecture
            </span>
            <span className="text-xs text-stone-500 font-mono">App.tsx • React Native & Expo</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 mt-1 tracking-tight">
            Production-Ready React Native Source Code
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            100% Native Animated API with 3D interpolation, zero external UI libraries needed.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-sm active:scale-95 bg-stone-900 text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY CODE'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download App.tsx"
            title="Download App.tsx"
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Animated API</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Uses <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">Animated.timing</code> with <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">useNativeDriver: true</code> for 60fps 3D flips on device UI threads.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>3-Streak Flashing</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Runs an <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">Animated.loop()</code> opacity cycle with tactile multi-burst vibration on streak milestones.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4" />
            <span>Expo Fast Start</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Run <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">npx create-expo-app</code>, paste this code into <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">App.tsx</code>, and launch!
          </p>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-xl border border-stone-800 text-stone-100">
        <div className="flex items-center justify-between px-4 py-3 bg-stone-950/70 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-stone-400 ml-2">App.tsx (React Native + Expo)</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 max-h-[550px] overflow-auto font-mono text-xs leading-relaxed selection:bg-amber-500/30">
          <pre className="text-stone-300">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
