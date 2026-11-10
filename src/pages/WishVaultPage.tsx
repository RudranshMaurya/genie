import React, { useState, useEffect } from 'react';
import { subscribeToWishes } from '../services/wishService';
import { Wish, WishStatus } from '../types';
import { sound } from '../utils/sound';
import { Sparkles, Clock, CheckCircle2, Flame, HelpCircle, PauseCircle, Filter, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WishVaultPage: React.FC<{ onNavigateToCreate: () => void }> = ({ onNavigateToCreate }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  useEffect(() => {
    const unsub = subscribeToWishes((updatedWishes) => {
      setWishes(updatedWishes);
    });
    return unsub;
  }, []);

  // Calculate live dynamic counts
  const totalWishes = wishes.length;
  const grantedWishes = wishes.filter((w) => w.status === 'WISH GRANTED').length;
  const inProgressWishes = wishes.filter(
    (w) => w.status === 'MAGIC IN PROGRESS' || w.status === 'COMING SOON'
  ).length;

  // Filter items
  const filteredWishes = wishes.filter((w) => {
    if (filter === 'PENDING' && w.status !== 'WISH RECEIVED' && w.status !== 'UNDER CONSIDERATION') return false;
    if (filter === 'IN_PROGRESS' && w.status !== 'MAGIC IN PROGRESS') return false;
    if (filter === 'COMING_SOON' && w.status !== 'COMING SOON') return false;
    if (filter === 'GRANTED' && w.status !== 'WISH GRANTED') return false;
    if (selectedCategory !== 'ALL' && w.category !== selectedCategory) return false;
    return true;
  });

  const getStatusBadge = (status: WishStatus) => {
    switch (status) {
      case 'WISH GRANTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#064e3b]/80 text-[#6ee7b7] border border-[#10b981]/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <CheckCircle2 size={13} />
            <span>WISH GRANTED</span>
          </span>
        );
      case 'MAGIC IN PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1e3a8a]/80 text-[#93c5fd] border border-[#3b82f6]/50 shadow-[0_0_12px_rgba(59,130,246,0.3)] animate-pulse">
            <Flame size={13} className="text-[#60a5fa]" />
            <span>MAGIC IN PROGRESS</span>
          </span>
        );
      case 'COMING SOON':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#78350f]/80 text-[#fde047] border border-[#f59e0b]/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Clock size={13} />
            <span>COMING SOON</span>
          </span>
        );
      case 'UNDER CONSIDERATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#312e81]/80 text-[#c7d2fe] border border-[#6366f1]/40">
            <HelpCircle size={13} />
            <span>UNDER CONSIDERATION</span>
          </span>
        );
      case 'ON HOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#3f3f46]/80 text-[#e4e4e7] border border-[#71717a]/40">
            <PauseCircle size={13} />
            <span>ON HOLD</span>
          </span>
        );
      case 'WISH RECEIVED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1e1b4b]/80 text-[#ddd6fe] border border-[#8b5cf6]/40">
            <Sparkles size={13} />
            <span>WISH RECEIVED</span>
          </span>
        );
    }
  };

  const handleCardClick = (wish: Wish) => {
    setSelectedWish(wish);
    if (wish.status === 'WISH GRANTED') {
      sound.playWishGranted();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#ffe07a', '#f5c443', '#10b981'],
        });
      } catch {}
    } else {
      sound.playChime(850);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Fairytale Header */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          ✦ Enchanted Archive ✦
        </span>
        <h1 className="font-fairytale text-3xl sm:text-4xl md:text-5xl text-[#fff3b0] tracking-wider mt-1 mb-2">
          The Wish Vault
        </h1>
        <p className="font-storybook italic text-base sm:text-lg text-[#f4ecd8]/70">
          Where every dream whispered to the stars is preserved with love.
        </p>

        {/* Live Counter Badge */}
        <div className="mt-4 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#0e1438]/90 border border-[#d4af37]/35 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <span className="font-storybook text-sm sm:text-base text-[#f5c443]">
            ✨ <strong className="font-bold text-[#fff3b0]">{totalWishes}</strong> wishes captured
          </span>
          <span className="text-[#d4af37]/40">•</span>
          <span className="font-storybook text-sm sm:text-base text-[#34d399]">
            🌸 <strong className="font-bold text-[#6ee7b7]">{grantedWishes}</strong> dreams fulfilled
          </span>
          {inProgressWishes > 0 && (
            <>
              <span className="text-[#d4af37]/40">•</span>
              <span className="font-storybook text-sm sm:text-base text-[#60a5fa]">
                🔮 <strong className="font-bold text-[#93c5fd]">{inProgressWishes}</strong> brewing
              </span>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3 rounded-2xl bg-[#090e29]/70 border border-[#d4af37]/20 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'ALL', label: 'All Wishes' },
            { id: 'PENDING', label: 'Received' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'COMING_SOON', label: 'Coming Soon' },
            { id: 'GRANTED', label: 'Fulfilled' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playChime(900);
                setFilter(item.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === item.id
                  ? 'bg-gradient-to-r from-[#ffe57f] to-[#f5c443] text-[#050716] font-semibold shadow-[0_0_10px_rgba(245,196,67,0.4)]'
                  : 'text-[#f4ecd8]/70 hover:text-[#fff3b0] hover:bg-[#d4af37]/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={onNavigateToCreate}
          className="text-xs uppercase tracking-wider text-[#f5c443] hover:text-[#fff3b0] font-fairytale flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#d4af37]/30 hover:border-[#d4af37] transition-all ml-auto"
        >
          <span>Make New Wish</span>
          <span>+</span>
        </button>
      </div>

      {/* Wish Cards Grid */}
      {filteredWishes.length === 0 ? (
        <div className="text-center py-16 parchment-card rounded-3xl max-w-lg mx-auto p-8">
          <div className="text-4xl mb-3">📜</div>
          <h3 className="font-fairytale text-lg text-[#fff3b0] mb-2">No Wishes Found</h3>
          <p className="font-storybook italic text-sm text-[#f4ecd8]/70 mb-4">
            Come on, Ananya. Even the smallest dreams deserve a place here.
          </p>
          <button
            onClick={onNavigateToCreate}
            className="px-6 py-2.5 rounded-full font-fairytale text-xs tracking-wider text-[#050716] font-bold bg-[#f5c443] hover:bg-[#ffe57f] transition-all"
          >
            Whisper A Wish ✨
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishes.map((wish) => {
            const isGranted = wish.status === 'WISH GRANTED';
            return (
              <div
                key={wish.id}
                onClick={() => handleCardClick(wish)}
                className={`group cursor-pointer parchment-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isGranted ? 'border-[#10b981]/40 hover:border-[#10b981]/70' : ''
                }`}
              >
                {/* Completed Golden Seal Watermark */}
                {isGranted && (
                  <div className="absolute -top-3 -right-3 w-16 h-16 pointer-events-none select-none flex items-center justify-center opacity-85">
                    <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(245,196,67,0.8)]">
                      👑
                    </span>
                  </div>
                )}

                <div>
                  {/* Category and Date */}
                  <div className="flex items-center justify-between text-[11px] text-[#d4af37]/75 font-storybook tracking-wide mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#0a1029] border border-[#d4af37]/20 uppercase tracking-widest text-[10px]">
                      {wish.category}
                    </span>
                    <span>{new Date(wish.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Wish Title */}
                  <h3 className="font-fairytale text-base sm:text-lg text-[#fff3b0] group-hover:text-[#ffd700] transition-colors leading-snug mb-2">
                    {wish.title}
                  </h3>

                  {/* Wish Description */}
                  {wish.description && wish.description !== wish.title && (
                    <p className="font-storybook text-sm text-[#f4ecd8]/70 line-clamp-3 mb-3 italic">
                      "{wish.description}"
                    </p>
                  )}

                  {/* Optional Image Preview */}
                  {wish.imageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden h-28 border border-[#d4af37]/20">
                      <img
                        src={wish.imageUrl}
                        alt={wish.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Personal Administrator Note / Genie Message Preview */}
                  {wish.adminResponse && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#0e163b]/85 border border-[#d4af37]/30 text-xs text-[#fed7aa] font-storybook italic flex items-start gap-2">
                      <span className="text-sm shrink-0">💌</span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#f5c443] tracking-widest block font-sans">
                          A Note For You:
                        </span>
                        <p className="line-clamp-2">"{wish.adminResponse}"</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Status Badge and Expected Date */}
                <div className="mt-4 pt-3 border-t border-[#d4af37]/15 flex items-center justify-between">
                  <div>{getStatusBadge(wish.status)}</div>

                  {wish.expectedCompletionAt && (
                    <div className="flex items-center gap-1 text-[11px] text-[#fde047] font-storybook">
                      <Calendar size={12} />
                      <span>{new Date(wish.expectedCompletionAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Wish Detail Modal */}
      {selectedWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg parchment-card rounded-3xl p-6 sm:p-8 gold-border-ornament">
            <button
              onClick={() => setSelectedWish(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                {selectedWish.category}
              </span>
            </div>

            <h2 className="font-fairytale text-xl sm:text-2xl text-[#fff3b0] mb-2">
              {selectedWish.title}
            </h2>

            <div className="mb-4">{getStatusBadge(selectedWish.status)}</div>

            {selectedWish.description && (
              <div className="p-4 rounded-2xl bg-[#070b20]/90 border border-[#d4af37]/20 mb-4">
                <p className="font-storybook text-base text-[#f4ecd8] italic">
                  "{selectedWish.description}"
                </p>
              </div>
            )}

            {selectedWish.imageUrl && (
              <div className="mb-4 rounded-2xl overflow-hidden max-h-56 border border-[#d4af37]/30">
                <img
                  src={selectedWish.imageUrl}
                  alt={selectedWish.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Admin Personal Note Section */}
            {selectedWish.adminResponse && (
              <div className="p-4 rounded-2xl bg-[#141d47]/95 border border-[#f5c443]/40 mb-4 shadow-[0_0_20px_rgba(245,196,67,0.15)]">
                <span className="text-xs uppercase font-fairytale text-[#f5c443] tracking-widest flex items-center gap-1.5 mb-1">
                  <span>💌</span>
                  <span>Personal Message from Your Genie</span>
                </span>
                <p className="font-storybook text-sm sm:text-base text-[#fef08a] italic">
                  "{selectedWish.adminResponse}"
                </p>
              </div>
            )}

            {/* Date Details */}
            <div className="text-xs text-[#d4af37]/70 font-storybook space-y-1 mb-6">
              <div>Requested on: {new Date(selectedWish.createdAt).toLocaleString()}</div>
              {selectedWish.expectedCompletionAt && (
                <div className="text-[#fde047] font-semibold">
                  Expected Magic Date: {new Date(selectedWish.expectedCompletionAt).toLocaleString()}
                </div>
              )}
              {selectedWish.completedAt && (
                <div className="text-[#34d399] font-semibold">
                  Granted On: {new Date(selectedWish.completedAt).toLocaleString()} ✨
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => setSelectedWish(null)}
                className="px-6 py-2 rounded-full font-fairytale text-xs tracking-wider text-[#050716] font-bold bg-[#f5c443] hover:bg-[#ffe57f] transition-all"
              >
                Close Scroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
