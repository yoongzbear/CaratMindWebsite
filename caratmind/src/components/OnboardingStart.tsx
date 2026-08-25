'use client';
import { useEffect, useRef } from 'react';
import { useNextStep } from 'nextstepjs';
import { useAuth } from '@/context/AuthContext';
import { UserOnboarding } from '@/types/user';
import { usePathname } from 'next/navigation';

const ONBOARDING_KEY: Record<string, keyof UserOnboarding> = {
  '/home': 'home',
  '/journal/new': 'new_entry',
  '/journal/edit': 'edit_entry',
  '/journal/past': 'past_entry',
  '/journal/insight': 'journal_insights',
  '/mood': 'mood_charts',
  '/exercise/tracking': 'exc_track',
  '/exercise/catalog': 'exc_catalog',
  '/helpline': 'helpline',
  '/profile': 'profile',
  '/theme_select': 'theme',
};

export default function OnboardingStart() {
  const { user, loading } = useAuth();
  const { startNextStep } = useNextStep();
  const pathName = usePathname();
  const started = useRef<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    const key = ONBOARDING_KEY[pathName];
    if (!key) return;

    if (started.current === pathName) return;

    if (!user.onboarding?.[key]) {
      started.current = pathName;
      startNextStep(key);
    }
  }, [loading, user, startNextStep, pathName]);

  return null;
}
