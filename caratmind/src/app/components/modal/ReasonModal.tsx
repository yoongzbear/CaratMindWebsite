// for entering reason of not completing exercise

'use client';

import { useState } from 'react';
import Modal from './Modal';
import { buttonGradientColor, buttonRed, styles } from '@/app/styles/styles';
import { Star } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  date: string;
  lastUpdated: string;
  entry: string;
};

export default function EntryDetailModal({
  open,
  onClose,
  date,
  lastUpdated,
  entry,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reason for not completing the exercise:"
      width={900}
    >
      {/* <label style={styles.label}>Exercise Type</label> */}

      <select className="w-full" style={styles.dropdown}>
        <option>Breathing</option>
        <option>Meditation</option>
        <option>Reflection</option>
      </select>
    </Modal>
  );
}
