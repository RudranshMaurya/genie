import React, { useState, useEffect } from 'react';
import { subscribeToWishes } from '../services/wishService';
import { Wish } from '../types';
import { sound } from '../utils/sound';
import { Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
}

function calculateTimeLeft(targetDateStr: string): Countdown {
  const difference = +new Date(targetDateStr) - +new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isOverdue: false,
  };
}

export const MagicCalendarPage: React.FC<{ onNavigateToVault: () => void }> = ({ onNavigateToVault }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const unsub = subscribeToWishes((allWishes) => {
      setWishes(allWishes);
    });
    return unsub;
  }, []);

  // Update clock every second for live countdown precision
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter for upcoming scheduled wishes:
  // Must have an expectedCompletionAt, and status is not yet 'WISH GRANTED'
  const upcomingWishes = wishes
    .filter((w) => w.expectedCompletionAt && w.status !== 'WISH GRANTED')
    .sort((a, b) => new Date(a.expectedCompletionAt!).getTime() - new Date(b.expectedCompletionAt!).getTime());

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Fairytale Title */}
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          ✦ Star Alignment & Timelines ✦
        </span>
        <h1 className="font-fairytale text-3xl sm:text-4xl md:text-5xl text-[#fff3b0] tracking-wider mt-1 mb-2">
          When Magic Happens
        </h1>
        <p className="font-storybook italic text-base sm:text-lg text-[#f4ecd8]/70 max-w-xl mx-auto">
          Upcoming surprises, dates, and memories already scheduled by your genie.
        </p>
      </div>

      {upcomingWishes.length === 0 ? (
        <div className="text-center py-16 parchment-card rounded-3xl max-w-md mx-auto p-8">
          <CalendarIcon className="mx-auto text-[#f5c443] mb-3 opacity-80" size={36} />
          <h3 className="font-fairytale text-lg text-[#fff3b0] mb-2">The Stars Are Aligning</h3>
          <p className="font-storybook italic text-sm text-[#f4ecd8]/70 mb-4">
            No specific dates are currently locked into the cosmos. New scheduled dates will appear here the moment your administrator sets them!
          </p>
          <button
            onClick={onNavigateToVault}
            className="px-5 py-2 rounded-full font-fairytale text-xs tracking-wider text-[#050716] font-bold bg-[#f5c443] hover:bg-[#ffe57f] transition-all"
          >
            Explore Wish Vault 📜
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingWishes.map((wish) => {
            const countdown = calculateTimeLeft(wish.expectedCompletionAt!);
            const targetDate = new Date(wish.expectedCompletionAt!);

            return (
              <div
                key={wish.id}
                className="parchment-card rounded-3xl p-6 sm:p-8 gold-border-ornament transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,196,67,0.25)]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Wish Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#d4af37] font-storybook tracking-widest uppercase mb-1">
                      <span>{wish.category}</span>
                      <span>•</span>
                      <span className="text-[#38bdf8]">{wish.status}</span>
                    </div>

                    <h2 className="font-fairytale text-xl sm:text-2xl text-[#fff3b0] mb-2">
                      {wish.title}
                    </h2>

                    {wish.description && wish.description !== wish.title && (
                      <p className="font-storybook italic text-sm sm:text-base text-[#f4ecd8]/70 mb-3">
                        "{wish.description}"
                      </p>
                    )}

                    {wish.adminResponse && (
                      <div className="p-3 rounded-xl bg-[#0e163b]/90 border border-[#d4af37]/30 text-xs sm:text-sm text-[#fed7aa] font-storybook italic flex items-center gap-2">
                        <span>💌</span>
                        <span>"{wish.adminResponse}"</span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-xs text-[#d4af37]/80">
                      <CalendarIcon size={14} />
                      <span>
                        Target Date:{' '}
                        <strong className="text-[#fde047]">
                          {targetDate.toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'Asia/Kolkata',
                          })}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Magical Countdown Counter */}
                  <div className="shrink-0 bg-[#060a1f]/90 border border-[#d4af37]/30 rounded-2xl p-4 sm:p-5 text-center min-w-[280px]">
                    <span className="text-[11px] uppercase tracking-widest text-[#d4af37]/80 block font-fairytale mb-3">
                      Your surprise is arriving in...
                    </span>

                    {countdown.isOverdue ? (
                      <div className="text-center py-2">
                        <span className="text-sm font-fairytale text-[#34d399] flex items-center justify-center gap-1">
                          <Sparkles size={16} /> Any moment now!
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {/* Days */}
                        <div className="bg-[#12193e] rounded-xl p-2 border border-[#d4af37]/20">
                          <span className="font-fairytale text-xl sm:text-2xl font-bold text-[#fff3b0] block">
                            {String(countdown.days).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-[#d4af37]/70">
                            Days
                          </span>
                        </div>

                        {/* Hours */}
                        <div className="bg-[#12193e] rounded-xl p-2 border border-[#d4af37]/20">
                          <span className="font-fairytale text-xl sm:text-2xl font-bold text-[#fff3b0] block">
                            {String(countdown.hours).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-[#d4af37]/70">
                            Hours
                          </span>
                        </div>

                        {/* Minutes */}
                        <div className="bg-[#12193e] rounded-xl p-2 border border-[#d4af37]/20">
                          <span className="font-fairytale text-xl sm:text-2xl font-bold text-[#fff3b0] block">
                            {String(countdown.minutes).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-[#d4af37]/70">
                            Mins
                          </span>
                        </div>

                        {/* Seconds */}
                        <div className="bg-[#12193e] rounded-xl p-2 border border-[#d4af37]/20">
                          <span className="font-fairytale text-xl sm:text-2xl font-bold text-[#f5c443] block">
                            {String(countdown.seconds).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-[#d4af37]/70">
                            Secs
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
