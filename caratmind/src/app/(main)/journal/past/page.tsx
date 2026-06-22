'use client';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { Journal } from '@/app/types/journal';
import { useAuth } from '@/context/AuthContext';
import { toastError } from '@/utils/toast';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { DayPicker } from '@daypicker/react';
import Pill from '@/app/components/Pill';
import { useRouter } from 'next/navigation';

export default function PastEntryPage() {
  const { user, loading, accessToken } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<Journal[]>([]);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

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
      <section className="px-8 py-6 text-center" style={{ color: C.faint }}>
        Loading…
      </section>
    );
  }

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[90%] mx-auto">
        <header className="mb-3 flex items-center justify-between">
          <h1
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Past Journal Entry
          </h1>

          <button
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            onClick={() => router.push('/journal/new')}
          >
            New Entry
          </button>
        </header>

        <div
          className="rounded-[10px] border mb-3.75 p-2.5 flex"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          {/* calendar - 40% */}
          <div className="w-[40%]">
            <h3
              className="sm:text-[24px] md:text-[28px] font-semibold"
              style={{ color: C.navy }}
            >
              Calendar
            </h3>
            <div className="w-[90%] mx-auto">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                style={{ color: C.navy }}
                classNames={{
                  root: 'w-full',
                  months: 'w-full',
                  month: 'w-full',
                  day_button:
                    'w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#eef2f9] transition-colors',
                  today: 'font-semibold text-[#92A8D1]',
                  selected: 'bg-[#92A8D1] text-white rounded-full',
                  month_caption: 'flex items-center justify-between px-2 mb-4',
                  caption_label: 'text-base font-semibold text-center flex-1',
                  nav: 'flex items-center gap-2',
                  button_previous:
                    'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center',
                  button_next:
                    'h-8 w-8 rounded-md hover:bg-[#eef2f9] flex items-center justify-center',
                }}
              />
            </div>
          </div>

          {/* saved entries section - 60% */}
          <div className="w-[60%] flex flex-col">
            <h3
              className="sm:text-[24px] md:text-[28px] font-semibold"
              style={{ color: C.navy }}
            >
              Saved Entries: {format(selectedDate, 'd MMMM yyyy')}
            </h3>

            {/* scroll */}
            <div className="mt-3 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
              {fetching && <p style={{ color: C.faint }}>Loading entries…</p>}

              {!fetching && entries.length === 0 && (
                <p style={{ color: C.faint }}>No entries for this date.</p>
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
                    <h5
                      className="sm:text-[20px] md:text-[24px] font-medium"
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
                    <p
                      className="m-0 sm:text-[14px] md:text-[16px] leading-[1.65]"
                      style={{ color: C.navy }}
                    >
                      {entry.jrnl_preview
                        ? entry.jrnl_preview.length >= 150
                          ? `${entry.jrnl_preview}…`
                          : entry.jrnl_preview
                        : 'No preview available.'}
                    </p>

                    {/* mood */}
                    <p
                      className="m-0 sm:text-[14px] md:text-[16px] leading-[1.65]"
                      style={{ color: C.navy }}
                    >
                      {entry.mood_id ? `Mood: ${entry.mood_id}` : 'Mood: -'}
                    </p>

                    {/* button to insights page */}
                    <button
                      className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
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
