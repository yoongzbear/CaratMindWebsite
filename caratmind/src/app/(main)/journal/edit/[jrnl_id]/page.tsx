'use client';
import {
  buttonGradientColor,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/utils/toast';
import { JournalDetail, StatusKey } from '@/app/types/journal';
import { format } from 'date-fns';

export default function EditEntryPage() {
  const router = useRouter();
  const { user, loading, accessToken } = useAuth();
  const { jrnl_id } = useParams<{ jrnl_id: string }>();
  const [entry, setEntry] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [fetchingJournal, setFetchingJournal] = useState(false);
  const [journal, setJournal] = useState<JournalDetail | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken || !jrnl_id) return;

    async function loadEntry() {
      setFetchingJournal(true);
      try {
        const res = await fetch(`/api/journal/${jrnl_id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await res.json();

        if (!res.ok) {
          toastError(data.error ?? 'Failed to load entry.');
          setJournal(null);
          return;
        }

        setJournal(data);
        setEntry(data.entryText);
      } catch {
        toastError('Something went wrong loading the entry.');
      } finally {
        setFetchingJournal(false);
      }
    }

    loadEntry();
  }, [jrnl_id, accessToken]);

  const originalText = journal?.entryText ?? '';
  const isDirty = entry !== originalText;

  // update entry
  async function updateEntry(status: StatusKey) {
    const content = entry.trim() || journal?.entryText;

    if (!content) {
      toastError('Entry text is required.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/journal/${jrnl_id}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ entry: content, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to save.');
        return;
      }
      toastSuccess(status === 'draft' ? 'Saved as draft.' : 'Entry submitted.');
      router.back();
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const handleSubmit = () => updateEntry('submitted');
  const handleSave = () => updateEntry('draft');

  const handleReset = () => {
    setEntry(originalText);

    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.selectionStart = originalText.length;
        el.selectionEnd = originalText.length;
      }
    });
  };

  const handleCancel = () => {
    // go back to previous page
    router.back();
  };

  if (loading || fetchingJournal) {
    return (
      <section className="px-8 py-6 text-center" style={{ color: C.faint }}>
        Loading…
      </section>
    );
  }

  if (!journal) {
    return (
      <section className="px-8 py-6 text-center" style={{ color: C.faint }}>
        Entry not found.
      </section>
    );
  }

  const isDraft = journal.jrnl_status === 'draft';

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
            {format(new Date(journal.jrnl_created_at), 'd MMMM yyyy, p')}
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
