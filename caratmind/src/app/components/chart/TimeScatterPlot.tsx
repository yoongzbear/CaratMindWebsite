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
import { addDays, addHours, format, parseISO, startOfDay } from 'date-fns';
// import { C } from '@/app/styles/styles';

import { toTitleCase } from '@/app/utils/format';
import { useRouter } from 'next/navigation';
import { getMoodStyle, MOOD_ORDER } from '@/app/utils/moodUtils';
import {
  MoodPoint,
  useDailyMoodScatterData,
} from '@/app/hooks/dailyMoodScatterData';
import Link from 'next/link';
import { buttonGradient } from '@/app/styles/ui';

type Props = {
  // range?: DateRangeValue;
  moodDate: string;
  height?: number;
  mockData?: { points: MoodPoint[] };
};

export default function TimeScatterPlot({
  // range = { mode: 'days', days: 1 },
  moodDate,
  height = 320,
  mockData,
}: Props) {
  const { points, loading, error } = useDailyMoodScatterData(
    moodDate,
    mockData,
  );
  const router = useRouter();
  const isToday = moodDate === format(new Date(), 'yyyy-MM-dd'); // check if date is current date

  // time for start and end of the day
  const xStart = startOfDay(parseISO(moodDate)).getTime();
  const xEnd = addDays(startOfDay(parseISO(moodDate)), 1).getTime();

  //   ES Lint error
  const handleScatterClick = (point: any) => {
    if (mockData) return;
    router.push(`/mood/insight/${point.jrnl_id}`);
  };

  if (loading) {
    return (
      <div className="text-center items-center" style={{ height: height }}>
        <p
          className="text-center text-[clamp(1rem,3vw,1.5rem)]"
          style={{ color: 'var(--muted)' }}
        >
          Loading daily mood scatter plot chart...
        </p>
      </div>
    );
  }

  if (!points.length) {
    return (
      <div
        className="flex flex-col text-center items-center justify-center"
        style={{ height: height }}
      >
        <p
          className="text-center text-[clamp(1rem,3vw,1.5rem)]"
          style={{ color: 'var(--muted)' }}
        >
          No mood data available for this date.
        </p>
        {/* button to new journal entry if the date is today */}
        {isToday && (
          <Link
            href="/journal/new"
            className={`${buttonGradient} mt-2`}
            // className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
          >
            Write an entry
          </Link>
        )}
      </div>
    );
  }

  // only moods present in the data, preserving MOOD_ORDER ordering
  const presentMoods = MOOD_ORDER.filter((mood) =>
    points.some((p) => p.mood_name === mood),
  );

  const presentMoodRankMap = Object.fromEntries(
    presentMoods.map((mood, i) => [mood, presentMoods.length - 1 - i]),
  );

  const maxY = presentMoods.length - 1;

  const data = points.map((p) => ({
    x: new Date(p.mood_timestamp).getTime(),
    y: presentMoodRankMap[p.mood_name] ?? 0,
    mood: p.mood_name,
    jrnl_id: p.jrnl_id,
    timestamp: p.mood_timestamp,
  }));

  // show time when mood exists
  // const presentTicks = Array.from(new Set(data.map((d) => d.x))).sort(
  //   (a, b) => a - b,
  // );

  // show all time
  const presentTicks = Array.from({ length: 24 }, (_, i) =>
    addHours(startOfDay(parseISO(moodDate)), i).getTime(),
  );

  return (
    <div className="w-full">
      <p
        className="text-[clamp(1rem,3vw,1.5rem)] mb-2 w-full"
        style={{ color: 'var(--text)' }}
      >
        {format(parseISO(moodDate), 'EEEE, dd/MM/yyyy')}
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{ top: 10, right: 0, left: -20, bottom: 5 }}
          responsive
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[xStart, xEnd]}
            ticks={presentTicks}
            tickFormatter={(ts) => format(new Date(ts), 'p')}
            tick={{ fontSize: 15, fill: 'var(--text)' }}
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
            tick={{ fontSize: 12, fill: 'var(--text)' }}
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
                    border: `1px solid ${'var(--text)'}`,
                    padding: '6px 10px',
                    color: 'var(--text)',
                    backgroundColor: 'var(--bg-div)',
                  }}
                >
                  {getMoodStyle(point.mood).emoji}
                  {toTitleCase(point.mood)} -{' '}
                  {format(new Date(point.timestamp), 'p')}
                </div>
              );
            }}
            wrapperStyle={{ zIndex: 100 }}
          />
          {/* <Tooltip
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
              border: `1px solid ${'var(--text)'}`,
              fontSize: 13,
            }}
            itemStyle={{ color: 'var(--text)', fontWeight: 600 }}
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
