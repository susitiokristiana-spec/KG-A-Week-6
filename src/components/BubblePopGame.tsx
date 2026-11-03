import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, Volume2, Target, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

interface BubbleItem {
  id: number;
  letter: 'J' | 'G' | 'H';
  isLower: boolean;
  x: number; // percentage 10% - 85%
  y: number; // percentage 10% - 75%
  size: number;
  color: string;
  popped: boolean;
}

interface BubblePopGameProps {
  onEarnStar: () => void;
  onWinGame: () => void;
}

export const BubblePopGame: React.FC<BubblePopGameProps> = ({
  onEarnStar,
  onWinGame
}) => {
  const [targetLetter, setTargetLetter] = useState<'J' | 'G' | 'H'>('J');
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const targetGoal = 6;
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [mascotTip, setMascotTip] = useState<string>('Pecahkan semua gelembung Huruf J!');

  // Generate bubbles
  const spawnBubbles = (target: 'J' | 'G' | 'H') => {
    const newBubbles: BubbleItem[] = [];
    const colors = [
      'from-amber-400 to-orange-400',
      'from-emerald-400 to-teal-400',
      'from-blue-400 to-indigo-400',
      'from-pink-400 to-rose-400',
      'from-purple-400 to-violet-400'
    ];

    // Guarantee at least 6 target letters and some distractions
    const baseLetters: ('J' | 'G' | 'H')[] = [
      target, target, target, target, target, target, target,
      target === 'J' ? 'G' : 'J',
      target === 'J' ? 'H' : 'J',
      'G', 'H', 'J', 'G', 'H'
    ];
    const letterPool = [...baseLetters].sort(() => 0.5 - Math.random());

    letterPool.slice(0, 12).forEach((l, idx) => {
      newBubbles.push({
        id: Date.now() + idx,
        letter: l,
        isLower: Math.random() > 0.45,
        x: 8 + (idx % 4) * 22 + (Math.random() * 8 - 4),
        y: 10 + Math.floor(idx / 4) * 28 + (Math.random() * 8 - 4),
        size: 72 + Math.floor(Math.random() * 20),
        color: colors[idx % colors.length],
        popped: false
      });
    });

    setBubbles(newBubbles);
    setPoppedCount(0);
    setIsVictory(false);
    const targetName = target === 'J' ? 'Huruf J (Jerapah & Jam)' : target === 'G' ? 'Huruf G (Gajah & Gitar)' : 'Huruf H (Harimau & Hujan)';
    setMascotTip(`Misi Ceria: Cari dan pecahkan semua ${targetName}!`);
    sound.speak(`Ayo cari dan pecahkan semua gelembung ${target === 'J' ? 'Huruf J' : target === 'G' ? 'Huruf G' : 'Huruf H'}!`);
  };

  useEffect(() => {
    spawnBubbles(targetLetter);
  }, [targetLetter]);

  const handleBubbleClick = (bubble: BubbleItem) => {
    if (bubble.popped) return;

    if (bubble.letter === targetLetter) {
      // Correct!
      sound.playPop();
      onEarnStar();

      setBubbles(prev =>
        prev.map(b => (b.id === bubble.id ? { ...b, popped: true } : b))
      );

      const newCount = poppedCount + 1;
      setPoppedCount(newCount);

      if (newCount >= targetGoal) {
        setIsVictory(true);
        sound.playSuccess();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
        sound.speak(`Hore! Kamu berhasil menangkap semua Huruf ${targetLetter}! Hebat sekali!`);
        onWinGame();
      } else {
        sound.speak(`Betul! Huruf ${targetLetter}!`);
      }
    } else {
      // Wrong bubble tapped
      sound.playBoing();
      sound.speak(`Itu huruf ${bubble.letter}! Ayo cari huruf ${targetLetter} ya!`);
      setMascotTip(`Ups, itu huruf ${bubble.letter}! Yuk fokus cari huruf ${targetLetter}!`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Header controls & Mission Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-slate-200 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            🫧
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Pecahkan Gelembung Huruf!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              {mascotTip}
            </p>
          </div>
        </div>

        {/* Target Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ganti Misi:
          </span>
          <button
            onClick={() => setTargetLetter('J')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              targetLetter === 'J'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Huruf J ⭐
          </button>
          <button
            onClick={() => setTargetLetter('G')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              targetLetter === 'G'
                ? 'bg-emerald-500 text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Huruf G 🐘
          </button>
          <button
            onClick={() => setTargetLetter('H')}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              targetLetter === 'H'
                ? 'bg-blue-500 text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Huruf H 🐯
          </button>
        </div>
      </div>

      {/* Progress Bar for the round */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-sm text-slate-700">
            Target Huruf {targetLetter}:
          </span>
          <span className="font-black text-amber-600 text-lg">
            {poppedCount} / {targetGoal}
          </span>
        </div>

        {/* Visual Progress Stars */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: targetGoal }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                i < poppedCount
                  ? 'bg-amber-400 text-white scale-110 shadow-xs'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              ★
            </div>
          ))}
        </div>
      </div>

      {/* Bubbles Floating Pond Area */}
      <div className="relative w-full h-[420px] sm:h-[460px] bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 rounded-3xl border-4 border-sky-200 shadow-inner overflow-hidden select-none">
        {/* Soft background decor */}
        <div className="absolute top-4 left-6 text-3xl opacity-30 pointer-events-none">☁️</div>
        <div className="absolute top-12 right-10 text-4xl opacity-30 pointer-events-none">☁️</div>
        <div className="absolute bottom-2 left-10 text-4xl opacity-40 pointer-events-none">🌿</div>
        <div className="absolute bottom-2 right-12 text-4xl opacity-40 pointer-events-none">🌱</div>

        {!isVictory ? (
          bubbles.map((bubble) => {
            if (bubble.popped) return null;
            const displayLetter = bubble.isLower ? bubble.letter.toLowerCase() : bubble.letter;
            return (
              <button
                key={bubble.id}
                onClick={() => handleBubbleClick(bubble)}
                type="button"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                }}
                className={`absolute rounded-full bg-gradient-to-tr ${bubble.color} text-white flex items-center justify-center shadow-lg border-2 border-white/80 active:scale-90 hover:scale-110 transition-transform duration-150 cursor-pointer animate-float`}
              >
                {/* Bubble shine reflection */}
                <span className="absolute top-2 left-2 w-3 h-2 bg-white/60 rounded-full rotate-[-30deg]" />
                <span className="text-3xl sm:text-4xl font-black drop-shadow select-none">
                  {displayLetter}
                </span>
              </button>
            );
          })
        ) : (
          /* Victory overlay */
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 animate-pop-in space-y-4">
            <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-6xl shadow-md animate-bounce">
              🌟
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-800">
              MISI SELESAI DENGAN SEMPURNA!
            </h3>
            <p className="text-base sm:text-lg font-bold text-amber-900 max-w-md">
              Kamu jago sekali membedakan Huruf {targetLetter} dengan huruf lainnya!
            </p>
            <button
              onClick={() => spawnBubbles(targetLetter)}
              type="button"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg shadow-xl hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Main Lagi!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
