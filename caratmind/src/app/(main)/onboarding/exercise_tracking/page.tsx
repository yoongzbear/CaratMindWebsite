'use client';
import Pill from '@/app/components/Pill';
import { DayPicker } from '@daypicker/react';
import { format } from 'date-fns';
import { Flame, Star } from 'lucide-react';
import { useMemo } from 'react';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { toTitleCase } from '@/app/utils/format';
import { buttonGradient } from '@/app/styles/ui';
import { useTheme } from '@/context/ThemeContext';

// sample data
const sampleExercise = [
  {
    uex_id: '1',
    uex_status: 'completed',
    exc_name: 'Gratitude Journaling',
    exc_type: 'positivity',
    exc_mood: ['joy', 'calm'],
    exc_desc:
      'Write down things you are grateful for, including both positive experiences and challenges that have helped you grow. It encourages a balanced perspective, fosters appreciation, and promotes emotional well-being.',
    uex_rating: 4,
    uex_reason: 'Current environment is not suitable',
  },
];

export default function ExerciseTrackingPreviewPage() {
  const { theme } = useTheme();
  const todayDate = useMemo(() => new Date(), []);

  return (
    <section
      className="min-h-[calc(100vh-140px)] items-center pt-4 sm:pt-6 pb-10"
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
            Coping Exercise Tracking (Preview)
          </h1>
        </header>

        {/* streak banner */}
        <div
          className="flex mx-auto items-center rounded-[10px] border mb-3.75 p-2.5 w-full lg:w-[80%]"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
          id="streak"
        >
          <div className="flex flex-col items-center justify-center px-3">
            <div className="relative z-10 w-24 h-24 flex items-center justify-center transition-transform duration-300">
              <Flame
                fill="#fc6f03"
                style={{ color: 'var(--text)' }}
                size={48}
              />
            </div>
            <p
              className="mt-0 mb-1 text-[clamp(1rem,3vw,1.5rem)]"
              style={{ color: 'var(--text)' }}
            >
              3 Days
            </p>
          </div>
          <p
            className="mt-0 mb-2.5 text-[clamp(1rem,3vw,1.5rem)]"
            style={{ color: 'var(--text)' }}
          >
            Great job! You kept your coping exercise streak going today. Keep it
            up!
          </p>
        </div>

        {/* today's exercise */}
        <div
          className="rounded-[10px] border mb-3.75 p-4"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
          id="today-exercise"
        >
          <h3
            className="text-[clamp(1.25rem,5vw,1.75rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Today&apos;s Exercise
          </h3>
          <h5
            className="text-[clamp(1rem,3vw,1.5rem)] font-semibold underline"
            style={{ color: 'var(--text)' }}
          >
            {format(todayDate, 'dd MMMM yyyy')}
          </h5>

          {/* exercise cards */}
          <div className="w-full flex flex-col mb-2">
            {/* scroll */}
            <div className="mt-2 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
              {/* exercise card */}
              {sampleExercise.map((exercise) => {
                const moods = Array.isArray(exercise.exc_mood)
                  ? exercise.exc_mood
                  : [exercise.exc_mood];
                const MAX_VISIBLE_MOODS = 3;
                const visibleMoods = moods.slice(0, MAX_VISIBLE_MOODS);
                const remainingCount = moods.length - visibleMoods.length;
                return (
                  <div
                    key={exercise.uex_id}
                    className="rounded-[10px] border mb-3.75 p-2.5"
                    style={{
                      backgroundColor: 'white',
                      boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                      border: '1px solid #eef2f9',
                    }}
                  >
                    <div className="w-full flex gap-3 mb-2">
                      <h5
                        className="text-[clamp(1rem,3vw,1.5rem)] font-bold mt-0 mb-0.5"
                        style={{ color: 'var(--text)' }}
                      >
                        {exercise.exc_name}
                      </h5>
                      <Pill
                        bgColor={'#f1f8f4'}
                        borderColor={'#66bb6a'}
                        textColor={'#2e7d32'}
                      >
                        Completed
                      </Pill>
                    </div>

                    {/* mood pills */}
                    {(() => {
                      const mobileVisibleMoods = moods.slice(0, 1);

                      return (
                        <div className="flex flex-wrap gap-3 mb-2">
                          {/* Mobile - 1 pill */}
                          <div className="flex gap-3 sm:hidden">
                            {mobileVisibleMoods.map((mood) => {
                              const moodStyle = getMoodStyle(mood);
                              return (
                                <Pill
                                  key={mood}
                                  bgColor={moodStyle.bgColor}
                                  borderColor={moodStyle.borderColor}
                                  textColor={moodStyle.textColor}
                                >
                                  {moodStyle.emoji} {toTitleCase(mood)}
                                </Pill>
                              );
                            })}

                            {moods.length > 1 && (
                              <div className="cursor-pointer">
                                <Pill
                                  bgColor="#f1f3f8"
                                  borderColor="#dde1ea"
                                  textColor={'var(--muted)'}
                                  title={moods
                                    .slice(1)
                                    .map(toTitleCase)
                                    .join(', ')}
                                >
                                  +{moods.length - 1} more
                                </Pill>
                              </div>
                            )}
                          </div>

                          {/* Desktop: existing visibleMoods / MAX_VISIBLE_MOODS */}
                          <div className="hidden sm:flex gap-3">
                            {visibleMoods.map((mood) => {
                              const moodStyle = getMoodStyle(mood);
                              return (
                                <Pill
                                  key={mood}
                                  bgColor={moodStyle.bgColor}
                                  borderColor={moodStyle.borderColor}
                                  textColor={moodStyle.textColor}
                                >
                                  {moodStyle.emoji} {toTitleCase(mood)}
                                </Pill>
                              );
                            })}

                            {remainingCount > 0 && (
                              <div className="cursor-pointer">
                                <Pill
                                  bgColor="#f1f3f8"
                                  borderColor="#dde1ea"
                                  textColor={'var(--muted)'}
                                  title={moods
                                    .slice(MAX_VISIBLE_MOODS)
                                    .map(toTitleCase)
                                    .join(', ')}
                                >
                                  +{remainingCount} more
                                </Pill>
                              </div>
                            )}
                          </div>

                          <Pill>{toTitleCase(exercise.exc_type)}</Pill>
                        </div>
                      );
                    })()}

                    <p
                      className="w-full mb-2 overflow-hidden text-justify text-ellipsis line-clamp-2 wrap-break-word text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{ color: 'var(--text)' }}
                    >
                      {exercise.exc_desc}
                    </p>

                    <div className="flex items-center gap-1">
                      <p
                        className="text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
                        id="rating"
                        style={{ color: 'var(--text)' }}
                      >
                        {exercise.uex_rating}
                      </p>
                      <Star
                        size={18}
                        style={{
                          color: 'var(--text)',
                        }}
                      />
                    </div>

                    {/* <div className="flex w-full gap-3"> */}
                    <div className="w-full mx-auto flex flex-wrap items-stretch justify-center gap-3 md:justify-start mt-4">
                      <button
                        className={buttonGradient(theme)}
                        id="button-exercise-details"
                      >
                        View More
                      </button>

                      <button
                        className={buttonGradient(theme)}
                        id="button-insights"
                      >
                        View Insights
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* recommended exercises history */}
        <div
          className="rounded-[10px] border mb-3.75 p-4"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
          id="exercise-history"
        >
          <h3
            className="text-[clamp(1.25rem,5vw,1.75rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Recommended Exercises History
          </h3>

          {/* mobile - date selector */}
          <div
            className="w-full flex lg:hidden flex-col gap-2"
            id="mobile-date"
          >
            <label
              className="text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
              style={{ color: 'var(--text)' }}
            >
              Select a Date
            </label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                id="mobile-date"
                value={format(todayDate, 'yyyy-MM-dd')}
                onChange={() => {}}
                className="flex-1 rounded-lg border px-3 py-2.5 text-[clamp(0.9rem,3.5vw,1rem)] font-medium"
                style={{ color: 'var(--text)', borderColor: '#eef2f9' }}
              />
              <button
                type="button"
                className="text-[clamp(0.75rem,2.5vw,0.875rem)] font-bold whitespace-nowrap cursor-pointer"
                style={{ color: 'var(--second-color)' }}
              >
                Today
              </button>
            </div>
          </div>

          <div className="flex">
            {/* desktop calendar - 40% */}
            <div className="w-[40%] hidden lg:flex" id="desktop-calendar">
              <div className="w-full flex justify-center">
                <div>
                  <DayPicker
                    mode="single"
                    selected={todayDate}
                    captionLayout="dropdown"
                    className="w-full"
                    style={{ color: 'var(--text)' }}
                    classNames={{
                      root: 'w-full',
                      months: 'w-full',
                      month: 'w-full',
                      month_grid: 'w-fit mx-auto',
                      weekday:
                        'w-11 text-center text-[clamp(0.875rem,1.5vw,1rem)] font-bold',
                      day_button:
                        'w-11 h-11 m-1 rounded-full flex items-center justify-center hover:bg-[#eef2f9] transition-colors hover:cursor-pointer',
                      today: 'font-semibold text-[#92A8D1]',
                      selected: 'bg-[#92A8D1] text-white rounded-full',
                      month_caption:
                        'flex items-center justify-between flex justify-center mb-3 hover:cursor-pointer',
                      caption_label:
                        'text-base font-bold text-left border rounded px-2 py-1 mx-2 flex items-center',
                      nav: 'flex items-center gap-2',
                      button_previous:
                        'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center hover:cursor-pointer',
                      button_next:
                        'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center hover:cursor-pointer',
                    }}
                  />
                  <button
                    className="text-[clamp(0.875rem,1.5vw,1rem)] font-semibold hover:cursor-pointer"
                    style={{ color: 'var(--second-color)' }}
                  >
                    Go to Today
                  </button>
                </div>
              </div>
            </div>

            {/* recommended coping exercise section - 60% */}
            <div
              className="w-full lg:w-[60%] flex flex-col"
              id="exercise-history-list"
            >
              <h5
                className="text-[clamp(1rem,3vw,1.5rem)] font-bold underline"
                style={{ color: 'var(--text)' }}
              >
                {format(todayDate, 'dd MMMM yyyy')}
              </h5>

              {/* scroll */}
              <div className="mx-2 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
                {/* exercise card */}
                {sampleExercise.map((exercise) => {
                  const moods = Array.isArray(exercise.exc_mood)
                    ? exercise.exc_mood
                    : [exercise.exc_mood];
                  const MAX_VISIBLE_MOODS = 2;
                  const visibleMoods = moods.slice(0, MAX_VISIBLE_MOODS);
                  const remainingCount = moods.length - visibleMoods.length;
                  return (
                    <div
                      key={exercise.uex_id}
                      className="rounded-[10px] border mb-3.75 p-2.5"
                      style={{
                        backgroundColor: 'white',
                        boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                        border: '1px solid #eef2f9',
                      }}
                    >
                      <h5
                        className="text-[clamp(1rem,3vw,2rem)] font-semibold mt-0 mb-0.5"
                        style={{ color: 'var(--text)' }}
                      >
                        {exercise.exc_name}
                      </h5>
                      <div className="flex gap-3 mb-2">
                        {/* exercise mood and type pills */}
                        {(() => {
                          const mobileVisibleMoods = moods.slice(0, 1);

                          return (
                            <div className="flex flex-wrap gap-3 mb-2">
                              {/* mobile - 1 pill */}
                              <div className="flex gap-3 sm:hidden">
                                {mobileVisibleMoods.map((mood) => {
                                  const moodStyle = getMoodStyle(mood);
                                  return (
                                    <Pill
                                      key={mood}
                                      bgColor={moodStyle.bgColor}
                                      borderColor={moodStyle.borderColor}
                                      textColor={moodStyle.textColor}
                                    >
                                      {moodStyle.emoji} {toTitleCase(mood)}
                                    </Pill>
                                  );
                                })}

                                {moods.length > 1 && (
                                  <div className="cursor-pointer">
                                    <Pill
                                      bgColor="#f1f3f8"
                                      borderColor="#dde1ea"
                                      textColor={'var(--muted)'}
                                      title={moods
                                        .slice(1)
                                        .map(toTitleCase)
                                        .join(', ')}
                                    >
                                      +{moods.length - 1} more
                                    </Pill>
                                  </div>
                                )}
                              </div>

                              {/* desktop mood */}
                              <div className="hidden sm:flex gap-3">
                                {visibleMoods.map((mood) => {
                                  const moodStyle = getMoodStyle(mood);
                                  return (
                                    <Pill
                                      key={mood}
                                      bgColor={moodStyle.bgColor}
                                      borderColor={moodStyle.borderColor}
                                      textColor={moodStyle.textColor}
                                    >
                                      {moodStyle.emoji} {toTitleCase(mood)}
                                    </Pill>
                                  );
                                })}

                                {remainingCount > 0 && (
                                  <div className="cursor-pointer">
                                    <Pill
                                      bgColor="#f1f3f8"
                                      borderColor="#dde1ea"
                                      textColor={'var(--muted)'}
                                      title={moods
                                        .slice(MAX_VISIBLE_MOODS)
                                        .map(toTitleCase)
                                        .join(', ')}
                                    >
                                      +{remainingCount} more
                                    </Pill>
                                  </div>
                                )}
                              </div>

                              <Pill>{toTitleCase(exercise.exc_type)}</Pill>
                            </div>
                          );
                        })()}
                      </div>

                      {/* rating (completed) / reason (incomplete) */}
                      <p
                        className="text-[clamp(0.875rem,1.5vw,1rem)] mb-2"
                        style={{ color: 'var(--text)' }}
                      >
                        <b>Incomplete Reason</b>: {exercise.uex_reason}
                      </p>

                      {/* exercise description */}
                      <p
                        className="w-full mb-2 overflow-hidden text-justify text-ellipsis line-clamp-2 wrap-break-word text-[clamp(0.875rem,1.5vw,1rem)]"
                        style={{ color: 'var(--text)' }}
                      >
                        {exercise.exc_desc}
                      </p>

                      <div className="mt-1 flex gap-3">
                        {/* button to insights page */}
                        <button className={buttonGradient(theme)}>
                          View More
                        </button>

                        {/* button to insights page */}
                        <button className={buttonGradient(theme)}>
                          View Insights
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
