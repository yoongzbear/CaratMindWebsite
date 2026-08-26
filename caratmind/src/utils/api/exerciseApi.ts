import { Exercise, UserExercise, UserExerciseDetail } from '@/types/exercise';
import { request } from './apiUtils';

type ExerciseStreakResponse = {
  streak: number;
  completed_today: boolean;
  new_badge: string;
};

type RatingResponse = {
  message: string;
  user_exercise: UserExercise;
};

type ReasonResponse = {
  message: string;
  user_exercise: UserExercise;
};

type ApiErrorResponse = {
  error: string;
};

export async function getExerciseList(
  accessToken: string,
): Promise<Exercise[]> {
  const data = await request<{ exercises: Exercise[] }>('/api/exercise/list', {
    accessToken,
  });
  return data.exercises;
}

export async function getJournalExercise(
  jrnl_id: string,
  accessToken: string,
): Promise<UserExerciseDetail> {
  return request<UserExerciseDetail>(`/api/user_exercise/${jrnl_id}`, {
    accessToken,
  });
}

export async function getExerciseStreak(
  accessToken: string,
): Promise<ExerciseStreakResponse> {
  return request<ExerciseStreakResponse>('/api/user_exercise/streak', {
    accessToken,
  });
}

export async function getExerciseByDate(
  date: string,
  accessToken: string,
): Promise<UserExerciseDetail[]> {
  const data = await request<{ exercises: UserExerciseDetail[] }>(
    `/api/user_exercise/list?date=${date}`,
    {
      accessToken,
    },
  );
  return data.exercises;
}

export async function saveRating(
  uex_id: string,
  rating: number,
  accessToken: string,
): Promise<void> {
  await request<void>(`/api/user_exercise/${uex_id}/rating`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating }),
    accessToken,
    cache: 'no-store',
  });
}

export async function saveReason(
  uex_id: string,
  reason: string,
  accessToken: string,
): Promise<void> {
  await request<void>(`/api/user_exercise/${uex_id}/reason`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
    accessToken,
    cache: 'no-store',
  });
}

export async function getExerciseCalendarDates(
  month: string,
  accessToken: string,
): Promise<{ exerciseDates: string[] }> {
  return request<{ exerciseDates: string[] }>(
    `/api/user_exercise/calendar_dates?month=${month}`,
    {
      accessToken,
    },
  );
  // return data.entries;
}
