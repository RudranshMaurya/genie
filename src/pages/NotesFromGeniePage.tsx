import React, { useState, useEffect } from 'react';
import { subscribeToMessages } from '../services/wishService';
import { GenieMessage } from '../types';
import { sound } from '../utils/sound';
import { Heart, Sparkles, Feather } from 'lucide-react';

export const NotesFromGeniePage: React.FC = () => {
  const [messages, setMessages] = useState<GenieMessage[]>([]);

  useEffect(() => {
    const unsub = subscribeToMessages((msgs) => {
      setMessages(msgs.filter((m) => m.active));
    });
    return unsub;
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Fairytale Header */}
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center justify-center gap-2">
          <span>✦</span> Personal Enclave <span>✦</span>
        </span>
        <h1 className="font-fairytale text-3xl sm:text-4xl md:text-5xl text-[#fff3b0] tracking-wider mt-1 mb-2">
          A Little Note From Your Genie
        </h1>
        <p className="font-storybook italic text-base sm:text-lg text-[#f4ecd8]/70 max-w-lg mx-auto">
          Warm thoughts, gentle reminders, and love letters tucked between the stars.
        </p>
      </div>

      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className="parchment-card rounded-3xl p-6 sm:p-10 gold-border-ornament relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,196,67,0.2)]"
          >
            {/* Background Watermark Quill */}
            <div className="absolute right-6 -bottom-4 text-7xl opacity-10 pointer-events-none select-none">
              🪶
            </div>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37]/80 font-fairytale mb-3">
              <Sparkles size={14} className="text-[#f5c443]" />
              <span>{msg.title || 'Message from your Genie'}</span>
            </div>

            <p className="font-storybook text-lg sm:text-xl md:text-2xl text-[#fff3b0] italic leading-relaxed mb-6 font-normal">
              "{msg.content}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#d4af37]/20 text-xs sm:text-sm font-storybook text-[#d4af37]/80">
              <span className="flex items-center gap-1.5 text-[#f472b6]">
                <Heart size={14} fill="#f472b6" />
                <span>{msg.author || 'Your Genie & Administrator'}</span>
              </span>
              <span>
                {new Date(msg.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Closing Signature */}
      <div className="text-center mt-12 mb-6">
        <p className="font-storybook italic text-base text-[#d4af37]/60">
          "Your happiness is my favourite kind of magic."
        </p>
      </div>
    </div>
  );
};
