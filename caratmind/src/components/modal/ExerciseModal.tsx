// for exercise details

'use client';

import Modal from './Modal';
import Pill from '../Pill';
import { toTitleCase } from '@/utils/format';
import { getMoodStyle } from '@/utils/moodUtils';
import { getExerciseStyle } from '@/utils/exerciseUtils';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  moods: string[];
  type: string;
  desc: string;
  steps: string[];
};

export default function ExerciseDetailModal({
  open,
  onClose,
  name,
  moods,
  type,
  desc,
  steps,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Modal
      open={open}
      onClose={onClose}
      width={1000}
      title={
        <>
          {getExerciseStyle(type).emoji} {name}
        </>
      }
    >
      <div className="max-h-24 lg:max-h-32 overflow-y-auto flex flex-wrap gap-2 mb-3">
        {moods.map((mood) => {
          const moodStyle = getMoodStyle(mood, isDark);
          return (
            <Pill
              key={mood}
              bgColor={moodStyle.bgColor}
              borderColor={moodStyle.borderColor}
              textColor={moodStyle.textColor}
            >
              {moodStyle.emoji} {toTitleCase(mood)}
            </Pill>
          );
        })}
      </div>

      <Pill shaded>{toTitleCase(type)}</Pill>

      <p
        className="text-[clamp(0.875rem,1.5vw,1rem)] text-justify"
        style={{ color: 'var(--muted)' }}
      >
        {desc}
      </p>

      <div className="mt-2 max-h-52 md:max-h-36 landscape:max-h-28 overflow-y-auto min-h-0 pb-4">
        <ol className="list-decimal pl-7 space-y-2">
          {steps.map((step, index) => (
            <li
              key={index}
              className="text-[clamp(0.875rem,1.5vw,1rem)] text-justify"
              style={{ color: 'var(--text)' }}
            >
              {step}
            </li>
          ))}
        </ol>
        <br />
      </div>
    </Modal>
  );
}
