// for mood explanation details

'use client';

import Modal from './Modal';
import { toTitleCase } from '@/utils/format';
import { getMoodStyle, MOOD_EMOJIS } from '@/utils/moodUtils';
import { Mood } from '@/types/mood';
import { useMemo, useState } from 'react';
import { buttonGradient, redButton } from '@/styles/ui';
import { toastError } from '@/utils/toast';
import Pill from '../Pill';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  open: boolean;
  onClose: () => void;
  moodData: Mood;
  onConfirm: () => Promise<void>;
  onCorrect: (corrected_mood: string) => Promise<void>;
};

export default function MoodExplainModal({
  open,
  onClose,
  moodData,
  onConfirm,
  onCorrect,
}: Props) {
  const { theme } = useTheme();
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCorrected, setLoadingCorrected] = useState(false);
  const [openMoods, setOpenMoods] = useState(false);
  const [correctMood, setCorrectMood] = useState('');
  const moodOptions = useMemo(() => {
    return Object.keys(MOOD_EMOJIS)
      .sort()
      .map((mood) => ({
        value: mood,
        label: `${MOOD_EMOJIS[mood].emoji} ${toTitleCase(mood)}`,
      }));
  }, []);
  const handleConfirm = async () => {
    setLoadingConfirm(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleCorrected = async () => {
    if (correctMood === '') {
      toastError('Please select mood before submitting.');
      return;
    }

    setLoadingCorrected(true);
    try {
      console.log('modal mood: ', correctMood);
      await onCorrect(correctMood);
      onClose();
    } finally {
      setLoadingCorrected(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={1000}
      title={'Detected Mood Details'}
    >
      <div className="max-h-[80vh] landscape:max-h-[70vh] overflow-y-auto min-h-0 pb-4 [-webkit-overflow-scrolling:touch]">
        <div className="mx-auto text-center w-fit">
          {/* mood emoji */}
          <div className="flex justify-center">
            <div className="text-[clamp(1.38rem,10vw,3rem)] z-10 w-18 h-18 flex items-center justify-center leading-none">
              {getMoodStyle(moodData?.mood_name).emoji}
            </div>
          </div>
          <h5
            className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
            style={{ color: 'var(--text)' }}
          >
            {toTitleCase(moodData.mood_name) ?? 'Unknown'}
          </h5>
        </div>

        <div className="mb-3.75 p-4">
          {/* mood confidence */}
          <p
            className="text-[clamp(0.875rem,1.5vw,1rem)] mb-1"
            style={{ color: 'var(--muted)' }}
          >
            Mood Detection Confidence Score:{' '}
            {moodData.mood_confidence
              ? `${(parseFloat(moodData.mood_confidence) * 100).toFixed(0)}%`
              : 'Unknown'}
          </p>

          {moodData?.mood_confirmed === true && (
            <Pill
              shaded
              bgColor="#f1f8f4"
              borderColor="#66bb6a"
              textColor="#2e7d32"
            >
              Agreed
            </Pill>
          )}
          {moodData?.mood_confirmed === false && moodData.mood_corrected && (
            <>
              <Pill
                shaded
                className="mb-2"
                bgColor="#fff5f5"
                borderColor="#e57373"
                textColor="#c62828"
              >
                Disagreed
              </Pill>
              <p
                className="text-[clamp(0.875rem,1.5vw,1rem)]"
                style={{ color: 'var(--text)' }}
              >
                Chosen Mood: {getMoodStyle(moodData.mood_corrected).emoji}
                {toTitleCase(moodData.mood_corrected)}
              </p>
            </>
          )}

          {/* explanation mood  */}
          <p
            className="text-[clamp(0.875rem,1.5vw,1rem)] mb-2 text-justify"
            style={{ color: 'var(--text)' }}
          >
            {moodData.mood_explain?.replace(/^"+|"+$/g, '') ?? 'Unknown'}
          </p>

          {/* disclaimer */}
          <p
            className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic text-justify"
            style={{ color: 'var(--muted)' }}
          >
            Your mood is estimated using AI based on the submitted entry. The
            detected mood may not always accurately reflect your actual
            emotional state. Please refer to a professional for further advice
            or help.
          </p>

          {moodData.mood_confirmed == null && (
            <div className="md:flex md:gap-2 mt-2">
              {/* agree button */}
              <div className="flex gap-2">
                <button
                  className={buttonGradient(theme)}
                  onClick={handleConfirm}
                  disabled={loadingConfirm}
                >
                  {loadingConfirm ? 'Saving...' : 'I Agree'}
                </button>

                {/* disagree button */}
                <button
                  {...redButton(theme)}
                  onClick={() => setOpenMoods(true)}
                  disabled={loadingCorrected}
                >
                  I Disagree
                </button>
              </div>

              {openMoods && (
                <>
                  <select
                    className="flex-1 text-[clamp(0.875rem,1.5vw,1rem)] w-full px-3 py-2.25 mt-3 lg:mt-0 rounded-[10px] bg-white cursor-pointer"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                    value={correctMood}
                    onChange={(e) => setCorrectMood(e.target.value)}
                  >
                    <option value="">Select Correct Mood</option>
                    {moodOptions.map((mood) => (
                      <option key={mood.value} value={mood.value}>
                        {toTitleCase(mood.label)}
                      </option>
                    ))}
                  </select>
                  <button
                    // className={`${buttonRed} mt-3 lg:mt-0`}
                    {...redButton(theme)}
                    onClick={handleCorrected}
                    disabled={loadingCorrected}
                  >
                    {loadingCorrected ? 'Saving...' : 'Submit'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
