// for exercise details

'use client';

import Modal from './Modal';
import Pill from '../Pill';
import { styles } from '@/app/styles/styles';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';

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
    <Modal open={open} onClose={onClose} width={1000} title={name}>
      <div className="flex flex-wrap gap-3 mb-3">
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

      <p style={styles.pText}>{desc}</p>

      <ol className="list-decimal pl-5 space-y-2">
        <p style={styles.pText}>
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </p>
      </ol>
    </Modal>
  );
}
