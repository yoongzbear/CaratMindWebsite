const adjectives = [
  'Happy',
  'Brave',
  'Calm',
  'Gentle',
  'Sunny',
  'Bright',
  'Kind',
  'Peaceful',
  'Hopeful',
  'Serene',
  'Quiet',
];

const nouns = [
  'Cat',
  'Panda',
  'Otter',
  'Cloud',
  'River',
  'Star',
  'Moon',
  'Fox',
  'Dolphin',
  'Fish',
  'Sun',
];

export function generateRandomName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);

  return `${adjective}${noun}${number}`;
}
