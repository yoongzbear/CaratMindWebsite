'use client';
import { C } from '@/app/styles/styles';
import { Journal } from '@/app/types/journal';
import { useAuth } from '@/context/AuthContext';
import { toastError } from '@/utils/toast';
import { format, isValid, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { DayPicker } from '@daypicker/react';
import Pill from '@/app/components/Pill';
import { useRouter, useSearchParams } from 'next/navigation';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { buttonGradient } from '@/app/styles/ui';

export default function PastEntryPage() {
  const { user, loading, accessToken } = useAuth();
  const [entries, setEntries] = useState<Journal[]>([]);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // read ?date=YYYY-MM-DD from URL
  const initialDate = (() => {
    const param = searchParams.get('date');
    if (!param) return new Date();
    const parsed = parseISO(param);
    return isValid(parsed) ? parsed : new Date();
  })();

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarMonth, setCalendarMonth] = useState<Date>(initialDate); // to change month

  useEffect(() => {
    if (!accessToken) return;

    async function loadEntries() {
      setFetching(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`/api/journal/list?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(data.error ?? 'Failed to load entries.');
          setEntries([]);
          return;
        }
        setEntries(data.entries ?? []);
      } catch {
        toastError('Something went wrong loading entries.');
      } finally {
        setFetching(false);
      }
    }

    loadEntries();
  }, [selectedDate, accessToken]);

  if (loading) {
    return (
      <section
        className="text-[clamp(1rem,3vw,1.5rem)] mt-0 mb-2 px-8 py-6 text-center"
        style={{ color: C.muted }}
      >
        Loading...
      </section>
    );
  }

  const handleViewMore = (jrnl_id: string) => {
    router.push(`/mood/insight/${jrnl_id}`);
  };

  return (
    <section
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-10"
      style={{
        background: C.bgPage,
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3 flex items-center justify-between">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Past Journal Entry
          </h1>

          <button
            // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
            className={`${buttonGradient}`}
            onClick={() => router.push('/journal/new')}
          >
            New Entry
          </button>
        </header>

        <div
          className="rounded-[10px] border mb-3.75 p-4 flex flex-col lg:flex-row gap-3 lg:gap-0"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
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
                  setSelectedDate(initialDate);
                  setCalendarMonth(initialDate);
                }}
              >
                Today
              </button>
            </div>
          </div>

          {/* desktop calendar */}
          <div className="hidden lg:flex lg:w-[40%]">
            {/* calendar - 40% */}
            <div className="w-full">
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
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
                        'w-11 text-center text-[clamp(0.875rem,1.5vw,1rem)] font-bold',
                      day_button:
                        'w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#eef2f9] transition-colors hover:cursor-pointer',
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
                    className="text-[clamp(0.7rem,1.5vw,0.85rem)] font-semibold hover:cursor-pointer"
                    style={{ color: C.serenity }}
                    onClick={() => setSelectedDate(initialDate)}
                  >
                    Go to Today
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* saved entries section - 60% */}
          <div className="w-full lg:w-[60%] flex flex-col">
            <h3
              className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold underline"
              style={{ color: C.navy }}
            >
              {format(selectedDate, 'dd MMMM yyyy')}
            </h3>

            {/* scroll */}
            <div className="mt-3 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
              {fetching && (
                <p
                  className="text-[clamp(1rem,3vw,1.5rem)]"
                  style={{ color: C.muted }}
                >
                  Loading entries...
                </p>
              )}

              {!fetching && entries.length === 0 && (
                <p
                  className="text-[clamp(1rem,3vw,1.5rem)]"
                  style={{ color: C.muted }}
                >
                  No entries for this date.
                </p>
              )}

              {/* entry card */}
              {!fetching &&
                entries.map((entry) => (
                  <div
                    key={entry.jrnl_id}
                    className="rounded-[10px] border mb-3.75 p-2.5"
                    style={{
                      backgroundColor: 'white',
                      boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                      border: '1px solid #eef2f9',
                    }}
                  >
                    <div className="w-full flex gap-3">
                      <h5
                        className="text-[clamp(1rem,3vw,1.5rem)] font-medium"
                        style={{ color: C.navy }}
                      >
                        {format(new Date(entry.jrnl_created_at), 'p')}
                      </h5>
                      <Pill
                        bgColor={
                          entry.jrnl_status === 'draft' ? '#fff5f5' : '#f1f8f4'
                        }
                        textColor={
                          entry.jrnl_status === 'draft' ? '#c62828' : '#2e7d32'
                        }
                        borderColor={
                          entry.jrnl_status === 'draft' ? '#f3caca' : '#c8e6c9'
                        }
                      >
                        {entry.jrnl_status === 'draft' ? 'Draft' : 'Submitted'}
                      </Pill>
                    </div>
                    <p
                      className="m-0 text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.65]"
                      style={{ color: C.navy }}
                    >
                      {entry.jrnl_preview
                        ? entry.jrnl_preview.length >= 150
                          ? `${entry.jrnl_preview}...`
                          : entry.jrnl_preview
                        : 'No preview available.'}
                    </p>

                    {/* mood */}
                    {entry.mood_name ? (
                      <div className="my-1.5 leading-[1.65]">
                        <Pill
                          bgColor={getMoodStyle(entry.mood_name).bgColor}
                          borderColor={
                            getMoodStyle(entry.mood_name).borderColor
                          }
                          textColor={getMoodStyle(entry.mood_name).textColor}
                        >
                          {getMoodStyle(entry.mood_name).emoji}{' '}
                          {toTitleCase(entry.mood_name)}
                        </Pill>
                      </div>
                    ) : (
                      <p
                        className="m-0 text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.65]"
                        style={{ color: C.navy }}
                      >
                        Mood: -
                      </p>
                    )}

                    {/* button to insights page */}
                    <button
                      // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
                      className={`${buttonGradient}`}
                      onClick={() => handleViewMore(entry.jrnl_id)}
                    >
                      View More
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
