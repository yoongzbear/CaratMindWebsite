'use client';

import HelplineModal from './modal/HelplineModal';
import { useMoodStreakAlert } from '../hooks/negativeMoodStreak';

export function HelplineModalProvider() {
  const { showHelpline, streakDays, dismiss } = useMoodStreakAlert();

  return (
    <HelplineModal open={showHelpline} onClose={dismiss} numDays={streakDays} />
  );
}
