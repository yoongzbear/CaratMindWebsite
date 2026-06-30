// show 3 helplines when persistent negative mood

'use client';

import Modal from './Modal';
import Pill from '../Pill';
import { C, styles } from '@/app/styles/styles';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
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
        className="mt-0 mb-2.5 sm:text-[18px] md:text-[22px]"
        style={{ color: C.navy }}
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
            style={{ borderColor: C.border }}
          >
            <p
              className="mt-0 mb-2.5 sm:text-[20px] md:text-[24px] font-medium"
              style={{ color: C.navy }}
            >
              {h.name}
            </p>
            <p
              className="mt-0 mb-2.5 sm:text-[14px] md:text-[16px]"
              style={{ color: C.faint }}
            >
              {h.description}
            </p>
            <Link
              href={h.href}
              className="mt-0 mb-2.5 sm:text-[16px] md:text-[18px]"
              style={{ color: C.serenity, fontWeight: 600 }}
            >
              {h.contact}
            </Link>
            <span
              className="ml-2 sm:text-[11px] md:text-[13px]"
              style={{ color: C.faint }}
            >
              {h.available}
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-2">
        <Link
          className="sm:text-[16px] md:text-[18px] underline"
          href={'/helpline'}
          style={{ color: C.serenity, fontWeight: 600 }}
        >
          More Emergency Helplines
        </Link>
      </div>
    </Modal>
  );
}
