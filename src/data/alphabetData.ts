export interface WordItem {
  id: string;
  word: string;
  letter: 'J' | 'G' | 'H';
  syllables: string;
  emoji: string;
  meaning: string;
  funFact: string;
  speechText: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface LetterInfo {
  letter: 'J' | 'G' | 'H';
  lower: 'j' | 'g' | 'h';
  name: string;
  soundDescription: string;
  shapeHint: string;
  color: string;
  badgeBg: string;
  themeGradient: string;
  textColor: string;
  words: WordItem[];
  strokeGuide: {
    instruction: string;
    steps: string[];
    capitalPath: string;
    lowerPath: string;
  };
}

export const LETTERS_DATA: Record<'J' | 'G' | 'H', LetterInfo> = {
  J: {
    letter: 'J',
    lower: 'j',
    name: 'Huruf J',
    soundDescription: 'Dibaca "Je / Juh", seperti bunyi kata Jerapah dan Jam!',
    shapeHint: 'Garis lurus ke bawah, lalu melengkung ke kiri seperti gagang payung lucu!',
    color: '#F59E0B', // Amber
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    themeGradient: 'from-amber-400 via-orange-400 to-amber-500',
    textColor: 'text-amber-600',
    strokeGuide: {
      instruction: 'Tarik garis dari atas lurus ke bawah, lalu melengkung ke kiri!',
      steps: [
        '1. Mulai dari atas di garis horizontal kecil (opsional)',
        '2. Tarik lurus ke bawah',
        '3. Buat lengkungan manis ke arah kiri'
      ],
      // Approximate 200x200 SVG paths
      capitalPath: 'M 100 40 L 100 130 C 100 160, 60 160, 60 135',
      lowerPath: 'M 100 70 L 100 145 C 100 170, 70 170, 70 150 M 100 50 A 4 4 0 1 1 100 49'
    },
    words: [
      {
        id: 'jerapah',
        word: 'Jerapah',
        letter: 'J',
        syllables: 'Je - ra - pah',
        emoji: '🦒',
        meaning: 'Hewan tertinggi di dunia dengan leher panjang',
        funFact: 'Jerapah suka makan daun yang ada di pucuk pohon tinggi!',
        speechText: 'Huruf J untuk Jerapah! Je-ra-pah! Lehernya tinggi sekali!',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
      },
      {
        id: 'jam',
        word: 'Jam',
        letter: 'J',
        syllables: 'Jam',
        emoji: '⏰',
        meaning: 'Penunjuk waktu tik-tok tik-tok',
        funFact: 'Jam membantu kita bangun pagi dan belajar tepat waktu!',
        speechText: 'Huruf J untuk Jam! Tik-tok-tik-tok, waktu untuk bermain dan belajar!',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
      },
      {
        id: 'jagung',
        word: 'Jagung',
        letter: 'J',
        syllables: 'Ja - gung',
        emoji: '🌽',
        meaning: 'Tanaman manis berwarna kuning cerah',
        funFact: 'Jagung manis sangat enak dan sehat untuk tubuh kita!',
        speechText: 'Huruf J untuk Jagung! Ja-gung manis yang lezat!',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
      },
      {
        id: 'jus',
        word: 'Jus',
        letter: 'J',
        syllables: 'Jus',
        emoji: '🧃',
        meaning: 'Minuman buah segar penuh vitamin',
        funFact: 'Jus buah kaya vitamin agar badan kita sehat dan ceria!',
        speechText: 'Huruf J untuk Jus! Minuman segar dan sehat!',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
      },
      {
        id: 'jendela',
        word: 'Jendela',
        letter: 'J',
        syllables: 'Jen - de - la',
        emoji: '🪟',
        meaning: 'Tempat udara segar dan sinar matahari masuk',
        funFact: 'Buka jendela di pagi hari agar udara kamar terasa segar!',
        speechText: 'Huruf J untuk Jendela! Jen-de-la tempat cahaya masuk!',
        color: 'text-sky-600',
        bgColor: 'bg-sky-50',
        borderColor: 'border-sky-300',
      },
      {
        id: 'jepit',
        word: 'Jepit',
        letter: 'J',
        syllables: 'Je - pit',
        emoji: '📎',
        meaning: 'Alat untuk merapikan kertas atau pakaian',
        funFact: 'Jepit ada bermacam-macam warna yang cerah!',
        speechText: 'Huruf J untuk Jepit! Je-pit warna-warni!',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-300',
      }
    ]
  },
  G: {
    letter: 'G',
    lower: 'g',
    name: 'Huruf G',
    soundDescription: 'Dibaca "Ge / Geh", seperti bunyi kata Gajah dan Gitar!',
    shapeHint: 'Membuat lingkaran hampir penuh lalu ada tangga kecil ke dalam!',
    color: '#10B981', // Emerald green
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    themeGradient: 'from-emerald-400 via-teal-400 to-green-500',
    textColor: 'text-emerald-600',
    strokeGuide: {
      instruction: 'Putar melengkung seperti huruf C, lalu beri garis ke dalam!',
      steps: [
        '1. Mulai dari atas kanan, melengkung melingkar ke kiri',
        '2. Lanjutkan ke bawah lalu naik sedikit',
        '3. Tarik garis horizontal masuk ke dalam'
      ],
      capitalPath: 'M 140 70 C 130 40, 70 40, 65 100 C 60 150, 120 160, 140 140 L 140 105 L 105 105',
      lowerPath: 'M 130 90 C 130 70, 75 70, 75 95 C 75 125, 130 125, 130 95 L 130 145 C 130 170, 80 170, 75 150'
    },
    words: [
      {
        id: 'gajah',
        word: 'Gajah',
        letter: 'G',
        syllables: 'Ga - jah',
        emoji: '🐘',
        meaning: 'Hewan darat paling besar dengan belalai panjang',
        funFact: 'Gajah punya telinga lebar seperti kipas dan belalai serbaguna!',
        speechText: 'Huruf G untuk Gajah! Ga-jah punya belalai panjang!',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-300',
      },
      {
        id: 'gitar',
        word: 'Gitar',
        letter: 'G',
        syllables: 'Gi - tar',
        emoji: '🎸',
        meaning: 'Alat musik berdawai merdu',
        funFact: 'Petik dawai gitar untuk menghasilkan lagu yang merdu!',
        speechText: 'Huruf G untuk Gitar! Jreng jreng! Suara gitar yang merdu!',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-300',
      },
      {
        id: 'gigi',
        word: 'Gigi',
        letter: 'G',
        syllables: 'Gi - gi',
        emoji: '🦷',
        meaning: 'Bagian putih di mulut untuk mengunyah makanan',
        funFact: 'Sikat gigi dua kali sehari agar gigi selalu bersih berkilau!',
        speechText: 'Huruf G untuk Gigi! Gi-gi bersih dan sehat tersenyum ceria!',
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-300',
      },
      {
        id: 'gasing',
        word: 'Gasing',
        letter: 'G',
        syllables: 'Ga - sing',
        emoji: '🪀',
        meaning: 'Mainan tradisional yang bisa berputar cepat',
        funFact: 'Gasing berputar seimbang dan seru sekali dimainkan bersama teman!',
        speechText: 'Huruf G untuk Gasing! Berputar putar kencang!',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
      },
      {
        id: 'gelas',
        word: 'Gelas',
        letter: 'G',
        syllables: 'Ge - las',
        emoji: '🥛',
        meaning: 'Wadah untuk minum air putih dan susu',
        funFact: 'Minum air putih dari gelas bikin badan kita selalu segar!',
        speechText: 'Huruf G untuk Gelas! Ge-las untuk minum susu!',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
      }
    ]
  },
  H: {
    letter: 'H',
    lower: 'h',
    name: 'Huruf H',
    soundDescription: 'Dibaca "Ha / Hah", seperti suara hembusan napas hangat!',
    shapeHint: 'Dua tiang tegak lurus yang dihubungkan dengan jembatan di tengah!',
    color: '#3B82F6', // Sky blue
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    themeGradient: 'from-blue-400 via-indigo-400 to-sky-500',
    textColor: 'text-blue-600',
    strokeGuide: {
      instruction: 'Tarik dua tiang ke bawah, lalu buat jembatan di tengahnya!',
      steps: [
        '1. Tarik tiang pertama dari atas ke bawah',
        '2. Tarik tiang kedua di sampingnya dari atas ke bawah',
        '3. Hubungkan kedua tiang dengan garis horizontal di tengah'
      ],
      capitalPath: 'M 65 40 L 65 160 M 135 40 L 135 160 M 65 100 L 135 100',
      lowerPath: 'M 75 40 L 75 160 M 75 100 C 75 75, 130 75, 130 100 L 130 160'
    },
    words: [
      {
        id: 'harimau',
        word: 'Harimau',
        letter: 'H',
        syllables: 'Ha - ri - mau',
        emoji: '🐯',
        meaning: 'Kucing besar berbelang gagah yang suka menjelajah',
        funFact: 'Harimau pandai berenang dan larinya cepat sekali!',
        speechText: 'Huruf H untuk Harimau! Ha-ri-mau! Aum, belangnya sangat indah!',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
      },
      {
        id: 'hujan',
        word: 'Hujan',
        letter: 'H',
        syllables: 'Hu - jan',
        emoji: '🌧️',
        meaning: 'Tetesan air yang turun dari awan di langit',
        funFact: 'Setelah hujan turun, seringkali muncul pelangi warna-warni!',
        speechText: 'Huruf H untuk Hujan! Tik tik bunyi hujan di atas genting!',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
      },
      {
        id: 'helikopter',
        word: 'Helikopter',
        letter: 'H',
        syllables: 'He - li - kop - ter',
        emoji: '🚁',
        meaning: 'Kendaraan udara dengan baling-baling putar di atasnya',
        funFact: 'Helikopter bisa mendarat di mana saja tanpa landasan panjang!',
        speechText: 'Huruf H untuk Helikopter! Baling-balingnya berputar di langit!',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-300',
      },
      {
        id: 'hati',
        word: 'Hati',
        letter: 'H',
        syllables: 'Ha - ti',
        emoji: '💖',
        meaning: 'Lambang cinta dan kasih sayang yang tulus',
        funFact: 'Hati yang gembira membuat kita sehat dan selalu tersenyum!',
        speechText: 'Huruf H untuk Hati! Lambang kasih sayang yang hangat!',
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-300',
      },
      {
        id: 'hadiah',
        word: 'Hadiah',
        letter: 'H',
        syllables: 'Ha - di - ah',
        emoji: '🎁',
        meaning: 'Kado kejutan dengan pita cantik untuk yang rajin belajar',
        funFact: 'Membuka hadiah selalu menyenangkan dan penuh kejutan!',
        speechText: 'Huruf H untuk Hadiah! Kado kejutan untuk anak hebat!',
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-300',
      }
    ]
  }
};

export const PRAISE_PHRASES = [
  'Hebat sekali!',
  'Luar biasa!',
  'Pintar!',
  'Kamu keren banget!',
  'Betul sekali, jempol dua!',
  'Jagoan abjad!',
  'Hore, tepat sekali!',
  'Wah, kamu cerdas!'
];

export const RETRY_PHRASES = [
  'Ayo coba lagi, kamu pasti bisa!',
  'Hampir tepat! Coba perhatikan lagi ya.',
  'Sedikit lagi! Yuk cari yang benar.',
  'Jangan menyerah, kamu pasti bisa!'
];

export const ALL_WORDS: WordItem[] = [
  ...LETTERS_DATA.J.words,
  ...LETTERS_DATA.G.words,
  ...LETTERS_DATA.H.words,
];

export interface StickerReward {
  id: string;
  name: string;
  emoji: string;
  letter: 'J' | 'G' | 'H';
  requirement: string;
  unlocked: boolean;
}

export const INITIAL_STICKERS: StickerReward[] = [
  { id: 'stk-jerapah', name: 'Jojo si Jerapah', emoji: '🦒', letter: 'J', requirement: 'Belajar Huruf J', unlocked: true },
  { id: 'stk-gajah', name: 'Gani si Gajah', emoji: '🐘', letter: 'G', requirement: 'Belajar Huruf G', unlocked: true },
  { id: 'stk-harimau', name: 'Hani si Harimau', emoji: '🐯', letter: 'H', requirement: 'Belajar Huruf H', unlocked: true },
  { id: 'stk-jam', name: 'Jam Juara', emoji: '⏰', letter: 'J', requirement: 'Selesaikan Mencocokkan', unlocked: false },
  { id: 'stk-jagung', name: 'Jagung Manis', emoji: '🌽', letter: 'J', requirement: 'Kumpulkan 5 Bintang', unlocked: false },
  { id: 'stk-gitar', name: 'Gitar Ceria', emoji: '🎸', letter: 'G', requirement: 'Tangkap Balon Huruf', unlocked: false },
  { id: 'stk-hujan', name: 'Awan Hujan', emoji: '🌧️', letter: 'H', requirement: 'Selesaikan Kuis Abjad', unlocked: false },
  { id: 'stk-helikopter', name: 'Helikopter Langit', emoji: '🚁', letter: 'H', requirement: 'Sempurna di Kuis', unlocked: false },
  { id: 'stk-bintang-emas', name: 'Bintang Emas Juara', emoji: '🌟', letter: 'J', requirement: 'Raih 15 Bintang', unlocked: false },
];
