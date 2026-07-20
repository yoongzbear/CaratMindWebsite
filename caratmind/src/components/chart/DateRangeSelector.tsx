'use client';

import { styles } from '@/styles/ui';
// import { styles } from '@/app/styles/styles';
import { useEffect, useState } from 'react';

export type DateRangeValue =
  | { mode: 'days'; days: number }
  | { mode: 'range'; startDate: string; endDate: string };

type Props = {
  onChange: (value: DateRangeValue) => void;
  presets?: number[];
};

const PRESET_LABELS: Record<number, string> = {
  7: '7 days',
  30: '30 days',
  90: '3 months',
  180: '6 months',
  365: '1 year',
};

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDefaultRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(end),
  };
}

export default function DateRangeSelector({
  onChange,
  presets = [7, 30, 90],
}: Props) {
  const [selected, setSelected] = useState<string>('7');
  const defaultRange = getDefaultRange(7);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  useEffect(() => {
    if (selected === 'custom') {
      if (startDate && endDate && startDate <= endDate) {
        onChange({ mode: 'range', startDate, endDate });
      }
    } else {
      onChange({ mode: 'days', days: parseInt(selected) });
    }
  }, [selected, startDate, endDate, onChange]);

  return (
    <div className="flex flex-wrap w-full gap-4 items-end">
      <div>
        <label
          className="block text-[clamp(0.875rem,1.5vw,1rem)] font-bold mb-1"
          style={{ color: 'var(--text)' }}
        >
          Period
        </label>
        <select
          className="text-[clamp(0.875rem,1.5vw,1rem)] font-semibold"
          style={styles.dropdown}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {presets.map((d) => (
            <option key={d} value={String(d)}>
              {PRESET_LABELS[d] ?? `${d} days`}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </div>

      {selected === 'custom' && (
        <div className="flex flex-wrap gap-4 w-full">
          <div className="min-w-35 flex-1">
            <label
              className="block text-[clamp(0.875rem,1.5vw,1rem)] font-semibold mb-1"
              style={{ color: 'var(--text)' }}
            >
              Start Date
            </label>
            <input
              className="text-[clamp(0.875rem,1.5vw,1rem)] w-full"
              style={styles.dateInput}
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="min-w-35 flex-1">
            <label
              className="block text-[clamp(0.875rem,1.5vw,1rem)] font-semibold mb-1"
              style={{ color: 'var(--text)' }}
            >
              End Date
            </label>
            <input
              className="text-[clamp(0.875rem,1.5vw,1rem)] w-full"
              style={styles.dateInput}
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
