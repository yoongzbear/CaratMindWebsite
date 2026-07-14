// for exercise details

'use client';

import Modal from './Modal';
import Pill from '../Pill';
import { C, styles } from '@/app/styles/styles';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { getExerciseStyle } from '@/app/utils/exerciseUtils';

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
      <div className="max-h-24 overflow-y-auto flex flex-wrap gap-2 mb-3">
        {moods.map((mood) => {
          const moodStyle = getMoodStyle(mood);
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

      <Pill>{toTitleCase(type)}</Pill>

      <p
        className="text-[clamp(0.875rem,1.5vw,1rem)]"
        style={{ color: C.muted }}
      >
        {desc}
      </p>

      <div className="mt-2 max-h-52 md:max-h-36 overflow-y-auto">
        <ol className="list-decimal pl-5 space-y-2">
          <p style={styles.pText}>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </p>
        </ol>
      </div>
    </Modal>
  );
}
