import React from 'react';

export const SupremeCourtIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg bg-slate-900 ${className}`}>
      <svg
        viewBox="0 0 800 480"
        className="w-full h-auto object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="scSky" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="60%" stop-color="#CBD5E1" />
            <stop offset="100%" stop-color="#94A3B8" />
          </linearGradient>
          <linearGradient id="scWall" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
          <linearGradient id="scRoof" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#C53030" />
            <stop offset="100%" stop-color="#7B1113" />
          </linearGradient>
          <linearGradient id="scSteps" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#CBD5E1" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="800" height="480" fill="url(#scSky)" />

        {/* Ghana Flag on Top Mast */}
        <line x1="400" y1="60" x2="400" y2="120" stroke="#475569" strokeWidth="3" />
        <g transform="translate(400, 60)">
          <rect x="0" y="0" width="45" height="10" fill="#CE1126" />
          <rect x="0" y="10" width="45" height="10" fill="#FCD116" />
          <rect x="0" y="20" width="45" height="10" fill="#006B3F" />
          {/* Black Star */}
          <polygon points="22.5,12 25,18 31,18 26,22 28,28 22.5,24 17,28 19,22 14,18 20,18" fill="#000000" />
        </g>

        {/* Supreme Court Accra - Main Central Roof Pediment */}
        <polygon points="240,140 400,100 560,140" fill="url(#scRoof)" stroke="#5A1A1A" strokeWidth="2" />
        <rect x="230" y="138" width="340" height="10" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" />

        {/* Left & Right Wing Roofs */}
        <polygon points="100,170 240,140 240,170" fill="url(#scRoof)" />
        <polygon points="560,140 700,170 560,170" fill="url(#scRoof)" />
        <rect x="90" y="168" width="150" height="8" fill="#F8FAFC" />
        <rect x="560" y="168" width="150" height="8" fill="#F8FAFC" />

        {/* Main Central Colonist Building Facade */}
        <rect x="240" y="148" width="320" height="180" fill="url(#scWall)" stroke="#94A3B8" strokeWidth="1" />

        {/* Upper Arch Windows */}
        <g fill="#0F172A">
          <path d="M 270 170 A 10 10 0 0 1 290 170 L 290 190 L 270 190 Z" />
          <path d="M 315 170 A 10 10 0 0 1 335 170 L 335 190 L 315 190 Z" />
          <path d="M 360 170 A 10 10 0 0 1 380 170 L 380 190 L 360 190 Z" />
          <path d="M 420 170 A 10 10 0 0 1 440 170 L 440 190 L 420 190 Z" />
          <path d="M 465 170 A 10 10 0 0 1 485 170 L 485 190 L 465 190 Z" />
          <path d="M 510 170 A 10 10 0 0 1 530 170 L 530 190 L 510 190 Z" />
        </g>

        {/* Center Pillars (10 Classical Stately Columns) */}
        <g fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5">
          <rect x="252" y="148" width="14" height="180" />
          <rect x="284" y="148" width="14" height="180" />
          <rect x="316" y="148" width="14" height="180" />
          <rect x="348" y="148" width="14" height="180" />
          <rect x="380" y="148" width="14" height="180" />
          <rect x="406" y="148" width="14" height="180" />
          <rect x="438" y="148" width="14" height="180" />
          <rect x="470" y="148" width="14" height="180" />
          <rect x="502" y="148" width="14" height="180" />
          <rect x="534" y="148" width="14" height="180" />
        </g>

        {/* Left & Right Flanks */}
        <rect x="90" y="176" width="150" height="152" fill="url(#scWall)" stroke="#94A3B8" strokeWidth="1" />
        <rect x="560" y="176" width="150" height="152" fill="url(#scWall)" stroke="#94A3B8" strokeWidth="1" />

        {/* Flank Windows */}
        <g fill="#1E293B">
          <rect x="110" y="200" width="22" height="35" rx="2" />
          <rect x="150" y="200" width="22" height="35" rx="2" />
          <rect x="190" y="200" width="22" height="35" rx="2" />

          <rect x="110" y="255" width="22" height="45" rx="2" />
          <rect x="150" y="255" width="22" height="45" rx="2" />
          <rect x="190" y="255" width="22" height="45" rx="2" />

          <rect x="590" y="200" width="22" height="35" rx="2" />
          <rect x="630" y="200" width="22" height="35" rx="2" />
          <rect x="670" y="200" width="22" height="35" rx="2" />

          <rect x="590" y="255" width="22" height="45" rx="2" />
          <rect x="630" y="255" width="22" height="45" rx="2" />
          <rect x="670" y="255" width="22" height="45" rx="2" />
        </g>

        {/* Center Grand Entrance Portico & Inscription */}
        <rect x="375" y="250" width="50" height="78" fill="#0A1D3D" rx="2" />
        <path d="M 375 250 A 25 25 0 0 1 425 250 Z" fill="#0A1D3D" />

        {/* Grand Marble Steps */}
        <rect x="60" y="328" width="680" height="14" fill="url(#scSteps)" />
        <rect x="40" y="342" width="720" height="16" fill="url(#scSteps)" />
        <rect x="20" y="358" width="760" height="20" fill="url(#scSteps)" />
        <rect x="0" y="378" width="800" height="102" fill="#1E3A8A" opacity="0.95" />

        {/* Foreground Court Lawn & Trees */}
        <g fill="#166534">
          <ellipse cx="60" cy="360" rx="35" ry="50" />
          <ellipse cx="140" cy="370" rx="25" ry="35" />
          <ellipse cx="740" cy="360" rx="35" ry="50" />
          <ellipse cx="660" cy="370" rx="25" ry="35" />
        </g>
      </svg>
      {/* Overlay caption */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200 bg-slate-950/70 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-700/60">
        <span className="font-medium tracking-wide">Supreme Court Building & Law Court Complex · High Street, Accra</span>
        <span className="text-amber-400 font-semibold">Republic of Ghana</span>
      </div>
    </div>
  );
};
