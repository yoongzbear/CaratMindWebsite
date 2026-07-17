// customized card

'use client';
import type { CardComponentProps } from 'nextstepjs';
import { C } from '@/app/styles/styles';
import { buttonGradient } from '@/app/styles/ui';

export function OnboardingCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) {
  const isLast = currentStep === totalSteps - 1;

  return (
    <div
      className="relative w-80 md:w-100 rounded-2xl p-5 shadow-lg"
      style={{
        backgroundColor: 'white',
        border: `1px solid ${C.roseQuartz}30`,
      }}
    >
      {arrow}

      <div className="flex items-center gap-2 mb-2">
        {step.icon && (
          <span
            className="text-[clamp(1.25rem,5vw,1.75rem)]"
            style={{ color: C.navy }}
          >
            {step.icon}
          </span>
        )}
        <h3
          className="font-semibold text-[clamp(1rem,3vw,1.5rem)]"
          style={{ color: C.navy }}
        >
          {step.title}
        </h3>
      </div>

      <p
        className="text-[clamp(0.875rem,1.5vw,1rem)] mb-4"
        style={{ color: C.navy }}
      >
        {step.content}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="text-[clamp(0.7rem,1.5vw,0.85rem)]"
          style={{ color: C.serenity }}
        >
          {currentStep + 1} / {totalSteps}
        </span>

        <div className="flex gap-2">
          {step.showSkip !== false && !isLast && (
            <button
              onClick={skipTour}
              className="text-[clamp(0.875rem,1.5vw,1rem)] px-2 py-1 cursor-pointer"
              style={{ color: C.serenity }}
            >
              Skip
            </button>
          )}
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="text-[clamp(0.875rem,1.5vw,1rem)] px-3 py-1.5 rounded-lg border cursor-pointer"
              style={{ borderColor: C.roseQuartz, color: C.navy }}
            >
              Back
            </button>
          )}
          <button
            onClick={isLast ? skipTour : nextStep}
            className={buttonGradient}
          >
            {isLast ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
