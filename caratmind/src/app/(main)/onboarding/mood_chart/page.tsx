'use client';
import CalendarHeatmap from '@/components/chart/CalendarHeatmap';
import DateRangeSelector from '@/components/chart/DateRangeSelector';
import DayScatterPlot from '@/components/chart/DayScatterPlot';
import StackedBarChart from '@/components/chart/StackedBarChart';
import TimeScatterPlot from '@/components/chart/TimeScatterPlot';
import { styles } from '@/styles/ui';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { buildMockBarData, buildMockScatterPoints } from '@/utils/moodUtils';

const previewDate = format(new Date(), 'yyyy-MM-dd');

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
        background: 'var(--bg)',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Mood Dashboard (Preview)
          </h1>
        </header>

        {/* cards grid */}
        <div className="grid lg:grid-cols-2 gap-4 mt-4 mb-3.75">
          {/* stacked bar chart */}
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
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
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
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
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
            <div className="flex w-full items-center justify-between">
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-bold"
                style={{ color: 'var(--text)' }}
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
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
            <div className="w-full flex justify-center" id="mood-heatmap">
              <CalendarHeatmap mockData={barData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
