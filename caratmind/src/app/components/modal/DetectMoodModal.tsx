// show loading when detecting mood during journal entry submission

'use client';

import Modal from './Modal';
import { C } from '@/app/styles/styles';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DetectMoodModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} width={900} hideClose>
      {/* loading spinner */}
      <div
        className="w-24 h-24 rounded-full animate-spin mb-6"
        style={{
          border: `4px solid ${C.border}`,
          borderTopColor: C.navy,
        }}
      />
      <h2
        className="mt-0 mb-2.5 sm:text-[26px] md:text-[30px]"
        style={{ color: C.navy }}
      >
        Detecting your mood and recommending a coping exercise...
      </h2>
    </Modal>
  );
}
