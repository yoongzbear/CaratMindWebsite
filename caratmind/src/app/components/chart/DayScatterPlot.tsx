// mood scatter plot over a range of days

// use Recharts <ScatterChart> with <Scatter>
// x = date (example: 25/6, 26/6 etc)
// y = all moods (?) in order from most positive (top) to most negative (bottom)
// TODO: decide to use all moods or only existing moods

'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
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

type Props = {
  range?: DateRangeValue;
  height?: number;
};

// type ScatterClickData = {
//   scatterData: MoodPoint;
// };

export default function MoodScatterChart({
  range = { mode: 'days', days: 30 },
  height = 360,
}: Props) {
  const { points, loading, error } = useMoodScatterData(range);
  const router = useRouter();

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
        Loading mood scatter plot chart..
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

  // x = timestamp (ms), y = mood rank (inverted so "most positive" is on top)
  const data = points.map((p) => ({
    x: new Date(p.mood_timestamp).getTime(),
    y:
      MOOD_ORDER.length -
      1 -
      (MOOD_ORDER_MAP[p.mood_name] ?? MOOD_ORDER.length - 1),
    mood: p.mood_name,
    jrnl_id: p.jrnl_id,
    timestamp: p.mood_timestamp,
  }));

  const maxY = MOOD_ORDER.length - 1;

  return (
    <ResponsiveContainer width="100%" height={height}>
      {/* TODO: add dates here */}
      <ScatterChart
        margin={{ top: 10, right: 16, left: 5, bottom: 5 }}
        responsive
      >
        <XAxis
          type="number"
          dataKey="x"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(ts) => format(new Date(ts), 'd/M')}
          tick={{ fontSize: 13, fill: C.navy }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={[0, maxY]}
          ticks={Array.from({ length: maxY + 1 }, (_, i) => i)}
          tickFormatter={(rank) => {
            const mood = MOOD_ORDER[maxY - rank];
            return toTitleCase(mood);
          }}
          tick={{ fontSize: 11, fill: C.faint }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          formatter={(_, __, props) => {
            const point = props.payload;
            return [
              `${toTitleCase(point.mood)} — ${format(new Date(point.timestamp), 'd MMM yyyy, p')}`,
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
        <Scatter
          data={data}
          //   onClick={(point: { scatterData: MoodPoint }) =>
          //     router.push(`/mood/insight/${point.scatterData.jrnl_id}`)
          //   }
          onClick={handleScatterClick}
          cursor="pointer"
        >
          {data.map((point, i) => (
            // deprecated cell
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
  );
}
