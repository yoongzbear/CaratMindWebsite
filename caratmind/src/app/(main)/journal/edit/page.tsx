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
          <h1
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-0.5"
            style={{ color: C.navy }}
          >
            Edit Journal Entry
          </h1>

          <h5
            className="sm:text-[20px] md:text-[24px] underline mb-1"
            style={{ color: C.navy }}
          >
            Date
          </h5>

          <p
            className="sm:text-[14px] md:text-[16px] mt-0.5 mb-2"
            style={{ color: C.navy }}
          >
            Write out your thoughts and feelings with no limits. Feel free to
            write about your day or any experiences you faced!
          </p>
          <p
            className="sm:text-[11px] md:text-[13px] mt-0.5 mb-2"
            style={{ color: C.faint }}
          >
            Entry shall be analyzed using AI to identify your mood.
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
            className="w-full min-h-64 px-3 py-2.5 rounded-lg sm:text-[14px] md:text-[16px] bg-white box-border outline-none font-inherit"
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
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Cancel Edit'}
            </button>

            {/* reset button */}
            <button
              onClick={handleReset}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Reset'}
            </button>

            {/* submit button */}
            <button
              onClick={handleSubmit}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Submit'}
            </button>

            {/* save draft button */}
            <button
              onClick={handleSave}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonOutlined} sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Save as Draft'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
