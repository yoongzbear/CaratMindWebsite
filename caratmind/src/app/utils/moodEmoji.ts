type MoodStyle = {
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

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

const DEFAULT_MOOD_STYLE: MoodStyle = {
  emoji: '🙂',
  bgColor: '#f4f7fc',
  textColor: '#3a4a6b',
  borderColor: '#dde4f0',
};

export function getMoodStyle(mood?: string | null): MoodStyle {
  if (!mood) return DEFAULT_MOOD_STYLE;

  return MOOD_EMOJIS[mood.toLowerCase()] ?? DEFAULT_MOOD_STYLE;
}
