import React, { useState, useEffect, useRef } from 'react';
import type { Wish, WishStatus } from '../types';

interface WishDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishes: Wish[];
  onOpenWhisper?: () => void;
}

type TabType = 'all' | 'pending' | 'granted';

function statusMeta(status: WishStatus) {
  switch (status) {
    case 'WISH GRANTED':
      return {
        badge: 'Completed',
        pillBg: 'bg-purple-950/80 border-purple-400/40 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
        dot: 'bg-purple-400',
        cardGlow: 'hover:border-purple-500/60 hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)]',
        icon: '👑',
        textColor: 'text-purple-100',
      };
    case 'MAGIC IN PROGRESS':
    case 'COMING SOON':
      return {
        badge: 'Approved',
        pillBg: 'bg-emerald-950/80 border-emerald-400/40 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
        dot: 'bg-emerald-400 animate-pulse',
        cardGlow: 'hover:border-emerald-500/60 hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)]',
        icon: '💕',
        textColor: 'text-emerald-100',
      };
    case 'ON HOLD':
      return {
        badge: 'On Hold',
        pillBg: 'bg-rose-950/80 border-rose-500/40 text-rose-200',
        dot: 'bg-rose-400',
        cardGlow: 'hover:border-rose-500/50',
        icon: '⏸',
        textColor: 'text-rose-200',
      };
    case 'UNDER CONSIDERATION':
    case 'WISH RECEIVED':
    default:
      return {
        badge: 'Pending',
        pillBg: 'bg-amber-950/80 border-amber-400/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        dot: 'bg-amber-400',
        cardGlow: 'hover:border-amber-500/60',
        icon: '✦',
        textColor: 'text-[#fff4d0]',
      };
  }
}

export const WishDrawer: React.FC<WishDrawerProps> = ({
  isOpen,
  onClose,
  wishes,
  onOpenWhisper,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<TabType>('all');

  // Close on outside overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const grantedWishes = wishes.filter((w) => w.status === 'WISH GRANTED');
  const pendingWishes = wishes.filter((w) => w.status !== 'WISH GRANTED');

  const displayedWishes =
    tab === 'granted' ? grantedWishes : tab === 'pending' ? pendingWishes : wishes;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: isOpen ? 'rgba(10, 2, 20, 0.82)' : 'transparent',
        backdropFilter: isOpen ? 'blur(12px)' : 'none',
      }}
    >
      {/* Sliding Luxury Storybook Vault Cart Panel */}
      <div
        className={`relative w-full max-w-md h-full bg-gradient-to-b from-[#1b0a33] via-[#140626] to-[#0d031a] border-l border-pink-400/25 flex flex-col overflow-hidden transition-transform duration-500 ease-out shadow-[-20px_0_60px_rgba(0,0,0,0.9),-5px_0_25px_rgba(244,63,142,0.18)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Soft Pink Header Aura */}
        <div
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(244,63,142,0.2) 0%, rgba(168,85,247,0.08) 55%, transparent 80%)',
          }}
        />

        {/* Top Header Bar */}
        <div className="relative z-10 px-6 pt-7 pb-4 border-b border-pink-400/20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Glowing Lamp Seal Emblem */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2a1147] via-[#3b175e] to-[#581c87] border border-pink-400/40 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(244,63,142,0.35)]">
                🪔
              </div>
              <span className="absolute -top-1 -right-1 text-pink-300 text-xs animate-ping">
                ✦
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-script text-2xl text-pink-100 tracking-wide drop-shadow-[0_0_10px_rgba(244,63,142,0.5)]">
                  The Wish Vault ♡
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#ffd166] to-[#f43f8e] text-[#120826] font-extrabold shadow-[0_0_10px_rgba(244,63,142,0.4)]">
                  {wishes.length}
                </span>
              </div>
              <p className="font-handwriting text-xs text-pink-300/80 mt-0.5">
                {wishes.length === 0
                  ? "Ananya's Enchanted Archive of Dreams"
                  : `${pendingWishes.length} waiting to happen · ${grantedWishes.length} fulfilled`}
              </p>
            </div>
          </div>

          {/* Close Talisman Button */}
          <button
            onClick={onClose}
            className="group w-9 h-9 rounded-full border border-pink-400/30 hover:border-pink-300 bg-pink-500/10 hover:bg-pink-500/20 flex items-center justify-center text-pink-300 hover:text-white transition-all shadow-sm cursor-pointer"
            aria-label="Close vault"
          >
            <span className="text-sm group-hover:rotate-90 transition-transform duration-300">
              ✕
            </span>
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="relative z-10 px-6 py-3 flex items-center gap-2 border-b border-pink-400/15 bg-[#120524]/80 backdrop-blur-sm">
          <button
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all font-semibold flex items-center gap-1.5 ${
              tab === 'all'
                ? 'bg-gradient-to-r from-[#ffd166] via-[#f43f8e] to-[#c084fc] text-[#120826] font-bold shadow-[0_0_15px_rgba(244,63,142,0.5)] scale-105'
                : 'text-pink-200/70 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <span>All Wishes</span>
            <span className="text-[10px] opacity-80 font-bold">({wishes.length})</span>
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all font-semibold flex items-center gap-1.5 ${
              tab === 'pending'
                ? 'bg-gradient-to-r from-[#ffd166] via-[#f43f8e] to-[#c084fc] text-[#120826] font-bold shadow-[0_0_15px_rgba(244,63,142,0.5)] scale-105'
                : 'text-pink-200/70 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <span>Pending ✦</span>
            <span className="text-[10px] opacity-80 font-bold">({pendingWishes.length})</span>
          </button>
          <button
            onClick={() => setTab('granted')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all font-semibold flex items-center gap-1.5 ${
              tab === 'granted'
                ? 'bg-gradient-to-r from-[#ffd166] via-[#f43f8e] to-[#c084fc] text-[#120826] font-bold shadow-[0_0_15px_rgba(244,63,142,0.5)] scale-105'
                : 'text-pink-200/70 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <span>Completed 👑</span>
            <span className="text-[10px] opacity-80 font-bold">({grantedWishes.length})</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 space-y-3.5 sm:space-y-4 vault-scroll">
          {displayedWishes.length === 0 ? (
            /* ENCHANTED STORYBOOK EMPTY STATE */
            <div className="text-center py-16 px-6 flex flex-col items-center justify-center">
              {/* Floating Constellation Orb Graphic */}
              <div className="relative mb-6">
                {/* Breathing golden aura */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#78350f]/30 via-[#d4af37]/25 to-[#ffe57f]/30 blur-xl animate-corona" />

                {/* Central Jewel Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-18 h-18 rounded-full bg-[#0a1030] border border-[#d4af37]/50 flex items-center justify-center shadow-[0_0_25px_rgba(245,196,67,0.3)]">
                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
                      ✨
                    </span>
                  </div>
                </div>

                {/* Orbiting Stardust Stars */}
                <div className="absolute -inset-3 animate-orbit pointer-events-none">
                  <span className="absolute top-0 left-1/4 text-[#ffd700] text-sm">✦</span>
                  <span className="absolute bottom-1 right-1/4 text-[#ffe57f] text-xs">✧</span>
                  <span className="absolute top-1/2 -right-1 text-[#f5c443] text-sm">✨</span>
                </div>
              </div>

              {/* Title & Romance Prose */}
              <h3 className="font-fairytale text-lg text-[#fff3b0] mb-2 tracking-widest drop-shadow-[0_2px_10px_rgba(245,196,67,0.3)]">
                {tab === 'granted'
                  ? 'No Wishes Granted Yet'
                  : tab === 'pending'
                  ? 'No Wishes In Flight'
                  : 'The Vault Awaits Your Heart'}
              </h3>

              <p className="font-storybook italic text-sm text-[#f4ecd8]/70 max-w-xs mx-auto leading-relaxed mb-6">
                {tab === 'all'
                  ? 'Every dream whispered to the lamp is preserved here safe and sound. A place you want to travel together, a sweet surprise, a late-night treat, or a secret memory waiting to unfold.'
                  : tab === 'pending'
                  ? 'You have no wishes currently waiting. When you whisper to the lamp, it will immediately appear right here.'
                  : 'Your fulfilled dreams and memories will shine brightly here once your genie grants them.'}
              </p>

              {/* Action Button: Whisper to Genie */}
              {tab === 'all' && (
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenWhisper) onOpenWhisper();
                  }}
                  className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-fairytale text-xs tracking-widest font-bold text-[#050716] bg-gradient-to-r from-[#ffe57f] via-[#f5c443] to-[#d4af37] shadow-[0_0_20px_rgba(245,196,67,0.5)] hover:shadow-[0_0_30px_rgba(245,196,67,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span>WHISPER A WISH</span>
                  <span className="text-sm group-hover:rotate-12 transition-transform">✨</span>
                </button>
              )}
            </div>
          ) : (
            /* WISH SCROLL CARDS */
            displayedWishes.map((wish) => {
              const meta = statusMeta(wish.status);
              const isFulfilled = wish.status === 'WISH GRANTED';

              return (
                <div
                  key={wish.id}
                  className={`vault-card-scroll gold-corner-ornament p-5 rounded-2xl transition-all duration-300 ${meta.cardGlow}`}
                >
                  {/* Status header & timestamp */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${meta.pillBg}`}
                    >
                      <span>{meta.icon}</span>
                      <span>{meta.badge}</span>
                    </span>

                    <span className="text-[11px] font-storybook text-[#d4af37]/80">
                      Whispered {new Date(wish.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Main Wish Text */}
                  <p
                    className={`font-storybook text-lg sm:text-xl leading-snug break-words ${meta.textColor}`}
                  >
                    “{wish.title}”
                  </p>

                  {/* Optional Detailed Description */}
                  {wish.description && wish.description !== wish.title && (
                    <p className="font-storybook italic text-xs sm:text-sm text-[#f4ecd8]/65 mt-1.5 line-clamp-2">
                      {wish.description}
                    </p>
                  )}

                  {/* Optional Inspiration Image */}
                  {wish.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden max-h-36 border border-[#d4af37]/25 shadow-md">
                      <img
                        src={wish.imageUrl}
                        alt={wish.title}
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                    </div>
                  )}

                  {/* Administrator Note / Genie Love Letter */}
                  {wish.adminResponse && (
                    <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-br from-[#1a1338]/90 via-[#110e26]/90 to-[#080714]/90 border border-[#d4af37]/45 shadow-[inset_0_1px_0_rgba(255,243,176,0.15)] relative overflow-hidden">
                      {/* Envelope Seal Header */}
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] font-fairytale text-[#f5c443] uppercase tracking-wider font-bold">
                        <span>💌</span>
                        <span>Secret Note From Your Genie</span>
                      </div>
                      <p className="font-storybook italic text-xs sm:text-sm text-[#fed7aa] leading-relaxed">
                        "{wish.adminResponse}"
                      </p>
                    </div>
                  )}

                  {/* Target schedule date hint */}
                  {wish.expectedCompletionAt && !isFulfilled && (
                    <div className="mt-3 pt-2.5 border-t border-[#d4af37]/15 text-[11px] font-storybook text-[#fde047] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>⏳</span>
                        <span>Scheduled Arrival:</span>
                      </span>
                      <strong className="underline underline-offset-2">
                        {new Date(wish.expectedCompletionAt).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </strong>
                    </div>
                  )}

                  {/* Fulfilled celebration seal */}
                  {isFulfilled && (
                    <div className="mt-3 pt-2.5 border-t border-emerald-500/25 text-[11px] font-storybook text-[#6ee7b7] flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1.5">
                        <span>👑</span>
                        <span>Turned into a memory with love</span>
                      </span>
                      {wish.completedAt && (
                        <span className="text-emerald-400/80">
                          {new Date(wish.completedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Romance Quote */}
        <div className="px-6 py-4 border-t border-[#d4af37]/20 bg-[#030612]/95 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-1 text-[9px] text-[#d4af37]/50 select-none">
            <span>✦</span>
            <span>───────</span>
            <span>🪔</span>
            <span>───────</span>
            <span>✦</span>
          </div>
          <p className="font-storybook italic text-xs text-[#d4af37]/80 leading-relaxed">
            "Your wishes are never just wishes. They're things waiting to become memories."
          </p>
        </div>
      </div>
    </div>
  );
};
