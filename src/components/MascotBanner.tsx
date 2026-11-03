import React from 'react';
import { Volume2, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/sound';

interface MascotBannerProps {
  message: string;
  subMessage?: string;
  activeLetter?: 'J' | 'G' | 'H';
  onMascotClick?: () => void;
}

export const MascotBanner: React.FC<MascotBannerProps> = ({
  message,
  subMessage,
  activeLetter = 'J',
  onMascotClick
}) => {
  const getMascot = () => {
    switch (activeLetter) {
      case 'G':
        return {
          emoji: '🐘',
          name: 'Gani si Gajah',
          color: 'bg-emerald-500',
          border: 'border-emerald-300',
          bubbleBg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          phrase: 'Halo! Aku Gani si Gajah! Huruf G seperti namaku!'
        };
      case 'H':
        return {
          emoji: '🐯',
          name: 'Hani si Harimau',
          color: 'bg-blue-500',
          border: 'border-blue-300',
          bubbleBg: 'bg-blue-50 border-blue-200 text-blue-950',
          phrase: 'Halo teman! Aku Hani si Harimau! Ayo belajar huruf H!'
        };
      case 'J':
      default:
        return {
          emoji: '🦒',
          name: 'Jojo si Jerapah',
          color: 'bg-amber-500',
          border: 'border-amber-300',
          bubbleBg: 'bg-amber-50 border-amber-200 text-amber-950',
          phrase: 'Halo sahabat pintar! Aku Jojo si Jerapah! Huruf J itu keren sekali!'
        };
    }
  };

  const mascot = getMascot();

  const handleSpeak = () => {
    sound.playClick();
    sound.speak(`${message}. ${subMessage || ''}`);
  };

  const handleMascotTap = () => {
    sound.playBoing();
    if (onMascotClick) {
      onMascotClick();
    } else {
      sound.speak(mascot.phrase);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      <div className="flex items-center gap-3 sm:gap-4 bg-white/90 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-lg border-2 border-amber-200">
        {/* Mascot Avatar */}
        <button
          onClick={handleMascotTap}
          type="button"
          aria-label={`Sentuh ${mascot.name}`}
          className="relative flex-shrink-0 group cursor-pointer"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-100 flex items-center justify-center text-4xl sm:text-5xl shadow-md border-4 border-amber-300 group-hover:scale-105 active:scale-95 transition-transform duration-200 animate-float">
            <span>{mascot.emoji}</span>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow">
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
          </span>
        </button>

        {/* Speech Bubble */}
        <div className={`flex-1 relative rounded-2xl p-3 sm:p-4 border-2 ${mascot.bubbleBg} shadow-sm`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{mascot.name}</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                {message}
              </p>
              {subMessage && (
                <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                  {subMessage}
                </p>
              )}
            </div>

            {/* Read aloud button */}
            <button
              onClick={handleSpeak}
              type="button"
              className="p-2 sm:p-2.5 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-bold shadow-md transition-all flex items-center justify-center cursor-pointer"
              title="Dengarkan Suara Jojo"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
