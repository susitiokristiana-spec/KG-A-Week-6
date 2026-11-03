import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, CheckCircle2, RotateCcw, Award, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { PRAISE_PHRASES, RETRY_PHRASES } from '../data/alphabetData';

interface QuizQuestion {
  id: number;
  question: string;
  speechText: string;
  type: 'word' | 'letter';
  options: {
    label: string;
    sublabel?: string;
    emoji?: string;
    isCorrect: boolean;
    speech: string;
  }[];
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Benda manakah yang berawalan Huruf J?',
    speechText: 'Benda manakah yang berawalan Huruf J?',
    type: 'word',
    options: [
      { label: 'Jerapah', emoji: '🦒', isCorrect: true, speech: 'Jerapah berawalan huruf J!' },
      { label: 'Gajah', emoji: '🐘', isCorrect: false, speech: 'Gajah berawalan huruf G.' },
      { label: 'Harimau', emoji: '🐯', isCorrect: false, speech: 'Harimau berawalan huruf H.' }
    ],
    explanation: 'Betul! Jerapah berawalan huruf J (Je - ra - pah)!'
  },
  {
    id: 2,
    question: 'Huruf apakah yang mengawali kata "Jam"?',
    speechText: 'Huruf apakah yang mengawali kata Jam? Tik tok tik tok!',
    type: 'letter',
    options: [
      { label: 'J', sublabel: 'Je / Juh', emoji: '⏰', isCorrect: true, speech: 'Huruf J untuk Jam!' },
      { label: 'G', sublabel: 'Ge / Geh', emoji: '🎸', isCorrect: false, speech: 'Huruf G untuk Gitar.' },
      { label: 'H', sublabel: 'Ha / Hah', emoji: '🌧️', isCorrect: false, speech: 'Huruf H untuk Hujan.' }
    ],
    explanation: 'Hebat! Huruf J mengawali kata Jam (J - A - M)!'
  },
  {
    id: 3,
    question: 'Manakah pasangan huruf kecil untuk Huruf "J"?',
    speechText: 'Manakah pasangan huruf kecil untuk Huruf J kapital?',
    type: 'letter',
    options: [
      { label: 'j', sublabel: 'Huruf j kecil', isCorrect: true, speech: 'Huruf j kecil yang punya titik di atas!' },
      { label: 'g', sublabel: 'Huruf g kecil', isCorrect: false, speech: 'Ini huruf g kecil.' },
      { label: 'h', sublabel: 'Huruf h kecil', isCorrect: false, speech: 'Ini huruf h kecil.' }
    ],
    explanation: 'Pintar sekali! Huruf "j" kecil memiliki titik manis di atasnya!'
  },
  {
    id: 4,
    question: 'Hewan besar dengan belalai panjang "Gajah" berawalan huruf apa?',
    speechText: 'Hewan besar dengan belalai panjang Gajah berawalan huruf apa?',
    type: 'letter',
    options: [
      { label: 'G', sublabel: 'Ge / Geh', emoji: '🐘', isCorrect: true, speech: 'G untuk Gajah!' },
      { label: 'J', sublabel: 'Je / Juh', emoji: '🦒', isCorrect: false, speech: 'J untuk Jerapah.' },
      { label: 'H', sublabel: 'Ha / Hah', emoji: '🐯', isCorrect: false, speech: 'H untuk Harimau.' }
    ],
    explanation: 'Tepat sekali! Huruf G untuk Gajah (Ga - jah)!'
  },
  {
    id: 5,
    question: 'Benda manakah yang berawalan Huruf H?',
    speechText: 'Benda manakah yang berawalan Huruf H?',
    type: 'word',
    options: [
      { label: 'Hujan', emoji: '🌧️', isCorrect: true, speech: 'Hujan berawalan huruf H!' },
      { label: 'Jagung', emoji: '🌽', isCorrect: false, speech: 'Jagung berawalan huruf J.' },
      { label: 'Gigi', emoji: '🦷', isCorrect: false, speech: 'Gigi berawalan huruf G.' }
    ],
    explanation: 'Hebat! Hujan berawalan huruf H (Hu - jan)!'
  },
  {
    id: 6,
    question: 'Jagung manis yang lezat berawalan huruf apa ya?',
    speechText: 'Jagung manis yang lezat berawalan huruf apa ya?',
    type: 'letter',
    options: [
      { label: 'J', sublabel: 'Je / Juh', emoji: '🌽', isCorrect: true, speech: 'J untuk Jagung!' },
      { label: 'H', sublabel: 'Ha / Hah', emoji: '🎁', isCorrect: false, speech: 'H untuk Hadiah.' },
      { label: 'G', sublabel: 'Ge / Geh', emoji: '🥛', isCorrect: false, speech: 'G untuk Gelas.' }
    ],
    explanation: 'Luar biasa! J untuk Jagung (Ja - gung)!'
  }
];

interface QuizAbjadProps {
  onEarnStar: () => void;
  onWinGame: () => void;
}

export const QuizAbjad: React.FC<QuizAbjadProps> = ({
  onEarnStar,
  onWinGame
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  useEffect(() => {
    if (!isQuizCompleted && currentQ) {
      sound.speak(currentQ.speechText);
    }
  }, [currentIndex, isQuizCompleted]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOptionIdx(idx);
    setIsAnswered(true);

    const chosen = currentQ.options[idx];
    if (chosen.isCorrect) {
      sound.playTing();
      const praise = PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
      sound.speak(`${praise}! ${chosen.speech}`);
      setScore(prev => prev + 1);
      onEarnStar();
    } else {
      sound.playWrong();
      const retry = RETRY_PHRASES[Math.floor(Math.random() * RETRY_PHRASES.length)];
      sound.speak(`Kurang tepat. ${chosen.speech} ${retry}`);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      setIsQuizCompleted(true);
      sound.playSuccess();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
      sound.speak(`Selamat! Kuis abjad selesai! Kamu memperoleh ${score + 1} bintang!`);
      onWinGame();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const playQuestionAudio = () => {
    sound.playClick();
    sound.speak(currentQ.speechText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Quiz Progress & Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border-2 border-slate-200 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">
            ❓
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Kuis Cerdas Abjad
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Pertanyaan {currentIndex + 1} dari {QUIZ_QUESTIONS.length}
            </h2>
          </div>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-black text-amber-800">
            Skor: {score}
          </span>
        </div>
      </div>

      {!isQuizCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-xl space-y-6">
          {/* Question banner */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              {currentQ.question}
            </h3>
            <button
              onClick={playQuestionAudio}
              type="button"
              className="p-3 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-bold shadow-md transition-all flex-shrink-0 cursor-pointer"
              title="Dengarkan Pertanyaan"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 scale-102';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 opacity-70';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  type="button"
                  className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer shadow-sm ${btnStyle}`}
                >
                  {opt.emoji && (
                    <span className="text-5xl mb-2 filter drop-shadow">
                      {opt.emoji}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black">
                    {opt.label}
                  </span>
                  {opt.sublabel && (
                    <span className="text-xs font-bold text-slate-500 mt-1">
                      {opt.sublabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pop-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-base font-bold text-slate-700">
                  {currentQ.explanation}
                </span>
              </div>
              <button
                onClick={handleNext}
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pertanyaan Berikutnya</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="bg-gradient-to-b from-amber-400 to-orange-500 rounded-3xl p-8 text-white text-center shadow-2xl space-y-6 animate-pop-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-6xl shadow-inner">
            <Award className="w-14 h-14 text-white" />
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-black">
              SELAMAT, KAMU JUARA!
            </h3>
            <p className="text-lg font-bold text-amber-100 mt-2">
              Kamu berhasil menyelesaikan Kuis Huruf J, G, dan H!
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full font-black text-xl mt-4">
              <span>🌟 Bintang Diperoleh:</span>
              <span className="text-yellow-300">{score} Bintang</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              type="button"
              className="px-8 py-3.5 rounded-2xl bg-white text-amber-900 font-black text-lg shadow-xl hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>Coba Kuis Lagi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
