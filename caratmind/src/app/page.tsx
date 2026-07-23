'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { gradientButton } from '../styles/ui';
import { useTheme } from '@/context/ThemeContext';
import StackedBarChart from '@/components/chart/StackedBarChart';
import { buildMockBarData, getMoodStyle } from '@/utils/moodUtils';
import { getExerciseStyle } from '@/utils/exerciseUtils';
import Pill from '@/components/Pill';
import { toTitleCase } from '@/utils/format';

export default function SplashPage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const barData = useMemo(() => buildMockBarData(), []);

  useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [user, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (user) {
    return null;
  }

  return (
    // splash page - not logged in
    <section
      className="min-h-[calc(100vh-140px)] items-center pt-4 sm:pt-6 pb-10"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      {/* hero */}
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <div className="relative z-10 text-center mb-8 flex flex-col items-center gap-4">
          <h1 className="text-[clamp(3rem,8vw,4rem)] font-light leading-none tracking-tight text-slate-800">
            Welcome to CaratMind
          </h1>
          <h5 className="text-slate-500 text-[clamp(1rem,3vw,2rem)] leading-relaxed">
            A thoughtful space for your mental wellbeing.
          </h5>
        </div>
        {/* cards */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mx-auto">
          {/* journal entry example */}
          <div
            className="group flex flex-col bg-(--bg-div) rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden"
            id="journal-streak"
          >
            <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3">
              {/* textarea */}
              <textarea
                className="w-full h-32 md:h-48 px-3 py-2.5 text-justify rounded-lg text-[clamp(0.875rem,1.5vw,1rem)] box-border outline-none font-inherit"
                id="entry-text"
                style={{
                  border: '1px solid var(--border)',
                  fontFamily: 'inherit',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg-div)',
                }}
                defaultValue="I went out with my friends to our favorite restaurant and shared
                stories about our lives. I will miss them a lot and I hope to see
                them again soon."
              ></textarea>

              <h3 className="text-(--text) text-[clamp(1.25rem,5vw,1.75rem)] font-semibold tracking-tight">
                Journal Entry
              </h3>
              <p className="text-(--text) text-[clamp(0.94rem,1.5vw,1rem)] leading-relaxed flex-1">
                Write your thoughts and feelings daily. Mood is detected through
                your entry using AI.
              </p>

              <Link href="/journal" {...gradientButton(theme)}>
                Write Entry
              </Link>

              {/* <h3
              className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Journal
            </h3> */}
            </div>
          </div>

          {/* mood bar chart */}
          <div
            className="group flex flex-col bg-(--bg-div) rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden"
            id="mood-chart"
          >
            <div className="flex flex-col flex-1 p-6 gap-3">
              {/* mood chart */}
              <div className="md:h-48 overflow-hidden">
                <StackedBarChart
                  range={{ mode: 'days', days: 7 }}
                  mockData={barData}
                  height={180}
                />
              </div>
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                Mood Chart
              </h3>
              <p className="text-(--text) text-[clamp(0.94rem,1.5vw,1rem)] leading-relaxed flex-1">
                View summary of detected moods over time in charts. Informative
                insights are generated based on the detected mood.
              </p>
              <Link href="/mood" {...gradientButton(theme)}>
                View Mood
              </Link>
            </div>
          </div>

          {/* exercise */}
          <div
            className="group flex flex-col bg-(--bg-div) rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden"
            id="exercise-streak"
          >
            <div className="flex flex-col flex-1 p-6 gap-3">
              {/* example coping exercise */}
              <div
                className="flex md:h-48 flex-col rounded-[10px] border p-4 md:grid md:grid-rows-subgrid md:row-span-6"
                style={{
                  backgroundColor: 'var(--bg-div)',
                  boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                  border: '1px solid #eef2f9',
                }}
                id="exercise"
              >
                {/* emoji */}
                <div className="items-center justify-center">
                  <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 flex items-center justify-center">
                    {getExerciseStyle('mindfulness').emoji}
                  </div>

                  {/* name + status / states */}
                  <div className="mb-2 text-center items-center justify-center">
                    <h5
                      className="m-0 mb-2 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                      style={{ color: 'var(--text)' }}
                    >
                      5-4-3-2-1 Grouding
                    </h5>
                    <div className="max-h-24 lg:max-h-32 justify-center overflow-y-auto flex flex-wrap gap-2 mb-3">
                      <Pill
                        bgColor={getMoodStyle('anger', false).bgColor}
                        borderColor={getMoodStyle('anger', false).borderColor}
                        textColor={getMoodStyle('anger', false).textColor}
                      >
                        {getMoodStyle('anger', false).emoji}{' '}
                        {toTitleCase('anger')}
                      </Pill>
                      <Pill
                        bgColor={getMoodStyle('fear', false).bgColor}
                        borderColor={getMoodStyle('fear', false).borderColor}
                        textColor={getMoodStyle('fear', false).textColor}
                      >
                        {getMoodStyle('fear', false).emoji}{' '}
                        {toTitleCase('fear')}
                      </Pill>

                      <Pill
                        bgColor="var(--bg-div)"
                        borderColor="var(--border)"
                        textColor="var(--muted)"
                      >
                        +17 more
                      </Pill>
                    </div>
                  </div>
                </div>
              </div>
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                Coping Exercise
              </h3>
              <p className="text-(--text) text-[clamp(0.94rem,1.5vw,1rem)] leading-relaxed flex-1">
                Get recommended coping exercise based on the detected mood. It
                helps to regulate your daily mood!
              </p>
              <Link href="/exercise/tracking" {...gradientButton(theme)}>
                Track exercise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
