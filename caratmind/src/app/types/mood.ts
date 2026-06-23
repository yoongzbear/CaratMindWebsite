export type Mood = {
  mood_id: string;
  mood_name: MoodName;
  mood_explain: string;
  mood_timestamp: string;
  jrnl_id: string;
  mood_confidence: number;
};

export type MoodName = {
  label: string;
  score: number;
};
