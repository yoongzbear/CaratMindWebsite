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
  height?: number;
  /** optional: if parent already fetched the data, pass it in to skip the fetch */
  chartData?: ChartRow[];
  moods?: string[];
};

export default function StackedBarChart({
  range = { mode: 'days', days: 7 },
  height = 320,
  chartData: propData,
  moods: propMoods,
}: Props) {
  const { accessToken } = useAuth();
  const { chartData, moods, loading, error } = useMoodChartData(range);

  if (loading) {
    return (
      <p className="text-center text-sm" style={{ color: C.faint }}>
        Loading chart…
      </p>
    );
  }

  if (!chartData.length || !moods.length) {
    return (
      <p
        className="text-center sm:text-[14px] md:text-[16px]"
        style={{ color: C.faint }}
      >
        No mood data for the past 7 days.
      </p>
    );
  }

  // format 'YYYY-MM-DD' to 'Mon 23'
  const formatted = chartData.map((row) => ({
    ...row,
    date: format(parseISO(row.date), 'EEE d'),
  }));

  // fit bars 100% to the height
  // const formatted = chartData.map((row) => {
  //   const total = moods.reduce(
  //     (sum, mood) => sum + (Number(row[mood]) || 0),
  //     0,
  //   );

  //   const normalizedRow: ChartRow = {
  //     date: format(parseISO(row.date), 'EEE d'),
  //   };
  //   moods.forEach((mood) => {
  //     const count = Number(row[mood]) || 0;
  //     normalizedRow[mood] = total > 0 ? (count / total) * 100 : 0;
  //     normalizedRow[`${mood}_count`] = count; // raw count stored under a separate key
  //   });

  //   return normalizedRow;
  // });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={formatted}
        margin={{ top: 10, right: 16, left: 5, bottom: 5 }}
      >
        <XAxis
          dataKey="date"
          tick={{ fontSize: 15, fill: C.navy }}
          axisLine={false}
          tickLine={false}
        />
        {/* <YAxis
          allowDecimals={false}
          tick={{ fontSize: 13, fill: C.faint }}
          axisLine={false}
          tickLine={false}
          width={24}
          // domain={[0, 100]}
          // tickFormatter={(v) => `${v}%`} // the number format
        /> */}
        <Tooltip
          formatter={(value, name, props) => {
            const rawCount = props.payload?.[`${name}_count`] ?? value;
            return [rawCount, toTitleCase(String(name))];
          }}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${C.navy}`,
            fontSize: 13,
            // color: C.navy,
          }}
          // date label
          labelStyle={{
            color: C.serenity,
            fontWeight: 700,
          }}
          itemStyle={{
            color: C.navy,
            fontWeight: 600,
          }}
          wrapperStyle={{ zIndex: 100 }} // make it above the legend
        />
        <Legend
          content={({ payload }) => (
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {payload?.map((entry) => (
                <div key={entry.value} className="flex items-center gap-1.5">
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      backgroundColor: entry.color,
                      border: `1.5px solid ${C.muted}`,
                      display: 'inline-block',
                    }}
                  />
                  <span
                    className="sm:text-[14px] md:text-[16px]"
                    style={{ color: C.navy, fontWeight: 500 }}
                  >
                    {getMoodStyle(String(entry.value)).emoji}{' '}
                    {toTitleCase(String(entry.value))}
                  </span>
                </div>
              ))}
            </div>
          )}
        />

        {moods.map((mood) => (
          <Bar
            key={mood}
            dataKey={mood}
            stackId="a"
            fill={getMoodStyle(mood).borderColor}
            // stroke={getMoodStyle(mood).borderColor}
            stroke={C.navy}
            strokeWidth={1.5}
            // radius={
            //   mood === moods[moods.length - 1] ? [4, 4, 0, 0] : [0, 0, 0, 0]
            // }
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
