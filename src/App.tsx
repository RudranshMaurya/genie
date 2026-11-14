import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ParticleBackground } from './components/ParticleBackground';
import { HeartSmokeLamp } from './components/HeartSmokeLamp';
import { AnanyaAvatar } from './components/Avatars';
import { WishDrawer } from './components/WishDrawer';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { createWish, subscribeToWishes } from './services/wishService';
import { chatWithGenieAI } from './services/aiService';
import type { Wish } from './types';
import confetti from 'canvas-confetti';
import {
  Clock,
  Send,
  Home,
  History,
  Heart,
  Wand2,
  Gift,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Info,
  X,
} from 'lucide-react';

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function AppContent() {
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [genieSpeech, setGenieSpeech] = useState<string>(
    "Hello Ananya ♡ Tell me a dream, a craving, or what's on your heart today!"
  );
  const [isSpeechVisible, setIsSpeechVisible] = useState(false);

  // Wishes state
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'about'>('home');
  const [justCapturedWish, setJustCapturedWish] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Route handling
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const viewingAdmin = currentPath === '/admin' || currentPath === '/admin/login';

  // Real-time Firebase database listener
  useEffect(() => {
    const unsub = subscribeToWishes(setWishes);
    return unsub;
  }, []);

  // Handle Lamp Rub/Tap
  const handleLampInteraction = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f43f8e', '#ec4899', '#c084fc', '#ffd166', '#ffffff'],
      });
    } catch {}

    const greetings = [
      "I'm listening, Ananya! What does your heart desire right now? ✨",
      "Your touch awakens the magic ♡ Whisper your wish to the stars!",
      "At your service, my favourite human! Tell me your dream ♡",
      "The stars are aligned for you, Ananya! What shall we make happen?",
    ];
    setGenieSpeech(greetings[Math.floor(Math.random() * greetings.length)]);
    setIsSpeechVisible(true);
    inputRef.current?.focus();
  };

  // SEND MESSAGE / WISH (AI + FIREBASE)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean || isAiThinking) return;

    setInputText('');
    setIsAiThinking(true);
    setIsSpeechVisible(true);

    const updatedHistory: ConversationTurn[] = [
      ...conversation,
      { role: 'user', content: clean },
    ];
    setConversation(updatedHistory);

    try {
      const aiResult = await chatWithGenieAI(clean, updatedHistory);

      if (aiResult.isWish) {
        const wishTitle = aiResult.wishTitle || clean;
        await createWish({
          title: wishTitle,
          description: clean !== wishTitle ? clean : wishTitle,
          category: 'Wish',
          userName: 'Ananya',
        });

        setJustCapturedWish(wishTitle);
        try {
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#f43f8e', '#ec4899', '#c084fc', '#ffd166'],
          });
        } catch {}

        setTimeout(() => setJustCapturedWish(null), 4000);
      }

      setGenieSpeech(aiResult.reply);
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', content: aiResult.reply },
      ]);
    } catch {
      setGenieSpeech(`POOF! Your wish for "${clean}" has been captured safely, Ananya! ♡`);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Helper relative time
  const formatTime = (isoString: string) => {
    try {
      const ms = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(ms / (1000 * 60));
      if (mins < 2) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hours ago`;
      const days = Math.floor(hours / 24);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } catch {
      return 'Recently';
    }
  };

  // Status mapping for badges
  const renderWishBadge = (status: Wish['status']) => {
    if (status === 'WISH GRANTED') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#3b1754] text-[#d8b4fe] border border-[#a855f7]/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
          Completed
        </span>
      );
    }
    if (status === 'MAGIC IN PROGRESS' || status === 'COMING SOON') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#14382c] text-[#6ee7b7] border border-[#10b981]/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          Approved
        </span>
      );
    }
    if (status === 'ON HOLD') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#3a1525] text-[#fda4af] border border-[#f43f5e]/40">
          On Hold
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#3a2612] text-[#fcd34d] border border-[#f59e0b]/40 shadow-[0_0_10px_rgba(245,158,11,0.25)] flex items-center gap-1">
        <span>✦</span>
        <span>Pending</span>
      </span>
    );
  };

  // Helper icon for wish item
  const renderWishIcon = (status: Wish['status']) => {
    if (status === 'WISH GRANTED') {
      return (
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
          <CheckCircle2 size={18} />
        </div>
      );
    }
    if (status === 'MAGIC IN PROGRESS' || status === 'COMING SOON') {
      return (
        <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center text-pink-300 shrink-0">
          <Heart size={18} className="fill-pink-400/30" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
        <Gift size={18} />
      </div>
    );
  };

  // Render Admin Dashboard Page if URL is /admin
  if (viewingAdmin) {
    return <AdminDashboardPage />;
  }

  // =========================================================================
  // LEFT SCREEN: ANANYA'S WISH PORTAL (Matching Left Screen of Reference Image)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#120826] text-[#fff0f5] flex items-center justify-center p-0 sm:p-4 md:p-6 relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-100">
      {/* Twilight canvas with starry nebulae & floating cherry blossom sakura petals */}
      <ParticleBackground intensity="magical" interactive />

      {/* Main Container / Mobile Phone Card Frame */}
      <div className="relative w-full max-w-md min-h-screen sm:min-h-0 sm:h-[844px] bg-gradient-to-b from-[#1b0a33] via-[#150727] to-[#0e041c] sm:rounded-[36px] sm:border sm:border-pink-500/25 sm:shadow-[0_20px_60px_rgba(10,2,20,0.95),0_0_35px_rgba(244,63,142,0.2)] flex flex-col justify-between overflow-hidden z-10">
        
        {/* Soft Pink Ambient Bloom behind top & lamp */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* ============================================================== */}
        {/* TOP BAR: Golden Lamp Icon + "Genie" Script + Ananya Avatar */}
        {/* ============================================================== */}
        <header className="px-5 pt-5 pb-3 flex items-center justify-between z-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2.5">
            <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,209,102,0.8)]">
              🪔
            </span>
            <div className="flex flex-col">
              <span className="font-script text-2xl text-pink-200 tracking-wide drop-shadow-[0_0_10px_rgba(244,63,142,0.6)] leading-none">
                Genie ✦
              </span>
              <span className="font-handwriting text-[11px] text-pink-300/80 tracking-wide mt-0.5">
                Your Wish, My Mission ♡
              </span>
            </div>
          </div>

          {/* Ananya Profile Avatar with Dropdown Arrow */}
          <button
            onClick={() => setAboutModalOpen(true)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-pink-500/10 transition-all cursor-pointer"
            aria-label="Profile"
          >
            <AnanyaAvatar size="sm" />
            <ChevronDown size={14} className="text-pink-300/70" />
          </button>
        </header>

        {/* ============================================================== */}
        {/* SCROLLABLE MAIN CONTENT AREA */}
        {/* ============================================================== */}
        <div className="flex-1 px-4 sm:px-5 pb-4 overflow-y-auto overflow-x-hidden space-y-4">
          
          {/* 1. HERO SECTION: Greeting & Heart Smoke Lamp */}
          <div className="text-center pt-2">
            <h1 className="font-script text-3xl sm:text-4xl text-white tracking-wide drop-shadow-[0_0_15px_rgba(244,63,142,0.5)]">
              Hello, my favourite human ♡
            </h1>
            <p className="font-handwriting text-xs sm:text-sm text-pink-200/80 mt-0.5 tracking-wide">
              ✦ Tell me your wish... and I'll make it happen! ✦
            </p>

            {/* Heart Smoke Lamp with Stone Pedestal & Crescent Moon */}
            <div className="my-1">
              <HeartSmokeLamp
                onClick={handleLampInteraction}
                onRub={handleLampInteraction}
              />
            </div>

            {/* Conversational Speech Bubble */}
            {isSpeechVisible && (
              <div className="mx-2 -mt-2 mb-3 p-3 rounded-2xl bg-[#25103d]/90 border border-pink-400/30 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300 relative">
                {isAiThinking ? (
                  <div className="flex items-center justify-center gap-2 py-0.5 text-pink-300 font-handwriting text-sm animate-pulse">
                    <Sparkles size={14} />
                    <span>Your Genie is weaving starlight into an answer…</span>
                    <Sparkles size={14} />
                  </div>
                ) : (
                  <p className="font-handwriting text-sm sm:text-base text-pink-100 leading-snug">
                    "{genieSpeech}"
                  </p>
                )}
                {/* Speech Bubble Arrow */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#25103d] border-t border-l border-pink-400/30 rotate-45" />
              </div>
            )}

            {/* Wish Captured Starlight Banner */}
            {justCapturedWish && (
              <div className="mx-2 mb-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-200 text-xs font-medium flex items-center justify-center gap-1.5 animate-in fade-in zoom-in-95">
                <span>👑</span>
                <span>Wish captured: "<strong>{justCapturedWish}</strong>"</span>
              </div>
            )}
          </div>

          {/* 2. WISH INPUT BAR (Matching Reference Image) */}
          <form onSubmit={handleSendMessage} className="w-full">
            <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2a1347]/75 border border-pink-400/35 backdrop-blur-xl shadow-[0_8px_25px_rgba(244,63,142,0.2)] focus-within:border-pink-400 focus-within:shadow-[0_0_20px_rgba(244,63,142,0.4)] transition-all">
              {/* Magic Wand Icon */}
              <div className="text-pink-400 shrink-0">
                <Wand2 size={17} />
              </div>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tell your genie what your heart desires..."
                disabled={isAiThinking}
                maxLength={250}
                className="flex-1 bg-transparent text-[15px] sm:text-[16px] text-pink-50 placeholder-pink-300/40 focus:outline-none min-w-0"
              />

              {/* Glowing Magenta Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isAiThinking}
                aria-label="Send wish"
                className="shrink-0 w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#e0287a] via-[#f43f8e] to-[#fb7185] text-white flex items-center justify-center shadow-[0_0_15px_rgba(244,63,142,0.6)] disabled:opacity-40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Send size={14} className="translate-x-[1px]" />
              </button>
            </div>
          </form>

          {/* 3. "YOUR WISHES" CARD (Matching Reference Image) */}
          <div className="glass-card rounded-[24px] p-4 border border-pink-400/20 shadow-[0_8px_30px_rgba(15,3,30,0.6)]">
            {/* Header: Clock Icon + "Your Wishes" + "View All →" */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-pink-400/15">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-pink-300" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Your Wishes
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-xs text-pink-300/80 hover:text-pink-100 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* Wishes List */}
            {wishes.length === 0 ? (
              <div className="text-center py-6 text-pink-200/60 text-xs font-handwriting">
                Your vault is waiting ♡ Tell your genie what your heart desires above!
              </div>
            ) : (
              <div className="space-y-2.5">
                {wishes.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#24103c]/70 border border-pink-400/10 hover:border-pink-400/30 transition-all"
                  >
                    {/* Left: Icon + Title + Time */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      {renderWishIcon(w.status)}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate leading-snug">
                          {w.title} ♡
                        </p>
                        <span className="text-[10px] text-pink-300/60">
                          {formatTime(w.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Status Pill Badge */}
                    <div className="shrink-0">
                      {renderWishBadge(w.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM NAVIGATION BAR: Home, History, About (Phone Style) */}
        {/* ============================================================== */}
        <nav className="px-6 py-2.5 bg-[#140626]/90 border-t border-pink-400/15 backdrop-blur-xl flex items-center justify-around z-20">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home'
                ? 'text-pink-400 font-bold scale-105'
                : 'text-pink-300/60 hover:text-pink-200'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'home' ? 'bg-pink-500/20' : ''}`}>
              <Home size={19} />
            </div>
            <span className="text-[10px] tracking-wider font-semibold">Home</span>
            {activeTab === 'home' && (
              <span className="w-4 h-0.5 rounded-full bg-pink-400 shadow-[0_0_6px_rgba(244,63,142,0.9)] -mt-0.5" />
            )}
          </button>

          {/* History / Wish Vault Tab */}
          <button
            onClick={() => {
              setActiveTab('history');
              setDrawerOpen(true);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'history'
                ? 'text-pink-400 font-bold scale-105'
                : 'text-pink-300/60 hover:text-pink-200'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'history' ? 'bg-pink-500/20' : ''}`}>
              <History size={19} />
            </div>
            <span className="text-[10px] tracking-wider font-semibold">History</span>
          </button>

          {/* About Tab */}
          <button
            onClick={() => {
              setActiveTab('about');
              setAboutModalOpen(true);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'about'
                ? 'text-pink-400 font-bold scale-105'
                : 'text-pink-300/60 hover:text-pink-200'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'about' ? 'bg-pink-500/20' : ''}`}>
              <Heart size={19} />
            </div>
            <span className="text-[10px] tracking-wider font-semibold">About</span>
          </button>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* FULL WISH VAULT DRAWER / MODAL */}
      {/* ============================================================== */}
      <WishDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setActiveTab('home');
        }}
        wishes={wishes}
        onOpenWhisper={() => inputRef.current?.focus()}
      />

      {/* ============================================================== */}
      {/* "ABOUT" ROMANTIC GIFT MODAL */}
      {/* ============================================================== */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-[28px] max-w-sm w-full p-6 border border-pink-400/35 relative text-center">
            <button
              onClick={() => {
                setAboutModalOpen(false);
                setActiveTab('home');
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center hover:bg-pink-500/30 transition-all"
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-tr from-[#f43f8e] via-[#c084fc] to-[#ffd166] flex items-center justify-center shadow-[0_0_20px_rgba(244,63,142,0.5)]">
              <Heart size={28} className="fill-white text-white" />
            </div>

            <h3 className="font-script text-3xl text-pink-200 mb-1">
              For Ananya ♡
            </h3>
            <p className="font-handwriting text-sm text-pink-300/80 mb-4">
              Your personal world of wishes, created with love.
            </p>

            <p className="text-xs text-pink-100/90 leading-relaxed font-light mb-5">
              Every wish you whisper into this lamp is heard directly by the one who loves you most. 
              Whether it's a sweet craving, a dream trip, or more hugs, consider each wish a promise waiting to become a memory.
            </p>

            <button
              onClick={() => {
                setAboutModalOpen(false);
                setActiveTab('home');
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#120826] bg-gradient-to-r from-[#ffd166] via-[#f43f8e] to-[#c084fc] shadow-[0_0_15px_rgba(244,63,142,0.4)]"
            >
              Back to My Genie ♡
            </button>
          </div>
        </div>
      )}
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
