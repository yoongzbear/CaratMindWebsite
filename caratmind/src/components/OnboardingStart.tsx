'use client';
import { useEffect, useRef } from 'react';
import { useNextStep } from 'nextstepjs';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { ONBOARDING_KEY } from '@/utils/onboardingPath';

export default function OnboardingStart() {
  const { user, loading } = useAuth();
  const { startNextStep } = useNextStep();
  const pathName = usePathname();
  const started = useRef<string | null>(null);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Current onboarding:', user?.onboarding);
    console.log('Path:', pathName);
    console.log('Onboarding key:', ONBOARDING_KEY[pathName]);
  }, [user, pathName]);

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
