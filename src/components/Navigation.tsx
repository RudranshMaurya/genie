import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Scroll, Calendar, Heart, Shield, Menu, X } from 'lucide-react';
import { sound } from '../utils/sound';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onReplayIntro?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath,
  onNavigate,
  onReplayIntro,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const navItems = [
    { path: '/', label: 'The Lamp', icon: Sparkles },
    { path: '/wishes', label: 'Wish Vault', icon: Scroll },
    { path: '/calendar', label: 'Magic Calendar', icon: Calendar },
    { path: '/notes', label: 'Genie Notes', icon: Heart },
    { path: '/admin', label: 'Admin', icon: Shield, badge: isAdmin ? 'Active' : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#040612]/80 border-b border-[#d4af37]/20 select-none transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#966a12] via-[#f5c443] to-[#fff3b0] shadow-[0_0_15px_rgba(245,196,67,0.4)] group-hover:shadow-[0_0_25px_rgba(245,196,67,0.7)] transition-all">
            <span className="text-lg">🪔</span>
          </div>
          <div className="flex flex-col">
            <span className="font-fairytale font-bold text-lg sm:text-xl tracking-widest text-[#fff3b0] group-hover:text-[#ffd700] transition-colors">
              GENIE
            </span>
            <span className="font-storybook italic text-[11px] sm:text-xs text-[#d4af37]/80 -mt-1 tracking-wider">
              Ananya's World
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  sound.playChime(750);
                  onNavigate(item.path);
                }}
                className={`relative px-4 py-2 rounded-full text-xs lg:text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 ${
                  isActive
                    ? 'text-[#050716] font-semibold bg-gradient-to-r from-[#ffe57f] to-[#f5c443] shadow-[0_0_15px_rgba(245,196,67,0.5)]'
                    : 'text-[#f4ecd8]/70 hover:text-[#fff3b0] hover:bg-[#d4af37]/10'
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#3b82f6]/30 text-[#93c5fd] border border-[#3b82f6]/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Controls: Audio Toggle, Replay Intro & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {/* Replay Intro Button */}
          {onReplayIntro && (
            <button
              onClick={() => {
                sound.playChime(800);
                onReplayIntro();
              }}
              title="Replay Magical Awakening Intro"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-[#d4af37]/80 hover:text-[#fff3b0] px-3 py-1.5 rounded-full border border-[#d4af37]/30 hover:border-[#d4af37] transition-colors"
            >
              <span>Intro</span>
              <span>✦</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[#d4af37]/30 text-[#f5c443] hover:bg-[#d4af37]/10 transition-colors"
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* User Badge / Status */}
          <div className="hidden lg:flex items-center text-xs text-[#d4af37]/90 font-storybook italic pl-2 border-l border-[#d4af37]/20">
            {isAdmin ? '✨ Master Admin' : `✨ For ${user?.name || 'Ananya'}`}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center border border-[#d4af37]/30 text-[#f5c443]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#070b1f]/95 border-b border-[#d4af37]/30 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    sound.playChime(750);
                    onNavigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium tracking-wide flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'text-[#050716] font-semibold bg-gradient-to-r from-[#ffe57f] to-[#f5c443]'
                      : 'text-[#f4ecd8]/80 hover:bg-[#d4af37]/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {onReplayIntro && (
              <button
                onClick={() => {
                  sound.playChime(800);
                  onReplayIntro();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-xs text-[#d4af37]/80 hover:text-[#fff3b0] text-center border-t border-[#d4af37]/20 mt-2 pt-3"
              >
                Replay Magical Opening Sequence ✦
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
