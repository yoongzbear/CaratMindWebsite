'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// export type ChartRow = { date: string; [mood: string]: string | number };
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

export function useMoodChartData(params: Params): Result {
  const { accessToken } = useAuth();
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // build stable cache key so useEffect only re-runs when params actually change
  const cacheKey =
    params.mode === 'days'
      ? `days=${params.days}`
      : `start=${params.startDate}&end=${params.endDate}`;

  useEffect(() => {
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
  }, [accessToken, cacheKey]);

  return { chartData, moods, loading, error };
}
