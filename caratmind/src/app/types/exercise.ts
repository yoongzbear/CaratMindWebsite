export type Exercise = {
  exc_id: string;
  exc_name: string;
  exc_type: string;
  exc_mood: string | string[];
  exc_desc: string;
  exc_steps: string[];
};

// user exercise
export type UserExercise = {
  uex_id: string;
  exc_id: string;
  jrnl_id: string;
  exc_name: string;
  uex_status: ExerciseStatusKey;
  uex_rating?: string;
  uex_reason?: string;
  uex_created_at: string;
  uex_done_date?: string;
  user_id: string;
  exercise: Exercise;
};

export type ExerciseStatusKey = 'incomplete' | 'completed';

// export type UserExerciseDetail = UserExercise & Exercise;
