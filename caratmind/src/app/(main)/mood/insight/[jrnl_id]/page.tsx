'use client';
import { DateRangeValue } from '@/app/components/chart/DateRangeSelector';
import StackedBarChart from '@/app/components/chart/StackedBarChart';
import EntryDetailModal, {
  DeleteEntryModal,
} from '@/app/components/modal/EntryModal';
import ExerciseDetailModal from '@/app/components/modal/ExerciseModal';
import Pill from '@/app/components/Pill';
import { buttonGradientColor, buttonRed, C, styles } from '@/app/styles/styles';
import { UserExerciseDetail } from '@/app/types/exercise';
import { JournalDetail, StatusKey } from '@/app/types/journal';
import { Mood } from '@/app/types/mood';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
// import { getMoodEmoji } from '@/app/utils/moodEmoji';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { format, subDays, isAfter, startOfDay, isSameDay } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function MoodInsightPage() {
  const { user, loading, accessToken } = useAuth();
  const { jrnl_id } = useParams<{ jrnl_id: string }>();
  const [entry, setEntry] = useState('');
  const router = useRouter();
  const [journal, setJournal] = useState<JournalDetail | null>(null);
  const [fetchingJournal, setFetchingJournal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingMoodData, setFetchingMoodData] = useState(false);
  const [moodData, setMoodData] = useState<Mood | null>(null);
  const [fetchingExercise, setFetchingExercise] = useState(false);
  // const [exerciseData, setExerciseData] = useState<UserExercise | null>(null);
  const [exerciseData, setExerciseData] = useState<UserExerciseDetail | null>(
    null,
  );
  const [openExcDetail, setOpenExcDetail] = useState(false);

  // const [barRange, setBarRange] = useState<DateRangeValue>({
  //   mode: 'days',
  //   days: 7,
  // });

  useEffect(() => {
    if (!accessToken || !jrnl_id || jrnl_id === 'undefined') return;

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

  useEffect(() => {
    if (!accessToken || !jrnl_id || jrnl_id === 'undefined') return;

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

    loadMood();
  }, [jrnl_id, accessToken]);

  useEffect(() => {
    if (!accessToken || !jrnl_id || jrnl_id === 'undefined') return;

    async function loadRecExercise() {
      setFetchingExercise(true);
      try {
        const res = await fetch(`/api/user_exercise/${jrnl_id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(
            data.error ?? 'Failed to load recommended coping exercise.',
          );
          setExerciseData(null);
          return;
        }
        setExerciseData(data);
      } catch {
        toastError('Something went wrong loading recommended coping exercise.');
      } finally {
        setFetchingExercise(false);
      }
    }

    loadRecExercise();
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
            }
          : prev,
      );
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const barRange: DateRangeValue = useMemo(() => {
    if (!journal) return { mode: 'days', days: 7 };

    const journalDate = startOfDay(new Date(journal.jrnl_created_at));
    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));

    if (
      isAfter(journalDate, sevenDaysAgo) ||
      journalDate.getTime() === sevenDaysAgo.getTime()
    ) {
      return { mode: 'days', days: 7 };
    }

    const start = subDays(journalDate, 6);
    return {
      mode: 'range',
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(journalDate, 'yyyy-MM-dd'),
    };
  }, [journal]);

  const handleSubmit = () => updateEntry('submitted');
  const handleSave = () => updateEntry('draft');

  const handleEdit = (jrnl_id: string) => {
    router.push(`/journal/edit/${jrnl_id}`);
  };

  const performExercise = () => {
    router.push('/journal/exercise/tracking');
  };

  const moodDashboard = () => {
    router.push('/mood/');
  };

  if (loading || fetchingJournal) {
    return (
      <section className="px-8 py-6 text-center" style={{ color: C.faint }}>
        Loading...
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
      <div className="w-[85%] mx-auto">
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

          {!fetchingJournal && (
            <>
              <div className="mt-0 mb-2">
                <Pill
                  bgColor={
                    journal.jrnl_status === 'draft' ? '#fff5f5' : '#f1f8f4'
                  }
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

              <div
                className="px-4 py-2 rounded-xl"
                style={{ border: `1px solid ${C.border}` }}
              >
                <p
                  className="w-full overflow-hidden text-justify text-ellipsis line-clamp-3 wrap-break-word sm:text-[14px] md:text-[16px]"
                  style={{
                    color: C.navy,
                  }}
                >
                  {journal.entryText
                    ? journal.entryText
                    : 'No preview available.'}
                </p>
              </div>

              <div className="flex gap-10 mt-3">
                {/* view more button */}
                <button
                  onClick={() => setOpenDetail(true)}
                  className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                >
                  {'View More'}
                </button>

                <EntryDetailModal
                  open={openDetail}
                  onClose={() => setOpenDetail(false)}
                  date={format(
                    new Date(journal.jrnl_created_at),
                    'd MMMM yyyy, p',
                  )}
                  lastUpdated={format(
                    new Date(journal.jrnl_updated_at),
                    'd MMMM yyyy, p',
                  )}
                  journal={journal}
                />

                {/* edit entry */}
                <button
                  onClick={() => handleEdit(journal.jrnl_id)}
                  className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
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
            </>
          )}
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
            {fetchingMoodData ? (
              <p style={{ color: C.navy }}>Loading mood insight...</p>
            ) : !moodData?.mood_id ? (
              // {!moodData?.mood_id ? (
              <h5
                className="m-5 text-center sm:text-[20px] md:text-[24px] leading-[1.65] font-semibold"
                style={{ color: C.navy }}
              >
                Mood not available yet. Submit your entry to see your mood
                insight.
              </h5>
            ) : (
              <>
                {/* mood emoji */}
                <div className="relative mb-2 sm:text-[24px] md:text-[28px] z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300">
                  {getMoodStyle(moodData?.mood_name).emoji}
                </div>
                <h5
                  className="m-0 sm:text-[20px] md:text-[24px] leading-[1.65] font-semibold"
                  style={{ color: C.navy }}
                >
                  {/* {toTitleCase(journal.mood_name) ?? 'Unknown'} */}
                  {toTitleCase(moodData.mood_name) ?? 'Unknown'}
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
                  Confidence:{' '}
                  {moodData.mood_confidence
                    ? `${(parseFloat(moodData.mood_confidence) * 100).toFixed(0)}%`
                    : 'Unknown'}
                </p>

                {/* explanation mood  */}
                <p style={styles.pText}>
                  {moodData.mood_explain?.replace(/^"+|"+$/g, '') ?? 'Unknown'}
                </p>

                {/* disclaimer */}
                <p
                  className="sm:text-[12px] md:text-[14px] mt-0 mb-2.5 italic"
                  style={{ color: C.faint }}
                >
                  Your mood is estimated using AI based on the submitted entry.
                  The detected mood may not always accurately reflect your
                  actual emotional state. Please refer to a professional for
                  further advice or help.
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
            {fetchingExercise ? (
              <p style={{ color: C.navy }}>
                Loading exercise recommendation...
              </p>
            ) : !journal.uex_id ? (
              <h5
                className="m-5 sm:text-[20px] md:text-[24px] leading-[1.65] font-semibold"
                style={{ color: C.navy }}
              >
                Exercise recommendation not available yet. Submit your entry
                first.
              </h5>
            ) : (
              <>
                <h5
                  className="m-0 sm:text-[20px] md:text-[24px] leading-[1.65] font-semibold"
                  style={{ color: C.navy }}
                >
                  {exerciseData?.exc_name}
                </h5>

                {/* moods and type */}
                {exerciseData?.uex_id &&
                  (() => {
                    const moods = Array.isArray(exerciseData.exc_mood)
                      ? exerciseData.exc_mood
                      : [exerciseData.exc_mood];
                    const MAX_VISIBLE_MOODS = 2;
                    const visibleMoods = moods.slice(0, MAX_VISIBLE_MOODS);
                    const remainingCount = moods.length - visibleMoods.length;

                    return (
                      <div className="flex gap-3 mb-2">
                        {visibleMoods.map((mood) => {
                          const moodStyle = getMoodStyle(mood);
                          return (
                            <Pill
                              key={mood}
                              bgColor={moodStyle.bgColor}
                              borderColor={moodStyle.borderColor}
                              textColor={moodStyle.textColor}
                            >
                              {moodStyle.emoji} {toTitleCase(mood)}
                            </Pill>
                          );
                        })}

                        {remainingCount > 0 && (
                          <div
                            onClick={() => {
                              // setSelectedExercise(exercise);
                              setOpenExcDetail(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Pill
                              bgColor="#f1f3f8"
                              borderColor="#dde1ea"
                              textColor={C.faint}
                              title={moods
                                .slice(MAX_VISIBLE_MOODS)
                                .map(toTitleCase)
                                .join(', ')}
                            >
                              +{remainingCount} more
                            </Pill>
                          </div>
                        )}

                        <Pill>{toTitleCase(exerciseData.exc_type)}</Pill>
                      </div>
                    );
                  })()}

                <p
                  className="mt-0 mb-2.5 sm:text-[14px] md:text-[16px]"
                  style={{ color: C.navy }}
                >
                  {exerciseData?.exc_desc}
                </p>

                {exerciseData?.uex_status === 'completed' && (
                  <div className="w-full mb-2">
                    <Pill
                      bgColor={'#f1f8f4'}
                      borderColor={'#66bb6a'}
                      textColor={'#2e7d32'}
                    >
                      Completed
                    </Pill>
                  </div>
                )}
                {exerciseData?.uex_status === 'incomplete' &&
                  exerciseData.uex_reason && (
                    <Pill
                      bgColor={'#fff5f5'}
                      borderColor={'#e57373'}
                      textColor={'#c62828'}
                    >
                      Incomplete
                    </Pill>
                  )}

                {/* disclaimer */}
                <p
                  className="sm:text-[12px] md:text-[14px] mt-0 mb-2.5 italic w-full"
                  style={{ color: C.faint }}
                >
                  AI-generated recommendation. Suggestions are not a substitute
                  for professional medical or mental health advice.
                </p>
                {/* // perform exercise button if the date is today and exercise not done */}
                {exerciseData?.uex_status === 'incomplete' &&
                  isSameDay(exerciseData.uex_created_at, new Date()) && (
                    <button
                      onClick={performExercise}
                      className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                    >
                      {'Perform Exercise'}
                    </button>
                  )}
              </>
            )}
          </div>
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
          {/* mood chart */}
          <h3
            className="sm:text-[22px] md:text-[26px] font-semibold w-full"
            style={{ color: C.navy }}
          >
            {barRange.mode === 'days'
              ? 'Mood This Week'
              : 'Mood Around This Entry'}
          </h3>
          <StackedBarChart range={barRange} />
          {/* mood dashboard button */}
          <button
            onClick={moodDashboard}
            className={`mt-2 mb-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            {'View Mood Dashboard'}
          </button>
        </div>
      </div>
      {exerciseData && openExcDetail == true && (
        <ExerciseDetailModal
          open={openExcDetail}
          onClose={() => setOpenExcDetail(false)}
          name={exerciseData.exc_name}
          moods={
            Array.isArray(exerciseData.exc_mood)
              ? exerciseData.exc_mood
              : [exerciseData.exc_mood]
          }
          desc={exerciseData.exc_desc}
          type={exerciseData.exc_type}
          steps={exerciseData.exc_steps}
        />
      )}
    </section>
  );
}
