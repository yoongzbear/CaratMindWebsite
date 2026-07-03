// for entering reason of not completing exercise

'use client';

import { useState } from 'react';
import Modal from './Modal';
import { buttonGradientColor, buttonRed, C, styles } from '@/app/styles/styles';
import { Star } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
};

export default function EntryDetailModal({ open, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason || reason === '') return;

    setLoading(true);
    try {
      await onSubmit(reason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reason for not completing the exercise:"
      width={900}
      footer={
        <div className="flex justify-center">
          <button
            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            onClick={handleSubmit}
            disabled={loading || reason === '' || !reason}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      }
    >
      <select
        className={`sm:text-[14px] md:text-[16px] w-full px-3 py-2.25 rounded-[10px] bg-white cursor-pointer`}
        style={{ border: `1px solid ${C.border}`, color: C.navy }}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select Reason</option>
        <option>No time to complete</option>
        <option>Current environment is not suitable</option>
        <option>Not interested in the coping exercise</option>
      </select>
    </Modal>
  );
}
