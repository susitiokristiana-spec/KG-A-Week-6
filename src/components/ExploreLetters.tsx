import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Sparkles, RotateCcw, CheckCircle2, ChevronRight, Star, Heart, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LETTERS_DATA, LetterInfo, WordItem } from '../data/alphabetData';
import { sound } from '../utils/sound';

interface ExploreLettersProps {
  onEarnStar: () => void;
  onSelectLetter?: (letter: 'J' | 'G' | 'H') => void;
}

export const ExploreLetters: React.FC<ExploreLettersProps> = ({
  onEarnStar,
  onSelectLetter
}) => {
  const [activeLetterKey, setActiveLetterKey] = useState<'J' | 'G' | 'H'>('J');
  const [isUpperCase, setIsUpperCase] = useState<boolean>(true);
  const [activeWord, setActiveWord] = useState<WordItem | null>(null);
  const [isTracingMode, setIsTracingMode] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [tracePoints, setTracePoints] = useState<{ x: number; y: number }[]>([]);
  const [hasTracedSuccessfully, setHasTracedSuccessfully] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentLetter: LetterInfo = LETTERS_DATA[activeLetterKey];

  useEffect(() => {
    // Notify parent
    if (onSelectLetter) {
      onSelectLetter(activeLetterKey);
    }
    // Set default active word
    setActiveWord(currentLetter.words[0]);
    clearCanvas();
    setHasTracedSuccessfully(false);

    // Initial greeting voice
    const introMsg = activeLetterKey === 'J' 
      ? 'Ayo mengenal Huruf J! J seperti Jerapah dan Jam!'
      : activeLetterKey === 'G'
      ? 'Ayo mengulang Huruf G! G seperti Gajah dan Gitar!'
      : 'Ayo mengulang Huruf H! H seperti Harimau dan Hujan!';
    sound.speak(introMsg);
  }, [activeLetterKey]);

  const handleLetterSwitch = (letter: 'J' | 'G' | 'H') => {
    sound.playClick();
    setActiveLetterKey(letter);
  };

  const handleSpeakPhonic = () => {
    sound.playBoing();
    const phonicText = activeLetterKey === 'J' 
      ? 'Huruf J! Bunyinya Je... Juh! J untuk Jerapah dan Jam!'
      : activeLetterKey === 'G'
      ? 'Huruf G! Bunyinya Ge... Geh! G untuk Gajah dan Gitar!'
      : 'Huruf H! Bunyinya Ha... Hah! H untuk Harimau dan Hujan!';
    sound.speak(phonicText);
  };

  const handleWordClick = (word: WordItem) => {
    setActiveWord(word);
    sound.playTing();
    sound.speak(word.speechText);
    onEarnStar();
  };

  // Tracing Canvas logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    sound.playPop();
    const coords = getCanvasCoords(e);
    if (coords) {
      setTracePoints([coords]);
      drawPoint(coords.x, coords.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    if (coords) {
      setTracePoints((prev) => [...prev, coords]);
      drawPoint(coords.x, coords.y);

      // Check if traced enough points
      if (tracePoints.length > 35 && !hasTracedSuccessfully) {
        setHasTracedSuccessfully(true);
        sound.playSuccess();
        sound.speak(`Luar biasa! Kamu berhasil menjiplak ${currentLetter.name}!`);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        onEarnStar();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = currentLetter.color;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Inner glowing dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTracePoints([]);
    setHasTracedSuccessfully(false);
    sound.playClick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Top Tabs: Huruf J (Special focus), Huruf G (Ulang), Huruf H (Ulang) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Button J with Special Badge */}
        <button
          onClick={() => handleLetterSwitch('J')}
          type="button"
          className={`relative px-6 py-3.5 rounded-2xl font-black text-xl sm:text-2xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer shadow-md ${
            activeLetterKey === 'J'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white scale-105 ring-4 ring-amber-300 shadow-amber-200'
              : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700'
          }`}
        >
          <span className="text-3xl">🦒</span>
          <span>Huruf J</span>
          <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            Fokus Utama!
          </span>
        </button>

        {/* Button G */}
        <button
          onClick={() => handleLetterSwitch('G')}
          type="button"
          className={`px-6 py-3.5 rounded-2xl font-black text-xl sm:text-2xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer shadow-md ${
            activeLetterKey === 'G'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white scale-105 ring-4 ring-emerald-300 shadow-emerald-200'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
          }`}
        >
          <span className="text-3xl">🐘</span>
          <span>Huruf G</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Ulang
          </span>
        </button>

        {/* Button H */}
        <button
          onClick={() => handleLetterSwitch('H')}
          type="button"
          className={`px-6 py-3.5 rounded-2xl font-black text-xl sm:text-2xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer shadow-md ${
            activeLetterKey === 'H'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white scale-105 ring-4 ring-blue-300 shadow-blue-200'
              : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700'
          }`}
        >
          <span className="text-3xl">🐯</span>
          <span>Huruf H</span>
          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
            Ulang
          </span>
        </button>
      </div>

      {/* Main Interactive Stage for Selected Letter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Giant Letter Card & Voice Phonics & Tracing */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 relative overflow-hidden">
          {/* Header of Letter card */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${currentLetter.badgeBg}`}>
                {currentLetter.name}
              </span>
              <button
                onClick={() => setIsUpperCase(!isUpperCase)}
                className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                Ganti ke: <span className="font-extrabold text-amber-600">{isUpperCase ? 'Huruf Kecil (abc)' : 'Huruf Besar (ABC)'}</span>
              </button>
            </div>

            <button
              onClick={() => setIsTracingMode(!isTracingMode)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                isTracingMode 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTracingMode ? 'Mode Lihat Kartu' : 'Mode Menjiplak / Tulis'}</span>
            </button>
          </div>

          {!isTracingMode ? (
            /* Big Letter Presentation Mode */
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              {/* Giant letter button */}
              <button
                onClick={handleSpeakPhonic}
                type="button"
                className="group relative cursor-pointer focus:outline-none"
                title="Tekan untuk mendengar suara huruf!"
              >
                <div className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr ${currentLetter.themeGradient} text-white flex flex-col items-center justify-center shadow-2xl transform group-hover:scale-105 active:scale-95 transition-all duration-200 border-4 border-white/60 relative`}>
                  <span className="text-8xl sm:text-9xl font-black drop-shadow-md select-none tracking-tight">
                    {isUpperCase ? currentLetter.letter : currentLetter.lower}
                  </span>
                  <div className="absolute bottom-2 flex items-center gap-1 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Tekan Suara</span>
                  </div>
                </div>
              </button>

              {/* Sound & Phonic hint */}
              <div className="w-full text-center px-4 py-3 bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-base font-extrabold text-amber-900">
                  {currentLetter.soundDescription}
                </p>
                <p className="text-xs sm:text-sm text-amber-700 mt-1">
                  💡 {currentLetter.shapeHint}
                </p>
              </div>

              {/* Action Buttons: Sound & Big Voice */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleSpeakPhonic}
                  type="button"
                  className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Dengarkan Bunyi Huruf</span>
                </button>
                <button
                  onClick={() => setIsTracingMode(true)}
                  type="button"
                  className="py-3 px-4 rounded-2xl bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Ayo Tulis</span>
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Tracing Mode */
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div className="w-full text-center">
                <span className="text-sm font-bold text-slate-700">
                  {currentLetter.strokeGuide.instruction}
                </span>
                <p className="text-xs text-slate-500">
                  Tarik jari atau mouse mengikuti garis huruf {isUpperCase ? currentLetter.letter : currentLetter.lower}!
                </p>
              </div>

              {/* Canvas Overlay with Reference Letter */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-slate-50 rounded-3xl border-4 border-dashed border-amber-300 flex items-center justify-center overflow-hidden touch-none">
                {/* Background Guide Letter */}
                <span className="absolute inset-0 flex items-center justify-center text-slate-300 font-black text-[180px] select-none pointer-events-none opacity-40">
                  {isUpperCase ? currentLetter.letter : currentLetter.lower}
                </span>

                {/* Arrow hint indicator */}
                <div className="absolute top-6 right-6 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-1 rounded-full animate-bounce pointer-events-none">
                  ✨ Mulai dari sini
                </div>

                {/* Drawing Canvas */}
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                />

                {hasTracedSuccessfully && (
                  <div className="absolute inset-0 bg-emerald-500/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 animate-pop-in">
                    <CheckCircle2 className="w-16 h-16 text-white mb-2" />
                    <span className="text-2xl font-black">HEBAT!</span>
                    <span className="text-sm font-semibold">Tjiplakanmu berhasil! +1 Bintang 🌟</span>
                  </div>
                )}
              </div>

              {/* Tracing Controls */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={clearCanvas}
                  type="button"
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Hapus & Ulangi</span>
                </button>
                <button
                  onClick={() => setIsTracingMode(false)}
                  type="button"
                  className="py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow transition-all cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Words Collection & Interactive Flashcards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>Benda Berawalan {currentLetter.name}</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {currentLetter.words.length} Kata
              </span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Ketuk untuk mendengar suara 🔊
            </span>
          </div>

          {/* Active Word Spotlight Banner */}
          {activeWord && (
            <div className={`p-4 rounded-3xl border-2 ${activeWord.borderColor} ${activeWord.bgColor} shadow-md transition-all`}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-inner flex items-center justify-center text-5xl sm:text-6xl flex-shrink-0 border-2 border-white">
                  <span className="animate-float">{activeWord.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl sm:text-3xl font-black ${activeWord.color}`}>
                      {activeWord.word}
                    </span>
                    <button
                      onClick={() => handleWordClick(activeWord)}
                      type="button"
                      className="p-1.5 rounded-full bg-white shadow-sm hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                      title="Ulang Suara"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                  <div className="text-sm font-extrabold text-slate-600 tracking-wider">
                    {activeWord.syllables}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1">
                    {activeWord.funFact}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Words Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentLetter.words.map((item) => {
              const isSelected = activeWord?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleWordClick(item)}
                  type="button"
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 border-2 cursor-pointer flex flex-col items-center text-center relative group ${
                    isSelected
                      ? `${item.bgColor} ${item.borderColor} ring-4 ring-amber-300 scale-105 shadow-md`
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-amber-100 flex items-center justify-center text-3xl mb-1.5 transition-colors">
                    <span>{item.emoji}</span>
                  </div>
                  <span className="font-black text-slate-800 text-base leading-tight">
                    {item.word}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                    {item.syllables}
                  </span>

                  {/* Corner indicator */}
                  <span className="absolute top-2 right-2 text-slate-400 group-hover:text-amber-500 transition-colors">
                    <Volume2 className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Educational Note about J vs G and H */}
          <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-blue-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">
              ✨ Catatan Belajar Ceria:
            </span>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-amber-700">Huruf J:</strong> Bunyi <code className="bg-white px-1.5 py-0.5 rounded font-bold">Je / Juh</code> (Jerapah, Jam, Jagung)</li>
              <li><strong className="text-emerald-700">Huruf G:</strong> Bunyi <code className="bg-white px-1.5 py-0.5 rounded font-bold">Ge / Geh</code> (Gajah, Gigi, Gitar)</li>
              <li><strong className="text-blue-700">Huruf H:</strong> Bunyi <code className="bg-white px-1.5 py-0.5 rounded font-bold">Ha / Hah</code> (Harimau, Hujan, Helikopter)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
