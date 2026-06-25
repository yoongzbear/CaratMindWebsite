'use client';
import EntryDetailModal, {
  DeleteEntryModal,
} from '@/app/components/modal/EntryModal';
import Pill from '@/app/components/Pill';
import {
  buttonGradientColor,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { JournalDetail, StatusKey } from '@/app/types/journal';
import { Mood } from '@/app/types/mood';
import { toTitleCase } from '@/app/utils/format';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function MoodInsightPage() {
  const { user, loading, accessToken } = useAuth();
  const { jrnl_id } = useParams<{ jrnl_id: string }>();
  const [entry, setEntry] = useState('');

  const router = useRouter();
  const [journal, setJournal] = useState<JournalDetail | null>(null);
  const [fetchingJournal, setFetchingJournal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [openDetail, setopenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingMoodData, setFetchingMoodData] = useState(false);
  const [moodData, setMoodData] = useState<Mood | null>(null);
  const [fetchingExercise, setFetchingExercise] = useState(false);

  useEffect(() => {
    if (!accessToken || !jrnl_id || jrnl_id === 'undefined') return;

    async function loadEntry() {
      setFetchingJournal(true);
      try {
        const res = await fetch(`/api/journal/${jrnl_id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        console.log('Response:', data);
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

    async function loadMood() {
      setFetchingMoodData(true);
      try {
        const res = await fetch(`/api/mood/${jrnl_id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(data.error ?? 'Failed to load mood.');
          setMoodData(null);
          return;
        }
        setMoodData(data);
      } catch {
        toastError('Something went wrong loading the mood.');
      } finally {
        setFetchingMoodData(false);
      }
    }

    // TODO: loadExercise

    loadEntry();
    loadMood();
  }, [jrnl_id, accessToken]);

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
      setJournal((prev) =>
        prev
          ? {
              ...prev,
              jrnl_status: status,
              jrnl_preview: content.slice(0, 150),
            }
          : prev,
      );
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const handleSubmit = () => updateEntry('submitted');
  const handleSave = () => updateEntry('draft');

  const handleEdit = (jrnl_id: string) => {
    router.push(`/journal/edit/${jrnl_id}`);
  };

  const performExercise = () => {
    // save as draft - save into db only
  };

  const moodDashboard = () => {
    // save as draft - save into db only
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
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            Mood Insights
          </h1>
        </header>

        {/* journal summary */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3
            className="sm:text-[22px] md:text-[26px] font-semibold"
            style={{ color: C.navy }}
          >
            {format(new Date(journal.jrnl_created_at), 'd MMMM yyyy, p')}
          </h3>

          <div className="mt-0 mb-2">
            <Pill
              bgColor={journal.jrnl_status === 'draft' ? '#fff5f5' : '#f1f8f4'}
              textColor={
                journal.jrnl_status === 'draft' ? '#c62828' : '#2e7d32'
              }
              borderColor={
                journal.jrnl_status === 'draft' ? '#f3caca' : '#c8e6c9'
              }
            >
              {journal.jrnl_status === 'draft' ? 'Draft' : 'Submitted'}
            </Pill>
          </div>

          <textarea
            disabled
            className="w-full h-24 px-3 py-2.5 border-none resize-none rounded-lg sm:text-[14px] md:text-[16px] bg-white box-border outline-none font-inherit"
            value={
              journal.jrnl_preview
                ? journal.jrnl_preview.length >= 150
                  ? `${journal.jrnl_preview}…`
                  : journal.jrnl_preview
                : 'No preview available.'
            }
            style={{
              border: `1px solid ${C.border}`,
              color: C.navy,
            }}
          ></textarea>

          <div className="flex gap-10 mt-3">
            {/* view more button */}
            <button
              onClick={() => setopenDetail(true)}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'View More'}
            </button>

            <EntryDetailModal
              open={openDetail}
              onClose={() => setopenDetail(false)}
              date={format(new Date(journal.jrnl_created_at), 'd MMMM yyyy, p')}
              lastUpdated={format(
                new Date(journal.jrnl_updated_at),
                'd MMMM yyyy, p',
              )}
              // entry={journal.entryText}
              journal={journal}
            />

            {/* edit entry */}
            <button
              onClick={() => handleEdit(journal.jrnl_id)}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              Edit Entry
            </button>

            {/* submit/edit entry button */}
            {isDraft && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {submitting ? 'Submitting...' : 'Submit Entry'}
              </button>
            )}

            {/* delete button */}
            <button
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              onClick={() => setOpenDelete(true)}
            >
              {'Delete Entry'}
            </button>

            <DeleteEntryModal
              open={openDelete}
              onClose={() => setOpenDelete(false)}
            />
          </div>
        </div>

        {/* mood insight */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <p
            className="m-0 sm:text-[14px] md:text-[16px] leading-[1.65] font-semibold"
            style={{ color: C.navy }}
          >
            From your entry, you felt:
          </p>
          <div className="flex flex-col items-center">
            {/* mood icon */}
            {/* {!moodData?.mood_id ? ( */}
            {!journal?.mood_id ? (
              <h5
                className="m-5 sm:text-[20px] md:text-[24px] leading-[1.65] font-semibold"
                style={{ color: C.navy }}
              >
                Mood not available yet. Submit your entry to see your mood
                insight.
              </h5>
            ) : (
              <>
                {/* mood emoji */}
                <div className="relative mb-2 z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300">
                  <Eye size={16} />
                </div>
                <h5
                  className="m-0 sm:text-[20px] md:text-[24px] leading-[1.65] font-semibold"
                  style={{ color: C.navy }}
                >
                  {/* {toTitleCase(journal.mood_name) ?? 'Unknown'} */}
                  {toTitleCase(journal.mood_name) ?? 'Unknown'}
                </h5>
              </>
            )}
          </div>

          {moodData?.mood_id && (
            <>
              <div
                className="rounded-[10px] border mb-3.75 p-2.5"
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                  border: '1px solid #eef2f9',
                }}
              >
                {/* mood confidence */}
                <p style={{ ...styles.pText, color: C.faint }}>
                  {/* TODO: retrieve from mood table */}
                  Confidence:{' '}
                  {moodData.mood_confidence
                    ? `${(parseFloat(moodData.mood_confidence) * 100).toFixed(0)}%`
                    : 'Unknown'}
                </p>

                {/* explanation mood  */}
                <p style={styles.pText}>
                  {/* TODO: retrieve from mood table */}
                  {moodData.mood_explain?.replace(/^"+|"+$/g, '') ?? 'Unknown'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* coping exercise recommendation */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3
            className="sm:text-[24px] md:text-[28px] font-semibold"
            style={{ color: C.navy }}
          >
            Recommended Coping Exercise:
          </h3>
          <div className="flex flex-col items-center">
            {/* recommended exercise */}
            {!journal.uex_id && (
              <h5
                className="m-5 sm:text-[20px] md:text-[24px] leading-[1.65] font-semibold"
                style={{ color: C.navy }}
              >
                Exercise recommendation not available yet. Submit your entry
                first.
              </h5>
            )}
          </div>

          <p style={styles.pText}>
            <b>Your happy mood was because of </b>nec ipsum blandit, sed
            ullamcorper sapien accumsan. Aliquam eget augue fringilla, porttitor
            purus nec, venenatis ex. Donec ut tortor lectus. Pellentesque sed
            malesuada turpis. Donec semper aliquet ipsum eu auctor. Duis ut diam
            nisl. Maecenas suscipit tempor nibh vel egestas.
          </p>
          {/* perform exercise button */}
          <button
            onClick={performExercise}
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            {'Perform Exercise'}
          </button>
        </div>

        {/* mood chart*/}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5 flex flex-col items-center"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          {/* mood chart here */}
          {/* mood dashboard button */}
          <button
            onClick={moodDashboard}
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            {'View Mood Dashboard'}
          </button>
        </div>
      </div>
    </section>
  );
}
