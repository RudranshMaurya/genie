import React, { useState, useEffect } from 'react';
import { LampIllustration } from './LampIllustration';
import { GenieCharacter } from './GenieCharacter';
import confetti from 'canvas-confetti';

interface OpeningExperienceProps {
  onComplete: () => void;
  userName?: string;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  onComplete,
  userName = 'Ananya',
}) => {
  const [stage, setStage] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [isIgniting, setIsIgniting] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => {
      setStage(1);
    }, 900);

    const t2 = setTimeout(() => {
      setStage(2);
    }, 2200);

    const t3 = setTimeout(() => {
      setStage(3);
    }, 3600);

    const t4 = setTimeout(() => {
      setStage(4);
      setSpeechText(`Well, well... look who's here!`);
    }, 4800);

    const t5 = setTimeout(() => {
      setSpeechText(`Welcome back, ${userName}. Have you brought a wish for me today?`);
    }, 6200);

    const t6 = setTimeout(() => {
      setShowButton(true);
    }, 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete, userName]);

  // If user taps the lamp early, awaken genie immediately
  const handleAwakenEarly = () => {
    if (stage < 4) {
      setStage(4);
      setSpeechText(`Welcome back, ${userName}! Have you brought a wish for me today?`);
      setShowButton(true);
    }
  };

  const handleMakeWishClick = () => {
    if (isIgniting) return;
    setIsIgniting(true);

    // Golden stardust confetti celebration (no audio chime)
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#ffe07a', '#f5c443', '#d4af37', '#93c5fd', '#ffffff'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 110,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#fef08a', '#60a5fa'],
        });
      }, 250);
    } catch {}

    // Smooth transition into the main sanctum
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none transition-all duration-700 ${
        isIgniting ? 'scale-110 opacity-0 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ background: '#040612' }}
    >
      {/* Golden Shockwave on Button Ignition */}
      {isIgniting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="w-96 h-96 rounded-full bg-radial from-[#ffe57f]/70 via-[#f5c443]/30 to-transparent animate-shockwave" />
        </div>
      )}

      {/* Atmospheric radial night nebula */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          stage >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at 50% 62%, #121c4b 0%, #080d24 50%, #03040a 100%)',
        }}
      />

      {/* Radiant golden sunburst bloom behind the lamp */}
      <div
        className={`absolute bottom-[25%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl transition-opacity duration-1000 pointer-events-none ${
          stage >= 1 ? 'opacity-50' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse, rgba(245,196,67,0.55) 0%, rgba(212,175,55,0.2) 45%, transparent 75%)',
        }}
      />

      {/* Scene content container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 text-center">
        {/* Genie Character */}
        <div
          className={`transition-all duration-1000 ease-out transform ${
            stage >= 3
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-12 scale-85 pointer-events-none'
          }`}
        >
          <GenieCharacter
            expression={isIgniting ? 'granting' : stage >= 4 ? 'speaking' : 'happy'}
            scale={1.05}
            isFloating
            showAura
          />
        </div>

        {/* Storybook speech parchment bubble */}
        <div
          className={`-mt-3 mb-4 w-full max-w-sm transition-all duration-700 transform ${
            stage >= 4 && speechText
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <div className="px-6 py-4 rounded-3xl bg-[#090f2b]/95 border border-[#d4af37]/35 shadow-[0_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-md relative">
            <p className="font-storybook text-base sm:text-lg text-[#fff3b0] italic leading-relaxed">
              "{speechText}"
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#090f2b] border-b border-r border-[#d4af37]/35 rotate-45" />
          </div>
        </div>

        {/* Antique Lamp with early-tap activation */}
        <div
          onClick={handleAwakenEarly}
          className={`transition-all duration-1000 ease-out cursor-pointer ${
            stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          } ${stage >= 3 ? '-mt-4' : 'mt-6'}`}
          title="Touch the lamp"
        >
          <LampIllustration
            size={stage >= 3 ? 'md' : 'lg'}
            isGlowing={stage >= 1}
            isAwakening={stage === 2}
            smokeActive={stage >= 2}
          />
        </div>

        {/* Flavour whispers before character appears */}
        {stage === 1 && (
          <p className="mt-5 font-storybook italic text-base text-[#f4ecd8]/60 animate-pulse">
            An ancient warmth stirs in the midnight dunes…
          </p>
        )}
        {stage === 2 && (
          <p className="mt-4 font-storybook italic text-lg text-[#f5c443] animate-pulse">
            The Golden Lamp awakens…
          </p>
        )}

        {/* THE ENCHANTED "MAKE A WISH" TALISMAN BUTTON (No clicking sound) */}
        <div
          className={`mt-7 relative flex items-center justify-center transition-all duration-700 ease-out transform ${
            showButton
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
          }`}
        >
          {/* Orbital Stardust Ring behind button */}
          <div className="absolute -inset-6 pointer-events-none flex items-center justify-center animate-orbit">
            <span className="absolute top-0 left-1/4 text-[#ffd700] text-sm opacity-80 filter drop-shadow-[0_0_6px_rgba(255,215,0,0.9)]">
              ✦
            </span>
            <span className="absolute bottom-1 right-1/4 text-[#ffe57f] text-xs opacity-70">
              ✧
            </span>
            <span className="absolute top-1/2 -left-2 text-[#f5c443] text-sm opacity-85">
              ✨
            </span>
            <span className="absolute top-1/3 -right-2 text-[#ffd700] text-xs opacity-90">
              ✦
            </span>
          </div>

          {/* Breathing Golden Halo / Sunburst Corona */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#ffe57f]/40 via-[#f5c443]/50 to-[#d4af37]/40 blur-xl animate-corona pointer-events-none" />

          {/* Main Button Body */}
          <button
            onClick={handleMakeWishClick}
            disabled={isIgniting}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 sm:px-12 sm:py-4.5 rounded-full overflow-hidden select-none cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_35px_rgba(245,196,67,0.55),0_0_50px_rgba(232,168,56,0.35)] hover:shadow-[0_15px_50px_rgba(245,196,67,0.85),0_0_80px_rgba(232,168,56,0.55)] border border-[#fff9d2]/60"
            style={{
              background: 'linear-gradient(135deg, #fff3b0 0%, #fcd34d 25%, #f59e0b 60%, #b45309 100%)',
            }}
          >
            {/* Animated Liquid Gold Beam Sweep */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none animate-shimmer" />

            {/* Left Rune Star */}
            <span className="relative z-10 text-[#451a03] font-bold text-lg group-hover:rotate-45 group-hover:scale-125 transition-transform duration-300">
              ✦
            </span>

            {/* Text Label */}
            <span className="relative z-10 font-fairytale text-sm sm:text-base tracking-[0.25em] font-extrabold text-[#3a1503] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
              MAKE A WISH
            </span>

            {/* Right Rune Sparkle */}
            <span className="relative z-10 text-[#451a03] font-bold text-lg group-hover:-rotate-45 group-hover:scale-125 transition-transform duration-300">
              ✨
            </span>
          </button>
        </div>

        {/* Gentle hint below button */}
        {showButton && (
          <p className="mt-3 text-[11px] font-storybook italic text-[#d4af37]/60 tracking-wider">
            Touch the golden seal to whisper your dream
          </p>
        )}
      </div>
    </div>
  );
};
