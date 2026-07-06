'use client';
import Link from 'next/link';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { Eye, Flame } from 'lucide-react';
import StackedBarChart from '@/app/components/chart/StackedBarChart';
import { useEffect, useState } from 'react';
import { DateRangeValue } from '@/app/components/chart/DateRangeSelector';
import { toastError } from '@/utils/toast';
import {
  Habit,
  HabitAction,
  habitMessage,
  HabitStatus,
} from '@/app/types/habit';

export default function HomePage() {
  const { user, loading, accessToken } = useAuth();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [fetchingHabit, setFetchingHabit] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<HabitStatus | null>(
    null,
  );
  const [submittingAction, setSubmittingAction] = useState(false);

  const [journalStreak, setJournalStreak] = useState(0);
  const [journalToday, setJournalToday] = useState(false);
  const [fetchingJournalStreak, setFetchingJournalStreak] = useState(true);

  const [excStreak, setExcStreak] = useState(0);
  const [excToday, setExcToday] = useState(false);
  const [fetchingExcStreak, setFetchingExcStreak] = useState(true);

  const [barRange, setBarRange] = useState<DateRangeValue>({
    mode: 'days',
    days: 7,
  });

  useEffect(() => {
    if (!accessToken) return;

    async function loadHabit() {
      setFetchingHabit(true);
      try {
        const res = await fetch('/api/habit/today', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(data.error ?? "Failed to load today's habit.");
          return;
        }
        setHabit(data.habit);
      } catch {
        toastError("Something went wrong loading today's habit.");
      } finally {
        setFetchingHabit(false);
      }
    }

    loadHabit();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    async function loadJournalStreak() {
      setFetchingJournalStreak(true);
      try {
        const res = await fetch('/api/journal/streak', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(data.error ?? 'Failed to load journal streak.');
          return;
        }
        console.log('journal streak: ', data);
        setJournalStreak(data.streak);
        setJournalToday(data.submitted_today);
      } catch {
        toastError('Something went wrong loading your journal streak.');
      } finally {
        setFetchingJournalStreak(false);
      }
    }

    loadJournalStreak();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    async function loadExcStreak() {
      setFetchingExcStreak(true);
      try {
        const res = await fetch('/api/user_exercise/streak', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(data.error ?? 'Failed to load coping exercise streak.');
          return;
        }
        console.log('exercise streak: ', data);
        setExcStreak(data.streak);
        setExcToday(data.completed_today);
      } catch {
        toastError('Something went wrong loading your coping exercise streak.');
      } finally {
        setFetchingExcStreak(false);
      }
    }

    loadExcStreak();
  }, [accessToken]);

  async function handleActionClick(action: HabitAction) {
    if (!habit) return;
    setSubmittingAction(true);
    try {
      const res = await fetch('/api/habit/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          hab_id: habit.hab_id,
          action: action.action,
          status: action.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to save.');
        return;
      }
      setSelectedStatus(action.status);
    } catch {
      toastError(
        'Something went wrong in saving habit action. Please try again.',
      );
    } finally {
      setSubmittingAction(false);
    }
  }

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Welcome back, {user?.preferredUsername}!
          </h1>
        </header>

        {/* banner for basic habits */}
        <div
          className="rounded-[10px] border mb-4 p-3 flex gap-3 items-center"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          {fetchingHabit ? (
            <h5
              className="sm:text-[20px] md:text-[24px]"
              style={{ color: C.navy }}
            >
              Loading today&apos;s habit...
            </h5>
          ) : !habit ? (
            <h5
              className="sm:text-[20px] md:text-[24px]"
              style={{ color: C.navy }}
            >
              All habits completed for today! Keep it up for tomorrow.
            </h5>
          ) : (
            <>
              <h5
                className="flex-1 sm:text-[20px] md:text-[24px]"
                style={{ color: C.navy }}
              >
                {habit.hab_question}
              </h5>

              {selectedStatus ? (
                <p
                  className="sm:text-[20px] md:text-[24px] font-semibold"
                  style={{ color: C.navy }}
                >
                  {habitMessage[selectedStatus]}
                </p>
              ) : (
                <div className="ml-auto flex gap-5 flex-wrap">
                  {habit.hab_actions.map((action) => (
                    <button
                      key={action.action}
                      disabled={submittingAction}
                      onClick={() => handleActionClick(action)}
                      className={`inline-flex cursor-pointer items-center px-4 justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 disabled:opacity-50`}
                    >
                      {action.action}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* cards */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
          {/* journal */}
          <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h3
                className="sm:text-[24px] md:text-[28px] font-semibold tracking-tight"
                style={{ color: C.navy }}
              >
                Journal
              </h3>
              <h5
                className="sm:text-[20px] md:text-[24px] font-semibold tracking-tight"
                style={{ color: C.navy }}
              >
                Current Journal Streak
              </h5>
              <div className="relative w-full h-44 bg-linear-to-br flex items-center justify-center">
                <div className="flex flex-col items-center justify-center px-3">
                  <div className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300">
                    {journalToday ? (
                      <Flame
                        fill="#fc6f03"
                        style={{ color: C.navy }}
                        className="size-full"
                      />
                    ) : (
                      <Flame style={{ color: C.navy }} className="size-full" />
                    )}
                  </div>
                  <p
                    className="mt-2 mb-2.5 sm:text-[18px] md:text-[20px] font-semibold"
                    style={{ color: C.navy }}
                  >
                    {fetchingJournalStreak
                      ? '...'
                      : `${journalStreak} ${journalStreak === 1 ? 'Day' : 'Days'}`}
                  </p>
                </div>
              </div>
              <p
                className="sm:text-[14px] md:text-[16px] leading-relaxed flex-1 text-justify"
                style={{ color: C.navy }}
              >
                {fetchingJournalStreak
                  ? 'Loading journal streak...'
                  : journalToday
                    ? 'Great job! You kept your journal streak going today. Keep it up!'
                    : 'You have not written an entry today. Write one to continue your streak!'}
              </p>
              <Link
                href="/journal/new"
                className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
              >
                Write an entry
              </Link>
            </div>
          </div>

          {/* mood */}
          <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h3
                className="sm:text-[24px] md:text-[28px] font-semibold tracking-tight"
                style={{ color: C.navy }}
              >
                Mood
              </h3>
              {/* mood chart */}
              <StackedBarChart range={barRange} height={280} />
              <Link
                href="/mood"
                className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
              >
                View more
              </Link>
            </div>
          </div>

          {/* exercise */}
          <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h3
                className="sm:text-[24px] md:text-[28px] font-semibold tracking-tight"
                style={{ color: C.navy }}
              >
                Coping Exercise
              </h3>
              <h5
                className="sm:text-[20px] md:text-[24px] font-semibold tracking-tight"
                style={{ color: C.navy }}
              >
                Current Exercise Streak
              </h5>
              {/* exercise streak */}
              <div
                className={`relative w-full h-44 bg-linear-to-br flex items-center justify-center`}
              >
                <div className="flex flex-col items-center justify-center px-3">
                  <div
                    className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300`}
                  >
                    {excToday ? (
                      <Flame
                        fill="#fc6f03"
                        style={{ color: C.navy }}
                        className="size-full"
                      />
                    ) : (
                      <Flame style={{ color: C.navy }} className="size-full" />
                    )}
                  </div>
                  <p
                    className="mt-2 mb-2.5 sm:text-[18px] md:text-[20px] font-semibold"
                    style={{ color: C.navy }}
                  >
                    {fetchingExcStreak
                      ? '...'
                      : `${excStreak} ${excStreak === 1 ? 'Day' : 'Days'}`}
                  </p>
                </div>
              </div>
              <p
                className="sm:text-[14px] md:text-[16px] leading-relaxed flex-1 text-justify"
                style={{ color: C.navy }}
              >
                {fetchingExcStreak
                  ? 'Loading coping exercise streak...'
                  : excToday
                    ? 'Great job! You kept your coping exercise streak going today. Keep it up!'
                    : 'You have not performed a coping exercise today. Complete one to continue your streak!'}
              </p>
              <Link
                href="/exercise/tracking"
                className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
              >
                Track exercise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
