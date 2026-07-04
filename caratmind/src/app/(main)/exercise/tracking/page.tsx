'use client';
import ExerciseDetailModal from '@/app/components/modal/ExerciseModal';
import Pill from '@/app/components/Pill';
import {
  buttonGradientColor,
  buttonGreen,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { Exercise, UserExercise } from '@/app/types/exercise';
import { useAuth } from '@/context/AuthContext';
import { DayPicker } from '@daypicker/react';
import { format } from 'date-fns';
import { Eye, Star } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { toTitleCase } from '@/app/utils/format';
import { toastError, toastSuccess } from '@/utils/toast';
import RatingModal from '@/app/components/modal/RatingModal';
import ReasonModal from '@/app/components/modal/ReasonModal';

export default function ExerciseTrackingPage() {
  const { user, loading, accessToken } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const router = useRouter();

  const todayDate = useMemo(() => new Date(), []);
  const [todayExercise, setTodayExercise] = useState<UserExercise[]>([]);
  const [fetchingTodayExc, setFetchingTodayExc] = useState(false);

  const [selectedUserExc, setSelectedUserExc] = useState<UserExercise | null>(
    null,
  );
  const [openRating, setOpenRating] = useState(false);
  const [openReason, setOpenReason] = useState(false);

  const [excHistoryData, setExcHistoryData] = useState<UserExercise[]>([]);
  const [fetchingExcHistory, setFetchingExcHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(todayDate);
  const [calendarMonth, setCalendarMonth] = useState<Date>(todayDate); // to change month
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  useEffect(() => {
    if (!accessToken) return;

    async function loadTodayExc() {
      setFetchingTodayExc(true);
      try {
        // const dateStr = format(todayDate, 'yyyy-MM-dd');
        const dateStr = '2026-07-01';
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
    }

    async function loadExcHistory() {
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
        toastError(
          'Something went wrong loading recommended coping exercises.',
        );
      } finally {
        setFetchingExcHistory(false);
      }
    }

    loadTodayExc();
    loadExcHistory();
  }, [selectedDate, accessToken, todayDate]);

  const handleCancel = () => {};

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
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to save rating.');
        return;
      }
      toastSuccess('Saved coping exercise rating.');
      // update exercises
      setTodayExercise((prev) =>
        prev.map((e) => (e.uex_id === uex_id ? { ...e, ...data } : e)),
      );
      setExcHistoryData((prev) =>
        prev.map((e) => (e.uex_id === uex_id ? { ...e, ...data } : e)),
      );
      setOpenRating(false);
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
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
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to save incompletion reason.');
        return;
      }
      toastSuccess('Saved coping exercise incompletion reason.');
      // update exercises
      setTodayExercise((prev) =>
        prev.map((e) => (e.uex_id === uex_id ? { ...e, ...data } : e)),
      );
      setExcHistoryData((prev) =>
        prev.map((e) => (e.uex_id === uex_id ? { ...e, ...data } : e)),
      );
      setOpenReason(false);
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
    }
  };

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
          <div className="flex flex-col items-center px-3">
            {/* mood icon */}
            <div
              className={`relative mb-2 z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300`}
            >
              <Eye size={16} />
            </div>
            <p style={styles.pText}>XX Days</p>
          </div>
          <p
            style={{
              ...styles.pText,
            }}
          >
            You have not performed a coping exercise today. Complete one to
            continue your streak!
          </p>
        </div>

        {/* today's exercise */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3
            className="sm:text-[24px] md:text-[28px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Today&apos;s Exercise
          </h3>
          <h5
            className="sm:text-[20px] md:text-[24px]"
            style={{ color: C.muted }}
          >
            {format(todayDate, 'dd MMMM yyyy')}
          </h5>

          {/* exercise cards */}
          <div className="w-full flex flex-col mb-2">
            {/* scroll */}
            <div className="mt-2 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
              {fetchingTodayExc && (
                <p style={{ color: C.faint }}>
                  Loading today&apos;s recommended coping exercises...
                </p>
              )}

              {!fetchingTodayExc && todayExercise.length === 0 && (
                <p style={{ color: C.faint }}>
                  No recommended coping exercises for today.
                </p>
              )}

              {/* exercise card */}
              {!fetchingTodayExc &&
                todayExercise.map((exercise) => {
                  const moods = Array.isArray(exercise.exercise.exc_mood)
                    ? exercise.exercise.exc_mood
                    : [exercise.exercise.exc_mood];
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
                      <h5
                        className="sm:text-[20px] md:text-[24px] font-semibold mt-0 mb-0.5"
                        style={{ color: C.navy }}
                      >
                        {exercise.exc_name}
                      </h5>
                      <div className="flex gap-3 mb-2">
                        {/* exercise mood and type pills */}
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
                              setSelectedExercise(exercise.exercise);
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

                        <Pill>{toTitleCase(exercise.exercise.exc_type)}</Pill>
                      </div>
                      <p
                        className="w-full mb-2 overflow-hidden text-justify text-ellipsis line-clamp-2 wrap-break-word sm:text-[14px] md:text-[16px]"
                        style={{ color: C.navy }}
                      >
                        {exercise.exercise.exc_desc}
                      </p>

                      <div className="flex w-full gap-3">
                        <button
                          onClick={() => {
                            setSelectedExercise(exercise.exercise);
                            setOpenDetail(true);
                          }}
                          className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                        >
                          {'View More'}
                        </button>

                        <button
                          // onClick={() => setopenDetail(true)}
                          onClick={() => handleViewEntry(exercise.jrnl_id)}
                          className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                        >
                          {'View Insights'}
                        </button>

                        <button
                          onClick={() => {
                            setOpenRating(true);
                            setSelectedUserExc(exercise);
                          }}
                          className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGreen} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                        >
                          {'Completed'}
                        </button>

                        <button
                          onClick={handleCancel}
                          className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                        >
                          {'Did Not Complete'}
                        </button>
                      </div>
                      <RatingModal
                        open={openRating}
                        onClose={() => setOpenRating(false)}
                        onSubmit={handleRatingSubmit}
                      />
                      <ReasonModal
                        open={openRating}
                        onClose={() => setOpenRating(false)}
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
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3
            className="sm:text-[24px] md:text-[28px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Recommended Exercises History
          </h3>

          <div className="flex">
            {/* calendar - 40% */}
            <div className="w-[40%]">
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
                        'w-11 text-center sm:text-[14px] md:text-[16px] font-bold',
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
                    className="sm:text-[12px] md:text-[14px] font-semibold hover:cursor-pointer"
                    style={{ color: C.serenity }}
                    onClick={() => setSelectedDate(todayDate)}
                  >
                    Go to Today
                  </button>
                </div>
              </div>
            </div>

            {/* recommended coping exercise section - 60% */}
            <div className="w-[60%] flex flex-col">
              <h5
                className="sm:text-[20px] md:text-[24px] font-bold underline"
                style={{ color: C.navy }}
              >
                {format(selectedDate, 'dd MMMM yyyy')}
              </h5>

              {/* scroll */}
              <div className="mx-2 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
                {fetchingExcHistory && (
                  <p style={{ color: C.faint }}>
                    Loading recommended exercises...
                  </p>
                )}

                {!fetchingExcHistory && excHistoryData.length === 0 && (
                  <p style={{ color: C.faint }}>
                    No recommended exercises for this date.
                  </p>
                )}

                {/* exercise card */}
                {!fetchingExcHistory &&
                  excHistoryData.map((exercise) => {
                    const moods = Array.isArray(exercise.exercise.exc_mood)
                      ? exercise.exercise.exc_mood
                      : [exercise.exercise.exc_mood];
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
                          className="sm:text-[20px] md:text-[24px] font-semibold mt-0 mb-0.5"
                          style={{ color: C.navy }}
                        >
                          {exercise.exc_name}
                        </h5>
                        <div className="flex gap-3 mb-2">
                          {/* exercise mood and type pills */}
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
                                setSelectedExercise(exercise.exercise);
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

                          <Pill>{toTitleCase(exercise.exercise.exc_type)}</Pill>
                        </div>

                        {/* rating (completed) / reason (incomplete) */}
                        {exercise.uex_status === 'completed' ? (
                          <p
                            className="sm:text-[14px] md:text-[16px]"
                            style={{ color: C.navy }}
                          >
                            {exercise.uex_rating} <Star size={18} />
                          </p>
                        ) : (
                          <p
                            className="sm:text-[14px] md:text-[16px]"
                            style={{ color: C.navy }}
                          >
                            Incomplete Reason: {exercise.uex_reason}
                          </p>
                        )}
                        {/* exercise description */}
                        <p
                          className="w-full mb-2 overflow-hidden text-justify text-ellipsis line-clamp-2 wrap-break-word sm:text-[14px] md:text-[16px]"
                          style={{ color: C.navy }}
                        >
                          {exercise.exercise.exc_desc}
                        </p>

                        <div className="mt-1 flex gap-3">
                          {/* button to insights page */}
                          <button
                            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                            onClick={() => {
                              setSelectedExercise(exercise.exercise);
                              setOpenDetail(true);
                            }}
                          >
                            View More
                          </button>

                          {/* button to insights page */}
                          <button
                            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                            onClick={() => handleViewEntry(exercise.jrnl_id)}
                          >
                            View Entry
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
