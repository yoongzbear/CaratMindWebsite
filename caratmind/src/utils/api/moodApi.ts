import { ChartRow, Mood, MoodPoint } from '@/types/mood';
import { request } from './apiUtils';

// export type MoodPoint = {
//   jrnl_id: string;
//   mood_name: string;
//   mood_timestamp: string;
// };

// export type ChartRow = {
//   date: string;
//   jrnl_ids?: string[];
//   [mood: string]: string | number | string[] | undefined;
// };

export async function getMood(
  jrnl_id: string,
  accessToken: string,
): Promise<Mood> {
  return request<Mood>(`/api/mood/${jrnl_id}`, { accessToken });
}

export async function confirmMood(
  mood_id: string,
  accessToken: string,
): Promise<void> {
  await request<void>(`/api/mood/${mood_id}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    accessToken,
    cache: 'no-store',
  });
}

export async function saveCorrectMood(
  mood_id: string,
  correctMood: string,
  accessToken: string,
): Promise<void> {
  await request<void>(`/api/mood/${mood_id}/corrected`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    accessToken,
    body: JSON.stringify({ correctMood }),
    cache: 'no-store',
  });
}

export async function getMoodScatterData(
  query: string,
  accessToken: string,
): Promise<MoodPoint[]> {
  const data = await request<{ points: MoodPoint[] }>(
    `/api/mood/chart/scatter?${query}`,
    {
      accessToken,
    },
  );
  return data.points;
}

export async function getMoodChartData(
  query: string,
  accessToken: string,
): Promise<{ chart_data: ChartRow[]; moods: string[] }> {
  const data = await request<{ chart_data: ChartRow[]; moods: string[] }>(
    `/api/mood/chart?${query}`,
    {
      accessToken,
    },
  );
  return data;
}

export async function getNegativeMoodStreak(
  accessToken: string,
): Promise<number> {
  const data = await request<{ negative_streak_days: number }>(
    '/api/mood/streak',
    {
      accessToken,
    },
  );
  return data.negative_streak_days;
}
