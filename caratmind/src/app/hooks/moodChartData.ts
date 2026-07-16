'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export type ChartRow = {
  date: string;
  jrnl_ids?: string[];
  [mood: string]: string | number | string[] | undefined;
};

type Params =
  | { mode: 'days'; days: number }
  | { mode: 'range'; startDate: string; endDate: string };

type Result = {
  chartData: ChartRow[];
  moods: string[];
  loading: boolean;
  error: string | null;
};

// sample for preview page
type MockData = { chartData: ChartRow[]; moods: string[] };

export function useMoodChartData(params: Params, mockData?: MockData): Result {
  const { accessToken } = useAuth();
  const [chartData, setChartData] = useState<ChartRow[]>(
    mockData?.chartData ?? [],
  );
  const [moods, setMoods] = useState<string[]>(mockData?.moods ?? []);
  const [loading, setLoading] = useState(!mockData);
  const [error, setError] = useState<string | null>(null);

  const cacheKey =
    params.mode === 'days'
      ? `days=${params.days}`
      : `start=${params.startDate}&end=${params.endDate}`;

  useEffect(() => {
    // mock for preview
    if (mockData) {
      setChartData(mockData.chartData);
      setMoods(mockData.moods);
      setLoading(false);
      setError(null);
      return;
    }

    if (!accessToken) return;

    const query =
      params.mode === 'days'
        ? `days=${params.days}`
        : `start_date=${params.startDate}&end_date=${params.endDate}`;

    async function fetch_() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/mood/chart?${query}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to load chart data.');
          return;
        }
        setChartData(data.chart_data);
        setMoods(data.moods);
      } catch {
        setError('Something went wrong loading chart data.');
      } finally {
        setLoading(false);
      }
    }

    fetch_();
  }, [accessToken, cacheKey, mockData]);

  return { chartData, moods, loading, error };
}
