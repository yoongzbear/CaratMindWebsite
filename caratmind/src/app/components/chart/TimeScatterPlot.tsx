// mood scatter plot over time in a day

// <ScatterChart>
// x = time (example: 10:00AM 11:00AM etc)
// y = moods

'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { format, parseISO, startOfDay } from 'date-fns';
import { C } from '@/app/styles/styles';

import { toTitleCase } from '@/app/utils/format';
import { DateRangeValue } from './DateRangeSelector';
import { MoodPoint, useMoodScatterData } from '@/app/hooks/moodScatterData';
import { useRouter } from 'next/navigation';
import {
  getMoodStyle,
  MOOD_ORDER,
  MOOD_ORDER_MAP,
} from '@/app/utils/moodUtils';
import { getRangeLabel, resolveLocalDateRange } from '@/app/utils/dateFormat';

type Props = {
  range?: DateRangeValue;
  height?: number;
};

export default function TimeScatterPlot({
  range = { mode: 'days', days: 1 },
  height = 320,
}: Props) {
  const { points, loading, error } = useMoodScatterData(range);
  const router = useRouter();

  //   TODO: change to the start time and end time, show all times?
  const { startDate, endDate } = resolveLocalDateRange(range);
  const xStart = startOfDay(parseISO(startDate)).getTime();
  const xEnd = startOfDay(parseISO(endDate)).getTime();

  //   ES Lint error
  const handleScatterClick = (point: any) => {
    router.push(`/mood/insight/${point.jrnl_id}`);
  };

  if (loading) {
    return (
      <p
        className="text-center sm:text-[14px] md:text-[16px]"
        style={{ color: C.faint }}
      >
        Loading mood daily scatter plot chart..
      </p>
    );
  }

  if (!points.length) {
    return (
      <p
        className="text-center sm:text-[14px] md:text-[16px]"
        style={{ color: C.faint }}
      >
        No mood data available for this period.
      </p>
    );
  }

  // only moods present in the data, preserving MOOD_ORDER ordering
  const presentMoods = MOOD_ORDER.filter((mood) =>
    points.some((p) => p.mood_name === mood),
  );

  // map each present mood to a Y index (0 = most negative present, top = most positive present)
  const presentMoodRankMap = Object.fromEntries(
    presentMoods.map((mood, i) => [mood, presentMoods.length - 1 - i]),
  );

  const maxY = presentMoods.length - 1;

  const data = points.map((p) => ({
    x: startOfDay(new Date(p.mood_timestamp)).getTime(), // not considering actual time of the day
    y: presentMoodRankMap[p.mood_name] ?? 0,
    mood: p.mood_name,
    jrnl_id: p.jrnl_id,
    timestamp: p.mood_timestamp,
  }));

  return (
    <div className="w-full">
      <p
        className="sm:text-[16px] md:text-[18px] mb-2 w-full"
        style={{ color: C.faint }}
      >
        {/* TODO: change to the day's date */}
        {getRangeLabel(range)}
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{ top: 10, right: 0, left: -20, bottom: 5 }}
          responsive
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            type="number"
            dataKey="x"
            domain={[xStart, xEnd]}
            tickFormatter={(ts) => format(new Date(ts), 'dd/MM')}
            tick={{ fontSize: 13, fill: C.navy }}
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, maxY]}
            ticks={Array.from({ length: maxY + 1 }, (_, i) => i)}
            tickFormatter={(rank) => {
              const mood = presentMoods[presentMoods.length - 1 - rank];
              return mood ? toTitleCase(mood) : '';
              // const mood = MOOD_ORDER[maxY - rank];
              // return toTitleCase(mood);
            }}
            tick={{ fontSize: 11, fill: C.navy }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip
            formatter={(_, __, props) => {
              const point = props.payload;
              //   show time only
              return [
                `${toTitleCase(point.mood)} - ${format(new Date(point.timestamp), 'p')}`,
                '',
              ];
            }}
            contentStyle={{
              borderRadius: 10,
              border: `1px solid ${C.navy}`,
              fontSize: 13,
            }}
            itemStyle={{ color: C.navy, fontWeight: 600 }}
            wrapperStyle={{ zIndex: 100 }}
          />
          <Scatter data={data} onClick={handleScatterClick} cursor="pointer">
            {data.map((point, i) => (
              <Cell
                key={i}
                fill={getMoodStyle(point.mood).bgColor}
                stroke={getMoodStyle(point.mood).borderColor}
                strokeWidth={1.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
