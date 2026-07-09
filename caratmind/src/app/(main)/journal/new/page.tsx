'use client';

import {
  buttonGradientColor,
  buttonOutlined,
  // buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { useRef, useState } from 'react';
import { toastError, toastSuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { StatusKey } from '@/app/types/journal';
import DetectMoodModal from '@/app/components/modal/DetectMoodModal';
import { buttonGradient, buttonGrey, buttonRed } from '@/app/styles/ui';

export default function NewEntryPage() {
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
      const res = await fetch('/api/journal/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ entry, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to save.');
        return;
      }
      toastSuccess(status === 'draft' ? 'Saved as draft.' : 'Entry submitted.');
      // navigate to view journal entry
      router.push(`/mood/insight/${data.jrnl_id}`);
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
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-2 lg:pb-12"
      style={{
        background: C.bgPage,
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            New Journal Entry
          </h1>

          <h5
            className="text-[clamp(0.875rem,1.5vw,1rem)] font-medium mt-0.5 mb-2"
            style={{ color: C.navy }}
          >
            Write out your thoughts and feelings with no limits. Feel free to
            write about your day or any experiences you faced!
          </h5>
          <p
            className="text-[clamp(0.875rem,1.5vw,1rem)] mt-0.5 mb-2"
            style={{ color: C.muted }}
          >
            Entry shall be analyzed using AI to identify your mood.
          </p>
        </header>

        <div
          className="rounded-[10px] border mb-3 p-3 pb-6"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <textarea
            className="w-full min-h-64 px-3 py-2.5 rounded-lg text-[clamp(0.875rem,1.5vw,1rem)] bg-white box-border outline-none font-inherit"
            value={entry}
            ref={textareaRef}
            onChange={(e) => setEntry(e.target.value)}
            style={{
              border: `1px solid ${C.border}`,
              fontFamily: 'inherit',
              color: C.navy,
            }}
          ></textarea>

          <div className="w-full sm:w-[40%] md:w-[60%] mx-auto flex items-stretch justify-between mt-4">
            {/* reset button */}
            <button onClick={handleReset} className={`${buttonRed}`}>
              {'Reset'}
            </button>

            {/* submit button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`${buttonGradient}`}
            >
              {submitting ? 'Submitting...' : 'Submit Entry'}
            </button>

            {/* save draft button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`${buttonGrey}`}
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
