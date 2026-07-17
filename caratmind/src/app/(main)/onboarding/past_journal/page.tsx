'use client';
import { C } from '@/app/styles/styles';
import { format } from 'date-fns';
import { DayPicker } from '@daypicker/react';
import Pill from '@/app/components/Pill';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { buttonGradient } from '@/app/styles/ui';

// sample data
const sampleJournal = [
  {
    jrnl_id: '1',
    jrnl_created_at: new Date().toISOString(),
    jrnl_status: 'submitted',
    jrnl_preview:
      "Had a pretty good day overall. Finished a project I've been stuck on for a while and it felt great to finally get it working.",
    mood_name: 'joy',
  },
  {
    jrnl_id: '2',
    jrnl_created_at: new Date().toISOString(),
    jrnl_status: 'draft',
    jrnl_preview:
      'I found a new album to listen to and it is by my favorite K-Pop artist, Vernon and his bandmate, The8. The album is so good!',
    mood_name: 'admiration',
  },
];

export default function PastEntryPreviewPage() {
  return (
    <section
      className="pt-4 sm:pt-6 pb-10"
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
            Past Journal Entry (Preview)
          </h1>

          <button className={buttonGradient} id="button-new-entry">
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
          id="past-journal"
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
                value={format(new Date().toISOString(), 'yyyy-MM-dd')}
                className="flex-1 rounded-lg border px-3 py-2.5 text-[clamp(0.9rem,3.5vw,1rem)] font-medium"
                style={{ color: C.navy, borderColor: '#eef2f9' }}
              />
              <button
                type="button"
                className="text-[clamp(0.75rem,2.5vw,0.875rem)] font-bold whitespace-nowrap hover:cursor-pointer"
                style={{ color: C.serenity }}
              >
                Today
              </button>
            </div>
          </div>

          {/* desktop calendar */}
          <div className="hidden lg:flex lg:w-[40%]">
            {/* calendar - 40% */}
            <div className="w-full" id="desktop-calendar">
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
                    selected={new Date()}
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
                    // onClick={() => setSelectedDate(initialDate)}
                  >
                    Go to Today
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* saved entries section - 60% */}
          <div className="w-full lg:w-[60%] flex flex-col" id="entry-list">
            <h3
              className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold underline"
              style={{ color: C.navy }}
            >
              {format(new Date().toISOString(), 'dd MMMM yyyy')}
            </h3>

            {/* scroll */}
            <div className="mt-3 flex-1 overflow-y-auto pr-2 max-h-[70vh]">
              {/* entry card */}
              {sampleJournal.map((entry) => (
                <div
                  key={entry.jrnl_id}
                  className="rounded-[10px] border mb-3.75 p-2.5"
                  style={{
                    backgroundColor: 'white',
                    boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                    border: '1px solid #eef2f9',
                  }}
                >
                  <div className="w-full flex gap-3 items-center">
                    <h5
                      className="text-[clamp(1rem,3vw,1.5rem)] font-semibold"
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
                        borderColor={getMoodStyle(entry.mood_name).borderColor}
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
                  <button className={buttonGradient} id="button-view-insights">
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
'