// for mood explanation details

'use client';

import Modal from './Modal';
import Pill from '../Pill';
import { C, styles } from '@/app/styles/styles';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { Mood } from '@/app/types/mood';

type Props = {
  open: boolean;
  onClose: () => void;
  moodData: Mood;
};

export default function MoodExplainModal({ open, onClose, moodData }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      width={1000}
      title={'Detected Mood Details'}
    >
      <div className="mx-auto w-fit">
        {/* mood emoji */}
        <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 w-18 h-18 flex items-center justify-center">
          {getMoodStyle(moodData?.mood_name).emoji}
        </div>
        <h5
          className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
          style={{ color: C.navy }}
        >
          {toTitleCase(moodData.mood_name) ?? 'Unknown'}
        </h5>
      </div>

      <div className="mb-3.75 p-4">
        {/* mood confidence */}
        <p
          className="text-[clamp(0.875rem,1.5vw,1rem)] mb-1"
          style={{ color: C.muted }}
        >
          Confidence:{' '}
          {moodData.mood_confidence
            ? `${(parseFloat(moodData.mood_confidence) * 100).toFixed(0)}%`
            : 'Unknown'}
        </p>

        {/* explanation mood  */}
        <p
          className="text-[clamp(0.875rem,1.5vw,1rem)] mb-2"
          style={{ color: C.navy }}
        >
          {moodData.mood_explain?.replace(/^"+|"+$/g, '') ?? 'Unknown'}
        </p>

        {/* disclaimer */}
        <p
          className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic"
          style={{ color: C.muted }}
        >
          Your mood is estimated using AI based on the submitted entry. The
          detected mood may not always accurately reflect your actual emotional
          state. Please refer to a professional for further advice or help.
        </p>
      </div>
    </Modal>
  );
}
