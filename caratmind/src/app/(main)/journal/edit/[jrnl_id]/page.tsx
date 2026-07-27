'use client';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toastError, toastSuccess } from '@/utils/toast';
import { JournalDetail, StatusKey } from '@/types/journal';
import { format } from 'date-fns';
import DetectMoodModal from '@/components/modal/DetectMoodModal';
import { gradientButton, greyButton, redButton } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';
import { editJournal } from '@/utils/api/journalApi';

export default function EditEntryPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, loading, accessToken } = useAuth();
  const { jrnl_id } = useParams<{ jrnl_id: string }>();
  const [entry, setEntry] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [fetchingJournal, setFetchingJournal] = useState(false);
  const [journal, setJournal] = useState<JournalDetail | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);

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

    if (status === 'draft') {
      setSaving(true);
    } else {
      setSubmitting(true);
      setDetecting(true);
    }

    try {
      if (accessToken) {
        const data = await editJournal(jrnl_id, content, status, accessToken);

        toastSuccess(
          status === 'draft' ? 'Saved as draft.' : 'Entry submitted.',
        );
        // route to journal insight page
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
      <section
        className="px-8 py-6 text-center"
        style={{ color: 'var(--muted)', backgroundColor: 'var(--bg-div)' }}
      >
        Loading...
      </section>
    );
  }

  if (!journal) {
    return (
      <section
        className="px-8 py-6 text-center"
        style={{ color: 'var(--muted)', backgroundColor: 'var(--bg-div)' }}
      >
        Entry not found.
      </section>
    );
  }

  return (
    <section
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-2 lg:pb-12"
      style={{
        background: 'var(--bg)',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto" id="edit-journal">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Edit Journal Entry
          </h1>

          <h5
            className="text-[clamp(0.875rem,1.5vw,1rem)] font-medium mt-0.5 mb-2"
            style={{ color: 'var(--text)' }}
          >
            {format(new Date(journal.jrnl_created_at), 'dd MMMM yyyy, p')}
          </h5>

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
          className="rounded-[10px] border mb-3.75 p-4"
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
            {/* cancel button */}
            <button
              onClick={handleCancel}
              {...redButton(theme)}
              id="button-cancel"
            >
              Cancel Edit
            </button>

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
              {submitting ? 'Submitting…' : 'Submit Entry'}
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
