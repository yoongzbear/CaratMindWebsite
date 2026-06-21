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

export default function PastEntryPage() {
  const { user, loading, accessToken } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<Journal[]>([]);
  const [fetching, setFetching] = useState(false);

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
        <header className="mb-3">
          <h1
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Past Journal Entry
          </h1>
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
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              selectable
              dateClick={(info) => {
                setSelectedDate(info.date);
              }}
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: '',
              }}
              dayMaxEventRows={2}
            />
          </div>

          {/* saved entries section - 60% */}
          <div className="w-[60%]">
            <h3
              className="sm:text-[24px] md:text-[28px] font-semibold"
              style={{ color: C.navy }}
            >
              Saved Entries: {format(selectedDate, 'PPP')}
            </h3>

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
                    {format(new Date(entry.jrnl_created_at), 'p')} —{' '}
                    {entry.jrnl_status === 'draft' ? 'Draft' : 'Submitted'}
                  </h5>
                  <button
                    className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                  >
                    View More
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
