// show 3 helplines when persistent negative mood

'use client';

import Modal from './Modal';
import Link from 'next/link';
import { HELPLINES } from '@/app/copywriting/helpline';

type Props = {
  open: boolean;
  onClose: () => void;
  numDays?: number;
};

export default function HelplineModal({ open, onClose, numDays = 3 }: Props) {
  const topHelplines = HELPLINES.slice(0, 3);
  return (
    <Modal open={open} onClose={onClose} width={900}>
      <p
        className="mt-0 mb-2.5 text-[clamp(0.875rem,1.5vw,1rem)]"
        style={{ color: 'var(--text)' }}
      >
        It seems you have been experiencing poor moods for 3 days or more.
        Please contact professional help for further advice as soon as you can.
      </p>

      {/* helpline */}
      <ul className="space-y-3 mb-4">
        {topHelplines.map((h) => (
          <li
            key={h.name}
            className="border rounded-lg p-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <p
              className="mt-0 mb-2.5 text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
              style={{ color: 'var(--text)' }}
            >
              {h.name}
            </p>
            <p
              className="mt-0 mb-2.5 text-[clamp(0.875rem,1.5vw,1rem)]"
              style={{ color: 'var(--muted)' }}
            >
              {h.description}
            </p>
            <Link
              href={h.href}
              className="mt-0 mb-2.5 text-[clamp(0.875rem,1.5vw,1rem)] font-medium"
              style={{ color: 'var(--second-color)', fontWeight: 600 }}
            >
              {h.contact}
            </Link>
            <span
              className="ml-2 text-[clamp(0.7rem,1.5vw,0.85rem)]"
              style={{ color: 'var(--muted)' }}
            >
              {h.available}
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-2">
        <Link
          className="text-[clamp(0.875rem,1.5vw,1rem)] underline"
          href={'/helpline'}
          style={{ color: 'var(--second-color)', fontWeight: 600 }}
        >
          More Emergency Helplines
        </Link>
      </div>
    </Modal>
  );
}
