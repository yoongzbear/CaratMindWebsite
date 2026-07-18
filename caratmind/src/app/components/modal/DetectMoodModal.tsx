// show loading when detecting mood during journal entry submission

'use client';

import Modal from './Modal';

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
            border: '4px solid var(--first-color)', //the majority part
            borderTopColor: 'var(--second-color)', // the smaller part
          }}
        />
      </div>
      <h2
        className="mt-0 mb-2.5 text-[clamp(1.3rem,6vw,1.85rem)]"
        style={{ color: 'var(--text)' }}
      >
        Detecting your mood and recommending a coping exercise...
      </h2>
    </Modal>
  );
}
