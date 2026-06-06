'use client';
import {
  buttonGradientColor,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { useRef, useState } from 'react';

export default function EditEntryPage() {
  const { user, loading } = useAuth();
  const [entry, setEntry] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleReset = () => {
    setEntry('');
    textareaRef.current?.focus(); // make the text area active
  };

  const handleSubmit = () => {
    // submit into database - determine mood etc
  };

  const handleSave = () => {
    // save as draft - save into db only
  };

  const handleCancel = () => {
    // go back to previous page
  };

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[90%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0' }}>Edit Journal Entry</h1>

          <h3 className="underline" style={styles.header3}>
            Date
          </h3>

          <p style={{ ...styles.subtitle, fontSize: '14px' }}>
            Write out your thoughts and feelings with no limits. Feel free to
            write about your day or any experiences you faced!
          </p>
        </header>

        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <textarea
            className="w-full min-h-64 px-3 py-2.5 rounded-lg text-[14px] bg-white box-border outline-none font-inherit"
            value={entry}
            ref={textareaRef}
            onChange={(e) => setEntry(e.target.value)}
            style={{
              border: `1px solid ${C.border}`,
              fontFamily: 'inherit',
              color: C.navy,
            }}
          ></textarea>

          <div className="flex items-center justify-center gap-30 mt-4">
            {/* cancel button */}
            <button
              onClick={handleCancel}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Cancel Edit'}
            </button>

            {/* reset button */}
            <button
              onClick={handleReset}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Reset'}
            </button>

            {/* submit button */}
            <button
              onClick={handleSubmit}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Submit'}
            </button>

            {/* save draft button */}
            <button
              onClick={handleSave}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonOutlined} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Save as Draft'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
