// heatmap showing mood on calendar

// DayPicker
// each day is colored with gradient with mood colors
// clickable date - show journal entries

'use client';

import { useAuth } from '@/context/AuthContext';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { toTitleCase } from '@/app/utils/format';
import { C } from '@/app/styles/styles';
import { format, isValid, parseISO } from 'date-fns';
import { DateRangeValue } from './DateRangeSelector';
import { useMoodChartData } from '@/app/hooks/moodChartData';
import { getRangeLabel } from '@/app/utils/dateFormat';
import { useRouter } from 'next/navigation';
import { DayPicker } from '@daypicker/react';
import { useMemo, useState } from 'react';

type ChartRow = {
  date: string;
  jrnl_ids?: string[];
  [mood: string]: string | number | string[] | undefined;
};

type Props = {
  range?: DateRangeValue;
  height?: number;
};

export default function CalendarHeatmap({
  range = { mode: 'days', days: 30 }, // TODO: 30 or 31
  height = 320,
}: Props) {
  const { accessToken } = useAuth();
  const { chartData, moods, loading, error } = useMoodChartData(range);
  const router = useRouter();

  // read ?date=YYYY-MM-DD from URL
  // const initialDate = (() => {
  //   const param = searchParams.get('date');
  //   if (!param) return new Date();
  //   const parsed = parseISO(param);
  //   return isValid(parsed) ? parsed : new Date();
  // })();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date()); // to change month

  // lookup for chart row
  const dataByDate = useMemo(() => {
    const map: Record<string, ChartRow> = {};
    for (const row of chartData) map[row.date] = row;
    return map;
  }, [chartData]);

  if (loading) {
    return (
      <p
        className="text-center sm:text-[14px] md:text-[16px]"
        style={{ color: C.faint }}
      >
        Loading mood calendar heatmap...
      </p>
    );
  }

  if (!chartData.length || !moods.length) {
    return (
      <p
        className="text-center sm:text-[14px] md:text-[16px]"
        style={{ color: C.faint }}
      >
        No mood data available for this period.
      </p>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <DayPicker
        mode="single"
        selected={selectedDate}
        month={calendarMonth}
        onMonthChange={setCalendarMonth}
        onSelect={(date) => date && setSelectedDate(date)}
        className="w-full"
        style={{ color: C.navy }}
        components={{
          DayButton: (props) => (
            <MoodDayButton
              {...props}
              dataByDate={dataByDate}
              moods={moods}
              router={router}
            />
          ),
        }}
        classNames={{
          month_grid: 'w-fit mx-auto border-collapse',
          // root: 'w-full',
          // months: 'w-full',
          // month: 'w-full',
          // day_button:
          //   'w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#eef2f9] transition-colors',
          today: 'font-semibold text-[#92A8D1]',
          // selected: 'bg-[#92A8D1] text-white rounded-full',
          selected: 'ring-2 ring-[#92A8D1] rounded-full',
          month_caption: 'flex items-center justify-between px-2 mb-4',
          caption_label: 'text-base font-semibold text-center flex-1',
          nav: 'flex items-center gap-2',
          button_previous:
            'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center',
          button_next:
            'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center',
        }}
      />
    </div>
  );
}

// calendar date button
type MoodDayButtonProps = {
  day: { date: Date };
  modifiers: Record<string, boolean>;
  dataByDate: Record<string, ChartRow>;
  moods: string[];
  router: ReturnType<typeof useRouter>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function MoodDayButton({
  day,
  modifiers,
  dataByDate,
  moods,
  router,
  className,
  ...buttonProps
}: MoodDayButtonProps) {
  const dateStr = format(day.date, 'yyyy-MM-dd');
  const row = dataByDate[dateStr];

  const moodCounts = row
    ? moods
        .map((mood) => ({ mood, count: (row[mood] as number) ?? 0 }))
        .filter((m) => m.count > 0)
    : [];

  const hasMoods = moodCounts.length > 0;

  const handleClick = () => {
    const ids = row?.jrnl_ids ?? [];
    if (ids.length === 1) {
      router.push(`/mood/insight/${ids[0]}`);
    } else if (ids.length > 1) {
      router.push(`/journal/past?date=${dateStr}`);
    }
  };

  return (
    <button
      {...buttonProps}
      onClick={handleClick}
      className={`group relative w-11 m-1 h-11 rounded-full overflow-hidden flex items-center justify-center transition-opacity hover:opacity-85 ${className ?? ''}`}
    >
      {/* mood segments, proportional to count, filling the circle */}
      {hasMoods && (
        <div className="absolute inset-0 flex">
          {moodCounts.map(({ mood, count }) => (
            <div
              key={mood}
              style={{
                flexGrow: count,
                flexBasis: 0,
                backgroundColor: getMoodStyle(mood).bgColor,
              }}
            />
          ))}
        </div>
      )}

      {/* fallback background for days with no data */}
      {!hasMoods && <div className="absolute inset-0 bg-[#f4f6fb]" />}

      <span
        className="relative z-10 text-sm font-medium"
        style={{ color: hasMoods ? C.navy : C.faint }}
      >
        {day.date.getDate()}
      </span>

      {/* today ring */}
      {modifiers.today && (
        <div className="absolute inset-0 rounded-full ring-2 ring-[#92A8D1] pointer-events-none" />
      )}

      {/* mood list for this day */}
      {hasMoods && (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col gap-0.5 z-50 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs shadow-md"
          style={{ background: 'white', borderColor: C.navy, color: C.navy }}
        >
          {moodCounts.map(({ mood, count }) => (
            <div key={mood} className="flex items-center gap-1">
              <span>{getMoodStyle(mood).emoji}</span>
              <span className="font-medium">{toTitleCase(mood)}</span>
              <span style={{ color: C.faint }}>x {count}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
