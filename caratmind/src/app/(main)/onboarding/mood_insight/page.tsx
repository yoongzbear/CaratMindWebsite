// preview page for mood insights
'use client';

import StackedBarChart from '@/app/components/chart/StackedBarChart';
import Pill from '@/app/components/Pill';
import {
  buttonGradient,
  buttonRed,
  gradientButton,
  redButton,
} from '@/app/styles/ui';
import { getExerciseStyle } from '@/app/utils/exerciseUtils';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { format } from 'date-fns';
import { buildMockBarData } from '../mood_chart/page';
import { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';

// sample data
const sampleJournal = {
  jrnl_created_at: new Date().toISOString(),
  entryText:
    "Had a pretty good day overall. Finished a project I've been stuck on for a while and it felt great to finally get it working.",
};

const sampleMood = {
  mood_name: 'joy',
  mood_confidence: '0.86',
  mood_explain:
    'The entry expresses relief and satisfaction after completing a difficult task, which points to a positive, upbeat mood.',
};

const sampleExercise = {
  exc_name: 'Gratitude Journaling',
  exc_type: 'positivity',
  exc_mood: ['joy', 'calm'],
  exc_desc:
    'Write down things you are grateful for, including both positive experiences and challenges that have helped you grow. It encourages a balanced perspective, fosters appreciation, and promotes emotional well-being.',
};

export default function MoodInsightPreviewPage() {
  const { theme } = useTheme();
  const barData = useMemo(() => buildMockBarData(), []);
  return (
    <section
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-12"
      style={{
        background: 'var(--bg)',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Mood Insights (Preview)
          </h1>
        </header>

        {/* journal summary */}
        <div
          className="rounded-[10px] border mb-3.75 p-4"
          style={{
            backgroundColor: 'var(--bg-div)',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
          id="journal-summary"
        >
          <div className="flex gap-2 items-center mb-2">
            <h3
              className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
              style={{ color: 'var(--text)' }}
            >
              {format(
                new Date(sampleJournal.jrnl_created_at),
                'dd MMMM yyyy, p',
              )}
            </h3>

            <div className="">
              <Pill
                shaded
                bgColor="#f1f8f4"
                textColor="#2e7d32"
                borderColor="#c8e6c9"
              >
                Submitted
              </Pill>
            </div>
          </div>

          <div
            className="px-4 py-2 rounded-xl"
            style={{ border: '1px solid var(--border)' }}
          >
            <p
              className="w-full overflow-hidden text-justify text-ellipsis line-clamp-3 wrap-break-word text-[clamp(0.875rem,1.5vw,1rem)]"
              style={{
                color: 'var(--text)',
              }}
            >
              {sampleJournal.entryText}
            </p>
          </div>

          <div className="w-full sm:w-[40%] md:w-[70%] mx-auto flex flex-wrap items-stretch justify-center gap-3 md:justify-between md:gap-0 mt-4">
            {/* view more button */}
            <button {...gradientButton(theme)} id="button-view-entry">
              View More
            </button>

            {/* edit entry */}
            <button {...gradientButton(theme)} id="button-edit-entry">
              Edit Entry
            </button>

            {/* submit entry button */}
            <button {...gradientButton(theme)} id="button-submit-entry">
              Submit Entry
            </button>

            {/* delete button */}
            <button {...redButton(theme)} id="button-delete-entry">
              Delete Entry
            </button>
          </div>
        </div>

        <div className="w-full mb-3.75 flex flex-col gap-2 md:grid md:grid-cols-2 md:grid-rows-[auto_auto_auto_1fr_auto_auto] md:gap-3">
          {/* mood insight */}
          <div
            className="flex flex-col rounded-[10px] border p-4 md:grid md:grid-rows-subgrid md:row-span-6"
            style={{
              backgroundColor: 'var(--bg-div)',
              boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              border: '1px solid #eef2f9',
            }}
            id="mood"
          >
            <h3
              className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
              style={{ color: 'var(--text)' }}
            >
              From your entry, you felt
            </h3>

            {/* emoji */}
            <div className="items-center justify-center text-center">
              <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 flex items-center justify-center">
                {getMoodStyle(sampleMood.mood_name).emoji}
              </div>

              {/* mood name */}
              <h5
                className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                style={{ color: 'var(--text)' }}
              >
                {toTitleCase(sampleMood.mood_name) ?? 'Unknown'}
              </h5>
              <div className="mb-2 lg:mb-0">
                <Pill
                  shaded
                  bgColor="#f1f8f4"
                  borderColor="#66bb6a"
                  textColor="#2e7d32"
                >
                  Agreed
                </Pill>
              </div>
            </div>

            {/* disclaimer */}
            <div>
              <p
                className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic text-justify"
                style={{ color: 'var(--muted)' }}
              >
                Your mood is estimated using AI based on the submitted entry.
                The detected mood may not always accurately reflect your actual
                emotional state. Please refer to a professional for further
                advice or help.
              </p>
            </div>

            {/* button */}
            <div className="w-fit mx-auto mt-3 lg:mt-0 flex gap-4">
              <button {...gradientButton(theme)} id="button-view-mood">
                View Details
              </button>
            </div>
          </div>

          {/* coping exercise recommendation */}
          <div
            className="flex flex-col rounded-[10px] border p-4 md:grid md:grid-rows-subgrid md:row-span-6"
            style={{
              backgroundColor: 'var(--bg-div)',
              boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              border: '1px solid #eef2f9',
            }}
            id="exercise"
          >
            <h3
              className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Recommended Coping Exercise:
            </h3>

            {/* emoji */}
            <div className="items-center justify-center">
              <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 flex items-center justify-center">
                {getExerciseStyle(sampleExercise.exc_type).emoji}
              </div>
              {/* </div> */}

              {/* name + status */}
              <div className="mb-2 text-center items-center justify-center">
                <h5
                  className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                  style={{ color: 'var(--text)' }}
                >
                  {sampleExercise.exc_name}
                </h5>
                <Pill
                  shaded
                  bgColor="#fff5f5"
                  borderColor="#e57373"
                  textColor="#c62828"
                >
                  Incomplete
                </Pill>
              </div>
            </div>

            {/* <div /> */}

            {/* disclaimer */}
            <div>
              <p
                className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic text-justify"
                style={{ color: 'var(--muted)' }}
              >
                AI-generated recommendation. Suggestions are not a substitute
                for professional medical or mental health advice.
              </p>
            </div>

            {/* buttons */}
            <div className="w-fit mx-auto mt-3 lg:mt-0 flex gap-4">
              <>
                <button {...gradientButton(theme)} id="button-view-exercise">
                  View Details
                </button>

                <button {...gradientButton(theme)} id="button-track-exercise">
                  Perform Exercise
                </button>
              </>
            </div>
          </div>
        </div>

        <div
          className="rounded-[10px] border mb-3.75 p-4 flex flex-col items-center"
          style={{
            backgroundColor: 'var(--bg-div)',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
          id="mood-chart-div"
        >
          {/* mood chart */}
          <h3
            className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold w-full"
            style={{ color: 'var(--text)' }}
          >
            Mood This Week
          </h3>
          <div className="w-full" id="mood-chart">
            <StackedBarChart
              range={{ mode: 'days', days: 7 }}
              mockData={barData}
            />
          </div>
          {/* mood dashboard button */}
          <button {...gradientButton(theme)} id="button-mood-chart">
            View Mood Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
