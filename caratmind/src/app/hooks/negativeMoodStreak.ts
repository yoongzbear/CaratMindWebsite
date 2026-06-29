'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

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
        const res = await fetch('/api/mood/streak', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) return;

        const streak = data.negative_streak_days ?? 0;
        setStreakDays(streak);

        if (streak >= STREAK_THRESHOLD) {
          const today = new Date().toISOString().slice(0, 10);
          const dismissedDate = localStorage.getItem(DISMISS_KEY);
          if (dismissedDate !== today) {
            setShowHelpline(true);
          }
        }
      } catch {
        // fail silently — this is a non-critical background check
      }
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
