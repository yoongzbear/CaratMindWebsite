type ExerciseStyle = {
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

export const EXERCISE_EMOJIS: Record<string, ExerciseStyle> = {
  breathing: {
    emoji: '🌬️',
    bgColor: '#FFF8E1',
    textColor: '#F57F17',
    borderColor: '#FFE082',
  },
  meditation: {
    emoji: '🧘‍♂️',
    bgColor: '#FFF8E1',
    textColor: '#F9A825',
    borderColor: '#FFE082',
  },
  mindfulness: {
    emoji: '🍃',
    bgColor: '#FDECEA',
    textColor: '#C62828',
    borderColor: '#EF9A9A',
  },
  positivity: {
    emoji: '🌞',
    bgColor: '#FCE4EC',
    textColor: '#AD1457',
    borderColor: '#F8BBD0',
  },
};

const DEFAULT_EXERCISE_STYLE: ExerciseStyle = {
  emoji: '💪',
  bgColor: '#f4f7fc',
  textColor: '#3a4a6b',
  borderColor: '#dde4f0',
};

export function getExerciseStyle(exercise?: string | null): ExerciseStyle {
  if (!exercise) return DEFAULT_EXERCISE_STYLE;

  return EXERCISE_EMOJIS[exercise.toLowerCase()] ?? DEFAULT_EXERCISE_STYLE;
}
