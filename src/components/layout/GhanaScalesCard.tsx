import React from 'react';

interface GhanaScalesCardProps {
  variant?: 'registry' | 'judge' | 'lawyer';
  className?: string;
}

export const GhanaScalesCard: React.FC<GhanaScalesCardProps> = ({
  variant = 'registry',
  className = '',
}) => {
  const content = {
    registry: {
      headline: 'Delivering Justice. Strengthening Trust.',
      subtext: 'Efficient, Transparent and Accountable Court Administration for a Stronger Ghana.',
    },
    judge: {
      headline: 'Upholding Justice. Delivering Impartiality.',
      subtext: 'Your decisions today shape the future of justice.',
    },
    lawyer: {
      headline: 'Upholding Justice. Delivering Impartiality.',
      subtext: 'Your commitment to justice drives a stronger Ghana.',
    },
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#091526] p-6 text-white border border-slate-800 shadow-sm flex flex-col justify-between ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Gold scales emblem */}
      <div className="flex items-center justify-center pt-2 pb-4">
        <div className="w-16 h-16 rounded-full bg-slate-800/60 border border-amber-500/30 flex items-center justify-center p-3 text-[#D4AF37] shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="4">
            {/* Scales of Justice */}
            <line x1="50" y1="15" x2="50" y2="85" strokeWidth="4" strokeLinecap="round" />
            <line x1="20" y1="28" x2="80" y2="28" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="18" r="4" fill="#D4AF37" />
            
            {/* Left Pan */}
            <line x1="20" y1="28" x2="10" y2="48" strokeWidth="2" />
            <line x1="20" y1="28" x2="30" y2="48" strokeWidth="2" />
            <path d="M 8 48 Q 20 60 32 48 Z" fill="#D4AF37" opacity="0.8" />
            
            {/* Right Pan */}
            <line x1="80" y1="28" x2="70" y2="48" strokeWidth="2" />
            <line x1="80" y1="28" x2="90" y2="48" strokeWidth="2" />
            <path d="M 68 48 Q 80 60 92 48 Z" fill="#D4AF37" opacity="0.8" />
            
            {/* Base */}
            <rect x="35" y="80" width="30" height="8" rx="2" fill="#D4AF37" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2 z-10">
        <h4 className="text-sm font-semibold tracking-wide text-amber-400 font-serif">
          {content.headline}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
          {content.subtext}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        <span>Judicial Service of Ghana · eJustice Core</span>
      </div>
    </div>
  );
};
