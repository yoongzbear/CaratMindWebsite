// stacked bar chart

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
import { getMoodStyle } from '@/app/utils/moodUtils';
import { toTitleCase } from '@/app/utils/format';
import { C } from '@/app/styles/styles';
import { format, parseISO } from 'date-fns';
import { DateRangeValue } from './DateRangeSelector';
import { useMoodChartData } from '@/app/hooks/moodChartData';
import { getRangeLabel } from '@/app/utils/dateFormat';
import { useRouter } from 'next/navigation';

type ChartRow = {
  date: string;
  jrnl_ids?: string[];
  [mood: string]: string | number | string[] | undefined;
};

type Props = {
  range?: DateRangeValue;
  height?: number;
};

export default function StackedBarChart({
  range = { mode: 'days', days: 7 },
  height = 320,
}: Props) {
  const { accessToken } = useAuth();
  const { chartData, moods, loading, error } = useMoodChartData(range);
  const router = useRouter();

  if (loading) {
    return (
      <div className="w-full">
        <p
          className="sm:text-[16px] md:text-[18px] mb-2"
          style={{ color: C.faint }}
        >
          {getRangeLabel(range)}
        </p>

        <div style={{ height }} className="flex items-center justify-center">
          <p
            className="text-center sm:text-[14px] md:text-[16px]"
            style={{ color: C.faint }}
          >
            Loading mood bar chart...
          </p>
        </div>
      </div>
    );
  }

  if (!chartData.length || !moods.length) {
    return (
      <div className="w-full">
        <p
          className="sm:text-[16px] md:text-[18px] mb-2"
          style={{ color: C.faint }}
        >
          {getRangeLabel(range)}
        </p>

        <div style={{ height }} className="flex items-center justify-center">
          <p
            className="text-center sm:text-[14px] md:text-[16px]"
            style={{ color: C.faint }}
          >
            No mood data available for this period.
          </p>
        </div>
      </div>
    );
  }

  // fit based on number of moods
  // const formatted = chartData.map((row) => ({
  //   ...row,
  //   raw_date: row.date, // for navigation
  //   date: format(parseISO(row.date), 'dd/MM'),
  // }));

  // fit bars 100% to the height
  const formatted = chartData.map((row) => {
    const total = moods.reduce(
      (sum, mood) => sum + (Number(row[mood]) || 0),
      0,
    );

    const normalizedRow: ChartRow = {
      date: format(parseISO(row.date), 'dd/MM'),
      raw_date: row.date,
      jrnl_ids: row.jrnl_ids ?? [],
    };
    moods.forEach((mood) => {
      const count = Number(row[mood]) || 0;
      normalizedRow[mood] = total > 0 ? (count / total) * 100 : 0;
      normalizedRow[`${mood}_count`] = count; // raw count stored under a separate key
    });

    return normalizedRow;
  });

  const handleBarClick = (barData: any) => {
    console.log('bar data:', barData);
    const rowData = barData?.payload;
    const ids: string[] = rowData?.jrnl_ids ?? [];
    if (ids.length === 0) return;
    if (ids.length === 1) {
      router.push(`/mood/insight/${ids[0]}`);
    } else {
      router.push(`/journal/past?date=${rowData?.raw_date}`);
    }
  };

  return (
    <div className="w-full">
      <p
        className="sm:text-[16px] md:text-[18px] mb-2 w-full"
        style={{ color: C.faint }}
      >
        {getRangeLabel(range)}
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={formatted}
          responsive
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
            labelFormatter={(_, payload) => {
              const raw = payload?.[0]?.payload?.raw_date;
              return raw ? format(parseISO(String(raw)), 'dd/MM/yyyy') : '';
            }}
            formatter={(value, name, props) => {
              const rawCount = props.payload?.[`${name}_count`] ?? value;
              const mood = String(name);
              const emoji = getMoodStyle(mood).emoji;
              return [rawCount, `${emoji} ${toTitleCase(mood)}`];
            }}
            contentStyle={{
              borderRadius: 10,
              border: `1px solid ${C.navy}`,
              fontSize: 13,
            }}
            // date label
            labelStyle={{
              color: C.serenity,
              fontWeight: 700,
            }}
            itemStyle={{
              color: C.navy,
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
                        border: `1.5px solid ${C.navy}`,
                        display: 'inline-block',
                      }}
                    />
                    <span
                      className="sm:text-[14px] md:text-[16px]"
                      style={{
                        color: getMoodStyle(entry.value).textColor,
                        fontWeight: 500,
                      }}
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
              stroke={getMoodStyle(mood).textColor}
              strokeWidth={1.5}
              onClick={handleBarClick}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
