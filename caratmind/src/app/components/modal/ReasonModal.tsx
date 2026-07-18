// for entering reason of not completing exercise

'use client';

import { useState } from 'react';
import Modal from './Modal';
import { toastError } from '@/utils/toast';
import { buttonGradient } from '@/app/styles/ui';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
};

export default function ReasonModal({ open, onClose, onSubmit }: Props) {
  const { theme } = useTheme();
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    'No time to complete',
    'Current environment is not suitable',
    'Not interested in the coping exercise',
  ];

  const handleSubmit = async () => {
    if (!reason || reason === '') {
      toastError('Please select an incompletion reason before submitting.');
      return;
    }

    const selectedReason = reason === 'Other' ? otherReason.trim() : reason;

    setLoading(true);
    try {
      await onSubmit(selectedReason);
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
            className={buttonGradient(theme)}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {reasons.map((item) => (
          <label key={item} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="reason"
              value={item}
              checked={reason === item}
              onChange={(e) => setReason(e.target.value)}
              className="cursor-pointer"
            />
            <span
              className="text-[clamp(1rem,3vw,1.5rem)]"
              style={{ color: 'var(--text)' }}
            >
              {item}
            </span>
          </label>
        ))}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="reason"
            value="Other"
            checked={reason === 'Other'}
            onChange={() => setReason('Other')}
            className="mt-1 cursor-pointer"
          />

          <div className="flex-1">
            <span
              className="text-[clamp(1rem,3vw,1.5rem)]"
              style={{ color: 'var(--text)' }}
            >
              Other:
            </span>

            {reason === 'Other' && (
              <input
                type="text"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please specify"
                className="mt-2 w-full rounded-[10px] px-3 py-2"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
            )}
          </div>
        </label>
      </div>
      {/* <input type="radio"></input>
      <select
        className={`sm:text-[14px] md:text-[16px] w-full px-3 py-2.25 rounded-[10px] bg-white cursor-pointer`}
        style={{ border: `1px solid ${C.border}`, color: 'var(--text)' }}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select Reason</option>
        <option>No time to complete</option>
        <option>Current environment is not suitable</option>
        <option>Not interested in the coping exercise</option>
      </select> */}
    </Modal>
  );
}
