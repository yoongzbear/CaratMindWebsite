// data for scatter plot
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DateRangeValue } from '@/components/chart/DateRangeSelector';

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

// sample for preview page
type MockData = { chartData: MoodPoint[]; moods: string[] };

export function useMoodScatterData(
  range: DateRangeValue,
  mockData?: MockData,
): Result {
  const { accessToken } = useAuth();
  const [points, setPoints] = useState<MoodPoint[]>(mockData?.chartData ?? []);
  const [loading, setLoading] = useState(!mockData);
  const [error, setError] = useState<string | null>(null);

  const cacheKey =
    range.mode === 'days'
      ? `days=${range.days}`
      : `start_date=${range.startDate}&end_date=${range.endDate}`;

  useEffect(() => {
    // mock for preview
    if (mockData) {
      setPoints(mockData.chartData);
      // setMoods(mockData.moods);
      setLoading(false);
      setError(null);
      return;
    }

    if (!accessToken) return;

    const query =
      range.mode === 'days'
        ? `days=${range.days}`
        : `start_date=${range.startDate}&end_date=${range.endDate}`;

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
  }, [accessToken, cacheKey, mockData]);

  return { points, loading, error };
}
