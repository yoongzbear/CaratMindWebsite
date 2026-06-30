'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { getMoodStyle } from '@/app/utils/moodEmoji';
import { toTitleCase } from '@/app/utils/format';
import { C } from '@/app/styles/styles';
import { format, parseISO } from 'date-fns';
import { DateRangeValue } from './DateRangeSelector';
import { useMoodChartData } from '@/app/hooks/moodChartData';

type ChartRow = { date: string; [mood: string]: string | number };

type Props = {
  range?: DateRangeValue;
  /** optional: if parent already fetched the data, pass it in to skip the fetch */
  chartData?: ChartRow[];
  moods?: string[];
};

export default function StackedBarChart({
  range = { mode: 'days', days: 7 },
  chartData: propData,
  moods: propMoods,
}: Props) {
  const { accessToken } = useAuth();
  //   const [chartData, setChartData] = useState<ChartRow[]>(propData ?? []);
  const { chartData, moods, loading, error } = useMoodChartData(range);
  //   const [moods, setMoods] = useState<string[]>(propMoods ?? []);
  //   const [loading, setLoading] = useState(!propData);

  //   useEffect(() => {
  //     if (propData) return; // already provided by parent
  //     if (!accessToken) return;

  //     async function fetchChart() {
  //       setLoading(true);
  //       try {
  //         const res = await fetch('/api/mood/chart', {
  //           headers: { Authorization: `Bearer ${accessToken}` },
  //         });
  //         const data = await res.json();
  //         if (res.ok) {
  //           setChartData(data.chart_data);
  //           setMoods(data.moods);
  //         }
  //       } catch {
  //         // fail silently — chart is non-critical
  //       } finally {
  //         setLoading(false);
  //       }
  //     }

  //     fetchChart();
  //   }, [accessToken, propData]);

  if (loading) {
    return (
      <p className="text-center text-sm" style={{ color: C.faint }}>
        Loading chart…
      </p>
    );
  }

  if (!chartData.length || !moods.length) {
    return (
      <p className="text-center text-sm" style={{ color: C.faint }}>
        No mood data for the past 7 days.
      </p>
    );
  }

  // format 'YYYY-MM-DD' -> 'Mon 23'
  const formatted = chartData.map((row) => ({
    ...row,
    date: format(parseISO(row.date), 'EEE d'),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={formatted}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="date"
          tick={{ fontSize: 13, fill: C.navy }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: C.faint }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip
          formatter={(value, name) => [value, toTitleCase(String(name))]}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid #eef2f9`,
            fontSize: 13,
            color: C.navy,
          }}
        />
        <Legend
          formatter={(value) => (
            <span
              className="sm:text-[12px] md:text-[14px]"
              style={{ color: C.navy }}
            >
              {getMoodStyle(value).emoji} {toTitleCase(value)}
            </span>
          )}
        />
        {/* TODO: make the texts more bold or use darker color */}
        {moods.map((mood) => (
          <Bar
            key={mood}
            dataKey={mood}
            stackId="a"
            fill={getMoodStyle(mood).borderColor}
            radius={
              mood === moods[moods.length - 1] ? [4, 4, 0, 0] : [0, 0, 0, 0]
            }
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
