const MOOD_EMOJIS: Record<string, string> = {
  admiration: '🤩',
  amusement: '😄',
  anger: '😠',
  annoyance: '🙄',
  approval: '👍',
  caring: '🤗',
  confusion: '😕',
  curiosity: '🤔',
  desire: '😏',
  disappointment: '😞',
  disapproval: '👎',
  disgust: '🤢',
  embarrassment: '😳',
  excitement: '🤩',
  fear: '😱',
  gratitude: '🙏',
  grief: '😭',
  joy: '😊',
  love: '🥰',
  nervousness: '😰',
  neutral: '😐',
  optimism: '🙂',
  pride: '👑',
  realization: '💡',
  relief: '😌',
  remorse: '😔',
  sadness: '😢',
  surprise: '😲',
};

export function getMoodEmoji(moodName?: string | null): string {
  if (!moodName) return '🙂';
  return MOOD_EMOJIS[moodName.toLowerCase()] ?? '🙂';
}
