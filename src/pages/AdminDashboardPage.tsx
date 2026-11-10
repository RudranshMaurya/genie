import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToWishes, updateWishByAdmin, deleteWish, subscribeToMessages, saveGenieMessage } from '../services/wishService';
import { Wish, WishStatus, GenieMessage } from '../types';
import { sound } from '../utils/sound';
import {
  Shield,
  LogOut,
  Edit3,
  Trash2,
  CheckCircle,
  Calendar,
  MessageSquare,
  Sparkles,
  Lock,
  PlusCircle,
  Key,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, loginAsAdmin, logout, authError } = useAuth();
  const [passkeyInput, setPasskeyInput] = useState('');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [messages, setMessages] = useState<GenieMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'wishes' | 'notes' | 'settings'>('wishes');

  // Modal editing wish state
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [editStatus, setEditStatus] = useState<WishStatus>('UNDER CONSIDERATION');
  const [editResponse, setEditResponse] = useState('');
  const [editCompletionDate, setEditCompletionDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // New Note Modal state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const unsubWishes = subscribeToWishes(setWishes);
    const unsubMsgs = subscribeToMessages(setMessages);
    return () => {
      unsubWishes();
      unsubMsgs();
    };
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

  // Open edit modal for a wish
  const handleOpenEdit = (wish: Wish) => {
    sound.playChime(750);
    setEditingWish(wish);
    setEditStatus(wish.status);
    setEditResponse(wish.adminResponse || '');
    // Format date for datetime-local input if present
    if (wish.expectedCompletionAt) {
      try {
        const d = new Date(wish.expectedCompletionAt);
        const iso = d.toISOString().slice(0, 16);
        setEditCompletionDate(iso);
      } catch {
        setEditCompletionDate('');
      }
    } else {
      setEditCompletionDate('');
    }
  };

  // Save changes to wish
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
    } catch (err) {
      alert('Failed to update wish. Please check network/permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete wish
  const handleDeleteWish = async (wish: Wish) => {
    const confirmed = window.confirm(`Are you certain you wish to delete: "${wish.title}"?`);
    if (!confirmed) return;

    sound.playSmokePoof();
    await deleteWish(wish.id);
  };

  // Add new note from Genie
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    await saveGenieMessage({
      title: newNoteTitle.trim() || 'A Whisper From Your Genie',
      content: newNoteContent.trim(),
      active: true,
    });

    sound.playWishCaptured();
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  // 1. If not authenticated as Admin, display Master Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md parchment-card rounded-3xl p-8 gold-border-ornament text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-tr from-[#78350f] via-[#d4af37] to-[#ffe57f] flex items-center justify-center shadow-[0_0_20px_rgba(245,196,67,0.4)]">
            <Lock className="text-[#050716]" size={28} />
          </div>

          <h2 className="font-fairytale text-2xl text-[#fff3b0] mb-1">
            Master Chamber
          </h2>
          <p className="font-storybook italic text-sm text-[#f4ecd8]/70 mb-6">
            Private Administrator access. Reserved exclusively for the one who turns Ananya's wishes into reality.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-xs text-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs uppercase tracking-widest text-[#d4af37]/80 font-fairytale mb-1.5">
                Master Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter secret administrator key..."
                  className="w-full bg-[#060919] border border-[#d4af37]/30 focus:border-[#f5c443] rounded-2xl px-4 py-3 pl-10 text-sm text-[#f4ecd8] placeholder-[#f4ecd8]/30 focus:outline-none"
                  required
                />
                <Key className="absolute left-3 top-3.5 text-[#d4af37]/60" size={17} />
              </div>
              <p className="text-[11px] text-[#d4af37]/60 font-storybook italic mt-1.5">
                Protected administrative chamber. Enter your private master key.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-fairytale text-xs tracking-widest text-[#050716] font-bold bg-gradient-to-r from-[#ffe57f] via-[#f5c443] to-[#d4af37] shadow-[0_0_15px_rgba(245,196,67,0.4)] hover:shadow-[0_0_25px_rgba(245,196,67,0.7)] transition-all"
            >
              Enter Master Chamber ✦
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  const pendingCount = wishes.filter(
    (w) => w.status === 'WISH RECEIVED' || w.status === 'UNDER CONSIDERATION'
  ).length;
  const inProgressCount = wishes.filter((w) => w.status === 'MAGIC IN PROGRESS').length;
  const comingSoonCount = wishes.filter((w) => w.status === 'COMING SOON').length;
  const grantedCount = wishes.filter((w) => w.status === 'WISH GRANTED').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header bar with logout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#d4af37]/20">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#f5c443] font-semibold flex items-center gap-1.5 font-fairytale">
            <Shield size={14} /> Master Administrator Dashboard
          </span>
          <h1 className="font-fairytale text-2xl sm:text-3xl text-[#fff3b0] mt-1">
            Ananya's Wish Orchestration
          </h1>
        </div>

        <button
          onClick={() => {
            sound.playChime(600);
            logout();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider text-[#f4ecd8]/70 hover:text-white bg-[#0e1438] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all"
        >
          <LogOut size={14} />
          <span>Exit Admin Mode</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="parchment-card rounded-2xl p-4 text-center">
          <span className="text-[11px] uppercase tracking-wider text-[#d4af37]/70 font-fairytale block mb-1">
            Total Wishes
          </span>
          <span className="font-fairytale text-2xl sm:text-3xl font-bold text-[#fff3b0]">
            {wishes.length}
          </span>
        </div>
        <div className="parchment-card rounded-2xl p-4 text-center">
          <span className="text-[11px] uppercase tracking-wider text-[#c7d2fe] font-fairytale block mb-1">
            Pending Review
          </span>
          <span className="font-fairytale text-2xl sm:text-3xl font-bold text-[#a5b4fc]">
            {pendingCount}
          </span>
        </div>
        <div className="parchment-card rounded-2xl p-4 text-center">
          <span className="text-[11px] uppercase tracking-wider text-[#93c5fd] font-fairytale block mb-1">
            In Progress & Soon
          </span>
          <span className="font-fairytale text-2xl sm:text-3xl font-bold text-[#60a5fa]">
            {inProgressCount + comingSoonCount}
          </span>
        </div>
        <div className="parchment-card rounded-2xl p-4 text-center">
          <span className="text-[11px] uppercase tracking-wider text-[#6ee7b7] font-fairytale block mb-1">
            Fulfilled
          </span>
          <span className="font-fairytale text-2xl sm:text-3xl font-bold text-[#34d399]">
            {grantedCount}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#d4af37]/20 pb-2">
        <button
          onClick={() => setActiveTab('wishes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-fairytale tracking-wider transition-all ${
            activeTab === 'wishes'
              ? 'bg-[#f5c443] text-[#050716] font-bold'
              : 'text-[#f4ecd8]/70 hover:text-white'
          }`}
        >
          Wishes Management ({wishes.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-fairytale tracking-wider transition-all ${
            activeTab === 'notes'
              ? 'bg-[#f5c443] text-[#050716] font-bold'
              : 'text-[#f4ecd8]/70 hover:text-white'
          }`}
        >
          Genie Love Notes ({messages.length})
        </button>
      </div>

      {/* Tab 1: Wishes Management Table / List */}
      {activeTab === 'wishes' && (
        <div className="space-y-4">
          {wishes.length === 0 ? (
            <p className="text-center py-12 font-storybook italic text-[#f4ecd8]/60">
              No wishes submitted yet.
            </p>
          ) : (
            wishes.map((wish) => (
              <div
                key={wish.id}
                className="parchment-card rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-[#d4af37]/60"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#d4af37] font-storybook mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#090f26] border border-[#d4af37]/20 uppercase">
                      {wish.category}
                    </span>
                    <span>•</span>
                    <span>Submitted: {new Date(wish.createdAt).toLocaleDateString()}</span>
                    {wish.expectedCompletionAt && (
                      <>
                        <span>•</span>
                        <span className="text-[#fde047] font-semibold">
                          Scheduled: {new Date(wish.expectedCompletionAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-fairytale text-base sm:text-lg text-[#fff3b0]">
                    {wish.title}
                  </h3>

                  {wish.description && wish.description !== wish.title && (
                    <p className="font-storybook text-xs sm:text-sm text-[#f4ecd8]/70 italic line-clamp-2 mt-0.5">
                      "{wish.description}"
                    </p>
                  )}

                  {wish.adminResponse && (
                    <p className="text-xs text-[#fed7aa] font-storybook italic mt-2">
                      <strong className="text-[#f5c443]">Your Note:</strong> "{wish.adminResponse}"
                    </p>
                  )}
                </div>

                {/* Status indicator and actions */}
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#d4af37]/15">
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-[#12193e] border border-[#d4af37]/30 text-[#fff3b0]">
                    {wish.status}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(wish)}
                      className="p-2 rounded-xl bg-[#1e3a8a]/60 hover:bg-[#1e3a8a] text-[#93c5fd] border border-[#3b82f6]/40 transition-colors"
                      title="Manage Status & Notes"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteWish(wish)}
                      className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 transition-colors"
                      title="Delete wish"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Genie Love Notes Management */}
      {activeTab === 'notes' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fairytale text-lg text-[#fff3b0]">
              Personal Notes Visible to Ananya
            </h2>
            <button
              onClick={() => setIsAddingNote(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-fairytale bg-[#f5c443] text-[#050716] font-bold hover:bg-[#ffe57f] transition-all"
            >
              <PlusCircle size={14} />
              <span>Add New Note</span>
            </button>
          </div>

          {/* Form for new note */}
          {isAddingNote && (
            <form onSubmit={handleCreateNote} className="parchment-card rounded-2xl p-5 mb-6 space-y-3">
              <h4 className="font-fairytale text-xs uppercase tracking-widest text-[#d4af37]">
                Pen a Secret Message
              </h4>
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note Title (e.g. 'A Promise of Adventure')"
                className="w-full bg-[#060919] border border-[#d4af37]/30 rounded-xl px-3 py-2 text-xs text-[#f4ecd8] focus:outline-none"
              />
              <textarea
                rows={3}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write your note to Ananya..."
                className="w-full bg-[#060919] border border-[#d4af37]/30 rounded-xl px-3 py-2 text-xs text-[#f4ecd8] focus:outline-none font-storybook text-sm"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1.5 text-xs text-[#d4af37] hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-fairytale bg-[#f5c443] text-[#050716] font-bold"
                >
                  Publish Note 💌
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="parchment-card rounded-2xl p-5">
                <h4 className="font-fairytale text-sm text-[#f5c443] mb-1">{m.title}</h4>
                <p className="font-storybook italic text-sm text-[#f4ecd8]/90 mb-2">"{m.content}"</p>
                <div className="text-[11px] text-[#d4af37]/60 flex items-center justify-between">
                  <span>Author: {m.author}</span>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Wish Dialog */}
      {editingWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg parchment-card rounded-3xl p-6 sm:p-8 gold-border-ornament">
            <button
              onClick={() => setEditingWish(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-white"
            >
              ✕
            </button>

            <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
              Orchestrate Wish
            </span>
            <h3 className="font-fairytale text-xl text-[#fff3b0] mb-4">
              {editingWish.title}
            </h3>

            <form onSubmit={handleSaveWishChanges} className="space-y-4">
              {/* Status Select */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#d4af37]/90 font-fairytale mb-1.5">
                  Update Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as WishStatus)}
                  className="w-full bg-[#060919] border border-[#d4af37]/30 rounded-xl px-3 py-2.5 text-xs text-[#f4ecd8] focus:outline-none"
                >
                  <option value="WISH RECEIVED">WISH RECEIVED</option>
                  <option value="UNDER CONSIDERATION">UNDER CONSIDERATION</option>
                  <option value="MAGIC IN PROGRESS">MAGIC IN PROGRESS</option>
                  <option value="COMING SOON">COMING SOON</option>
                  <option value="WISH GRANTED">WISH GRANTED (Fulfilled)</option>
                  <option value="ON HOLD">ON HOLD</option>
                </select>
              </div>

              {/* Expected Completion Date & Time */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#d4af37]/90 font-fairytale mb-1.5">
                  Expected Completion Date (for Countdown)
                </label>
                <input
                  type="datetime-local"
                  value={editCompletionDate}
                  onChange={(e) => setEditCompletionDate(e.target.value)}
                  className="w-full bg-[#060919] border border-[#d4af37]/30 rounded-xl px-3 py-2 text-xs text-[#f4ecd8] focus:outline-none"
                />
              </div>

              {/* Personal Response / Note for Ananya */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#d4af37]/90 font-fairytale mb-1.5">
                  Personal Genie Note For Ananya
                </label>
                <textarea
                  rows={3}
                  value={editResponse}
                  onChange={(e) => setEditResponse(e.target.value)}
                  placeholder="e.g., 'Your mountain adventure is coming sooner than you think. Just wait a little...'"
                  className="w-full bg-[#060919] border border-[#d4af37]/30 rounded-xl px-3 py-2 text-xs text-[#f4ecd8] focus:outline-none font-storybook text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingWish(null)}
                  className="px-4 py-2 text-xs text-[#d4af37] hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-fairytale text-xs tracking-wider text-[#050716] font-bold bg-[#f5c443] hover:bg-[#ffe57f] transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Saving Magic...' : 'Save & Broadcast Live ✦'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
