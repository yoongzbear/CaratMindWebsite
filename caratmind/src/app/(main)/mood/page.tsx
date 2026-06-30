'use client';
import DateRangeSelector, {
  DateRangeValue,
} from '@/app/components/chart/DateRangeSelector';
import DayScatterPlot from '@/app/components/chart/DayScatterPlot';
import StackedBarChart from '@/app/components/chart/StackedBarChart';
import ToggleSwitch from '@/app/components/ToggleSwitch';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function MoodPage() {
  const { user, loading } = useAuth();
  const [barRange, setBarRange] = useState<DateRangeValue>({
    mode: 'days',
    days: 7,
  });
  const [scatterRange, setScatterRange] = useState<DateRangeValue>({
    mode: 'days',
    days: 7,
  });

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[80%] mx-auto">
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
              <StackedBarChart range={barRange} height={240} />
            </div>

            <div className="w-full flex gap-5">
              <p style={styles.pText}>Selected Date: XX </p>
              <button
                //   onClick={handleSubmit}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-xs font-medium rounded-xl px-3 py-1.5 transition-colors duration-200 shadow-sm`}
              >
                {'View Entries'}
              </button>
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
            {/* <div className="flex w-full gap-5">
              {/* period dropdown *
              <div className="w-full">
                <label style={styles.label}>Period</label>
                <select className="w-full" style={styles.dropdown}>
                  <option>7 days</option>
                </select>
              </div>

              {/* start and end date *
              <div>
                <label style={styles.label}>Start date</label>
                <input style={styles.dateInput} type="date"></input>
              </div>

              <div>
                <label style={styles.label}>End date</label>
                <input style={styles.dateInput} type="date"></input>
              </div>
            </div> */}

            {/* <div className="w-full">
              <div className="w-full">
                <label style={styles.label}>Mood</label>
                <select className="w-40" style={styles.dropdown}>
                  <option>7 days</option>
                </select>
              </div>
            </div> */}

            <div className="w-full mt-2">
              <DayScatterPlot range={scatterRange} height={1000} />
            </div>

            <div className="w-full flex gap-5">
              <p style={styles.pText}>Selected Date: XX </p>
              <button
                //   onClick={handleSubmit}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-xs font-medium rounded-xl px-3 py-1.5 transition-colors duration-200 shadow-sm`}
              >
                {'View Entries'}
              </button>
            </div>
          </div>

          <div className="rounded-[14px] border p-4 bg-white shadow-sm">
            <div className="flex w-full items-center justify-between">
              <h3 style={{ ...styles.header3, fontWeight: 500 }}>Daily Mood</h3>

              {/* date */}
              <input style={styles.dateInput} type="date"></input>
            </div>

            <div className="w-full mt-2">
              <h1>daily line chart</h1>
            </div>

            <div className="w-full flex gap-5">
              <p style={styles.pText}>Selected Date: XX </p>
              <button
                //   onClick={handleSubmit}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-xs font-medium rounded-xl px-3 py-1.5 transition-colors duration-200 shadow-sm`}
              >
                {'View Entries'}
              </button>
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

            <div className="w-full">
              <h1>calendar heatmap</h1>
            </div>

            <div className="w-full flex gap-5">
              <p style={styles.pText}>Selected Date: XX </p>
              <button
                //   onClick={handleSubmit}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-xs font-medium rounded-xl px-3 py-1.5 transition-colors duration-200 shadow-sm`}
              >
                {'View Entries'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
