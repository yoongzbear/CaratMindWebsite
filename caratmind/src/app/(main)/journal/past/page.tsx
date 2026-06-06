'use client';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';

export default function PastEntryPage() {
  const { user, loading } = useAuth();
  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[90%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0' }}>Past Journal Entry</h1>
        </header>

        <div
          className="rounded-[10px] border mb-3.75 p-2.5 flex"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          {/* calendar - 30% */}
          <div className="w-[30%]">
            <h1 style={styles.header1}>Calendar</h1>
          </div>

          {/* saved entries section - 70% */}
          <div className="w-[70%]">
            <h1 style={styles.header1}>Saved Entries: </h1>

            {/* example card */}
            <div
              className="rounded-[10px] border mb-3.75 p-2.5"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
            >
              <h3 style={{ ...styles.header3, fontWeight: 500 }}>Date</h3>
              <p
                className="m-0 text-[13px] leading-[1.65]"
                style={{
                  color: C.navy,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus eget lectus lectus. Vestibulum id nisi odio. Maecenas
                nisi lectus, tempor in augue quis, dapibus viverra ligula. Nunc
                vitae varius velit. Maecenas elementum, arcu quis iaculis
                sollicitudin, ma...
              </p>
              <p
                className="m-0 text-[13px] leading-[1.65]"
                style={{
                  color: C.navy,
                }}
              >
                Mood: Happy
              </p>
              {/* submit button */}
              <button
                // onClick={handleSave}
                // disabled={saving}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'View More'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
