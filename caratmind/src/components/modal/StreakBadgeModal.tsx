// display earned streak badge - journal/exercise

'use client';

import Modal from './Modal';
import { gradientButton, greyButton } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
  badgeId: string | null;
};

const BADGE_LABELS: Record<string, string> = {
  exercise: 'Coping Exercise',
  journal: 'Journal',
};

export default function StreakBadgeModal({ open, onClose, badgeId }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  if (!open || !badgeId) return null;

  const [type, milestone] = badgeId.split('_'); // journal_7
  const label = BADGE_LABELS[type] ?? type;

  const handleView = () => router.push(`/profile`);

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={500}
      title={<>Unlocked {label} Streak</>}
    >
      <div className="max-h-[80vh] landscape:max-h-[70vh] overflow-y-auto min-h-0 pb-4 [-webkit-overflow-scrolling:touch]">
        <div className="mx-auto text-center w-fit">
          {/* bagde */}
          <img
            src={`/assets/badge/${badgeId}.png`}
            alt="Streak Badge"
            className="h-28 w-28"
          />
        </div>

        <div className="mb-3.75 p-4">
          <h5
            className="text-[clamp(1rem,3vw,1.5rem)] mb-2 text-center"
            style={{ color: 'var(--text)' }}
          >
            You have unlocked a new streak badge. Keep it up!
          </h5>

          <div className="flex gap-2 justify-center">
            <button onClick={handleView} {...gradientButton(theme)}>
              View Badges
            </button>
            <button onClick={onClose} {...greyButton(theme)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
