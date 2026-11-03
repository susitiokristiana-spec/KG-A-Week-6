import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopNavBar, GameTab } from './components/TopNavBar';
import { MascotBanner } from './components/MascotBanner';
import { ExploreLetters } from './components/ExploreLetters';
import { MatchGame } from './components/MatchGame';
import { BubblePopGame } from './components/BubblePopGame';
import { QuizAbjad } from './components/QuizAbjad';
import { StickerBookModal } from './components/StickerBookModal';
import { INITIAL_STICKERS, StickerReward } from './data/alphabetData';
import { sound } from './utils/sound';

export default function App() {
  const [activeTab, setActiveTab] = useState<GameTab>('explore');
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('abjad_jgh_stars');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [stickers, setStickers] = useState<StickerReward[]>(() => {
    try {
      const saved = localStorage.getItem('abjad_jgh_stickers');
      return saved ? JSON.parse(saved) : INITIAL_STICKERS;
    } catch {
      return INITIAL_STICKERS;
    }
  });

  const [isStickerModalOpen, setIsStickerModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeMascotLetter, setActiveMascotLetter] = useState<'J' | 'G' | 'H'>('J');

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('abjad_jgh_stars', stars.toString());
      localStorage.setItem('abjad_jgh_stickers', JSON.stringify(stickers));
    } catch {
      // Ignore
    }
  }, [stars, stickers]);

  const handleEarnStar = () => {
    setStars(prev => {
      const nextStars = prev + 1;
      checkStickerUnlocks(nextStars, 'star');
      return nextStars;
    });
  };

  const handleWinGame = () => {
    setStars(prev => {
      const nextStars = prev + 3;
      checkStickerUnlocks(nextStars, 'game_win');
      return nextStars;
    });
  };

  const checkStickerUnlocks = (currentStars: number, reason: string) => {
    setStickers(prev =>
      prev.map(stk => {
        if (stk.unlocked) return stk;
        if (stk.id === 'stk-jam' && reason === 'game_win') return { ...stk, unlocked: true };
        if (stk.id === 'stk-jagung' && currentStars >= 5) return { ...stk, unlocked: true };
        if (stk.id === 'stk-gitar' && currentStars >= 8) return { ...stk, unlocked: true };
        if (stk.id === 'stk-hujan' && currentStars >= 11) return { ...stk, unlocked: true };
        if (stk.id === 'stk-helikopter' && currentStars >= 13) return { ...stk, unlocked: true };
        if (stk.id === 'stk-bintang-emas' && currentStars >= 15) return { ...stk, unlocked: true };
        return stk;
      })
    );
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.setSoundEnabled(nextVal);
    sound.setSpeechEnabled(nextVal);
    if (nextVal) {
      sound.playClick();
      sound.speak('Suara aktif kembali!');
    }
  };

  const getMascotMessages = () => {
    switch (activeTab) {
      case 'explore':
        return {
          msg: activeMascotLetter === 'J'
            ? 'Selamat datang! Ayo mengenal Huruf J bersama Jojo si Jerapah!'
            : activeMascotLetter === 'G'
            ? 'Ayo kita mengulang Huruf G bersama Gani si Gajah!'
            : 'Ayo kita mengulang Huruf H bersama Hani si Harimau!',
          sub: 'Ketuk huruf besar, dengarkan bunyi fonik, atau coba jiplak hurufnya!'
        };
      case 'match':
        return {
          msg: 'Game Mencocokkan Rumah Huruf J, G, dan H!',
          sub: 'Tarik atau ketuk gambar ke rumah huruf yang sesuai ya!'
        };
      case 'bubbles':
        return {
          msg: 'Seru sekali! Pecahkan semua gelembung Huruf J!',
          sub: 'Hati-hati jangan sampai tertukar dengan huruf G atau H ya!'
        };
      case 'quiz':
        return {
          msg: 'Waktunya Kuis Ceria! Uji kepintaranmu!',
          sub: 'Dengarkan pertanyaan dan pilih jawaban yang paling tepat!'
        };
      default:
        return {
          msg: 'Ayo belajar dan bermain abjad bersama!',
          sub: ''
        };
    }
  };

  const mascotInfo = getMascotMessages();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* Background playful floating shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-10 left-[8%] text-6xl animate-float" style={{ animationDelay: '0s' }}>☁️</div>
        <div className="absolute top-24 right-[12%] text-5xl animate-float" style={{ animationDelay: '1.5s' }}>☁️</div>
        <div className="absolute top-48 left-[22%] text-4xl animate-float" style={{ animationDelay: '2.5s' }}>✨</div>
        <div className="absolute top-64 right-[25%] text-4xl animate-float" style={{ animationDelay: '0.8s' }}>🌟</div>
      </div>

      {/* Top Navigation */}
      <TopNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        stars={stars}
        onOpenStickers={() => setIsStickerModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 relative z-10 flex flex-col justify-start">
        {/* Animated Mascot Guidance Banner */}
        <MascotBanner
          message={mascotInfo.msg}
          subMessage={mascotInfo.sub}
          activeLetter={activeMascotLetter}
        />

        {/* Dynamic Game Modes */}
        <div className="mt-2 flex-1">
          {activeTab === 'explore' && (
            <ExploreLetters
              onEarnStar={handleEarnStar}
              onSelectLetter={setActiveLetterKey => setActiveMascotLetter(setActiveLetterKey)}
            />
          )}

          {activeTab === 'match' && (
            <MatchGame
              onEarnStar={handleEarnStar}
              onWinGame={handleWinGame}
            />
          )}

          {activeTab === 'bubbles' && (
            <BubblePopGame
              onEarnStar={handleEarnStar}
              onWinGame={handleWinGame}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizAbjad
              onEarnStar={handleEarnStar}
              onWinGame={handleWinGame}
            />
          )}
        </div>
      </main>

      {/* Footer Encouragement & Decor */}
      <footer className="w-full bg-white/70 backdrop-blur-xs border-t border-amber-200 py-3 text-center text-xs sm:text-sm font-bold text-amber-900 z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span>🦒 🐘 🐯</span>
            <span>Belajar Abjad Interaktif: Mengenal Huruf J, G, & H</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <span>🌟 Mudah</span>
            <span>🔊 Suara Ramah Anak</span>
            <span>🎉 Seru & Menyenangkan</span>
          </div>
        </div>
      </footer>

      {/* Reward Sticker Book Modal */}
      <StickerBookModal
        isOpen={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        stickers={stickers}
        totalStars={stars}
      />
    </div>
  );
}
