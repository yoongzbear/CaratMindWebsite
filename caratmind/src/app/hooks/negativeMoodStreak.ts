'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getNegativeMoodStreak } from '@/utils/api/moodApi';

const STREAK_THRESHOLD = 3;
const DISMISS_KEY = 'helplineModalDismissedDate';

export function useMoodStreakAlert() {
  const { accessToken, user } = useAuth();
  const [showHelpline, setShowHelpline] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    if (!accessToken || !user) return;

    async function checkStreak() {
      try {
        if (accessToken) {
          const data = await getNegativeMoodStreak(accessToken);

          const streak = data ?? 0;
          setStreakDays(streak);

          if (streak >= STREAK_THRESHOLD) {
            const today = new Date().toISOString().slice(0, 10);
            const dismissedDate = localStorage.getItem(DISMISS_KEY);
            if (dismissedDate !== today) {
              setShowHelpline(true);
            }
          }
        }
      } catch {}
    }

    checkStreak();
  }, [accessToken, user]);

  function dismiss() {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(DISMISS_KEY, today);
    setShowHelpline(false);
  }

  return { showHelpline, streakDays, dismiss };
}
