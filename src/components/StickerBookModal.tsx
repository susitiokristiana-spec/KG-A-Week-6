import React, { useState } from 'react';
import { Sparkles, Trophy, X, RotateCcw, Volume2, Star, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StickerReward } from '../data/alphabetData';
import { sound } from '../utils/sound';

interface PlacedSticker {
  id: string;
  emoji: string;
  name: string;
  x: number;
  y: number;
}

interface StickerBookProps {
  isOpen: boolean;
  onClose: () => void;
  stickers: StickerReward[];
  totalStars: number;
}

export const StickerBookModal: React.FC<StickerBookProps> = ({
  isOpen,
  onClose,
  stickers,
  totalStars
}) => {
  const [selectedSticker, setSelectedSticker] = useState<StickerReward | null>(null);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([
    { id: 'init-1', emoji: '🦒', name: 'Jerapah', x: 25, y: 55 },
    { id: 'init-2', emoji: '🐘', name: 'Gajah', x: 65, y: 58 }
  ]);

  if (!isOpen) return null;

  const handleSelectSticker = (sticker: StickerReward) => {
    if (!sticker.unlocked) {
      sound.playBoing();
      sound.speak(`Stiker ini masih terkunci! Mainkan game untuk membuka ${sticker.name}!`);
      return;
    }
    sound.playClick();
    setSelectedSticker(sticker);
    sound.speak(`Kamu memilih stiker ${sticker.name}! Ketuk di taman untuk menempelkannya!`);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedSticker) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPlaced: PlacedSticker = {
      id: `${selectedSticker.id}-${Date.now()}`,
      emoji: selectedSticker.emoji,
      name: selectedSticker.name,
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(15, Math.min(85, y))
    };

    sound.playPop();
    sound.playStarTwinkle();
    setPlacedStickers(prev => [...prev, newPlaced]);
  };

  const handleClearMeadow = () => {
    sound.playClick();
    setPlacedStickers([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🏆</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Buku Stiker & Hadiah Bintang
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-950">
                Koleksi {totalStars} Bintang Juara!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            type="button"
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 active:scale-90 text-white transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Sticker Tray */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-slate-800 text-sm sm:text-base">
                Pilih Stiker yang Sudah Terbuka:
              </span>
              <span className="text-xs text-amber-700 font-bold">
                {stickers.filter(s => s.unlocked).length} dari {stickers.length} Terbuka
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {stickers.map((stk) => {
                const isSelected = selectedSticker?.id === stk.id;
                return (
                  <button
                    key={stk.id}
                    onClick={() => handleSelectSticker(stk)}
                    type="button"
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer text-center relative ${
                      !stk.unlocked
                        ? 'bg-slate-100 border-slate-200 opacity-60'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 scale-105 shadow-md'
                        : 'bg-amber-50/60 hover:bg-amber-100/60 border-amber-200'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl mb-1 filter drop-shadow">
                      {stk.unlocked ? stk.emoji : '🔒'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                      {stk.name}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Playground / Garden Meadow Canvas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-slate-800 text-sm sm:text-base">
                Taman Bermain Stiker Ceria
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {selectedSticker
                    ? `Klik di mana saja untuk menempelkan ${selectedSticker.name}!`
                    : 'Pilih stiker di atas untuk ditempel!'}
                </span>
                <button
                  onClick={handleClearMeadow}
                  type="button"
                  className="text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 px-2.5 py-1 rounded-full cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Bersihkan</span>
                </button>
              </div>
            </div>

            <div
              onClick={handleCanvasClick}
              className="relative w-full h-64 sm:h-80 rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 border-4 border-amber-200 shadow-inner overflow-hidden cursor-pointer select-none"
            >
              {/* Sun & Clouds */}
              <div className="absolute top-4 right-8 text-5xl animate-spin" style={{ animationDuration: '30s' }}>
                ☀️
              </div>
              <div className="absolute top-6 left-10 text-4xl opacity-75">☁️</div>
              <div className="absolute top-12 left-44 text-3xl opacity-50">☁️</div>
              <div className="absolute top-8 right-36 text-4xl opacity-70">🌈</div>

              {/* Rolling Hills & Grass */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-[50px] border-t-4 border-emerald-500/20" />
              <div className="absolute bottom-2 left-6 text-3xl">🌻</div>
              <div className="absolute bottom-2 left-32 text-2xl">🌷</div>
              <div className="absolute bottom-2 right-16 text-3xl">🌳</div>
              <div className="absolute bottom-2 right-40 text-2xl">🍄</div>

              {/* Placed Stickers */}
              {placedStickers.map((ps) => (
                <div
                  key={ps.id}
                  style={{
                    left: `${ps.x}%`,
                    top: `${ps.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute text-5xl sm:text-6xl animate-pop-in hover:scale-125 transition-transform cursor-pointer filter drop-shadow-md"
                  title={ps.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playBoing();
                    sound.speak(ps.name);
                  }}
                >
                  {ps.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Kumpulkan lebih banyak bintang untuk membuka semua stiker rahasia!</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            type="button"
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
