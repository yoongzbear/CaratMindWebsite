// data for scatter plot
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DateRangeValue } from '@/app/components/chart/DateRangeSelector';

export type MoodPoint = {
  jrnl_id: string;
  mood_name: string;
  mood_timestamp: string;
};

type Result = {
  points: MoodPoint[];
  loading: boolean;
  error: string | null;
};

export function useDailyMoodScatterData(
  // range: DateRangeValue,
  moodDate: string,
  // endDate: string,
): Result {
  const { accessToken } = useAuth();
  const [points, setPoints] = useState<MoodPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // day = 1
  const cacheKey = `start_date=${moodDate}&end_date=${moodDate}`;
  // const cacheKey =
  //   range.mode === 'days'
  //     ? `days=${range.days}`
  //     : `start_date=${range.startDate}&end_date=${range.endDate}`;

  useEffect(() => {
    if (!accessToken) return;

    const query = `start_date=${moodDate}&end_date=${moodDate}`;
    // range.mode === 'days'
    //   ? `days=${range.days}`
    //   : `start_date=${range.startDate}&end_date=${range.endDate}`;

    async function fetch_() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/mood/chart/scatter?${query}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to load scatter data.');
          return;
        }
        setPoints(data.points);
      } catch {
        setError('Something went wrong loading scatter data.');
      } finally {
        setLoading(false);
      }
    }

    fetch_();
  }, [accessToken, cacheKey]);

  return { points, loading, error };
}
