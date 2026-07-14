'use client';
import ExerciseDetailModal from '@/app/components/modal/ExerciseModal';
import Pill from '@/app/components/Pill';
import {
  buttonGradientColor,
  buttonOutlined,
  C,
  styles,
} from '@/app/styles/styles';
import {
  Exercise,
  UserExercise,
  UserExerciseDetail,
} from '@/app/types/exercise';
import { useAuth } from '@/context/AuthContext';
import { DayPicker } from '@daypicker/react';
import { format, isSameDay, isValid, parseISO } from 'date-fns';
import { Eye, Flame, Pi, Snowflake, Star } from 'lucide-react';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { toTitleCase } from '@/app/utils/format';
import { toastError, toastSuccess } from '@/utils/toast';
import RatingModal from '@/app/components/modal/RatingModal';
import ReasonModal from '@/app/components/modal/ReasonModal';
import { buttonGradient, buttonGreen, buttonRed } from '@/app/styles/ui';

type RatingResponse = {
  message: string;
  user_exercise: UserExercise;
};

type ReasonResponse = {
  message: string;
  user_exercise: UserExercise;
};

type ApiErrorResponse = {
  error: string;
};

export default function ExerciseTrackingPage() {
  const { user, loading, accessToken } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const router = useRouter();

  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [fetchingStreak, setFetchingStreak] = useState(false);

  const todayDate = useMemo(() => new Date(), []);
  const [todayExercise, setTodayExercise] = useState<UserExerciseDetail[]>([]);
  const [fetchingTodayExc, setFetchingTodayExc] = useState(false);

  const [selectedUserExc, setSelectedUserExc] =
    useState<UserExerciseDetail | null>(null);
  const [openRating, setOpenRating] = useState(false);
  const [openReason, setOpenReason] = useState(false);

  const [excHistoryData, setExcHistoryData] = useState<UserExerciseDetail[]>(
    [],
  );
  const [fetchingExcHistory, setFetchingExcHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(todayDate);
  const [calendarMonth, setCalendarMonth] = useState<Date>(todayDate); // to change month
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const loadStreak = async () => {
    if (!accessToken) return;
    setFetchingStreak(true);
    try {
      const res = await fetch('/api/user_exercise/streak', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to load streak.');
        return;
      }
      setStreak(data.streak);
      setCompletedToday(data.completed_today);
    } catch {
      toastError('Something went wrong loading your streak.');
    } finally {
      setFetchingStreak(false);
    }
  };

  const loadTodayExc = async () => {
    if (!accessToken) return;
    setFetchingTodayExc(true);
    try {
      const dateStr = format(todayDate, 'yyyy-MM-dd');
      const res = await fetch(`/api/user_exercise/list?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(
          data.error ?? 'Failed to load recommended coping exercises today.',
        );
        setTodayExercise([]);
        return;
      }
      setTodayExercise(data.exercises ?? []);
    } catch {
      toastError(
        'Something went wrong loading recommended coping exercises today.',
      );
    } finally {
      setFetchingTodayExc(false);
    }
  };

  const loadExcHistory = async () => {
    if (!accessToken) return;
    setFetchingExcHistory(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const res = await fetch(`/api/user_exercise/list?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(
          data.error ?? 'Failed to load recommended coping exercises.',
        );
        setExcHistoryData([]);
        return;
      }
      setExcHistoryData(data.exercises ?? []);
    } catch {
      toastError('Something went wrong loading recommended coping exercises.');
    } finally {
      setFetchingExcHistory(false);
    }
  };
  useEffect(() => {
    startTransition(() => {
      loadStreak();
    });
  }, [accessToken]);

  useEffect(() => {
    startTransition(() => {
      loadTodayExc();
    });
  }, [accessToken, todayDate]);

  useEffect(() => {
    startTransition(() => {
      loadExcHistory();
    });
  }, [selectedDate, accessToken]);

  const handleViewEntry = (jrnl_id: string) => {
    router.push(`/mood/insight/${jrnl_id}`);
  };

  const handleRatingSubmit = async (rating: number) => {
    if (!selectedUserExc) return;
    const uex_id = selectedUserExc.uex_id;
    try {
      const res = await fetch(`/api/user_exercise/${uex_id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ rating }),
        cache: 'no-store',
      });

      let data: RatingResponse | ApiErrorResponse;
      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response from Django:', text);
        data = { error: 'Unexpected response from server.' };
      }

      if (!res.ok || 'error' in data) {
        toastError('error' in data ? data.error : 'Failed to save rating.');
        return;
      }

      toastSuccess('Saved coping exercise rating.');
      setOpenRating(false);

      // refresh today's exercises, history, and streak
      await Promise.all([loadTodayExc(), loadExcHistory(), loadStreak()]);
    } catch {
      toastError('Something went wrong. Please try again.');
    }
  };

  const handleReasonSubmit = async (reason: string) => {
    if (!selectedUserExc) return;
    const uex_id = selectedUserExc.uex_id;
    try {
      const res = await fetch(`/api/user_exercise/${uex_id}/reason`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ reason }),
        cache: 'no-store',
      });

      let data: ReasonResponse | ApiErrorResponse;
      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response from Django:', text);
        data = { error: 'Unexpected response from server.' };
      }

      if (!res.ok || 'error' in data) {
        toastError(
          'error' in data ? data.error : 'Failed to save incompletion reason.',
        );
        return;
      }

      toastSuccess('Saved coping exercise incompletion reason.');
      setOpenReason(false);

      // refresh today's exercises and history
      await Promise.all([loadTodayExc(), loadExcHistory()]);
    } catch {
      toastError('Something went wrong. Please try again.');
    }
  };

  return (
    <section
      className="min-h-[calc(100vh-140px)] items-center pt-4 sm:pt-6 pb-10"
      style={{
        background: C.bgPage,
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Coping Exercise Tracking
          </h1>
        </header>

        {/* streak banner */}
        <div
          className="flex mx-auto items-center rounded-[10px] border mb-3.75 p-2.5 w-[80%]"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <div className="flex flex-col items-center justify-center px-3">
            <div className="relative z-10 w-24 h-24 flex items-center justify-center transition-transform duration-300">
              {completedToday ? (
                <Flame fill="#fc6f03" style={{ color: C.navy }} size={48} />
              ) : (
                <Flame style={{ color: C.navy }} size={48} />
              )}
            </div>
            <p
              className="mt-0 mb-1 text-[clamp(1rem,3vw,1.5rem)]"
              style={{ color: C.navy }}
            >
              {fetchingStreak
                ? '...'
                : `${streak} ${streak === 1 ? 'Day' : 'Days'}`}
            </p>
          </div>
          <p
            className="mt-0 mb-2.5 text-[clamp(1rem,3vw,1.5rem)]"
            style={{ color: C.navy }}
          >
            {fetchingStreak
              ? 'Loading coping exercise streak...'
              : completedToday
                ? 'Great job! You kept your coping exercise streak going today. Keep it up!'
                : streak === 0
                  ? 'Complete a coping exercise today to start your streak!'
                  : 'Complete a coping exercise today to continue your streak!'}
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
        >
          <h3
            className="text-[clamp(1.25rem,5vw,1.75rem)] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Today&apos;s Exercise
          </h3>
          <h5
            className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
            style={{ color: C.muted }}
          >
            {format(todayDate, 'dd MMMM yyyy')}
          </h5>

          {/* exercise cards */}
          <div className="w-full flex flex-col mb-2">
            {/* scroll */}
            <div className="mt-2 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
              {fetchingTodayExc && (
                <p
                  className="text-[clamp(1rem,3vw,1.5rem)]"
                  style={{ color: C.muted }}
                >
                  Loading today&apos;s recommended coping exercises...
                </p>
              )}

              {!fetchingTodayExc && todayExercise.length === 0 && (
                <div>
                  <p
                    className="text-[clamp(0.875rem,1.5vw,1rem)] font-semibold"
                    style={{ color: C.navy }}
                  >
                    No recommended coping exercises for today. Create a new
                    entry to get started!
                  </p>
                  <button
                    // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white text-[clamp(0.875rem,1.5vw,1rem)] rounded-xl px-5 py-2.5 transition-colors duration-200`}
                    className={buttonGradient}
                    onClick={() => router.push('/journal/new')}
                  >
                    New Entry
                  </button>
                </div>
              )}

              {/* exercise card */}
              {!fetchingTodayExc &&
                todayExercise.map((exercise) => {
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
                          style={{ color: C.navy }}
                        >
                          {exercise.exc_name}
                        </h5>
                        {exercise.uex_status === 'completed' && (
                          <Pill
                            bgColor={'#f1f8f4'}
                            borderColor={'#66bb6a'}
                            textColor={'#2e7d32'}
                          >
                            Completed
                          </Pill>
                        )}
                        {exercise.uex_status === 'incomplete' &&
                          exercise.uex_reason && (
                            <Pill
                              bgColor={'#fff5f5'}
                              borderColor={'#e57373'}
                              textColor={'#c62828'}
                            >
                              Incomplete
                            </Pill>
                          )}
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
                                <div
                                  onClick={() => {
                                    setSelectedExercise(exercise);
                                    setOpenDetail(true);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Pill
                                    bgColor="#f1f3f8"
                                    borderColor="#dde1ea"
                                    textColor={C.faint}
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

                            {/* Desktop: existing visibleMoods / MAX_VISIBLE_MOODS logic */}
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
                                <div
                                  onClick={() => {
                                    setSelectedExercise(exercise);
                                    setOpenDetail(true);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Pill
                                    bgColor="#f1f3f8"
                                    borderColor="#dde1ea"
                                    textColor={C.faint}
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
                        style={{ color: C.navy }}
                      >
                        {exercise.exc_desc}
                      </p>

                      {exercise.uex_status === 'completed' ? (
                        <div className="flex items-center gap-1">
                          <p
                            className="text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
                            style={{ color: C.navy }}
                          >
                            {exercise.uex_rating}
                          </p>
                          <Star
                            size={18}
                            style={{
                              color: C.navy,
                            }}
                          />
                        </div>
                      ) : exercise.uex_status === 'incomplete' &&
                        exercise.uex_reason ? (
                        <p
                          className="text-[clamp(0.875rem,1.5vw,1rem)] mb-2"
                          style={{ color: C.navy }}
                        >
                          <b>Incomplete Reason</b>: {exercise.uex_reason}
                        </p>
                      ) : (
                        <></>
                      )}

                      {/* <div className="flex w-full gap-3"> */}
                      <div className="w-full mx-auto flex flex-wrap items-stretch justify-center gap-3 md:justify-start mt-4">
                        <button
                          onClick={() => {
                            setSelectedExercise(exercise);
                            setOpenDetail(true);
                          }}
                          // className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white text-[clamp(0.875rem,1.5vw,1rem)] rounded-xl px-5 py-2.5 transition-colors duration-200`}
                          className={buttonGradient}
                        >
                          View More
                        </button>

                        <button
                          onClick={() => handleViewEntry(exercise.jrnl_id)}
                          // className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white text-[clamp(0.875rem,1.5vw,1rem)] rounded-xl px-5 py-2.5 transition-colors duration-200`}
                          className={buttonGradient}
                        >
                          View Insights
                        </button>

                        {exercise.uex_status === 'incomplete' &&
                          !exercise.uex_reason && (
                            <>
                              <button
                                onClick={() => {
                                  setOpenRating(true);
                                  setSelectedUserExc(exercise);
                                }}
                                // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGreen} text-[clamp(0.875rem,1.5vw,1rem)] rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                                className={buttonGreen}
                              >
                                {'Completed'}
                              </button>

                              <button
                                onClick={() => {
                                  setOpenReason(true);
                                  setSelectedUserExc(exercise);
                                }}
                                // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-[clamp(0.875rem,1.5vw,1rem)] font-bold rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                                className={buttonRed}
                              >
                                Uncompleted
                              </button>
                            </>
                          )}
                      </div>
                      <RatingModal
                        open={openRating}
                        onClose={() => setOpenRating(false)}
                        onSubmit={handleRatingSubmit}
                      />
                      <ReasonModal
                        open={openReason}
                        onClose={() => setOpenReason(false)}
                        onSubmit={handleReasonSubmit}
                      />
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
        >
          <h3
            className="text-[clamp(1.25rem,5vw,1.75rem)] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Recommended Exercises History
          </h3>

          {/* mobile - date selector */}
          <div className="w-full flex lg:hidden flex-col gap-2">
            <label
              className="text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
              style={{ color: C.navy }}
            >
              Select a Date
            </label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                id="mobile-date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const parsed = parseISO(e.target.value);
                  if (isValid(parsed)) {
                    setSelectedDate(parsed);
                    setCalendarMonth(parsed);
                  }
                }}
                className="flex-1 rounded-lg border px-3 py-2.5 text-[clamp(0.9rem,3.5vw,1rem)] font-medium"
                style={{ color: C.navy, borderColor: '#eef2f9' }}
              />
              <button
                type="button"
                className="text-[clamp(0.75rem,2.5vw,0.875rem)] font-bold whitespace-nowrap hover:cursor-pointer"
                style={{ color: C.serenity }}
                onClick={() => {
                  setSelectedDate(todayDate);
                  // setCalendarMonth(initialDate);
                }}
              >
                Today
              </button>
            </div>
          </div>

          <div className="flex">
            {/* desktop calendar - 40% */}
            <div className="w-[40%] hidden lg:flex">
              <div className="w-full flex justify-center">
                <div>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    onSelect={(date) => date && setSelectedDate(date)}
                    captionLayout="dropdown"
                    className="w-full"
                    style={{ color: C.navy }}
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
                    style={{ color: C.serenity }}
                    onClick={() => setSelectedDate(todayDate)}
                  >
                    Go to Today
                  </button>
                </div>
              </div>
            </div>

            {/* recommended coping exercise section - 60% */}
            <div className="w-full lg:w-[60%] flex flex-col">
              <h5
                className="text-[clamp(1rem,3vw,1.5rem)] font-bold underline"
                style={{ color: C.navy }}
              >
                {format(selectedDate, 'dd MMMM yyyy')}
              </h5>

              {/* scroll */}
              <div className="mx-2 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
                {fetchingExcHistory && (
                  <p
                    className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
                    style={{ color: C.muted }}
                  >
                    Loading recommended exercises...
                  </p>
                )}

                {!fetchingExcHistory && excHistoryData.length === 0 && (
                  <p
                    className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
                    style={{ color: C.muted }}
                  >
                    No recommended exercises for this date.
                  </p>
                )}
                {!fetchingExcHistory &&
                  excHistoryData.length === 0 &&
                  isSameDay(selectedDate, todayDate) && (
                    <button
                      // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white text-[clamp(0.875rem,1.5vw,1rem)] rounded-xl px-5 py-2.5 transition-colors duration-200`}
                      className={buttonGradient}
                      onClick={() => router.push('/journal/new')}
                    >
                      New Entry
                    </button>
                  )}

                {/* exercise card */}
                {!fetchingExcHistory &&
                  excHistoryData.map((exercise) => {
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
                          style={{ color: C.navy }}
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
                                    <div
                                      onClick={() => {
                                        setSelectedExercise(exercise);
                                        setOpenDetail(true);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <Pill
                                        bgColor="#f1f3f8"
                                        borderColor="#dde1ea"
                                        textColor={C.faint}
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
                                    <div
                                      onClick={() => {
                                        setSelectedExercise(exercise);
                                        setOpenDetail(true);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <Pill
                                        bgColor="#f1f3f8"
                                        borderColor="#dde1ea"
                                        textColor={C.faint}
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
                        {exercise.uex_status === 'completed' ? (
                          <div className="flex items-center gap-1">
                            <p
                              className="text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
                              style={{ color: C.navy }}
                            >
                              {exercise.uex_rating}
                            </p>
                            <Star
                              size={18}
                              style={{
                                color: C.navy,
                              }}
                            />
                          </div>
                        ) : exercise.uex_status === 'incomplete' &&
                          exercise.uex_reason ? (
                          <p
                            className="text-[clamp(0.875rem,1.5vw,1rem)] mb-2"
                            style={{ color: C.navy }}
                          >
                            <b>Incomplete Reason</b>: {exercise.uex_reason}
                          </p>
                        ) : (
                          <></>
                        )}

                        {/* exercise description */}
                        <p
                          className="w-full mb-2 overflow-hidden text-justify text-ellipsis line-clamp-2 wrap-break-word text-[clamp(0.875rem,1.5vw,1rem)]"
                          style={{ color: C.navy }}
                        >
                          {exercise.exc_desc}
                        </p>

                        <div className="mt-1 flex gap-3">
                          {/* button to insights page */}
                          <button
                            // className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white text-[clamp(1rem,3vw,2rem)] rounded-xl px-5 py-2.5 transition-colors duration-200`}
                            className={buttonGradient}
                            onClick={() => {
                              setSelectedExercise(exercise);
                              setOpenDetail(true);
                            }}
                          >
                            View More
                          </button>

                          {/* button to insights page */}
                          <button
                            // className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white text-[clamp(1rem,3vw,2rem)] rounded-xl px-5 py-2.5 transition-colors duration-200`}
                            className={buttonGradient}
                            onClick={() => handleViewEntry(exercise.jrnl_id)}
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
        </div>
      </div>
      {selectedExercise && (
        <ExerciseDetailModal
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          name={selectedExercise.exc_name}
          moods={
            Array.isArray(selectedExercise.exc_mood)
              ? selectedExercise.exc_mood
              : [selectedExercise.exc_mood]
          }
          desc={selectedExercise.exc_desc}
          type={selectedExercise.exc_type}
          steps={selectedExercise.exc_steps}
        />
      )}
    </section>
  );
}
