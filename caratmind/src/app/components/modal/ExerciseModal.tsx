// for exercise details

'use client';

import Modal from './Modal';
import Pill from '../Pill';
import { styles } from '@/app/styles/styles';

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  mood: string; // TODO: change to mood enum
  type: string;
  steps: string; // TODO: check again
};

export default function ExerciseDetailModal({
  open,
  onClose,
  name,
  mood,
  type,
  steps,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} width={700} title={name}>
      <div className="flex gap-3 mb-3">
        <Pill bgColor="#edf9f0" borderColor="#cdebd5" textColor="#2e7d32">
          {mood}
        </Pill>

        <Pill>{type}</Pill>
      </div>

      <p style={styles.pText}>{steps}</p>
    </Modal>
  );
}
