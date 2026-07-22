import { MoodPoint } from '@/types/mood';
import { format, subDays } from 'date-fns';

type MoodStyle = {
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

export function buildMockBarData() {
  const moods = ['joy', 'fear', 'anger'];
  const chartData = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
    jrnl_ids: [],
    joy: Math.floor(Math.random() * 3),
    fear: Math.floor(Math.random() * 3),
    anger: Math.floor(Math.random() * 2),
  }));
  return { chartData, moods };
}

export function buildMockScatterPoints(): MoodPoint[] {
  const moods = ['joy', 'fear', 'anger'];
  return Array.from({ length: 7 }).map((_, i) => ({
    jrnl_id: `mock-${i}`,
    mood_name: moods[i % moods.length],
    mood_timestamp: subDays(new Date(), 6 - i).toISOString(),
  }));
}

export const MOOD_EMOJIS: Record<string, MoodStyle> = {
  admiration: {
    emoji: '🤩',
    bgColor: '#FFF8E1',
    textColor: '#F57F17',
    borderColor: '#FFE082',
  },
  amusement: {
    emoji: '😄',
    bgColor: '#FFF8E1',
    textColor: '#F9A825',
    borderColor: '#FFE082',
  },
  anger: {
    emoji: '😠',
    bgColor: '#FDECEA',
    textColor: '#C62828',
    borderColor: '#EF9A9A',
  },
  annoyance: {
    emoji: '🙄',
    bgColor: '#FCE4EC',
    textColor: '#AD1457',
    borderColor: '#F8BBD0',
  },
  approval: {
    emoji: '👍',
    bgColor: '#E8F5E9',
    textColor: '#2E7D32',
    borderColor: '#A5D6A7',
  },
  caring: {
    emoji: '🤗',
    bgColor: '#F3E5F5',
    textColor: '#7B1FA2',
    borderColor: '#CE93D8',
  },
  confusion: {
    emoji: '😕',
    bgColor: '#ECEFF1',
    textColor: '#455A64',
    borderColor: '#B0BEC5',
  },
  curiosity: {
    emoji: '🤔',
    bgColor: '#E3F2FD',
    textColor: '#1565C0',
    borderColor: '#90CAF9',
  },
  desire: {
    emoji: '😏',
    bgColor: '#FCE4EC',
    textColor: '#AD1457',
    borderColor: '#F8BBD0',
  },
  disappointment: {
    emoji: '😞',
    bgColor: '#F5F5F5',
    textColor: '#616161',
    borderColor: '#BDBDBD',
  },
  disapproval: {
    emoji: '👎',
    bgColor: '#FFEBEE',
    textColor: '#C62828',
    borderColor: '#EF9A9A',
  },
  disgust: {
    emoji: '🤢',
    bgColor: '#F1F8E9',
    textColor: '#558B2F',
    borderColor: '#C5E1A5',
  },
  embarrassment: {
    emoji: '😳',
    bgColor: '#FCE4EC',
    textColor: '#C2185B',
    borderColor: '#F48FB1',
  },
  excitement: {
    emoji: '🤩',
    bgColor: '#FFF3E0',
    textColor: '#EF6C00',
    borderColor: '#FFCC80',
  },
  fear: {
    emoji: '😱',
    bgColor: '#E8EAF6',
    textColor: '#3949AB',
    borderColor: '#9FA8DA',
  },
  gratitude: {
    emoji: '🙏',
    bgColor: '#E8F5E9',
    textColor: '#2E7D32',
    borderColor: '#A5D6A7',
  },
  grief: {
    emoji: '😭',
    bgColor: '#E3F2FD',
    textColor: '#1565C0',
    borderColor: '#90CAF9',
  },
  joy: {
    emoji: '😊',
    bgColor: '#FFFDE7',
    textColor: '#F9A825',
    borderColor: '#FFF59D',
  },
  love: {
    emoji: '🥰',
    bgColor: '#FCE4EC',
    textColor: '#D81B60',
    borderColor: '#F48FB1',
  },
  nervousness: {
    emoji: '😰',
    bgColor: '#E8EAF6',
    textColor: '#5E35B1',
    borderColor: '#B39DDB',
  },
  neutral: {
    emoji: '😐',
    bgColor: '#ECEFF1',
    textColor: '#546E7A',
    borderColor: '#CFD8DC',
  },
  optimism: {
    emoji: '🙂',
    bgColor: '#E8F5E9',
    textColor: '#388E3C',
    borderColor: '#A5D6A7',
  },
  pride: {
    emoji: '👑',
    bgColor: '#FFF8E1',
    textColor: '#F9A825',
    borderColor: '#FFD54F',
  },
  realization: {
    emoji: '💡',
    bgColor: '#FFFDE7',
    textColor: '#FBC02D',
    borderColor: '#FFF59D',
  },
  relief: {
    emoji: '😌',
    bgColor: '#E0F7FA',
    textColor: '#00838F',
    borderColor: '#80DEEA',
  },
  remorse: {
    emoji: '😔',
    bgColor: '#F3E5F5',
    textColor: '#6A1B9A',
    borderColor: '#CE93D8',
  },
  sadness: {
    emoji: '😢',
    bgColor: '#E3F2FD',
    textColor: '#1976D2',
    borderColor: '#90CAF9',
  },
  surprise: {
    emoji: '😲',
    bgColor: '#FFF3E0',
    textColor: '#F57C00',
    borderColor: '#FFCC80',
  },
};

// dark theme
export const MOOD_EMOJIS_DARK: Record<string, MoodStyle> = {
  admiration: {
    emoji: '🤩',
    bgColor: '#3d3418',
    textColor: '#FFD54F',
    borderColor: '#5c4d1f',
  },
  amusement: {
    emoji: '😄',
    bgColor: '#3d3418',
    textColor: '#FFCA28',
    borderColor: '#5c4d1f',
  },
  anger: {
    emoji: '😠',
    bgColor: '#3d1f1d',
    textColor: '#EF9A9A',
    borderColor: '#5c2b28',
  },
  annoyance: {
    emoji: '🙄',
    bgColor: '#3a1a26',
    textColor: '#F48FB1',
    borderColor: '#552538',
  },
  approval: {
    emoji: '👍',
    bgColor: '#1b3320',
    textColor: '#A5D6A7',
    borderColor: '#2a4d31',
  },
  caring: {
    emoji: '🤗',
    bgColor: '#2e2038',
    textColor: '#CE93D8',
    borderColor: '#443053',
  },
  confusion: {
    emoji: '😕',
    bgColor: '#2a2f33',
    textColor: '#B0BEC5',
    borderColor: '#3f474d',
  },
  curiosity: {
    emoji: '🤔',
    bgColor: '#1a2c3d',
    textColor: '#90CAF9',
    borderColor: '#26415c',
  },
  desire: {
    emoji: '😏',
    bgColor: '#3a1a26',
    textColor: '#F48FB1',
    borderColor: '#552538',
  },
  disappointment: {
    emoji: '😞',
    bgColor: '#2a2a2a',
    textColor: '#BDBDBD',
    borderColor: '#404040',
  },
  disapproval: {
    emoji: '👎',
    bgColor: '#3d1f1f',
    textColor: '#EF9A9A',
    borderColor: '#5c2b2b',
  },
  disgust: {
    emoji: '🤢',
    bgColor: '#242f1a',
    textColor: '#C5E1A5',
    borderColor: '#374526',
  },
  embarrassment: {
    emoji: '😳',
    bgColor: '#3a1a26',
    textColor: '#F48FB1',
    borderColor: '#552538',
  },
  excitement: {
    emoji: '🤩',
    bgColor: '#3d2a15',
    textColor: '#FFCC80',
    borderColor: '#5c3f1f',
  },
  fear: {
    emoji: '😱',
    bgColor: '#242a4d',
    textColor: '#9FA8DA',
    borderColor: '#363f70',
  },
  gratitude: {
    emoji: '🙏',
    bgColor: '#1b3320',
    textColor: '#A5D6A7',
    borderColor: '#2a4d31',
  },
  grief: {
    emoji: '😭',
    bgColor: '#1a2c3d',
    textColor: '#90CAF9',
    borderColor: '#26415c',
  },
  joy: {
    emoji: '😊',
    bgColor: '#3d3418',
    textColor: '#FFF59D',
    borderColor: '#5c4d1f',
  },
  love: {
    emoji: '🥰',
    bgColor: '#3a1a26',
    textColor: '#F48FB1',
    borderColor: '#552538',
  },
  nervousness: {
    emoji: '😰',
    bgColor: '#2a2140',
    textColor: '#B39DDB',
    borderColor: '#3f305c',
  },
  neutral: {
    emoji: '😐',
    bgColor: '#2a2f33',
    textColor: '#CFD8DC',
    borderColor: '#3f474d',
  },
  optimism: {
    emoji: '🙂',
    bgColor: '#1b3320',
    textColor: '#A5D6A7',
    borderColor: '#2a4d31',
  },
  pride: {
    emoji: '👑',
    bgColor: '#3d3418',
    textColor: '#FFD54F',
    borderColor: '#5c4d1f',
  },
  realization: {
    emoji: '💡',
    bgColor: '#3d3418',
    textColor: '#FFF59D',
    borderColor: '#5c4d1f',
  },
  relief: {
    emoji: '😌',
    bgColor: '#123338',
    textColor: '#80DEEA',
    borderColor: '#1c4d54',
  },
  remorse: {
    emoji: '😔',
    bgColor: '#2e2038',
    textColor: '#CE93D8',
    borderColor: '#443053',
  },
  sadness: {
    emoji: '😢',
    bgColor: '#1a2c3d',
    textColor: '#90CAF9',
    borderColor: '#26415c',
  },
  surprise: {
    emoji: '😲',
    bgColor: '#3d2a15',
    textColor: '#FFCC80',
    borderColor: '#5c3f1f',
  },
};

const DEFAULT_MOOD_STYLE: MoodStyle = {
  emoji: '🙂',
  bgColor: '#f4f7fc',
  textColor: '#3a4a6b',
  borderColor: '#dde4f0',
};

const DEFAULT_MOOD_STYLE_DARK: MoodStyle = {
  emoji: '🙂',
  bgColor: '#1e2536',
  textColor: '#c7d2e8',
  borderColor: '#2f3a52',
};

export function getMoodStyle(
  mood?: string | null,
  isDark: boolean = false,
): MoodStyle {
  const map = isDark ? MOOD_EMOJIS_DARK : MOOD_EMOJIS; // map dark and normal theme emojis
  const fallback = isDark ? DEFAULT_MOOD_STYLE_DARK : DEFAULT_MOOD_STYLE;

  if (!mood) return fallback;
  return map[mood.toLowerCase()] ?? fallback;
}

// negative mood
export const NEGATIVE_MOOD = [
  'anger',
  'annoyance',
  'disappointment',
  'disapproval',
  'disgust',
  'embarrassment',
  'fear',
  'grief',
  'nervousness',
  'remorse',
  'sadness',
];

export function isNegativeMood(moodName: string | null | undefined): boolean {
  if (!moodName) return false;
  return NEGATIVE_MOOD.includes(moodName.toLowerCase());
}

// order of mood - most positive to most negative
export const MOOD_ORDER = [
  'love',
  'gratitude',
  'joy',
  'admiration',
  'caring',
  'optimism',
  'approval',
  'pride',
  'relief',
  'amusement',
  'excitement',
  'desire',
  'curiosity',
  'realization',
  'surprise',
  'neutral',
  'confusion',
  'nervousness',
  'fear',
  'embarrassment',
  'remorse',
  'disappointment',
  'sadness',
  'grief',
  'annoyance',
  'disapproval',
  'anger',
  'disgust',
] as const;

export const MOOD_ORDER_MAP = Object.fromEntries(
  MOOD_ORDER.map((mood, index) => [mood, index]),
);
