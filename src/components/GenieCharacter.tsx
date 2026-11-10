import React from 'react';

interface GenieCharacterProps {
  expression?: 'happy' | 'listening' | 'speaking' | 'granting' | 'surprised';
  speakingText?: string;
  isFloating?: boolean;
  isRolling?: boolean;
  isEmerging?: boolean;
  scale?: number;
  className?: string;
  showAura?: boolean;
  onClick?: () => void;
}

export const GenieCharacter: React.FC<GenieCharacterProps> = ({
  expression = 'happy',
  speakingText,
  isFloating = true,
  isRolling = false,
  isEmerging = false,
  scale = 1,
  className = '',
  showAura = true,
  onClick,
}) => {
  const animationClass = isEmerging
    ? 'animate-genie-emerge'
    : isRolling
    ? 'animate-genie-roll'
    : isFloating
    ? 'animate-float'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer will-change-transform ${animationClass} ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Soft ethereal magical mist aura around character */}
      {showAura && (
        <div
          className="absolute -inset-10 rounded-full blur-3xl pointer-events-none opacity-70 animate-corona"
          style={{
            background:
              'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, rgba(212, 175, 55, 0.3) 45%, transparent 75%)',
          }}
        />
      )}

      {/* Floating Dialogue Speech Bubble if text is provided */}
      {speakingText && (
        <div className="mb-3 max-w-sm px-6 py-3.5 rounded-2xl bg-[#0b1029]/95 border border-[#d4af37]/40 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-md relative z-30 transition-all duration-300">
          <p className="font-storybook text-base sm:text-lg text-[#fff3b0] leading-snug tracking-wide text-center italic">
            "{speakingText}"
          </p>
          {/* Decorative speech arrow pointing down to genie */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0b1029] border-b border-r border-[#d4af37]/40 rotate-45" />
        </div>
      )}

      {/* Character Illustration SVG */}
      <svg
        viewBox="0 0 280 340"
        className="w-56 h-68 sm:w-64 sm:h-80 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] z-20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Genie Skin Gradient (Deep sapphire to iridescent azure mist) */}
          <linearGradient id="genieSkin" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="35%" stopColor="#60a5fa" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Lower Smoke Tail Gradient */}
          <linearGradient id="smokeTail" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#f5c443" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f5c443" stopOpacity="0" />
          </linearGradient>

          {/* Golden Vest & Ornaments */}
          <linearGradient id="vestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="30%" stopColor="#f5c443" />
            <stop offset="70%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Royal Violet Fabric */}
          <linearGradient id="royalSilk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="60%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#2e1065" />
          </linearGradient>

          {/* Eye Sparkle */}
          <radialGradient id="eyeGlint" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>

        {/* Lower body mystical smoke tail transitioning downwards */}
        <path
          d="M100 200 C80 230, 160 250, 140 280 C125 305, 155 320, 140 340 C135 325, 95 305, 110 270 C120 245, 60 230, 80 200 Z"
          fill="url(#smokeTail)"
          className="animate-pulse"
        />

        {/* Floating stardust embers rising from the smoke tail */}
        <circle cx="95" cy="245" r="2" fill="#ffe57f" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="155" cy="270" r="1.5" fill="#f5c443" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        <circle cx="130" cy="305" r="2.5" fill="#ffd700" className="animate-ping" style={{ animationDuration: '3.8s' }} />

        {/* Waist Sash & Golden Belt */}
        <ellipse cx="140" cy="202" rx="34" ry="12" fill="url(#vestGold)" />
        <ellipse cx="140" cy="202" rx="30" ry="8" fill="url(#royalSilk)" />
        <circle cx="140" cy="202" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />

        {/* Torso */}
        <path
          d="M95 130 C95 120, 110 115, 140 115 C170 115, 185 120, 185 130 C185 160, 175 200, 140 200 C105 200, 95 160, 95 130 Z"
          fill="url(#genieSkin)"
        />

        {/* Royal Embroidered Vest */}
        {/* Left Side Vest */}
        <path
          d="M96 128 C98 150, 105 185, 128 196 C115 170, 115 140, 126 126 Z"
          fill="url(#royalSilk)"
          stroke="url(#vestGold)"
          strokeWidth="2.5"
        />
        {/* Right Side Vest */}
        <path
          d="M184 128 C182 150, 175 185, 152 196 C165 170, 165 140, 154 126 Z"
          fill="url(#royalSilk)"
          stroke="url(#vestGold)"
          strokeWidth="2.5"
        />

        {/* Golden Cuffs on wrists / arms */}
        {/* Left Arm folded warmly */}
        <path
          d="M96 135 C70 145, 60 170, 78 185 C90 195, 105 188, 112 180"
          fill="none"
          stroke="url(#genieSkin)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <rect
          x="66"
          y="160"
          width="12"
          height="16"
          rx="3"
          transform="rotate(25 66 160)"
          fill="url(#vestGold)"
          stroke="#78350f"
          strokeWidth="1"
        />

        {/* Right Arm waving or gesturing welcomingly */}
        {expression === 'granting' ? (
          <path
            d="M180 135 C205 120, 225 100, 230 75"
            fill="none"
            stroke="url(#genieSkin)"
            strokeWidth="16"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M180 135 C205 145, 218 165, 205 185 C192 195, 175 188, 168 180"
            fill="none"
            stroke="url(#genieSkin)"
            strokeWidth="16"
            strokeLinecap="round"
          />
        )}
        <rect
          x="198"
          y="160"
          width="12"
          height="16"
          rx="3"
          transform="rotate(-25 198 160)"
          fill="url(#vestGold)"
          stroke="#78350f"
          strokeWidth="1"
        />

        {/* Neck */}
        <path d="M130 110 L130 120 L150 120 L150 110 Z" fill="url(#genieSkin)" />
        {/* Golden Torque Necklace with Glowing Sapphire */}
        <path d="M125 118 Q140 128 155 118" fill="none" stroke="url(#vestGold)" strokeWidth="3" />
        <circle cx="140" cy="125" r="3.5" fill="#38bdf8" stroke="#fff" strokeWidth="0.8" />

        {/* Head */}
        <path
          d="M108 75 C108 50, 120 40, 140 40 C160 40, 172 50, 172 75 C172 98, 160 112, 140 112 C120 112, 108 98, 108 75 Z"
          fill="url(#genieSkin)"
        />

        {/* Whimsical Genie Topknot Hair swirl */}
        <path
          d="M136 40 C134 25, 142 12, 148 5 C153 15, 150 28, 144 40 Z"
          fill="#1e1b4b"
        />
        <circle cx="140" cy="38" r="5" fill="url(#vestGold)" />

        {/* Elven Ornate Genie Ears */}
        {/* Left Ear */}
        <path
          d="M109 68 C96 60, 92 50, 90 44 C95 55, 102 65, 109 76 Z"
          fill="url(#genieSkin)"
          stroke="#1e3a8a"
          strokeWidth="1"
        />
        <circle cx="95" cy="62" r="3.5" fill="none" stroke="url(#vestGold)" strokeWidth="1.5" />

        {/* Right Ear */}
        <path
          d="M171 68 C184 60, 188 50, 190 44 C185 55, 178 65, 171 76 Z"
          fill="url(#genieSkin)"
          stroke="#1e3a8a"
          strokeWidth="1"
        />

        {/* Friendly Expressive Eyebrows */}
        <path
          d={expression === 'listening' ? "M118 56 Q127 50 134 54" : "M118 60 Q127 54 134 58"}
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d={expression === 'listening' ? "M146 54 Q153 50 162 56" : "M146 58 Q153 54 162 60"}
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Eyes with Natural Blinking and Warm Sparkle */}
        <g className="animate-blink">
          {/* Left Eye */}
          <ellipse cx="126" cy="68" rx="6" ry="7" fill="#ffffff" />
          <ellipse cx="127" cy="68" rx="4" ry="4.5" fill="url(#eyeGlint)" />
          <circle cx="128" cy="66" r="1.5" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="154" cy="68" rx="6" ry="7" fill="#ffffff" />
          <ellipse cx="153" cy="68" rx="4" ry="4.5" fill="url(#eyeGlint)" />
          <circle cx="154" cy="66" r="1.5" fill="#ffffff" />
        </g>

        {/* Cheeks with Warm Rose Glow */}
        <circle cx="118" cy="78" r="5" fill="#f43f5e" opacity="0.35" />
        <circle cx="162" cy="78" r="5" fill="#f43f5e" opacity="0.35" />

        {/* Nose */}
        <path
          d="M138 70 Q142 77 139 80 Q143 80 144 76"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Friendly Genie Smile / Beard */}
        {expression === 'speaking' ? (
          <path
            d="M132 86 Q140 98 148 86 Z"
            fill="#450a0a"
            stroke="#1e1b4b"
            strokeWidth="1.5"
          />
        ) : (
          <path
            d="M130 86 Q140 96 150 86"
            fill="none"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Whimsical Curled Goatee Beard */}
        <path
          d="M138 98 Q140 108 143 112 Q147 114 148 108"
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Magic Sparkle on gesturing hand if granting */}
        {expression === 'granting' && (
          <g className="animate-spin origin-[230px_75px]">
            <text x="230" y="75" fontSize="22" fill="#ffd700" textAnchor="middle">
              ✨
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
