'use client';
import { useEffect, useRef } from 'react';
import { useNextStep } from 'nextstepjs';
import { useAuth } from '@/context/AuthContext';

export default function OnboardingStart() {
  const { user, loading } = useAuth();
  const { startNextStep } = useNextStep();
  const started = useRef(false);

  useEffect(() => {
    if (loading || !user || started.current) return;
    if (!user.completedOnboarding) {
      started.current = true;
      startNextStep('welcome');
    }
  }, [loading, user, startNextStep]);

  return null;
}
