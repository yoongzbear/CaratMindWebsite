// show 3 helplines when persistent negative mood

'use client';

import Modal from './Modal';
import Pill from '../Pill';
import { C, styles } from '@/app/styles/styles';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodEmoji';
import Link from 'next/link';

type Props = {
  open: boolean;
  onClose: () => void;
  numDays?: number;
};

export default function HelplineModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} width={1000}>
      {/* <div className="flex flex-wrap gap-3 mb-3"></div> */}
      {/* TODO: change 3 days to the number of days */}
      <p
        className="mt-0 mb-2.5 sm:text-[14px] md:text-[16px]"
        style={{ color: C.navy }}
      >
        It seems you have been experiencing poor moods over the past 3 days.
        Please contact professional help for further advice as soon as you can.
      </p>

      {/* TODO: fetch helplines */}
      {/* <ol className="list-decimal pl-5 space-y-2">
        <p style={styles.pText}>
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </p>
      </ol> */}

      <Link href={'/helpline'} style={{ color: C.serenity, fontWeight: 600 }}>
        More Emergency Helplines
      </Link>
    </Modal>
  );
}
