import React from 'react';

// Castle silhouette in the twilight hills
export const FairytaleCastle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 280 180"
    className={`pointer-events-none select-none opacity-40 mix-blend-screen ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="castleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#7e22ce" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#3b0764" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    {/* Distant Hills */}
    <path d="M0 160 Q 90 120 180 145 T 280 140 L 280 180 L 0 180 Z" fill="#2d124d" opacity="0.7" />
    <path d="M60 160 Q 180 110 280 135 L 280 180 L 60 180 Z" fill="#1e0b36" opacity="0.9" />

    {/* Castle Spires & Towers */}
    <g fill="url(#castleGrad)">
      {/* Central Keep */}
      <rect x="180" y="70" width="36" height="70" />
      <polygon points="180,70 198,35 216,70" />
      {/* Tall Spire */}
      <rect x="202" y="55" width="20" height="85" />
      <polygon points="202,55 212,18 222,55" />
      <circle cx="212" cy="16" r="2" fill="#fbcfe8" />
      {/* Left Turret */}
      <rect x="160" y="85" width="22" height="55" />
      <polygon points="160,85 171,50 182,85" />
      {/* Right Turret */}
      <rect x="220" y="82" width="24" height="60" />
      <polygon points="220,82 232,45 244,82" />
      {/* Small Outer Turrets */}
      <rect x="145" y="105" width="16" height="38" />
      <polygon points="145,105 153,80 161,105" />
      <rect x="242" y="102" width="18" height="42" />
      <polygon points="242,102 251,75 260,102" />

      {/* Castle Windows */}
      <circle cx="198" cy="85" r="2.5" fill="#fef08a" opacity="0.9" />
      <circle cx="212" cy="70" r="2.5" fill="#fef08a" opacity="0.9" />
      <circle cx="232" cy="95" r="2" fill="#fef08a" opacity="0.9" />
    </g>
  </svg>
);

// Silhouette of the loving couple sitting under starry night
export const CoupleSilhouette: React.FC<{ className?: string; withHeartString?: boolean }> = ({
  className = '',
  withHeartString = false,
}) => (
  <svg
    viewBox="0 0 240 180"
    className={`pointer-events-none select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="coupleDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e0b36" />
        <stop offset="100%" stopColor="#0d0417" />
      </linearGradient>
    </defs>

    {/* Stone Balcony/Wall ledge */}
    <rect x="30" y="140" width="180" height="40" rx="3" fill="#130624" />
    <rect x="20" y="136" width="200" height="8" rx="2" fill="#240c3d" />

    {/* Boy Silhouette (Left) */}
    <g fill="url(#coupleDark)">
      {/* Head */}
      <circle cx="95" cy="78" r="14" />
      {/* Boy Hair Tufts */}
      <path d="M82 76 C80 62, 108 60, 108 72 C110 76, 106 82, 104 84 C100 80, 94 72, 82 76 Z" fill="#0d0417" />
      {/* Neck & Body */}
      <path d="M88 92 C82 96, 75 108, 76 140 L108 140 C108 120, 106 100, 98 92 Z" />
      {/* Arm resting on knees */}
      <path d="M78 112 C72 120, 74 135, 85 140" stroke="#0d0417" strokeWidth="6" strokeLinecap="round" />
    </g>

    {/* Girl Silhouette (Right, leaning slightly into boy) */}
    <g fill="url(#coupleDark)">
      {/* Head leaning */}
      <circle cx="125" cy="82" r="13" />
      {/* Girl Long Hair flowing down */}
      <path d="M112 80 C112 66, 138 66, 138 82 C142 98, 144 125, 140 140 L120 140 C120 120, 114 96, 112 80 Z" />
      {/* Body */}
      <path d="M116 95 C114 105, 118 120, 120 140 L145 140 C146 115, 135 98, 126 95 Z" />
    </g>

    {/* Optional Glowing Heart Thread */}
    {withHeartString && (
      <g>
        <path
          d="M 12 110 Q 50 135 85 105"
          fill="none"
          stroke="#f472b6"
          strokeWidth="1.8"
          strokeDasharray="3 3"
          opacity="0.8"
        />
        {/* Glowing Heart floating */}
        <path
          d="M 50 115 C 45 105, 30 112, 50 130 C 70 112, 55 105, 50 115 Z"
          fill="none"
          stroke="#f43f8e"
          strokeWidth="2"
          filter="drop-shadow(0 0 6px #f43f8e)"
        />
      </g>
    )}
  </svg>
);
