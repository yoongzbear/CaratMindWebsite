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
import { format, parseISO, startOfDay } from 'date-fns';
import { C } from '@/app/styles/styles';

import { toTitleCase } from '@/app/utils/format';
import { DateRangeValue } from './DateRangeSelector';
import { useMoodScatterData } from '@/app/hooks/moodScatterData';
import { useRouter } from 'next/navigation';
import { getMoodStyle, MOOD_ORDER } from '@/app/utils/moodUtils';
import { getRangeLabel, resolveLocalDateRange } from '@/app/utils/dateFormat';

type Props = {
  range?: DateRangeValue;
  height?: number;
};

export default function DayScatterPlot({
  range = { mode: 'days', days: 30 },
  height = 320,
}: Props) {
  const { points, loading, error } = useMoodScatterData(range);
  const router = useRouter();

  const { startDate, endDate } = resolveLocalDateRange(range);
  const xStart = startOfDay(parseISO(startDate)).getTime();
  const xEnd = startOfDay(parseISO(endDate)).getTime();

  //   ES Lint error
  const handleScatterClick = (point: any) => {
    console.log('point: ', point);
    router.push(`/mood/insight/${point.jrnl_id}`);
  };

  if (loading) {
    return (
      <div className="w-full">
        <h5
          className="text-[clamp(1rem,3vw,1.5rem)] mb-2"
          style={{ color: C.navy }}
        >
          {getRangeLabel(range)}
        </h5>

        <div style={{ height }} className="flex items-center justify-center">
          <p
            className="text-center text-[clamp(1rem,3vw,1.5rem)]"
            style={{ color: C.muted }}
          >
            Loading mood scatter plot chart..
          </p>
        </div>
      </div>
    );
  }

  if (!points.length) {
    return (
      <div className="w-full">
        <h5
          className="text-[clamp(1rem,3vw,1.5rem)] mb-2"
          style={{ color: C.navy }}
        >
          {getRangeLabel(range)}
        </h5>

        <div style={{ height }} className="flex items-center justify-center">
          <p
            className="text-center text-[clamp(1rem,3vw,1.5rem)]"
            style={{ color: C.muted }}
          >
            No mood data available for this period.
          </p>
        </div>
      </div>
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
      <h5
        className="text-[clamp(1rem,3vw,1.5rem)] mb-2 w-full"
        style={{ color: C.navy }}
      >
        {getRangeLabel(range)}
      </h5>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{ top: 10, right: 0, left: -20, bottom: 10 }}
          // style={{ backgroundColor: C.serenity }}
          responsive
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            type="number"
            dataKey="x"
            domain={[xStart, xEnd]}
            tickFormatter={(ts) => format(new Date(ts), 'dd/MM')}
            tick={{ fontSize: 15, fill: C.navy }}
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
            tick={{ fontSize: 12, fill: C.navy }}
            axisLine={false}
            tickLine={false}
            width={90}
            padding={{ bottom: 15 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const point = payload[0].payload;

              return (
                <div
                  className="text-[clamp(1rem,2vw,1.15rem)]"
                  style={{
                    background: 'white',
                    borderRadius: 10,
                    border: `1px solid ${C.navy}`,
                    padding: '6px 10px',
                    color: C.navy,
                  }}
                >
                  {getMoodStyle(point.mood).emoji}
                  {toTitleCase(point.mood)} -{' '}
                  {format(new Date(point.timestamp), 'dd/MM/yyyy, p')}
                </div>
              );
            }}
            wrapperStyle={{ zIndex: 100 }}
          />
          {/* <Tooltip
            formatter={(_, __, props) => {
              const point = props.payload;
              return [
                `${toTitleCase(point.mood)} - ${format(new Date(point.timestamp), 'dd/MM/yyyy, p')}`,
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
          /> */}
          <Scatter data={data} onClick={handleScatterClick} cursor="pointer">
            {data.map((point, i) => (
              <Cell
                key={i}
                fill={getMoodStyle(point.mood).borderColor}
                stroke={getMoodStyle(point.mood).borderColor}
                strokeWidth={4}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
