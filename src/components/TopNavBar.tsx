import React from 'react';
import { Sparkles, Star, Volume2, VolumeX, Trophy, BookOpen, Target, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';

export type GameTab = 'explore' | 'match' | 'bubbles' | 'quiz';

interface TopNavBarProps {
  activeTab: GameTab;
  onSelectTab: (tab: GameTab) => void;
  stars: number;
  onOpenStickers: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onSelectTab,
  stars,
  onOpenStickers,
  soundEnabled,
  onToggleSound
}) => {
  const tabs = [
    {
      id: 'explore' as GameTab,
      label: 'Kenal Huruf J, G, H',
      shortLabel: 'Kenal Huruf',
      emoji: '🌟',
      badge: 'Fokus J!'
    },
    {
      id: 'match' as GameTab,
      label: 'Mencocokkan',
      shortLabel: 'Cocokkan',
      emoji: '🎯',
      badge: 'J, G, H'
    },
    {
      id: 'bubbles' as GameTab,
      label: 'Pecahkan Balon',
      shortLabel: 'Balon',
      emoji: '🫧',
      badge: 'Seru'
    },
    {
      id: 'quiz' as GameTab,
      label: 'Kuis Ceria',
      shortLabel: 'Kuis',
      emoji: '❓',
      badge: 'Bintang'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        {/* Upper Row: Brand, Stars, Sound, Sticker Book */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo / App Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 flex items-center justify-center text-2xl sm:text-3xl shadow-md border-2 border-white">
              🦒
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-2xl font-black text-amber-900 tracking-tight leading-none">
                  Petualangan Huruf J, G & H
                </h1>
                <span className="hidden md:inline-flex bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-300">
                  Belajar Abjad Ceria
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-amber-700 hidden sm:block">
                Mengenal Huruf J & Mengulang Huruf G, H dengan Suara Interaktif
              </p>
            </div>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2">
            {/* Star Counter */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-xs">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-wiggle" />
              <span className="font-black text-amber-900 text-base sm:text-lg">
                {stars}
              </span>
            </div>

            {/* Sticker Book Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenStickers();
              }}
              type="button"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs sm:text-sm px-3 py-2 rounded-2xl shadow-md transition-all cursor-pointer"
              title="Buka Buku Stiker Hadiah"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Stiker</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              type="button"
              className={`p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
              }`}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Lower Row: Navigation Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-amber-100 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(tab.id);
                }}
                type="button"
                className={`flex-shrink-0 px-3.5 sm:px-5 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-amber-50/70 hover:bg-amber-100 text-amber-900 border border-amber-200/60'
                }`}
              >
                <span className="text-base sm:text-lg">{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/30 text-white'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
