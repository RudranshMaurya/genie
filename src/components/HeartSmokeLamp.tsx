import React, { useState, useRef } from 'react';

interface HeartSmokeLampProps {
  onRub?: () => void;
  onClick?: () => void;
  isAwakening?: boolean;
  className?: string;
}

export const HeartSmokeLamp: React.FC<HeartSmokeLampProps> = ({
  onRub,
  onClick,
  isAwakening = false,
  className = '',
}) => {
  const [rubCount, setRubCount] = useState(0);
  const [isRubbing, setIsRubbing] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnSpark = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newSpark = { id: Date.now() + Math.random(), x, y };
    setSparks((prev) => [...prev.slice(-6), newSpark]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
    }, 600);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsRubbing(true);
    spawnSpark(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isRubbing) return;
    spawnSpark(e.clientX, e.clientY);

    setRubCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
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
      className={`relative w-full max-w-[320px] sm:max-w-[360px] h-[210px] sm:h-[240px] mx-auto select-none cursor-pointer touch-none ${className}`}
      title="Rub or tap the golden lamp to awaken your Genie"
    >
      {/* Background Soft Glow Nebula */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f43f8e]/15 via-[#a855f7]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Dynamic Friction Sparks */}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="absolute pointer-events-none text-[#ffe07a] text-sm animate-ping filter drop-shadow-[0_0_8px_rgba(255,224,122,0.9)] z-40"
          style={{ left: spark.x, top: spark.y }}
        >
          ✦
        </span>
      ))}

      {/* SVG Master Illustration: Crescent Moon, Heart Smoke & Golden Lamp on Pedestal */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Lamp Gold Gradients */}
          <linearGradient id="lampGoldBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2a8" />
            <stop offset="25%" stopColor="#f5c443" />
            <stop offset="65%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#7a4607" />
          </linearGradient>

          <linearGradient id="lampHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffe794" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>

          {/* Pedestal Stone Gradient */}
          <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#532e6b" />
            <stop offset="50%" stopColor="#32174d" />
            <stop offset="100%" stopColor="#1a0a2a" />
          </linearGradient>

          {/* Heart Smoke Glow Gradient */}
          <linearGradient id="smokeHeartGrad" x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#f43f8e" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.95" />
          </linearGradient>

          {/* Moonlight glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#fed7aa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f8e" stopOpacity="0" />
          </radialGradient>

          {/* Smoke Blur Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. CRESCENT MOON IN UPPER RIGHT */}
        <g opacity="0.85" className="animate-pulse" style={{ animationDuration: '4s' }}>
          <path
            d="M330 35 C325 50, 335 68, 352 74 C342 78, 326 73, 320 60 C314 48, 318 38, 330 35 Z"
            fill="#fff3cd"
            filter="drop-shadow(0 0 10px rgba(254, 215, 170, 0.7))"
          />
        </g>

        {/* 2. CHERRY BLOSSOM PETALS FLOATING */}
        <g opacity="0.6">
          <ellipse cx="60" cy="50" rx="4" ry="2.5" fill="#f472b6" transform="rotate(25 60 50)" />
          <ellipse cx="90" cy="85" rx="3" ry="2" fill="#f43f8e" transform="rotate(-30 90 85)" />
          <ellipse cx="320" cy="110" rx="3.5" ry="2.2" fill="#f472b6" transform="rotate(45 320 110)" />
          <ellipse cx="340" cy="80" rx="4" ry="2.5" fill="#fbb6ce" transform="rotate(-15 340 80)" />
        </g>

        {/* 3. MAGICAL HEART SMOKE RISING FROM LAMP SPOUT */}
        {/* Glow halo behind smoke */}
        <path
          d="M 165 195 
             C 150 160, 130 140, 145 105
             C 155 80, 175 60, 200 80
             C 215 92, 215 108, 200 125
             C 180 145, 150 165, 165 195 Z"
          fill="none"
          stroke="url(#smokeHeartGrad)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
          filter="url(#superGlow)"
        />

        {/* Outer and Inner Heart Ribbons */}
        <path
          d="M 165 195 
             C 140 165, 115 135, 125 95 
             C 133 65, 165 52, 195 76 
             C 202 82, 206 82, 213 76
             C 243 52, 275 65, 283 95
             C 292 132, 260 165, 204 200
             C 185 212, 175 205, 165 195 Z"
          fill="none"
          stroke="url(#smokeHeartGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity={isAwakening || isRubbing ? '1' : '0.85'}
          filter="url(#softGlow)"
          className="transition-all duration-500"
        />

        {/* Swirling Heart Smoke Highlights & Core Stardust Trail */}
        <path
          d="M 167 195
             C 145 168, 128 142, 136 105
             C 142 80, 168 70, 195 90
             C 202 95, 206 95, 213 90
             C 240 70, 266 80, 272 105
             C 278 135, 252 165, 204 195"
          fill="none"
          stroke="#fff0f5"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
          filter="drop-shadow(0 0 6px #ff77b4)"
        />

        {/* Delicate Stardust Dots around Heart */}
        <circle cx="204" cy="84" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #f43f8e)" />
        <circle cx="160" cy="68" r="1.5" fill="#fde047" />
        <circle cx="248" cy="68" r="1.5" fill="#fde047" />
        <circle cx="130" cy="120" r="1.8" fill="#ffffff" />
        <circle cx="278" cy="120" r="1.8" fill="#ffffff" />
        <circle cx="204" cy="145" r="2.2" fill="#ffe07a" filter="drop-shadow(0 0 5px #ffd166)" />

        {/* 4. STONE PEDESTAL AT BASE */}
        <g id="pedestal">
          {/* Pedestal Bottom Base */}
          <ellipse cx="200" cy="275" rx="110" ry="18" fill="#180b26" opacity="0.9" />
          <path
            d="M 100 255 C 100 245, 300 245, 300 255 L 290 270 C 290 280, 110 280, 110 270 Z"
            fill="url(#pedestalGrad)"
            opacity="0.95"
          />
          {/* Pedestal Top Rim */}
          <ellipse cx="200" cy="254" rx="98" ry="15" fill="#44215d" stroke="#f472b6" strokeWidth="0.8" opacity="0.9" />
          <ellipse cx="200" cy="252" rx="94" ry="13" fill="#2d1342" />
        </g>

        {/* 5. HANDCRAFTED ANTIQUE GOLD ARABIAN LAMP */}
        <g
          id="lamp"
          className={`transition-transform duration-300 ${
            isRubbing ? 'scale-105' : 'hover:scale-[1.02]'
          }`}
          style={{ transformOrigin: '200px 220px' }}
        >
          {/* Soft Golden Lamp Glow */}
          <ellipse
            cx="200"
            cy="225"
            rx="75"
            ry="25"
            fill="#d4af37"
            opacity={isRubbing ? '0.45' : '0.25'}
            filter="url(#superGlow)"
          />

          {/* Lamp Stand / Foot */}
          <ellipse cx="200" cy="242" rx="28" ry="7" fill="url(#lampGoldBody)" stroke="#fef08a" strokeWidth="0.5" />
          <path d="M 188 238 L 194 228 L 206 228 L 212 238 Z" fill="url(#lampGoldBody)" />

          {/* Lamp Main Body (Teardrop Vessel) */}
          <path
            d="M 155 220
               C 150 205, 170 195, 200 195
               C 230 195, 250 205, 245 220
               C 240 234, 160 234, 155 220 Z"
            fill="url(#lampGoldBody)"
            stroke="#fef08a"
            strokeWidth="0.8"
          />

          {/* Lamp Belly Golden Emboss Rings */}
          <path
            d="M 164 218 Q 200 228 236 218"
            stroke="#5c3405"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M 166 219 Q 200 229 234 219"
            stroke="#fff2a8"
            strokeWidth="1"
            fill="none"
            opacity="0.85"
          />

          {/* Spout Curving Upward towards Heart Smoke */}
          <path
            d="M 160 212
               C 145 208, 138 200, 142 195
               C 145 190, 160 194, 168 196
               C 174 198, 178 205, 170 212 Z"
            fill="url(#lampGoldBody)"
            stroke="#fef08a"
            strokeWidth="0.6"
          />
          {/* Spout Tip Opening */}
          <ellipse cx="145" cy="194" rx="4" ry="2.5" fill="#451a03" stroke="#fef08a" strokeWidth="0.8" />

          {/* Spout Glow Emitter */}
          <circle cx="145" cy="194" r="5" fill="#f43f8e" opacity="0.6" filter="url(#softGlow)" />

          {/* Lamp Handle (Graceful Ornate S-Loop) */}
          <path
            d="M 240 210
               C 260 205, 272 215, 268 228
               C 264 238, 248 236, 238 230
               C 244 232, 256 230, 258 225
               C 260 218, 252 214, 238 215 Z"
            fill="url(#lampGoldBody)"
            stroke="#fef08a"
            strokeWidth="0.8"
          />

          {/* Lamp Lid & Finial */}
          <ellipse cx="200" cy="196" rx="16" ry="5" fill="url(#lampGoldBody)" stroke="#fef08a" strokeWidth="0.5" />
          <path d="M 197 194 L 200 186 L 203 194 Z" fill="#ffd166" />
          <circle cx="200" cy="186" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ffd166)" />

          {/* Shimmer Highlight across Belly */}
          <ellipse
            cx="195"
            cy="210"
            rx="20"
            ry="6"
            fill="url(#lampHighlight)"
            transform="rotate(-5 195 210)"
          />
        </g>
      </svg>
    </div>
  );
};
