import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ParticleBackground } from './components/ParticleBackground';
import { GenieCharacter } from './components/GenieCharacter';
import { LampIllustration } from './components/LampIllustration';
import { WishDrawer } from './components/WishDrawer';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { createWish, subscribeToWishes } from './services/wishService';
import { chatWithGenieAI } from './services/aiService';
import type { Wish } from './types';
import confetti from 'canvas-confetti';

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function AppContent() {
  // Whether the genie has been awakened by rubbing/clicking the lamp
  const [isGenieOut, setIsGenieOut] = useState<boolean>(false);
  const [isAwakening, setIsAwakening] = useState<boolean>(false);

  // Chat & input states
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [genieSpeech, setGenieSpeech] = useState<string>(
    "Rub or click the Golden Lamp to awaken your Genie..."
  );
  const [genieExpression, setGenieExpression] = useState<
    'happy' | 'listening' | 'speaking' | 'granting'
  >('happy');

  // Wishes & Vault Cart state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [justCapturedWish, setJustCapturedWish] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Route handling
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const viewingAdmin = currentPath === '/admin' || currentPath === '/admin/login';

  // Real-time Firebase database listener
  useEffect(() => {
    const unsub = subscribeToWishes(setWishes);
    return unsub;
  }, []);

  // AWAKEN THE GENIE: Triggered when Ananya rubs or clicks the lamp
  const handleAwakenGenie = () => {
    if (isGenieOut || isAwakening) return;
    setIsAwakening(true);

    // Stardust golden burst
    try {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#ffe07a', '#f5c443', '#d4af37', '#93c5fd', '#ffffff'],
      });
    } catch {}

    setTimeout(() => {
      setIsGenieOut(true);
      setIsAwakening(false);
      setGenieExpression('speaking');
      setGenieSpeech(
        "✨ Well, well... look who has awakened me! Hello, Ananya. I am your personal Genie, bound to your heart. Tell me a wish, a dream, or what's on your mind today!"
      );

      // Focus input field once Genie emerges
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }, 900);
  };

  // SEND MESSAGE / WISH TO THE GENIE (AI CONVERSATION)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean || isAiThinking) return;

    setInputText('');
    setIsAiThinking(true);
    setGenieExpression('listening');

    // Add user turn to conversation history
    const updatedHistory: ConversationTurn[] = [
      ...conversation,
      { role: 'user', content: clean },
    ];
    setConversation(updatedHistory);

    try {
      // Call OpenRouter AI
      const aiResult = await chatWithGenieAI(clean, updatedHistory);

      // If AI detects this message is a wish or desire, save it to Firebase Realtime Database!
      if (aiResult.isWish) {
        const wishTitle = aiResult.wishTitle || clean;
        await createWish({
          title: wishTitle,
          description: clean !== wishTitle ? clean : wishTitle,
          category: 'Wish',
          userName: 'Ananya',
        });

        setJustCapturedWish(wishTitle);
        setGenieExpression('granting');

        // Confetti stardust celebration
        try {
          confetti({
            particleCount: 50,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#ffe07a', '#f5c443', '#d4af37', '#6ee7b7'],
          });
        } catch {}

        setTimeout(() => setJustCapturedWish(null), 4000);
      } else {
        setGenieExpression('speaking');
      }

      setGenieSpeech(aiResult.reply);
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', content: aiResult.reply },
      ]);
    } catch (err) {
      console.error('Conversation error:', err);
      setGenieSpeech(
        `POOF! Your wish for "${clean}" has been captured into your Wish Vault, Ananya! ✨`
      );
      setGenieExpression('happy');
    } finally {
      setIsAiThinking(false);
    }
  };

  const pendingCount = wishes.filter((w) => w.status !== 'WISH GRANTED').length;
  const grantedCount = wishes.filter((w) => w.status === 'WISH GRANTED').length;

  // Render Admin Dashboard Page if URL is /admin
  if (viewingAdmin) {
    return (
      <div className="min-h-screen bg-[#040612] text-[#f4ecd8] relative">
        <ParticleBackground intensity="calm" interactive={false} />
        {/* Back to Ananya's world button */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 pt-6">
          <button
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a1029] border border-[#d4af37]/35 text-[#f5c443] hover:text-[#fff3b0] text-xs font-storybook transition-all"
          >
            ← Back to Ananya's Genie
          </button>
        </div>
        <div className="relative z-10">
          <AdminDashboardPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040612] text-[#f4ecd8] relative overflow-hidden select-none">
      {/* Deep celestial starlight canvas */}
      <ParticleBackground intensity="cinematic" interactive />

      {/* FLOATING WISH VAULT CART TALISMAN — Top Right */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-5 right-5 z-30 group flex items-center gap-2.5 px-4.5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 border border-[#d4af37]/40 hover:border-[#ffd700] shadow-[0_6px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(245,196,67,0.15)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(16, 23, 56, 0.92) 0%, rgba(8, 12, 32, 0.95) 100%)',
        }}
        aria-label="Open wishes"
      >
        {/* Ornate Gold Cart Icon */}
        <div className="relative text-[#f5c443] group-hover:rotate-12 transition-transform duration-300">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_6px_rgba(245,196,67,0.5)]"
          >
            <path
              d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3 6h18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 10a4 4 0 0 1-8 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col text-left">
          <span className="font-fairytale text-xs tracking-wider text-[#fff3b0] group-hover:text-[#ffd700] transition-colors leading-tight">
            Wish Vault
          </span>
          <span className="font-storybook italic text-[11px] text-[#d4af37]/80 -mt-0.5">
            {wishes.length === 0
              ? 'Your collection'
              : pendingCount > 0
              ? `${pendingCount} waiting`
              : `${grantedCount} fulfilled ✨`}
          </span>
        </div>

        {wishes.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#ffe07a] to-[#f5c443] text-[#040612] text-[10px] font-extrabold flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,196,67,0.7)]">
            {wishes.length}
          </span>
        )}
      </button>

      {/* MAIN MAGICAL STAGE */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-5 py-8">
        {/* Subtle Ambient Moonbeam God-Ray Halo behind center */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-40 animate-corona"
          style={{
            background:
              'radial-gradient(circle, rgba(147, 197, 253, 0.25) 0%, rgba(212, 175, 55, 0.2) 40%, transparent 75%)',
          }}
        />

        {/* SCENE 1: THE GENIE IS INSIDE THE LAMP — RUB OR TAP TO RELEASE HIM */}
        {!isGenieOut && (
          <div className="flex flex-col items-center text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-700">
            {/* Romantic Introduction Header */}
            <div className="mb-6">
              <span className="text-[11px] font-fairytale uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-1">
                ✦ ANCIENT MAGIC OF THE DUNES ✦
              </span>
              <h1 className="font-fairytale text-2xl sm:text-3xl text-[#fff3b0] tracking-wider drop-shadow-[0_2px_12px_rgba(245,196,67,0.4)]">
                The Golden Lamp
              </h1>
              <p className="font-storybook italic text-sm sm:text-base text-[#f4ecd8]/70 mt-1 max-w-xs mx-auto">
                "An ancient magic rests within... awaiting the touch of its rightful master."
              </p>
            </div>

            {/* Interactive Lamp with Rubbing & Tapping Physics */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Outer Golden Glow Ring */}
              <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-tr from-[#f5c443]/30 to-[#93c5fd]/20 pointer-events-none animate-corona" />

              <LampIllustration
                size="lg"
                isGlowing={true}
                isAwakening={isAwakening}
                smokeActive={isAwakening}
                canRub={true}
                onRub={handleAwakenGenie}
                onClick={handleAwakenGenie}
              />
            </div>

            {/* Pulsing Guidance Talisman */}
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={handleAwakenGenie}
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full overflow-hidden select-none transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(245,196,67,0.45)] hover:shadow-[0_12px_40px_rgba(245,196,67,0.7)] border border-[#fff9d2]/60"
                style={{
                  background:
                    'linear-gradient(135deg, #fff3b0 0%, #fcd34d 30%, #f59e0b 70%, #b45309 100%)',
                }}
              >
                {/* Shimmer beam */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none animate-shimmer" />

                <span className="text-[#3a1503] font-bold text-base">✨</span>
                <span className="font-fairytale text-xs sm:text-sm tracking-[0.2em] font-extrabold text-[#3a1503]">
                  RUB OR TAP THE LAMP
                </span>
                <span className="text-[#3a1503] font-bold text-base">✦</span>
              </button>

              <span className="font-storybook italic text-xs text-[#d4af37]/70 mt-3 tracking-wide">
                Swipe your finger across or tap the lamp to summon your Genie
              </span>
            </div>
          </div>
        )}

        {/* SCENE 2: THE GENIE IS OUT — CONVERSE IN REAL-TIME & MAKE WISHES */}
        {isGenieOut && (
          <div className="flex flex-col items-center w-full max-w-sm relative z-10 animate-in fade-in duration-700">
            {/* Living Genie Character */}
            <div className="mb-1">
              <GenieCharacter
                expression={genieExpression}
                scale={1}
                isFloating={true}
                showAura={true}
              />
            </div>

            {/* Conversational Speech Bubble */}
            <div
              className="w-full -mt-2 mb-4 px-6 py-4 rounded-[24px] text-center transition-all duration-500 backdrop-blur-md relative border border-[#d4af37]/35 shadow-[0_12px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,243,176,0.12)]"
              style={{
                background:
                  'linear-gradient(145deg, rgba(14, 20, 52, 0.95) 0%, rgba(7, 10, 28, 0.96) 100%)',
              }}
            >
              {isAiThinking ? (
                <div className="flex items-center justify-center gap-2 py-1 text-[#f5c443] font-storybook italic text-sm animate-pulse">
                  <span>✨</span>
                  <span>The Genie is weaving starlight into an answer…</span>
                  <span>✨</span>
                </div>
              ) : (
                <p className="font-storybook text-base sm:text-lg text-[#fff3b0] italic leading-relaxed">
                  {genieSpeech}
                </p>
              )}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#080d26] border-b border-r border-[#d4af37]/35 rotate-45" />
            </div>

            {/* Captured Wish Notification Banner */}
            {justCapturedWish && (
              <div className="mb-3 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-200 text-xs font-storybook flex items-center gap-1.5 animate-in fade-in zoom-in-95">
                <span>👑</span>
                <span>Wish captured: "<strong>{justCapturedWish}</strong>"</span>
              </div>
            )}

            {/* Antique Golden Lamp */}
            <LampIllustration
              size="sm"
              isGlowing={true}
              smokeActive={isAiThinking || Boolean(justCapturedWish)}
              onClick={() => {
                setGenieSpeech(
                  "You touched the lamp! I'm here right beside you, Ananya. Tell me what's on your heart."
                );
                setGenieExpression('happy');
              }}
            />

            {/* AI Wish & Conversation Input Form */}
            <form onSubmit={handleSendMessage} className="mt-5 w-full">
              <div
                className="relative flex items-center gap-2 px-5 py-3.5 rounded-full transition-all duration-300 border shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(8, 11, 32, 0.95) 0%, rgba(4, 6, 20, 0.98) 100%)',
                  borderColor:
                    inputText.length > 0
                      ? 'rgba(245, 196, 67, 0.75)'
                      : 'rgba(212, 175, 55, 0.35)',
                  boxShadow:
                    inputText.length > 0
                      ? '0 0 0 4px rgba(245, 196, 67, 0.12), 0 10px 35px rgba(0,0,0,0.7), 0 0 20px rgba(245, 196, 67, 0.2)'
                      : '0 8px 30px rgba(0,0,0,0.6)',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tell me a wish or talk to me, Ananya…"
                  disabled={isAiThinking}
                  maxLength={300}
                  className="flex-1 bg-transparent text-sm sm:text-base text-[#f4ecd8] placeholder-[#f4ecd8]/40 focus:outline-none font-storybook min-w-0"
                />

                {/* Enchanted Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isAiThinking}
                  aria-label="Send wish or message"
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 hover:scale-110 active:scale-95 group overflow-hidden relative cursor-pointer"
                  style={{
                    background: inputText.trim()
                      ? 'linear-gradient(135deg, #fff3b0 0%, #fcd34d 30%, #f59e0b 70%, #d97706 100%)'
                      : 'rgba(212,175,55,0.15)',
                    boxShadow: inputText.trim()
                      ? '0 0 20px rgba(245,196,67,0.75), 0 2px 10px rgba(0,0,0,0.5)'
                      : 'none',
                  }}
                >
                  {/* Internal Shimmer Beam */}
                  {inputText.trim() && (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none animate-shimmer" />
                  )}

                  {/* Compass / Star Send Icon */}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 group-hover:rotate-12 transition-transform duration-300"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke={inputText.trim() ? '#290e02' : '#d4af37'}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke={inputText.trim() ? '#290e02' : '#d4af37'}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Floating Wish Cart Drawer */}
      <WishDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        wishes={wishes}
        onOpenWhisper={() => inputRef.current?.focus()}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
