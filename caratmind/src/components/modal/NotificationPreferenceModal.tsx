// select email notification

'use client';

import { startTransition, useEffect, useState } from 'react';
import Modal from './Modal';
import { gradientButton } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';
import { EMAIL_OPTIONS, EmailPreference } from '@/types/notification';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (pref: EmailPreference) => void;
  initialPreference: EmailPreference;
};

export default function NotificationPreferenceModal({
  open,
  onClose,
  onSave,
  initialPreference,
}: Props) {
  const { theme } = useTheme();

  const [preference, setPreference] =
    useState<EmailPreference>(initialPreference);

  useEffect(() => {
    startTransition(() => {
      setPreference(initialPreference);
      console.log('preference in modal: ', preference);
    });
  }, [initialPreference]);

  const toggle = (key: keyof EmailPreference) => {
    setPreference((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSave(preference);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        width={600}
        title="Email Notification Preference"
        subtitle="Update emails to be sent to your inbox"
        footer={
          <div className="flex justify-start gap-3">
            <button onClick={handleSave} {...gradientButton(theme)}>
              Update Preference
            </button>
          </div>
        }
      >
        {/* checkbox */}
        <div className="flex flex-col gap-4">
          {EMAIL_OPTIONS.map(({ key, label, description }) => (
            <label
              key={key}
              style={{ color: 'var(--text)' }}
              className="flex text-[clamp(0.875rem,1.5vw,1rem)] items-start gap-3 cursor-pointer px-3 rounded-lg"
            >
              <input
                type="checkbox"
                checked={preference[key]}
                onChange={() => toggle(key)}
                className="mt-1 h-4 w-4 rounded border-(--border) cursor-pointer accent-current"
              />
              <div className="flex flex-col">
                <span className="text-[clamp(0.875rem,1.5vw,1rem)] font-medium">
                  {label}
                </span>
                <span className="text-[clamp(0.7rem,1.5vw,0.85rem)] opacity-70">
                  {description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
