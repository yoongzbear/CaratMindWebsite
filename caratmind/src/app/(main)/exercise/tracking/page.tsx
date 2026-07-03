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
import {
  Exercise,
  UserExercise,
  UserExerciseDetail,
} from '@/app/types/exercise';
import { useAuth } from '@/context/AuthContext';
import { DayPicker } from '@daypicker/react';
import { format } from 'date-fns';
import { Eye, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { toTitleCase } from '@/app/utils/format';
import { toastError } from '@/utils/toast';

export default function ExerciseTrackingPage() {
  const { user, loading, accessToken } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const router = useRouter();

  const [excHistoryData, setExcHistoryData] = useState<UserExerciseDetail[]>(
    [],
  );
  const [fetchingExcHistory, setFetchingExcHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date()); // to change month
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  useEffect(() => {
    if (!accessToken) return;

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

    loadExcHistory();
  }, [selectedDate, accessToken]);

  const redirectInsight = () => {};

  const handleCancel = () => {};

  const handleViewEntry = (jrnl_id: string) => {
    router.push(`/mood/insight/${jrnl_id}`);
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
          <h1 style={{ ...styles.header1, margin: '0' }}>
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
          <h1 style={styles.header1}>Today&apos;s Exercise</h1>
          <h3 style={{ ...styles.header3, color: C.muted, fontWeight: 500 }}>
            Date
          </h3>

          {/* exercise cards */}
          <div
            className="rounded-[10px] border mb-3.75 p-2.5 mt-2"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              border: '1px solid #eef2f9',
            }}
          >
            <h1 style={styles.header1}>Exercise 1</h1>
            <div className="flex gap-3 mb-2">
              {/* mood */}
              <Pill bgColor="#edf9f0" borderColor="#cdebd5" textColor="#2e7d32">
                Happy
              </Pill>
              {/* exercise type */}
              <Pill>Breathing</Pill>
            </div>
            {/* desc - max 3 lines*/}
            <p style={styles.pText}>
              Proin in odio sodales, sagittis tortor a, mollis eros. Vestibulum
              vitae bibendum sapien. In at euismod diam. Vivamus sed tellus sit
              amet nibh condimentum ornare. Nunc non purus lectus. Vestibulum
              nec cursus turpis, in pretium diam. Aenean vitae placerat ni...
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setOpenDetail(true)}
                className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'View More'}
              </button>

              <button
                // onClick={() => setopenDetail(true)}
                onClick={redirectInsight}
                className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'View Insights'}
              </button>

              <button
                onClick={handleCancel}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGreen} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'Completed It'}
              </button>

              <button
                onClick={handleCancel}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'Did not complete'}
              </button>
            </div>

            {/* <ExerciseDetailModal
              open={openDetail}
              onClose={() => setopenDetail(false)}
              name="Exercise 1"
              mood="Happy"
              type="Breathing"
              steps="Proin in odio sodales, sagittis tortor a, mollis eros. Vestibulum
              vitae bibendum sapien. In at euismod diam. Vivamus sed tellus sit
              amet nibh condimentum ornare. Nunc non purus lectus. Vestibulum
              nec cursus turpis, in pretium diam. Aenean vitae placerat ni..."
            /> */}
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
          <h1 style={styles.header1}>Recommended Exercises History</h1>

          <div className="flex">
            {/* calendar - 40% */}
            <div className="w-[40%]">
              <h3
                className="sm:text-[24px] md:text-[28px] font-semibold"
                style={{ color: C.navy }}
              >
                Calendar
              </h3>
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
                    onClick={() => setCalendarMonth(new Date())}
                  >
                    Go to Today
                  </button>
                </div>
              </div>
            </div>

            {/* recommended coping exercise section - 60% */}
            <div className="w-[60%] flex flex-col">
              <h3
                className="sm:text-[24px] md:text-[28px] font-semibold"
                style={{ color: C.navy }}
              >
                {format(selectedDate, 'dd MMMM yyyy')}
              </h3>

              {/* scroll */}
              <div className="mt-3 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
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
                        <h3
                          className="sm:text-[24px] md:text-[28px] font-bold mt-0 mb-0.5"
                          style={{ color: C.navy }}
                        >
                          {exercise.exc_name}
                        </h3>
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

                          <Pill>{toTitleCase(exercise.exc_type)}</Pill>
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
                          {exercise.exc_desc}
                        </p>

                        {/* button to insights page */}
                        <button
                          className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                          onClick={() => handleViewEntry(exercise.jrnl_id)}
                        >
                          View Entry
                        </button>
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
