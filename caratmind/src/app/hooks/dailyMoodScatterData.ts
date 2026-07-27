// data for scatter plot
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMoodScatterData } from '@/utils/api/moodApi';
import { MoodPoint } from '@/types/mood';

type Result = {
  points: MoodPoint[];
  loading: boolean;
  error: string | null;
};

type MockData = { points: MoodPoint[] };

export function useDailyMoodScatterData(
  moodDate: string,
  mockData?: MockData,
): Result {
  const { accessToken } = useAuth();
  const [points, setPoints] = useState<MoodPoint[]>(mockData?.points ?? []);
  const [loading, setLoading] = useState(!mockData);
  const [error, setError] = useState<string | null>(null);

  // day = 1
  const cacheKey = `start_date=${moodDate}&end_date=${moodDate}`;

  useEffect(() => {
    // preview
    if (mockData) {
      setPoints(mockData.points);
      setLoading(false);
      setError(null);
      return;
    }

    if (!accessToken) return;

    const query = `start_date=${moodDate}&end_date=${moodDate}`;

    async function fetch_() {
      setLoading(true);
      setError(null);
      try {
        if (accessToken) {
          const data = await getMoodScatterData(query, accessToken);

          setPoints(data);
        }
      } catch {
        setError('Something went wrong loading scatter data.');
      } finally {
        setLoading(false);
      }
    }

    fetch_();
  }, [accessToken, cacheKey, mockData]);

  return { points, loading, error };
}
