// TODO: replace with lucide react icon
const MOOD_EMOJIS: Record<string, string> = {
  joy: '😊',
  happiness: '😊',
  sadness: '😢',
  anger: '😠',
  annoyance: '😒',
  fear: '😨',
  surprise: '😲',
  disgust: '🤢',
  neutral: '😐',
  love: '🥰',
  gratitude: '🙏',
  excitement: '🤩',
  anxiety: '😰',
  confusion: '😕',
  embarrassment: '😳',
  pride: '😌',
  relief: '😅',
  disappointment: '😞',
  grief: '😭',
  nervousness: '😬',
  optimism: '🙂',
  caring: '🤗',
  curiosity: '🤔',
  admiration: '😍',
  amusement: '😄',
  approval: '👍',
  disapproval: '👎',
  desire: '😏',
  remorse: '😔',
  realization: '💡',
};

// Admiration	🤩	Love	❤️
// Amusement	😄	Nervousness	😰
// Anger	😠	Optimism	✨
// Annoyance	🙄	Pride	👑
// Approval	👍	Realization	💡
// Caring	🤗	Relief	😌
// Confusion	😕	Remorse	😔
// Curiosity	🤔	Sadness	😢
// Desire	🔥	Surprise	😲
// Disappointment	😞	Disapproval	👎
// Disgust	🤢	Gratitude	🙏
// Embarrassment	😳	Grief	😭
// Excitement	🎉	Joy	😊
// Fear	😱	Neutral	😐

export function getMoodEmoji(moodName?: string | null): string {
  if (!moodName) return '🙂';
  return MOOD_EMOJIS[moodName.toLowerCase()] ?? '🙂';
}
