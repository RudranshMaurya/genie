import React from 'react';

export const AnanyaAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div
      className={`relative rounded-full p-[2px] bg-gradient-to-tr from-[#f43f8e] via-[#ec4899] to-[#fb7185] shadow-[0_0_15px_rgba(244,63,142,0.5)] shrink-0 ${sizeMap[size]} ${className}`}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#24123a] flex items-center justify-center">
        {/* Stylized Anime Girl Illustration */}
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d2314" />
              <stop offset="100%" stopColor="#24140b" />
            </linearGradient>
            <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff1e8" />
              <stop offset="100%" stopColor="#fed7c3" />
            </linearGradient>
            <linearGradient id="blush" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f43f8e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f8e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <rect width="100" height="100" fill="#2d1645" />
          <circle cx="50" cy="50" r="45" fill="#441a68" opacity="0.6" />

          {/* Long Hair Back */}
          <path d="M22 45 C15 70, 18 90, 28 100 L72 100 C82 90, 85 70, 78 45 Z" fill="url(#bgHair)" />

          {/* Neck & Shoulders */}
          <path d="M42 68 L58 68 L64 100 L36 100 Z" fill="url(#skin)" />
          {/* Lavender Top */}
          <path d="M30 84 C40 76, 60 76, 70 84 L76 100 L24 100 Z" fill="#7c3aed" opacity="0.9" />

          {/* Head */}
          <ellipse cx="50" cy="52" rx="22" ry="24" fill="url(#skin)" />

          {/* Soft Hair Strands & Bangs */}
          <path d="M28 42 C30 20, 70 20, 72 42 C74 48, 68 46, 62 44 C56 42, 50 48, 44 43 C38 48, 30 46, 28 42 Z" fill="url(#bgHair)" />
          <path d="M26 40 C22 55, 26 75, 32 82 C34 76, 32 60, 31 50 Z" fill="url(#bgHair)" />
          <path d="M74 40 C78 55, 74 75, 68 82 C66 76, 68 60, 69 50 Z" fill="url(#bgHair)" />

          {/* Blushing Cheeks */}
          <circle cx="38" cy="58" r="4" fill="#fb7185" opacity="0.6" />
          <circle cx="62" cy="58" r="4" fill="#fb7185" opacity="0.6" />

          {/* Gentle Anime Eyes */}
          <ellipse cx="40" cy="50" rx="3.5" ry="4.5" fill="#24140b" />
          <circle cx="39" cy="48" r="1.5" fill="#ffffff" />
          <ellipse cx="60" cy="50" rx="3.5" ry="4.5" fill="#24140b" />
          <circle cx="59" cy="48" r="1.5" fill="#ffffff" />

          {/* Soft Smile */}
          <path d="M46 62 Q50 66 54 62" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export const AdminAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div
      className={`relative rounded-full p-[2px] bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] shadow-[0_0_15px_rgba(99,102,241,0.5)] shrink-0 ${sizeMap[size]} ${className}`}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#16132e] flex items-center justify-center">
        {/* Stylized Anime Guy Illustration */}
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="boyHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1b2e" />
              <stop offset="100%" stopColor="#0f0e17" />
            </linearGradient>
            <linearGradient id="boySkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffeedd" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <rect width="100" height="100" fill="#1e1338" />
          <circle cx="50" cy="50" r="45" fill="#312056" opacity="0.7" />

          {/* Neck & Jacket */}
          <path d="M42 66 L58 66 L62 100 L38 100 Z" fill="url(#boySkin)" />
          <path d="M25 80 L50 90 L75 80 L80 100 L20 100 Z" fill="#2e1065" />
          <path d="M38 78 L50 96 L62 78" stroke="#a855f7" strokeWidth="2" fill="none" />

          {/* Head */}
          <polygon points="50,75 30,50 70,50" fill="url(#boySkin)" />
          <circle cx="50" cy="48" r="21" fill="url(#boySkin)" />

          {/* Anime Boy Hair */}
          <path d="M26 44 C24 24, 76 24, 74 44 C76 36, 68 34, 60 30 C54 36, 48 30, 42 36 C36 32, 28 36, 26 44 Z" fill="url(#boyHair)" />
          <path d="M32 32 L36 48 L44 34 L48 46 L54 33 L62 48 L68 36" fill="url(#boyHair)" />

          {/* Confident Eyes */}
          <path d="M36 48 Q42 46 45 49" stroke="#0f0e17" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="41" cy="52" r="2.5" fill="#0f0e17" />
          <path d="M55 49 Q58 46 64 48" stroke="#0f0e17" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="59" cy="52" r="2.5" fill="#0f0e17" />

          {/* Confident Smile */}
          <path d="M46 63 Q50 66 54 63" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Online indicator */}
      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#120826] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
    </div>
  );
};
