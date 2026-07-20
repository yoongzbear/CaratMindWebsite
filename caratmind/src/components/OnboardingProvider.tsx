'use client';
import { useMemo } from 'react';
import { NextStepProvider, NextStep } from 'nextstepjs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { buildSteps } from '@/app/copywriting/onboarding/steps';
import { OnboardingCard } from './OnboardingCard';
import OnboardingStart from './OnboardingStart';

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const steps = useMemo(() => buildSteps(isDesktop), [isDesktop]);

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={OnboardingCard}
        onComplete={(tourName) => {
          if (tourName === 'welcome')
            fetch('/api/onboarding/complete', { method: 'POST' });
        }}
        onSkip={(_step, tourName) => {
          if (tourName === 'welcome')
            fetch('/api/onboarding/complete', { method: 'POST' });
        }}
      >
        <OnboardingStart />
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
