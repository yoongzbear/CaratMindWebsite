'use client';
import CalendarHeatmap from '@/app/components/chart/CalendarHeatmap';
import DateRangeSelector, {
  DateRangeValue,
} from '@/app/components/chart/DateRangeSelector';
import DayScatterPlot from '@/app/components/chart/DayScatterPlot';
import StackedBarChart from '@/app/components/chart/StackedBarChart';
import TimeScatterPlot from '@/app/components/chart/TimeScatterPlot';
import ToggleSwitch from '@/app/components/ToggleSwitch';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { useState } from 'react';

export default function MoodPage() {
  const { user, loading } = useAuth();
  const chartHeight = 320;
  const [barRange, setBarRange] = useState<DateRangeValue>({
    mode: 'days',
    days: 7,
  });
  const [scatterRange, setScatterRange] = useState<DateRangeValue>({
    mode: 'days',
    days: 7,
  });
  const [moodDate, setMoodDate] = useState(() =>
    format(new Date(), 'yyyy-MM-dd'),
  );

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[85%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0' }}>Mood Dashboard</h1>
        </header>

        {/* cards grid */}
        <div className="grid grid-cols-2 gap-4 mt-4 mb-3.75">
          {/* stacked bar chart */}
          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            {/* time range */}
            {/* TODO: preset the dates to today and 7 days */}
            <DateRangeSelector presets={[7, 30, 90]} onChange={setBarRange} />

            <div className="w-full mt-2">
              <StackedBarChart range={barRange} height={chartHeight} />
            </div>
          </div>

          {/* scatter plot */}
          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            {/* time range */}
            {/* TODO: preset the dates to today and 7 days */}
            <DateRangeSelector
              presets={[7, 30, 90]}
              onChange={setScatterRange}
            />

            <div className="w-full mt-2">
              <DayScatterPlot range={scatterRange} height={chartHeight} />
            </div>
          </div>

          {/* daily scatter plot */}
          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            <div className="flex w-full items-center justify-between">
              <h3 style={{ ...styles.header3, fontWeight: 500 }}>Daily Mood</h3>

              {/* date */}
              <input
                style={styles.dateInput}
                type="date"
                value={moodDate}
                onChange={(e) => setMoodDate(e.target.value)}
              ></input>
            </div>

            <div className="w-full mt-2">
              <TimeScatterPlot moodDate={moodDate} />
            </div>
          </div>

          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            <div>
              <ToggleSwitch
                leftLabel="Dominant Mood"
                rightLabel="Average Mood"
                defaultValue="left"
                onChange={(value) => {
                  console.log('Selected:', value); // left | right
                }}
              />
            </div>

            <div className="w-full flex justify-center">
              <CalendarHeatmap height={320} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
