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
      <div className="flex items-center justify-center mb-6">
        <div
          className="w-20 h-20 rounded-full animate-spin"
          style={{
            border: `4px solid ${C.roseQuartz}`, //the majority part
            borderTopColor: C.serenity, // the smaller part
          }}
        />
      </div>
      <h2
        className="mt-0 mb-2.5 sm:text-[26px] md:text-[30px]"
        style={{ color: C.navy }}
      >
        Detecting your mood and recommending a coping exercise...
      </h2>
    </Modal>
  );
}
