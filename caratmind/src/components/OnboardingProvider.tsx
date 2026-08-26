'use client';
import { useMemo } from 'react';
import { NextStepProvider, NextStep } from 'nextstepjs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { buildSteps } from '@/app/copywriting/onboarding/steps';
import { OnboardingCard } from './OnboardingCard';
import OnboardingStart from './OnboardingStart';
import { useAuth } from '@/context/AuthContext';

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshUser } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const steps = useMemo(() => buildSteps(isDesktop), [isDesktop]);

  const completeTour = async (tourName?: string | null) => {
    if (!tourName) return;

    try {
      const response = await fetch(`/api/onboarding/${tourName}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Failed to complete onboarding');
        return;
      }

      await refreshUser();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={OnboardingCard}
        onComplete={completeTour}
        onSkip={(_step, tourName) => completeTour(tourName)}
      >
        <OnboardingStart />
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
