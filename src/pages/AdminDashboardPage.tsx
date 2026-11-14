import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToWishes,
  updateWishByAdmin,
  deleteWish,
} from '../services/wishService';
import { Wish, WishStatus } from '../types';
import { sound } from '../utils/sound';
import { AnanyaAvatar, AdminAvatar } from '../components/Avatars';
import { FairytaleCastle, CoupleSilhouette } from '../components/RomanticDecorations';
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Settings,
  LogOut,
  Check,
  X,
  CheckCircle2,
  Hourglass,
  Activity,
  Gift,
  Star,
  Lock,
  Key,
  Edit3,
  Calendar,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, loginAsAdmin, logout, authError } = useAuth();
  const [passkeyInput, setPasskeyInput] = useState('');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'wishes' | 'stats' | 'settings'>('dashboard');

  // Modal editing wish state
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [editStatus, setEditStatus] = useState<WishStatus>('MAGIC IN PROGRESS');
  const [editResponse, setEditResponse] = useState('');
  const [editCompletionDate, setEditCompletionDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const unsub = subscribeToWishes(setWishes);
    return unsub;
  }, [isAdmin]);

  // Handle Login
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLampAwaken();
    const success = await loginAsAdmin(passkeyInput);
    if (success) {
      sound.playWishCaptured();
    }
  };

  // Quick Action Handlers
  const handleApprove = async (wishId: string) => {
    sound.playWishCaptured();
    await updateWishByAdmin(wishId, {
      status: 'MAGIC IN PROGRESS',
    });
  };

  const handleReject = async (wishId: string) => {
    sound.playSmokePoof();
    await updateWishByAdmin(wishId, {
      status: 'ON HOLD',
    });
  };

  const handleMarkDone = async (wishId: string) => {
    sound.playWishGranted();
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f8e', '#ec4899', '#c084fc', '#ffd166'],
      });
    } catch {}
    await updateWishByAdmin(wishId, {
      status: 'WISH GRANTED',
    });
  };

  const handleOpenEdit = (wish: Wish) => {
    setEditingWish(wish);
    setEditStatus(wish.status);
    setEditResponse(wish.adminResponse || '');
    if (wish.expectedCompletionAt) {
      try {
        const d = new Date(wish.expectedCompletionAt);
        setEditCompletionDate(d.toISOString().slice(0, 16));
      } catch {
        setEditCompletionDate('');
      }
    } else {
      setEditCompletionDate('');
    }
  };

  const handleSaveWishChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWish) return;

    setIsSaving(true);
    sound.playLampAwaken();

    try {
      await updateWishByAdmin(editingWish.id, {
        status: editStatus,
        adminResponse: editResponse.trim(),
        expectedCompletionAt: editCompletionDate ? new Date(editCompletionDate).toISOString() : null,
      });

      if (editStatus === 'WISH GRANTED') {
        sound.playWishGranted();
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        sound.playWishCaptured();
      }

      setEditingWish(null);
    } catch {
      alert('Failed to update wish.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWish = async (wish: Wish) => {
    const confirmed = window.confirm(`Delete wish: "${wish.title}"?`);
    if (!confirmed) return;
    sound.playSmokePoof();
    await deleteWish(wish.id);
  };

  // Helper relative time
  const formatRelativeTime = (isoString: string) => {
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

  // 1. If not authenticated, display Master Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Soft Pink Nebula */}
        <div className="absolute w-[450px] h-[450px] rounded-full blur-3xl bg-pink-600/15 pointer-events-none -top-20 -left-20" />
        <div className="absolute w-[450px] h-[450px] rounded-full blur-3xl bg-purple-600/15 pointer-events-none -bottom-20 -right-20" />

        <div className="w-full max-w-md relative z-10 glass-card rounded-[28px] p-8 text-center border border-pink-400/25 shadow-[0_12px_45px_rgba(20,4,36,0.8)]">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-tr from-[#f43f8e] via-[#c084fc] to-[#ffd166] flex items-center justify-center shadow-[0_0_25px_rgba(244,63,142,0.5)]">
            <Lock className="text-[#120826]" size={28} />
          </div>

          <h2 className="font-script text-3xl sm:text-4xl text-[#fff0f5] mb-1">
            Master Chamber
          </h2>
          <p className="font-handwriting text-base sm:text-lg text-pink-200/80 mb-6">
            Reserved exclusively for the one who turns Ananya's wishes into reality ♡
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-[11px] uppercase tracking-widest text-pink-300/80 font-semibold mb-1.5">
                Master Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter secret administrator key..."
                  className="w-full bg-[#170a2a]/80 border border-pink-400/30 focus:border-pink-400 rounded-2xl px-4 py-3 pl-10 text-sm text-[#fff0f5] placeholder-pink-300/30 focus:outline-none"
                  required
                />
                <Key className="absolute left-3 top-3.5 text-pink-400/60" size={17} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase text-[#120826] bg-gradient-to-r from-[#ffd166] via-[#f43f8e] to-[#c084fc] shadow-[0_0_20px_rgba(244,63,142,0.4)] hover:shadow-[0_0_30px_rgba(244,63,142,0.7)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Enter Dashboard ♡
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Metrics Calculation
  const totalCount = wishes.length;
  const completedCount = wishes.filter((w) => w.status === 'WISH GRANTED').length;
  const pendingWishes = wishes.filter(
    (w) => w.status === 'WISH RECEIVED' || w.status === 'UNDER CONSIDERATION'
  );
  const approvedWishes = wishes.filter(
    (w) => w.status === 'MAGIC IN PROGRESS' || w.status === 'COMING SOON'
  );

  return (
    <div className="min-h-screen bg-[#100722] text-[#fff0f5] flex flex-col md:flex-row relative overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-100">
      {/* Background Twilight Nebulae */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-b from-pink-600/10 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-t from-purple-900/15 via-pink-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ============================================================== */}
      {/* LEFT SIDEBAR (Matching Right Screen in Reference Image) */}
      {/* ============================================================== */}
      <aside className="w-full md:w-64 bg-[#180b33]/70 backdrop-blur-2xl border-r border-pink-400/15 flex flex-col justify-between shrink-0 p-5 z-20">
        <div>
          {/* Top Logo: Golden Lamp + "Genie" in script */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-pink-400/15 mb-6">
            <div className="text-3xl mb-1 filter drop-shadow-[0_0_10px_rgba(255,209,102,0.8)]">
              🪔
            </div>
            <h1 className="font-script text-3xl text-pink-200 tracking-wide drop-shadow-[0_0_12px_rgba(244,63,142,0.6)]">
              Genie
            </h1>
            <span className="font-handwriting text-xs text-pink-300/70 -mt-1 tracking-wider">
              Make her wishes come true ♡
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-gradient-to-r from-[#f43f8e] to-[#a855f7] text-white shadow-[0_0_20px_rgba(244,63,142,0.5)] font-bold'
                  : 'text-pink-200/70 hover:text-white hover:bg-pink-500/10'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveNav('wishes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                activeNav === 'wishes'
                  ? 'bg-gradient-to-r from-[#f43f8e] to-[#a855f7] text-white shadow-[0_0_20px_rgba(244,63,142,0.5)] font-bold'
                  : 'text-pink-200/70 hover:text-white hover:bg-pink-500/10'
              }`}
            >
              <Inbox size={16} />
              <span>Wish Requests</span>
              {pendingWishes.length > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-[#120826] font-bold">
                  {pendingWishes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                activeNav === 'stats'
                  ? 'bg-gradient-to-r from-[#f43f8e] to-[#a855f7] text-white shadow-[0_0_20px_rgba(244,63,142,0.5)] font-bold'
                  : 'text-pink-200/70 hover:text-white hover:bg-pink-500/10'
              }`}
            >
              <BarChart3 size={16} />
              <span>Statistics</span>
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                activeNav === 'settings'
                  ? 'bg-gradient-to-r from-[#f43f8e] to-[#a855f7] text-white shadow-[0_0_20px_rgba(244,63,142,0.5)] font-bold'
                  : 'text-pink-200/70 hover:text-white hover:bg-pink-500/10'
              }`}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide text-rose-300/70 hover:text-rose-200 hover:bg-rose-500/10 transition-all mt-3"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Artwork: Couple silhouette with quote */}
        <div className="pt-6 border-t border-pink-400/15 flex flex-col items-center text-center">
          <p className="font-script text-xl text-pink-300/90 mb-1">
            Always here for her ♡
          </p>
          <CoupleSilhouette className="w-36 h-24" />
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN ADMIN CONTENT AREA */}
      {/* ============================================================== */}
      <main className="flex-1 p-5 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        {/* Top Header Bar */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-4">
          {/* Fairytale Castle Silhouette in background of header */}
          <FairytaleCastle className="absolute -top-12 -left-6 sm:left-48 w-60 h-40" />

          <div className="relative z-10">
            <h1 className="font-script text-3xl sm:text-4xl text-white tracking-wide drop-shadow-[0_0_15px_rgba(244,63,142,0.4)]">
              Welcome Back, My Love ♡
            </h1>
            <p className="text-xs sm:text-sm text-pink-200/70 mt-1">
              Here are the latest wishes from your Genie
            </p>
          </div>

          {/* Admin Avatar Profile Pill */}
          <div className="relative z-10 self-end sm:self-auto flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1f0d3d]/80 border border-pink-400/25 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <AdminAvatar size="sm" />
            <span className="text-xs font-semibold text-pink-100">Admin ⌄</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4 STAT METRIC CARDS ROW */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {/* Card 1: Total Wishes */}
          <div className="glass-card rounded-[22px] p-4.5 border border-pink-500/20 shadow-[0_8px_25px_rgba(244,63,142,0.15)] relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 mb-3">
              <Gift size={20} />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-pink-200/60 font-semibold block mb-0.5">
              Total Wishes
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalCount}
              </span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                ↑ +12%
              </span>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="glass-card rounded-[22px] p-4.5 border border-purple-500/20 shadow-[0_8px_25px_rgba(168,85,247,0.15)] relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 mb-3">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-purple-200/60 font-semibold block mb-0.5">
              Completed
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {completedCount}
              </span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                ↑ +8%
              </span>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="glass-card rounded-[22px] p-4.5 border border-amber-500/20 shadow-[0_8px_25px_rgba(245,158,11,0.15)] relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-3">
              <Hourglass size={20} />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-amber-200/60 font-semibold block mb-0.5">
              Pending
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {pendingWishes.length}
              </span>
            </div>
          </div>

          {/* Card 4: Approved */}
          <div className="glass-card rounded-[22px] p-4.5 border border-emerald-500/20 shadow-[0_8px_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-3">
              <Star size={20} />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-200/60 font-semibold block mb-0.5">
              Approved
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {approvedWishes.length}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: PENDING WISHES (Matching Reference Image) */}
        {/* ============================================================== */}
        <div className="glass-card rounded-[24px] p-5 sm:p-6 border border-pink-400/20 mb-7">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-400/15">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Hourglass size={18} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Pending Wishes
              </h2>
            </div>
            <button
              onClick={() => setActiveNav('wishes')}
              className="text-xs text-pink-300/80 hover:text-pink-100 flex items-center gap-1 font-semibold transition-colors"
            >
              View All →
            </button>
          </div>

          {pendingWishes.length === 0 ? (
            <div className="text-center py-8 text-pink-200/60 text-sm font-handwriting">
              No pending wishes waiting right now. All caught up with her dreams ♡
            </div>
          ) : (
            <div className="space-y-3">
              {pendingWishes.map((wish) => (
                <div
                  key={wish.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#241240]/80 border border-pink-400/15 hover:border-pink-400/35 transition-all"
                >
                  {/* Left: Ananya Avatar + Wish title + time */}
                  <div className="flex items-center gap-3">
                    <AnanyaAvatar size="md" />
                    <div>
                      <p className="text-sm font-semibold text-white leading-snug">
                        {wish.title} ♡
                      </p>
                      <span className="text-[11px] text-pink-300/60">
                        {formatRelativeTime(wish.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Right: 3 Direct Action Buttons (Matching Reference Image) */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Approve Button (Green) */}
                    <button
                      onClick={() => handleApprove(wish.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-100 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check size={13} />
                      <span>Approve</span>
                    </button>

                    {/* Reject Button (Rose/Red) */}
                    <button
                      onClick={() => handleReject(wish.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-100 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <X size={13} />
                      <span>Reject</span>
                    </button>

                    {/* Mark Done Button (Purple) */}
                    <button
                      onClick={() => handleMarkDone(wish.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-100 bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      <span>Mark Done</span>
                    </button>

                    {/* Edit Note Button */}
                    <button
                      onClick={() => handleOpenEdit(wish)}
                      className="p-1.5 rounded-xl text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-500/25 border border-pink-400/30 transition-all"
                      title="Add love note / schedule"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: RECENT ACTIVITY (Matching Reference Image) */}
        {/* ============================================================== */}
        <div className="glass-card rounded-[24px] p-5 sm:p-6 border border-pink-400/20 mb-7">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-400/15">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Activity size={18} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Recent Activity
              </h2>
            </div>
            <button
              onClick={() => setActiveNav('wishes')}
              className="text-xs text-pink-300/80 hover:text-pink-100 flex items-center gap-1 font-semibold transition-colors"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {wishes.slice(0, 5).map((w, index) => {
              const isApproved = w.status === 'MAGIC IN PROGRESS' || w.status === 'COMING SOON';
              const isDone = w.status === 'WISH GRANTED';

              return (
                <div key={w.id} className="flex items-start gap-3 text-xs sm:text-sm">
                  {/* Colored Status Dot */}
                  <div className="mt-0.5">
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                        <Check size={11} />
                      </div>
                    ) : isApproved ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                        <Check size={11} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-pink-500/30 border border-pink-400 flex items-center justify-center text-pink-300 shadow-[0_0_8px_rgba(244,63,142,0.5)]">
                        ✦
                      </div>
                    )}
                  </div>

                  {/* Activity Message & Time */}
                  <div className="flex-1">
                    <p className="text-pink-100/90 font-medium">
                      {isDone ? (
                        <>
                          You marked as completed:{' '}
                          <span className="font-semibold text-white">"{w.title}"</span> 🧸
                        </>
                      ) : isApproved ? (
                        <>
                          You approved:{' '}
                          <span className="font-semibold text-white">"{w.title}"</span> 💕
                        </>
                      ) : (
                        <>
                          New wish received:{' '}
                          <span className="font-semibold text-white">"{w.title}"</span> ♡
                        </>
                      )}
                    </p>
                    <span className="text-[11px] text-pink-300/60">
                      {formatRelativeTime(w.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: BOTTOM BANNER (Matching Reference Image) */}
        {/* ============================================================== */}
        <div className="glass-card rounded-[24px] p-6 border border-pink-400/25 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_10px_35px_rgba(244,63,142,0.18)]">
          <div className="relative z-10 max-w-md">
            <p className="font-script text-2xl sm:text-3xl text-pink-200 leading-snug drop-shadow-[0_0_15px_rgba(244,63,142,0.6)]">
              "Every wish of hers... is a little piece of your love ♡"
            </p>
            <p className="font-handwriting text-xs sm:text-sm text-pink-300/70 mt-1">
              Your secret sanctuary for turning Ananya's dreams into eternal memories.
            </p>
          </div>

          <div className="shrink-0 -mb-6 -mr-4 sm:mr-0 self-end">
            <CoupleSilhouette className="w-44 h-28" withHeartString={true} />
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* EDIT WISH MODAL (Secret Love Notes & Dates) */}
      {/* ============================================================== */}
      {editingWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-[28px] max-w-lg w-full p-6 border border-pink-400/35 relative">
            <h3 className="font-script text-3xl text-pink-200 mb-1">
              Fulfill Her Wish ♡
            </h3>
            <p className="text-xs text-pink-300/70 mb-4">
              “{editingWish.title}”
            </p>

            <form onSubmit={handleSaveWishChanges} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-pink-300 font-semibold mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as WishStatus)}
                  className="w-full bg-[#1e0c38] border border-pink-400/30 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="WISH RECEIVED">Pending (Received)</option>
                  <option value="MAGIC IN PROGRESS">Approved (Magic in Progress)</option>
                  <option value="COMING SOON">Approved (Coming Soon)</option>
                  <option value="WISH GRANTED">Completed (Wish Granted)</option>
                  <option value="ON HOLD">Reject / On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-pink-300 font-semibold mb-1">
                  Secret Love Note from Genie / Admin
                </label>
                <textarea
                  value={editResponse}
                  onChange={(e) => setEditResponse(e.target.value)}
                  placeholder="e.g. I already booked the dinner table for 8pm, wear your favorite dress! ♡"
                  rows={3}
                  className="w-full bg-[#1e0c38] border border-pink-400/30 rounded-xl p-3 text-sm text-white placeholder-pink-300/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-pink-300 font-semibold mb-1">
                  Scheduled Arrival Date
                </label>
                <input
                  type="datetime-local"
                  value={editCompletionDate}
                  onChange={(e) => setEditCompletionDate(e.target.value)}
                  className="w-full bg-[#1e0c38] border border-pink-400/30 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteWish(editingWish)}
                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>Delete Wish</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingWish(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-pink-300/80 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-[#120826] bg-gradient-to-r from-[#ffd166] via-[#f43f8e] to-[#c084fc] shadow-[0_0_15px_rgba(244,63,142,0.4)]"
                  >
                    Save Changes ♡
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
