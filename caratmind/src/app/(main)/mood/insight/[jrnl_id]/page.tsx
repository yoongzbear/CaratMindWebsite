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
import { JournalDetail } from '@/app/types/journal';
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

  useEffect(() => {
    if (!accessToken || !jrnl_id) return;
    console.log('at detail', jrnl_id);

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
      } catch {
        toastError('Something went wrong loading the entry.');
      } finally {
        setFetchingJournal(false);
      }
    }

    loadEntry();
  }, [jrnl_id, accessToken]);

  const entryDetail = () => {
    Swal.fire({
      title: 'Date (Last Updated: Date)',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget lectus lectus. Vestibulum id nisi odio. Maecenas nisi lectus, tempor in augue quis, dapibus viverra ligula. Nunc vitae varius velit. Maecenas elementum, arcu quis iaculis sollicitudin, mauris mauris consectetur nulla, sit amet venenatis mi urna quis risus. Aliquam erat volutpat. Nam interdum lorem felis, id malesuada dolor pharetra pharetra. Donec a cursus lorem. Duis quam erat, interdum sit amet nulla vel, lobortis egestas justo. Quisque convallis id felis et laoreet. Cras egestas, arcu a aliquet bibendum, risus diam vestibulum nulla, eu egestas dolor odio eu turpis. Nunc quis dapibus arcu. Mauris pellentesque, quam ut imperdiet cursus, eros dolor consequat ipsum, vitae porta felis nisi at dolor. Ut sollicitudin mauris non neque malesuada facilisis.',
      confirmButtonText: 'Edit Entry',
      // showCancelButton: true,
      showDenyButton: true,
      denyButtonText: 'Delete Entry',
      width: 1000,
      didOpen: () => {
        const title = Swal.getTitle();
        const content = Swal.getHtmlContainer();
        if (title) title.style.textAlign = 'left';
        if (content) content.style.textAlign = 'justify';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success'); // TODO
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Cannot delete entry',
          text: 'You are not allowed to delete a journal entry after submitted. Do not worry, no one will see your entry!',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  const handleEdit = () => {
    // save as draft - save into db only
  };

  const handleSubmit = async () => {
    if (!journal) return;
    setSubmitting(true);
    try {
      // TODO: call a submit endpoint once it exists (PATCH status -> submitted)
      toastSuccess('Entry submitted.');
    } catch {
      toastError('Failed to submit entry.');
    } finally {
      setSubmitting(false);
    }
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

  console.log(journal);

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
              entry={journal.entryText}
            />

            {/* edit entry */}
            <button
              onClick={handleEdit}
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
                {submitting ? 'Submitting…' : 'Submit Entry'}
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
          <p style={styles.pText}>From your entry, you felt:</p>
          <div className="flex flex-col items-center">
            {/* mood icon */}
            {isDraft ? (
              <p style={styles.pText}>
                Mood not available yet. Submit your entry to see your mood
                insight.
              </p>
            ) : (
              <>
                <div className="relative mb-2 z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300">
                  <Eye size={16} />
                </div>
                <p style={styles.pText}>{journal.mood_id ?? 'Unknown'}</p>
              </>
            )}
          </div>

          <div
            className="rounded-[10px] border mb-3.75 p-2.5"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              border: '1px solid #eef2f9',
            }}
          >
            {/* explanation mood */}
            <p style={styles.pText}>
              <b>Your happy mood was because of </b>nec ipsum blandit, sed
              ullamcorper sapien accumsan. Aliquam eget augue fringilla,
              porttitor purus nec, venenatis ex. Donec ut tortor lectus.
              Pellentesque sed malesuada turpis. Donec semper aliquet ipsum eu
              auctor. Duis ut diam nisl. Maecenas suscipit tempor nibh vel
              egestas.
            </p>
          </div>
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
          <h3 style={{ ...styles.header3, fontWeight: 500 }}>
            Recommended Coping Exercise:
          </h3>
          {/* recommended exercise */}
          {isDraft ? (
            <p style={styles.pText}>
              Exercise recommendation not available yet — submit your entry
              first.
            </p>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <h3 style={styles.header3}>{journal.uex_id ?? 'Unknown'}</h3>
              </div>
              <button
                onClick={performExercise}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                Perform Exercise
              </button>
            </>
          )}

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
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
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
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            {'View Mood Dashboard'}
          </button>
        </div>
      </div>
    </section>
  );
}
