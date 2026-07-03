// heatmap showing mood on calendar

// FullCalendar
// custom dayCellContent styling
// clickable date - show journal entries

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
import { format, isValid, parseISO } from 'date-fns';
import { DateRangeValue } from './DateRangeSelector';
import { useMoodChartData } from '@/app/hooks/moodChartData';
import { getRangeLabel } from '@/app/utils/dateFormat';
import { useRouter } from 'next/navigation';
import { DayPicker } from '@daypicker/react';
import { useState } from 'react';

type ChartRow = {
  date: string;
  jrnl_ids?: string[];
  [mood: string]: string | number | string[] | undefined;
  // [mood: string]: string | number;
};

type Props = {
  range?: DateRangeValue;
  height?: number;
  /** optional: if parent already fetched the data, pass it in to skip the fetch */
  chartData?: ChartRow[];
  moods?: string[];
};

export default function CalendarHeatmap({
  range = { mode: 'days', days: 7 },
  height = 320,
  chartData: propData,
  moods: propMoods,
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

  const formatted = chartData.map((row) => ({
    ...row,
    raw_date: row.date, // for navigation
    date: format(parseISO(row.date), 'dd/MM'),
    // date: format(parseISO(row.date), 'EEE d'),
  }));

  const handleBarClick = (barData: any) => {
    const ids: string[] = barData?.jrnl_ids ?? [];
    if (ids.length === 0) return;
    if (ids.length === 1) {
      router.push(`/mood/insight/${ids[0]}`);
    } else {
      // multiple entries that day — go to journal list filtered by date
      // barData.date is already formatted ('25/06') so we need the raw date
      // store raw date separately (see step 4 below)
      router.push(`/journal/past?date=${barData.raw_date}`);
    }
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <DayPicker
          mode="single"
          selected={selectedDate}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          onSelect={(date) => date && setSelectedDate(date)}
          className="w-full"
          style={{ color: C.navy }}
          classNames={{
            root: 'w-full',
            months: 'w-full',
            month: 'w-full',
            day_button:
              'w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#eef2f9] transition-colors',
            today: 'font-semibold text-[#92A8D1]',
            selected: 'bg-[#92A8D1] text-white rounded-full',
            month_caption: 'flex items-center justify-between px-2 mb-4',
            caption_label: 'text-base font-semibold text-center flex-1',
            nav: 'flex items-center gap-2',
            button_previous:
              'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center',
            button_next:
              'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center',
          }}
        />
      </ResponsiveContainer>
    </div>
  );
}
