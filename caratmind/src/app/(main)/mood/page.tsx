'use client';
import CalendarHeatmap from '@/components/chart/CalendarHeatmap';
import DateRangeSelector, {
  DateRangeValue,
} from '@/components/chart/DateRangeSelector';
import DayScatterPlot from '@/components/chart/DayScatterPlot';
import StackedBarChart from '@/components/chart/StackedBarChart';
import TimeScatterPlot from '@/components/chart/TimeScatterPlot';
import { styles } from '@/styles/ui';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { useState } from 'react';
import { CircleQuestionMark } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
            Mood Dashboard
          </h1>
        </header>

        {/* cards grid */}
        <div className="grid lg:grid-cols-2 gap-4 mt-4 mb-3.75">
          {/* stacked bar chart */}
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
            <div className="flex gap-2">
              <h5
                className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Mood Bar Chart
              </h5>
              <Popover>
                <PopoverTrigger
                  className="cursor-help"
                  style={{ color: 'var(--muted)' }}
                >
                  <CircleQuestionMark />
                </PopoverTrigger>
                <PopoverContent>
                  <p>
                    View all moods detected on each date. Click on a bar to view
                    its journal insights.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            {/* time range */}
            <div id="select-date">
              <DateRangeSelector presets={[7, 30, 90]} onChange={setBarRange} />
            </div>

            <div className="w-full mt-2" id="bar-chart">
              <StackedBarChart range={barRange} height={chartHeight} />
            </div>
          </div>

          {/* scatter plot */}
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
            <div className="flex gap-2">
              <h5
                className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Mood Scatter Plot
              </h5>
              <Popover>
                <PopoverTrigger
                  className="cursor-help"
                  style={{ color: 'var(--muted)' }}
                >
                  <CircleQuestionMark />
                </PopoverTrigger>
                <PopoverContent>
                  <p>
                    View overall mood pattern over time. Click a point to view
                    its journal insights.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            {/* time range */}
            <DateRangeSelector
              presets={[7, 30, 90]}
              onChange={setScatterRange}
            />

            <div className="w-full mt-2" id="scatter-plot">
              <DayScatterPlot range={scatterRange} height={chartHeight} />
            </div>
          </div>

          {/* daily scatter plot */}
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-2">
                <h5
                  className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Daily Mood Scatter Plot
                </h5>
                <Popover>
                  <PopoverTrigger
                    className="cursor-help"
                    style={{ color: 'var(--muted)' }}
                  >
                    <CircleQuestionMark />
                  </PopoverTrigger>
                  <PopoverContent>
                    <p>
                      View mood pattern in a day. Click on a point to view its
                      journal insights.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>

              {/* date */}
              <input
                id="daily-date"
                style={styles.dateInput}
                type="date"
                value={moodDate}
                onChange={(e) => setMoodDate(e.target.value)}
              ></input>
            </div>

            <div className="w-full mt-2" id="daily-scatter-plot">
              <TimeScatterPlot moodDate={moodDate} />
            </div>
          </div>

          {/* calendar heatmap */}
          <div className="rounded-[14px] border p-4 bg-(--bg-div) shadow-sm">
            <div className="flex gap-2">
              <h5
                className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Mood Calendar
              </h5>
              <Popover>
                <PopoverTrigger
                  className="cursor-help"
                  style={{ color: 'var(--muted)' }}
                >
                  <CircleQuestionMark />
                </PopoverTrigger>
                <PopoverContent>
                  <p>
                    View all moods on each date in the calendar. Click on a date
                    to view its journal insights.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full flex justify-center" id="mood-heatmap">
              <CalendarHeatmap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
