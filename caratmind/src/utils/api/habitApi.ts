import { Habit } from '@/types/habit';
import { request } from './apiUtils';

type TodayHabitResponse = {
  habit: Habit | null;
  message?: string;
};

type CreateTodayHabit = {
  hab_id: string;
  action: string;
  status: string;
};

export async function getTodayHabit(
  accessToken: string,
): Promise<Habit | null> {
  const data = request<TodayHabitResponse>('/api/habit/today', {
    accessToken,
  });
  return (await data).habit;
}

export async function saveTodayHabit(
  payload: CreateTodayHabit,
  accessToken: string,
): Promise<void> {
  await request<void>('/api/habit/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    accessToken,
    cache: 'no-store',
  });
}
