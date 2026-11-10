import React, { useState, useRef } from 'react';

interface LampIllustrationProps {
  isGlowing?: boolean;
  isAwakening?: boolean;
  smokeActive?: boolean;
  onClick?: () => void;
  onRub?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  canRub?: boolean;
}

export const LampIllustration: React.FC<LampIllustrationProps> = ({
  isGlowing = true,
  isAwakening = false,
  smokeActive = false,
  onClick,
  onRub,
  className = '',
  size = 'md',
  canRub = false,
}) => {
  const [rubCount, setRubCount] = useState(0);
  const [isRubbing, setIsRubbing] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'w-36 h-28',
    md: 'w-64 h-48',
    lg: 'w-80 h-60 sm:w-96 sm:h-72',
  }[size];

  // Helper to spawn friction sparks during rubbing
  const spawnSpark = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newSpark = { id: Date.now() + Math.random(), x, y };
    setSparks((prev) => [...prev.slice(-8), newSpark]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
    }, 600);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canRub && !onClick) return;
    setIsRubbing(true);
    spawnSpark(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isRubbing || !canRub) return;
    spawnSpark(e.clientX, e.clientY);

    setRubCount((prev) => {
      const next = prev + 1;
      // After rubbing ~6 movement ticks, awaken the genie!
      if (next >= 6) {
        if (onRub) onRub();
        else if (onClick) onClick();
        return 0;
      }
      return next;
    });
  };

  const handlePointerUp = () => {
    setIsRubbing(false);
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative inline-block cursor-pointer select-none transition-all duration-500 touch-none ${sizeClasses} ${className}`}
      title={canRub ? 'Rub or tap the golden lamp to awaken your Genie' : 'The Golden Lamp'}
    >
      {/* Radiant God Rays / Celestial Bloom behind the lamp */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-1000 blur-2xl pointer-events-none ${
          isGlowing || isAwakening || isRubbing ? 'opacity-90 scale-105' : 'opacity-30'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(245,196,67,0.55) 0%, rgba(212,175,55,0.25) 50%, transparent 75%)',
        }}
      />

      {/* Dynamic Friction Sparks during rubbing */}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="absolute pointer-events-none text-[#ffd700] text-sm animate-ping filter drop-shadow-[0_0_8px_rgba(255,215,0,0.9)]"
          style={{ left: spark.x, top: spark.y }}
        >
          ✦
        </span>
      ))}

      {/* Magical smoke wisps and stardust rising from spout */}
      {smokeActive && (
        <div className="absolute top-2 left-4 sm:left-8 pointer-events-none z-20">
          <div className="relative">
            {/* Swirling Smoke Rings */}
            <div
              className="absolute -top-14 -left-8 w-20 h-20 rounded-full blur-md opacity-70 animate-ping"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,236,160,0.85), rgba(212,175,55,0.3), transparent)',
                animationDuration: '2.4s',
              }}
            />
            <div
              className="absolute -top-28 -left-14 w-32 h-32 rounded-full blur-xl opacity-60 animate-pulse"
              style={{
                background:
                  'radial-gradient(circle, rgba(147,197,253,0.55), rgba(212,175,55,0.35), transparent)',
                animationDuration: '2.8s',
              }}
            />
            {/* Star sparkles */}
            <span className="absolute -top-16 left-3 text-[#ffd700] text-xl animate-bounce select-none drop-shadow-[0_0_8px_rgba(255,215,0,0.9)]">
              ✦
            </span>
            <span className="absolute -top-28 -left-4 text-[#ffe57f] text-sm animate-pulse select-none">
              ✧
            </span>
            <span className="absolute -top-20 -left-10 text-[#f5c443] text-sm animate-ping select-none">
              ✨
            </span>
          </div>
        </div>
      )}

      {/* SVG Handcrafted Antique Arabian Lamp */}
      <svg
        viewBox="0 0 320 220"
        className={`w-full h-full filter ${
          isGlowing || isRubbing
            ? 'drop-shadow-[0_0_30px_rgba(245,196,67,0.8)]'
            : 'drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
        } transition-transform duration-300 hover:scale-105 active:scale-95 ${
          isAwakening || isRubbing ? 'animate-bounce' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rich Polished Gold Gradient */}
          <linearGradient id="goldBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="25%" stopColor="#f5c443" />
            <stop offset="55%" stopColor="#d4af37" />
            <stop offset="85%" stopColor="#966a12" />
            <stop offset="100%" stopColor="#4a3407" />
          </linearGradient>

          {/* Golden Highlights */}
          <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffd24d" stopOpacity="0" />
          </linearGradient>

          {/* Deep Shadow Gradient */}
          <linearGradient id="goldShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#573e0c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#241701" stopOpacity="0.9" />
          </linearGradient>

          {/* Spout Glow Radial */}
          <radialGradient id="spoutFlame" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#ffe680" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Ornate Pedestal / Stand Base */}
        <ellipse cx="160" cy="204" rx="72" ry="12" fill="#04060f" opacity="0.6" />
        <ellipse cx="160" cy="200" rx="60" ry="9" fill="url(#goldShadow)" />
        <path
          d="M110 200 C110 190, 130 185, 145 180 L175 180 C190 185, 210 190, 210 200 Z"
          fill="url(#goldBody)"
          stroke="#4a3407"
          strokeWidth="1.5"
        />
        {/* Pedestal filigree beads */}
        <circle cx="135" cy="192" r="2.5" fill="#fff3b0" />
        <circle cx="147" cy="190" r="2.5" fill="#fff3b0" />
        <circle cx="160" cy="189" r="3" fill="#ffffff" />
        <circle cx="173" cy="190" r="2.5" fill="#fff3b0" />
        <circle cx="185" cy="192" r="2.5" fill="#fff3b0" />

        {/* Stem of the Lamp */}
        <path
          d="M148 180 C146 166, 149 155, 150 148 L170 148 C171 155, 174 166, 172 180 Z"
          fill="url(#goldBody)"
          stroke="#573e0c"
          strokeWidth="1"
        />

        {/* Main Voluptuous Lamp Body */}
        <path
          d="M90 125 C65 110, 48 95, 30 75 C42 85, 60 98, 85 106 C110 115, 125 118, 160 118 C205 118, 235 102, 248 122 C255 135, 245 152, 220 156 C190 162, 130 162, 90 125 Z"
          fill="url(#goldBody)"
          stroke="#3d2902"
          strokeWidth="2"
        />

        {/* Ornate Swirling Handle */}
        <path
          d="M242 120 C272 105, 290 85, 282 62 C274 42, 252 45, 240 60 C234 68, 235 78, 242 84 C250 91, 260 88, 263 80 C265 74, 258 70, 254 74 C262 70, 270 78, 268 90 C265 105, 246 126, 232 136 Z"
          fill="url(#goldBody)"
          stroke="#4a3407"
          strokeWidth="1.5"
        />

        {/* Lamp Lid & Ruby Finial */}
        <path
          d="M145 118 C145 108, 152 100, 160 100 C168 100, 175 108, 175 118 Z"
          fill="url(#goldBody)"
          stroke="#573e0c"
          strokeWidth="1.5"
        />
        {/* Glowing Ruby on top of lid */}
        <circle cx="160" cy="96" r="4.5" fill="#e11d48" stroke="#fecdd3" strokeWidth="1" />
        <ellipse cx="158.5" cy="94.5" rx="1.5" ry="1" fill="#ffffff" />

        {/* Long Curved Spout */}
        <path
          d="M90 125 C75 118, 52 102, 34 82 C28 75, 23 68, 20 60 C23 62, 28 66, 38 68 C48 70, 60 76, 75 92 Z"
          fill="url(#goldBody)"
          stroke="#3d2902"
          strokeWidth="1.5"
        />

        {/* Spout Tip / Mouth with Magical Flame Light */}
        <ellipse cx="20" cy="60" rx="4.5" ry="3" fill="#ffe57f" stroke="#d4af37" strokeWidth="1" />
        <circle
          cx="19"
          cy="58"
          r="8"
          fill="url(#spoutFlame)"
          className={isGlowing || isRubbing ? 'animate-pulse' : ''}
        />

        {/* Handcrafted Engravings on Lamp belly */}
        <path
          d="M125 136 Q160 146 195 136"
          fill="none"
          stroke="#573e0c"
          strokeWidth="1.5"
          strokeDasharray="2,3"
        />
        <path
          d="M135 144 Q160 152 185 144"
          fill="none"
          stroke="#ffe680"
          strokeWidth="1"
        />
        {/* Filigree Star Center */}
        <text
          x="160"
          y="138"
          textAnchor="middle"
          fontSize="10"
          fill="#fff3b0"
          fontFamily="Cinzel, serif"
          opacity="0.85"
        >
          ✦
        </text>

        {/* Glossy Upper Light Reflection Curve */}
        <path
          d="M100 112 C125 118, 195 118, 220 110 C205 106, 135 106, 100 112 Z"
          fill="url(#goldHighlight)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};
