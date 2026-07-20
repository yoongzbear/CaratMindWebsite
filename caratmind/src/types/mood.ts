export type Mood = {
  mood_id: string;
  mood_name: string;
  mood_confidence: string;
  mood_explain: string;
  mood_timestamp: string;
  jrnl_id: string;
  user_id: string;
  mood_confirmed?: boolean;
  mood_corrected?: string;
};

// export type MoodName = {
//   mood_label: string;
//   mood_confidence: number;
// };

export type MoodPoint = {
  jrnl_id: string;
  mood_name: string;
  mood_timestamp: string;
};

export type ChartRow = {
  date: string;
  jrnl_ids?: string[];
  [mood: string]: string | number | string[] | undefined;
};
