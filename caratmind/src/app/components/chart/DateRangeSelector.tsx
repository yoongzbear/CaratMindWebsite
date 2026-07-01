'use client';

import { C, styles } from '@/app/styles/styles';
import { useEffect, useState } from 'react';

export type DateRangeValue =
  | { mode: 'days'; days: number }
  | { mode: 'range'; startDate: string; endDate: string };

type Props = {
  onChange: (value: DateRangeValue) => void;
  presets?: number[]; // e.g. [7, 30, 90]
};

const PRESET_LABELS: Record<number, string> = {
  7: '7 days',
  30: '30 days',
  90: '3 months',
  180: '6 months',
  365: '1 year',
};

export default function DateRangeSelector({
  onChange,
  presets = [7, 30, 90],
}: Props) {
  const [selected, setSelected] = useState<string>('7');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // emit on every meaningful change
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
          className="block text-xs sm:text-sm md:text-base font-semibold mb-1"
          style={{ color: C.navy }}
        >
          Period
        </label>
        <select
          className="sm:text-[14px] md:text-[16px]"
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
        <>
          <div>
            <label
              className="block text-xs sm:text-sm md:text-base font-semibold mb-1"
              style={{ color: C.muted }}
            >
              Start Date
            </label>
            <input
              className="sm:text-[14px] md:text-[16px]"
              style={styles.dateInput}
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-xs sm:text-sm md:text-base font-semibold mb-1"
              style={{ color: C.muted }}
            >
              End Date
            </label>
            <input
              className="sm:text-[14px] md:text-[16px]"
              style={styles.dateInput}
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}
