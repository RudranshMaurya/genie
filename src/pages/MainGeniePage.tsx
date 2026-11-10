import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { LampIllustration } from '../components/LampIllustration';
import { GenieCharacter } from '../components/GenieCharacter';
import { createWish } from '../services/wishService';
import { WISH_CATEGORIES, WishCategory } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

export const MainGeniePage: React.FC<{ onNavigateToVault: () => void }> = ({ onNavigateToVault }) => {
  const [wishText, setWishText] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WishCategory>('Something else');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic genie dialogue reactions based on what Ananya types
  const [genieSpeech, setGenieSpeech] = useState<string>(
    "Tell me what's on your mind, Ananya... Even the tiniest wish has a home here."
  );
  const [genieExpression, setGenieExpression] = useState<'happy' | 'listening' | 'speaking' | 'granting'>('happy');

  // Interactive Genie responses based on input keywords
  const handleWishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setWishText(text);

    const lower = text.toLowerCase();
    if (lower.includes('manali') || lower.includes('mountain') || lower.includes('shimla') || lower.includes('trip') || lower.includes('travel')) {
      setGenieSpeech("Oho! A grand adventure! Shall I add this little dream to our collection?");
      setGenieExpression('speaking');
    } else if (lower.includes('date') || lower.includes('surprise') || lower.includes('dinner') || lower.includes('candle')) {
      setGenieSpeech("A surprise date? Someone is getting romantic! Let me prepare the stars.");
      setGenieExpression('speaking');
    } else if (lower.includes('cake') || lower.includes('chocolate') || lower.includes('ice cream') || lower.includes('food') || lower.includes('pizza')) {
      setGenieSpeech("Consider that a delicious mission! I'm already taking notes.");
      setGenieExpression('speaking');
    } else if (lower.includes('hug') || lower.includes('kiss') || lower.includes('cuddle') || lower.includes('love')) {
      setGenieSpeech("Aww, the sweetest kinds of wishes are always the ones that come right from the heart.");
      setGenieExpression('happy');
    } else if (text.length > 5) {
      setGenieSpeech("I am listening closely... every detail matters.");
      setGenieExpression('listening');
    } else {
      setGenieSpeech("Tell me what's on your mind, Ananya...");
      setGenieExpression('happy');
    }
  };

  // Voice speech-to-text integration using Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please type your wish!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        sound.playChime(500);
        setGenieSpeech("I'm listening to your voice, Ananya... speak to me!");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setWishText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        sound.playChime(800);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Wish Submission Handler
  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    sound.playLampAwaken();

    try {
      await createWish({
        title: wishText,
        description: description || wishText,
        category: selectedCategory,
        imageUrl: imageUrl.trim() || undefined,
        userName: 'Ananya',
      });

      // Magical success triggers
      sound.playWishCaptured();
      setGenieExpression('granting');
      setGenieSpeech("POOF! Your wish has been captured and sealed into our Wish Vault!");
      setSuccessAnimation(true);

      // Gold stardust confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffe07a', '#f5c443', '#d4af37', '#93c5fd'],
        });
      } catch {}

      // Reset form
      setWishText('');
      setDescription('');
      setImageUrl('');
      setShowImageInput(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not whisper wish to the vault. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start px-4 py-8">
      {/* Decorative Fairytale Header Quote */}
      <div className="text-center mb-6 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center justify-center gap-2 mb-2">
          <span>✦</span> An Enchanted Sanctum <span>✦</span>
        </span>
        <h1 className="font-fairytale text-2xl sm:text-3xl md:text-4xl text-[#fff3b0] tracking-wider leading-tight drop-shadow-[0_2px_15px_rgba(245,196,67,0.3)]">
          Whisper Your Wish
        </h1>
        <p className="font-storybook italic text-base sm:text-lg text-[#f4ecd8]/70 mt-1">
          "Your wishes are never just wishes. They're things waiting to become memories."
        </p>
      </div>

      {/* Genie and Lamp Companion Area */}
      <div className="relative flex flex-col items-center justify-center mb-6">
        <GenieCharacter
          expression={genieExpression}
          speakingText={genieSpeech}
          scale={0.95}
        />
        <div className="-mt-8">
          <LampIllustration
            size="sm"
            isGlowing={true}
            smokeActive={isSubmitting || successAnimation}
            onClick={() => {
              sound.playSmokePoof();
              setGenieSpeech("You tapped the lamp! What adventure shall we dream up next?");
            }}
          />
        </div>
      </div>

      {/* Magical Wish Submission Orb Card */}
      <div className="w-full max-w-xl relative parchment-card rounded-3xl p-6 sm:p-8 gold-border-ornament">
        {/* Success Modal / Banner */}
        {successAnimation && (
          <div className="mb-6 p-4 rounded-2xl bg-[#092419]/90 border border-[#10b981]/50 backdrop-blur-md flex items-start justify-between gap-3 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-[#34d399] shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-fairytale text-sm text-[#a7f3d0] font-bold">
                  Wish Safely Captured!
                </h4>
                <p className="font-storybook text-sm text-[#ecfdf5] italic mt-0.5">
                  Now let's see what magic we can make happen! It is waiting inside your Wish Vault.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccessAnimation(false);
                onNavigateToVault();
              }}
              className="text-xs uppercase tracking-wider text-[#a7f3d0] hover:text-white underline shrink-0 mt-1"
            >
              View Vault →
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#450a0a]/80 border border-[#f87171]/40 text-xs text-[#fca5a5] flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitWish} className="space-y-4">
          {/* Main Wish Input */}
          <div className="relative">
            <label className="block font-fairytale text-xs uppercase tracking-widest text-[#d4af37]/90 mb-2">
              Your Heart's Desire
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={wishText}
                onChange={handleWishChange}
                placeholder="Tell me what's on your mind, Ananya..."
                className="w-full bg-[#060919]/90 border border-[#d4af37]/30 focus:border-[#f5c443] rounded-2xl px-5 py-3.5 pr-24 text-sm sm:text-base text-[#f4ecd8] placeholder-[#f4ecd8]/40 focus:outline-none focus:ring-2 focus:ring-[#f5c443]/30 transition-all font-storybook"
                required
              />

              {/* Voice Input Mic Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                title={isListening ? 'Listening...' : 'Speak your wish'}
                className={`absolute right-3 p-2 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-[#ef4444]/30 border-[#ef4444] text-[#fca5a5] animate-pulse'
                    : 'bg-[#12193b] border-[#d4af37]/30 text-[#f5c443] hover:border-[#f5c443]'
                }`}
              >
                {isListening ? <MicOff size={17} /> : <Mic size={17} />}
              </button>
            </div>
          </div>

          {/* Optional Fuller Description */}
          <div>
            <label className="block font-fairytale text-[11px] uppercase tracking-widest text-[#d4af37]/75 mb-1.5">
              Whisper More Details (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any specific places, feelings, or little touches you'd love?..."
              className="w-full bg-[#060919]/90 border border-[#d4af37]/25 focus:border-[#f5c443] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#f4ecd8] placeholder-[#f4ecd8]/30 focus:outline-none focus:ring-1 focus:ring-[#f5c443]/20 transition-all font-storybook resize-none"
            />
          </div>

          {/* Category Selector Chips */}
          <div>
            <label className="block font-fairytale text-[11px] uppercase tracking-widest text-[#d4af37]/75 mb-2">
              Wish Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {WISH_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sound.playChime(950);
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#ffe07a] to-[#f5c443] text-[#050716] font-semibold shadow-[0_0_10px_rgba(245,196,67,0.4)]'
                        : 'bg-[#0b1029]/80 border border-[#d4af37]/25 text-[#f4ecd8]/75 hover:border-[#d4af37]/60'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Image Attachment Toggle */}
          <div className="pt-1">
            {!showImageInput ? (
              <button
                type="button"
                onClick={() => setShowImageInput(true)}
                className="inline-flex items-center gap-1.5 text-xs text-[#d4af37]/80 hover:text-[#fff3b0] transition-colors"
              >
                <Image size={14} />
                <span>Add an inspiration photo link</span>
              </button>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#d4af37]">
                  <span>Image URL (Unsplash or Pinterest link)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageInput(false);
                      setImageUrl('');
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#060919]/90 border border-[#d4af37]/25 focus:border-[#f5c443] rounded-xl px-3 py-2 text-xs text-[#f4ecd8] focus:outline-none font-storybook"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !wishText.trim()}
              className="w-full relative group overflow-hidden rounded-2xl py-3.5 px-6 font-fairytale text-sm sm:text-base tracking-widest text-[#050716] font-bold bg-gradient-to-r from-[#ffe57f] via-[#f5c443] to-[#d4af37] shadow-[0_0_20px_rgba(245,196,67,0.45)] hover:shadow-[0_0_35px_rgba(245,196,67,0.8)] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="animate-spin text-[#050716]" size={18} />
                  <span>Enchanting & Saving...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Wish To The Stars ✨</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick link below to vault */}
      <div className="mt-6 text-center">
        <button
          onClick={onNavigateToVault}
          className="text-xs sm:text-sm font-storybook italic text-[#d4af37]/80 hover:text-[#fff3b0] transition-colors underline underline-offset-4"
        >
          Or view the collection of dreams inside your Wish Vault →
        </button>
      </div>
    </div>
  );
};
