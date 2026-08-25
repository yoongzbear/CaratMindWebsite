'use client';

import { useAuth } from '@/context/AuthContext';
import { useRef, useState } from 'react';
import { toastError, toastSuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { StatusKey } from '@/types/journal';
import DetectMoodModal from '@/components/modal/DetectMoodModal';
import { gradientButton, greyButton, redButton } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';
import { createNewJournal } from '@/utils/api/journalApi';

export default function NewEntryPage() {
  const { theme } = useTheme();
  const { user, loading, accessToken } = useAuth();
  const [entry, setEntry] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  const handleReset = () => {
    setEntry('');
    textareaRef.current?.focus(); // make the text area active
  };

  async function saveEntry(status: StatusKey) {
    if (!entry.trim()) return;
    if (status === 'draft') {
      setSaving(true);
    } else {
      setSubmitting(true);
      setDetecting(true);
    }
    try {
      if (accessToken) {
        const data = await createNewJournal(entry, status, accessToken);

        toastSuccess(
          status === 'draft' ? 'Saved as draft.' : 'Entry submitted.',
        );
        // navigate to view journal entry
        router.push(`/journal/insight/${data.jrnl_id}`);
      }
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
      if (status === 'draft') {
        setSaving(false);
      } else {
        setSubmitting(false);
        setDetecting(false);
      }
    }
  }

  const handleSubmit = () => saveEntry('submitted');
  const handleSave = () => saveEntry('draft');

  return (
    <section
      className="min-h-[calc(100vh-200px)] pt-4 sm:pt-6 pb-2 lg:pb-12"
      style={{
        background: 'var(--bg)',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto" id="new-journal">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            New Journal Entry
          </h1>

          <h5
            className="text-[clamp(0.875rem,1.5vw,1rem)] font-medium mt-0.5 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Write out your thoughts and feelings with no limits. Feel free to
            write about your day or any experiences you faced!
          </h5>
          <p
            className="text-[clamp(0.875rem,1.5vw,1rem)] mt-0.5 mb-2 italic"
            style={{ color: 'var(--muted)' }}
          >
            Entry shall be analyzed using AI to detect your mood.
          </p>
        </header>

        <div
          className="rounded-[10px] border mb-3 p-3 pb-6"
          style={{
            backgroundColor: 'var(--bg-div)',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <textarea
            className="w-full min-h-64 px-3 py-2.5 rounded-lg text-[clamp(0.875rem,1.5vw,1rem)] box-border outline-none font-inherit"
            value={entry}
            id="entry-text"
            ref={textareaRef}
            onChange={(e) => setEntry(e.target.value)}
            style={{
              border: '1px solid var(--border)',
              fontFamily: 'inherit',
              color: 'var(--text)',
              backgroundColor: 'var(--bg-div)',
            }}
          ></textarea>

          <div
            className="w-full sm:w-[40%] md:w-[60%] mx-auto grid grid-cols-2 gap-2
                sm:flex sm:items-stretch sm:justify-between mt-4"
          >
            {/* reset button */}
            <button
              onClick={handleReset}
              {...redButton(theme)}
              id="button-reset"
            >
              Reset
            </button>

            {/* submit button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              {...gradientButton(theme)}
              id="button-submit"
            >
              {submitting ? 'Submitting...' : 'Submit Entry'}
            </button>

            {/* save draft button */}
            <button
              onClick={handleSave}
              disabled={saving}
              {...greyButton(theme)}
              id="button-draft"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
          </div>
        </div>
      </div>
      <DetectMoodModal open={detecting} onClose={() => setDetecting(false)} />
    </section>
  );
}
