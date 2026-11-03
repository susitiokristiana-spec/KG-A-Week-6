import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, Trophy, Star, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_WORDS, WordItem, PRAISE_PHRASES, RETRY_PHRASES } from '../data/alphabetData';
import { sound } from '../utils/sound';

interface MatchGameProps {
  onEarnStar: () => void;
  onWinGame: () => void;
}

export const MatchGame: React.FC<MatchGameProps> = ({
  onEarnStar,
  onWinGame
}) => {
  // 6 cards per round (2 of J, 2 of G, 2 of H)
  const [cards, setCards] = useState<WordItem[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedItems, setMatchedItems] = useState<{ J: WordItem[]; G: WordItem[]; H: WordItem[] }>({
    J: [],
    G: [],
    H: []
  });
  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'success' | 'error' | 'idle';
  }>({
    text: 'Pilih satu gambar, lalu ketuk Rumah Huruf yang cocok (J, G, atau H)!',
    type: 'idle'
  });
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [draggedItem, setDraggedItem] = useState<WordItem | null>(null);

  // Initialize randomized round
  const setupRound = () => {
    // Pick 2 from J, 2 from G, 2 from H
    const jWords = [...ALL_WORDS.filter(w => w.letter === 'J')].sort(() => 0.5 - Math.random()).slice(0, 2);
    const gWords = [...ALL_WORDS.filter(w => w.letter === 'G')].sort(() => 0.5 - Math.random()).slice(0, 2);
    const hWords = [...ALL_WORDS.filter(w => w.letter === 'H')].sort(() => 0.5 - Math.random()).slice(0, 2);

    const roundDeck = [...jWords, ...gWords, ...hWords].sort(() => 0.5 - Math.random());
    setCards(roundDeck);
    setSelectedCardId(null);
    setMatchedItems({ J: [], G: [], H: [] });
    setIsRoundFinished(false);
    setFeedback({
      text: 'Ayo cocokkan gambar dengan huruf awalnya! J, G, atau H?',
      type: 'idle'
    });

    sound.playClick();
    sound.speak('Ayo cocokkan gambar ke Rumah Huruf yang benar! Ada huruf J, G, dan H!');
  };

  useEffect(() => {
    setupRound();
  }, [roundNumber]);

  const handleCardClick = (card: WordItem) => {
    sound.playClick();
    setSelectedCardId(card.id);
    sound.speak(`${card.word}. Benda ini berawalan huruf apa ya?`);
    setFeedback({
      text: `Kamu memilih ${card.word}. Sekarang ketuk Rumah Huruf yang sesuai!`,
      type: 'idle'
    });
  };

  const handleTargetDrop = (letter: 'J' | 'G' | 'H') => {
    const cardToMatch = draggedItem || cards.find(c => c.id === selectedCardId);
    if (!cardToMatch) {
      sound.playBoing();
      sound.speak('Pilih dulu salah satu kartu gambar di bawah ya!');
      setFeedback({
        text: 'Pilih dulu kartu gambar di bawah ya!',
        type: 'idle'
      });
      return;
    }

    if (cardToMatch.letter === letter) {
      // Correct match!
      sound.playTing();
      const praise = PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
      sound.speak(`Hore! ${praise}! Huruf ${letter} untuk ${cardToMatch.word}!`);

      // Move card into matched bucket
      setMatchedItems(prev => ({
        ...prev,
        [letter]: [...prev[letter], cardToMatch]
      }));

      const remainingCards = cards.filter(c => c.id !== cardToMatch.id);
      setCards(remainingCards);
      setSelectedCardId(null);
      setDraggedItem(null);
      onEarnStar();

      setFeedback({
        text: `Tepat sekali! Huruf ${letter} untuk ${cardToMatch.word}! 🌟`,
        type: 'success'
      });

      // Check if finished
      if (remainingCards.length === 0) {
        setIsRoundFinished(true);
        sound.playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        sound.speak('Luar biasa! Semua gambar sudah masuk ke rumah huruf yang tepat!');
        onWinGame();
      }
    } else {
      // Wrong match
      sound.playWrong();
      const retry = RETRY_PHRASES[Math.floor(Math.random() * RETRY_PHRASES.length)];
      sound.speak(`Ups! ${cardToMatch.word} bukan berawalan huruf ${letter}. ${retry}`);
      setFeedback({
        text: `Bukan huruf ${letter}. Ayo cari rumah huruf untuk ${cardToMatch.word}!`,
        type: 'error'
      });
    }
  };

  const selectedCard = cards.find(c => c.id === selectedCardId);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Title & Guidance */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Game Mencocokkan Abjad</span>
          <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
            Babak {roundNumber}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
          Masukkan Gambar ke Rumah Huruf yang Tepat!
        </h2>

        {/* Feedback Banner */}
        <div className={`max-w-xl mx-auto p-3 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 animate-pop-in'
            : feedback.type === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-900 animate-wiggle'
            : 'bg-white border-slate-200 text-slate-700'
        }`}>
          {feedback.text}
        </div>
      </div>

      {/* The 3 Letter Houses / Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* House J */}
        <div
          onClick={() => handleTargetDrop('J')}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleTargetDrop('J')}
          className={`relative p-5 rounded-3xl border-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[220px] shadow-lg ${
            selectedCard?.letter === 'J'
              ? 'ring-4 ring-amber-400 bg-amber-50/90 border-amber-400 scale-102'
              : 'bg-white hover:bg-amber-50/50 border-amber-300'
          }`}
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between">
            <span className="text-3xl">🦒</span>
            <span className="text-xs font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full">
              Fokus J
            </span>
          </div>

          {/* Letter Badge */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex flex-col items-center justify-center shadow-md border-2 border-white my-2">
            <span className="text-5xl font-black">J</span>
            <span className="text-[10px] font-bold">Je / Juh</span>
          </div>

          <div className="text-center">
            <span className="font-extrabold text-amber-900 text-lg block">Rumah Huruf J</span>
            <span className="text-xs text-amber-700">Contoh: Jerapah, Jam, Jagung</span>
          </div>

          {/* Matched items inside bucket */}
          <div className="w-full mt-3 pt-2 border-t border-amber-200 flex flex-wrap gap-1.5 justify-center min-h-[36px]">
            {matchedItems.J.length === 0 ? (
              <span className="text-xs text-amber-600/70 italic">Ketuk di sini untuk huruf J</span>
            ) : (
              matchedItems.J.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-xl animate-pop-in"
                >
                  <span>{m.emoji}</span>
                  <span>{m.word}</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* House G */}
        <div
          onClick={() => handleTargetDrop('G')}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleTargetDrop('G')}
          className={`relative p-5 rounded-3xl border-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[220px] shadow-lg ${
            selectedCard?.letter === 'G'
              ? 'ring-4 ring-emerald-400 bg-emerald-50/90 border-emerald-400 scale-102'
              : 'bg-white hover:bg-emerald-50/50 border-emerald-300'
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-3xl">🐘</span>
            <span className="text-xs font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
              Ulang G
            </span>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 text-white flex flex-col items-center justify-center shadow-md border-2 border-white my-2">
            <span className="text-5xl font-black">G</span>
            <span className="text-[10px] font-bold">Ge / Geh</span>
          </div>

          <div className="text-center">
            <span className="font-extrabold text-emerald-900 text-lg block">Rumah Huruf G</span>
            <span className="text-xs text-emerald-700">Contoh: Gajah, Gitar, Gigi</span>
          </div>

          <div className="w-full mt-3 pt-2 border-t border-emerald-200 flex flex-wrap gap-1.5 justify-center min-h-[36px]">
            {matchedItems.G.length === 0 ? (
              <span className="text-xs text-emerald-600/70 italic">Ketuk di sini untuk huruf G</span>
            ) : (
              matchedItems.G.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-2.5 py-1 rounded-xl animate-pop-in"
                >
                  <span>{m.emoji}</span>
                  <span>{m.word}</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* House H */}
        <div
          onClick={() => handleTargetDrop('H')}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleTargetDrop('H')}
          className={`relative p-5 rounded-3xl border-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[220px] shadow-lg ${
            selectedCard?.letter === 'H'
              ? 'ring-4 ring-blue-400 bg-blue-50/90 border-blue-400 scale-102'
              : 'bg-white hover:bg-blue-50/50 border-blue-300'
          }`}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-3xl">🐯</span>
            <span className="text-xs font-black uppercase tracking-wider bg-blue-200 text-blue-900 px-2.5 py-1 rounded-full">
              Ulang H
            </span>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-400 text-white flex flex-col items-center justify-center shadow-md border-2 border-white my-2">
            <span className="text-5xl font-black">H</span>
            <span className="text-[10px] font-bold">Ha / Hah</span>
          </div>

          <div className="text-center">
            <span className="font-extrabold text-blue-900 text-lg block">Rumah Huruf H</span>
            <span className="text-xs text-blue-700">Contoh: Harimau, Hujan, Hati</span>
          </div>

          <div className="w-full mt-3 pt-2 border-t border-blue-200 flex flex-wrap gap-1.5 justify-center min-h-[36px]">
            {matchedItems.H.length === 0 ? (
              <span className="text-xs text-blue-600/70 italic">Ketuk di sini untuk huruf H</span>
            ) : (
              matchedItems.H.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold px-2.5 py-1 rounded-xl animate-pop-in"
                >
                  <span>{m.emoji}</span>
                  <span>{m.word}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cards to Match Deck */}
      {!isRoundFinished ? (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border-2 border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-slate-800">
                Pilih Kartu Gambar yang Ingin Dimasukkan:
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                Tersisa {cards.length} kartu
              </span>
            </div>
            {selectedCard && (
              <span className="text-xs text-amber-700 font-bold animate-pulse">
                👉 Sekarang klik Rumah Huruf di atas!
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {cards.map((card) => {
              const isSelected = selectedCardId === card.id;
              return (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => setDraggedItem(card)}
                  onClick={() => handleCardClick(card)}
                  className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative select-none ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 scale-105 shadow-lg ring-4 ring-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-300 shadow-xs hover:scale-102'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl mb-1 filter drop-shadow">
                    {card.emoji}
                  </span>
                  <span className="font-black text-slate-800 text-sm sm:text-base leading-tight">
                    {card.word}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      sound.speak(card.speechText);
                    }}
                    type="button"
                    className="mt-1 p-1 rounded-full bg-white text-slate-600 hover:text-amber-600 shadow-xs"
                    title="Dengar suara"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {isSelected && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Round Victory Celebration Banner */
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-3xl p-6 text-white text-center shadow-xl space-y-4 animate-pop-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl">
            🏆
          </div>
          <div>
            <h3 className="text-3xl font-black">HEBAT SEKALI!</h3>
            <p className="text-base sm:text-lg font-bold text-amber-950 mt-1">
              Kamu berhasil mencocokkan semua huruf J, G, dan H dengan tepat!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setRoundNumber((prev) => prev + 1);
              }}
              type="button"
              className="px-6 py-3.5 rounded-2xl bg-white text-amber-900 font-black text-base shadow-lg hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>Mainkan Babak Baru</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
