// for exercise rating

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
  const [rating, setRating] = useState(0);
  return (
    <Modal
      open={open}
      onClose={onClose}
      width={900}
      title="Did the exercise help you?"
      footer={
        <div className="flex justify-center">
          <button
            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            Submit
          </button>
        </div>
      }
    >
      <div className="flex justify-center gap-2 mb-4">
        {/* add Did not help */}
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)}>
            <Star fill={star <= rating ? '#facc15' : 'none'} />
          </button>
        ))}
        {/* add Helped a lot */}
      </div>

      {/* <textarea placeholder="Optional feedback..." style={styles.textarea} /> */}
    </Modal>
  );
}
