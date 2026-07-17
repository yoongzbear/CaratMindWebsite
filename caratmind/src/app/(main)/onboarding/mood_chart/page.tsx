'use client';
import CalendarHeatmap from '@/app/components/chart/CalendarHeatmap';
import DateRangeSelector from '@/app/components/chart/DateRangeSelector';
import DayScatterPlot from '@/app/components/chart/DayScatterPlot';
import StackedBarChart from '@/app/components/chart/StackedBarChart';
import TimeScatterPlot from '@/app/components/chart/TimeScatterPlot';
import { MoodPoint } from '@/app/hooks/moodScatterData';
import { C, styles } from '@/app/styles/styles';
import { format, subDays } from 'date-fns';
import { useMemo } from 'react';

const previewDate = format(new Date(), 'yyyy-MM-dd');

export function buildMockBarData() {
  const moods = ['joy', 'fear', 'anger'];
  const chartData = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
    jrnl_ids: [],
    joy: Math.floor(Math.random() * 3),
    fear: Math.floor(Math.random() * 3),
    anger: Math.floor(Math.random() * 2),
  }));
  return { chartData, moods };
}

export function buildMockScatterPoints(): MoodPoint[] {
  const moods = ['joy', 'fear', 'anger'];
  return Array.from({ length: 7 }).map((_, i) => ({
    jrnl_id: `mock-${i}`,
    mood_name: moods[i % moods.length],
    mood_timestamp: subDays(new Date(), 6 - i).toISOString(),
  }));
}

export default function MoodPreviewPage() {
  const chartHeight = 320;

  const barData = useMemo(() => buildMockBarData(), []);
  const scatterPoints = useMemo(() => buildMockScatterPoints(), []);
  const dailyMockPoints = useMemo(
    () => [
      {
        jrnl_id: 'mock-1',
        mood_name: 'joy',
        mood_timestamp: new Date().toISOString(),
      },
    ],
    [],
  );

  return (
    <section
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-10"
      style={{
        background: C.bgPage,
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Mood Dashboard (Preview)
          </h1>
        </header>

        {/* cards grid */}
        <div className="grid lg:grid-cols-2 gap-4 mt-4 mb-3.75">
          {/* stacked bar chart */}
          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            {/* time range */}
            <div id="select-date">
              <DateRangeSelector presets={[7, 30, 90]} onChange={() => {}} />
            </div>
            <div className="w-full mt-2" id="bar-chart">
              <StackedBarChart
                range={{ mode: 'days', days: 7 }}
                height={chartHeight}
                mockData={barData}
              />
            </div>
          </div>

          {/* scatter plot */}
          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            {/* time range */}
            <DateRangeSelector presets={[7, 30, 90]} onChange={() => {}} />

            <div className="w-full mt-2" id="scatter-plot">
              <DayScatterPlot
                range={{ mode: 'days', days: 7 }}
                height={chartHeight}
                mockData={{ chartData: scatterPoints, moods: [] }}
              />
            </div>
          </div>

          {/* daily scatter plot */}
          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            <div className="flex w-full items-center justify-between">
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-bold"
                style={{ color: C.navy }}
              >
                Daily Mood
              </h3>

              {/* date */}
              <input
                id="daily-date"
                style={styles.dateInput}
                type="date"
                value={previewDate}
                readOnly
              ></input>
            </div>

            <div className="w-full mt-2" id="daily-scatter-plot">
              <TimeScatterPlot
                moodDate={previewDate}
                mockData={{ points: dailyMockPoints }}
              />
            </div>
          </div>

          {/* calendar heatmap */}
          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            <div className="w-full flex justify-center" id="mood-heatmap">
              <CalendarHeatmap mockData={barData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
