'use client';
import { DateRangeValue } from '@/app/components/chart/DateRangeSelector';
import StackedBarChart from '@/app/components/chart/StackedBarChart';
import DetectMoodModal from '@/app/components/modal/DetectMoodModal';
import EntryDetailModal, {
  DeleteEntryModal,
} from '@/app/components/modal/EntryModal';
import ExerciseDetailModal from '@/app/components/modal/ExerciseModal';
import Pill from '@/app/components/Pill';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { buttonGradient, buttonRed } from '@/app/styles/ui';
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
  const [detecting, setDetecting] = useState(false);

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
    if (
      !accessToken ||
      !jrnl_id ||
      jrnl_id === 'undefined' ||
      journal?.jrnl_status !== 'submitted'
    )
      return;

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
  }, [jrnl_id, accessToken, journal?.jrnl_status]);

  useEffect(() => {
    if (
      !accessToken ||
      !jrnl_id ||
      jrnl_id === 'undefined' ||
      journal?.jrnl_status !== 'submitted'
    )
      return;

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
  }, [jrnl_id, accessToken, journal?.jrnl_status]);

  // update entry
  async function updateEntry(status: StatusKey) {
    const content = entry.trim() || journal?.entryText;

    if (!content) {
      toastError('Entry text is required.');
      return;
    }

    setSubmitting(true);

    if (status === 'submitted') {
      setDetecting(true);
    }

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
      // if (status === 'submitted') {
      //   const refresh = await fetch(`/api/journal/${jrnl_id}`, {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   });

      //   const updatedJournal = await refresh.json();
      //   setJournal(updatedJournal);
      // }
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
      if (status === 'submitted') {
        setDetecting(false);
      }
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
    router.push('/exercise/tracking');
  };

  const moodDashboard = () => {
    router.push('/mood/');
  };

  const isDraft = journal?.jrnl_status === 'draft';

  return (
    <section
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-12"
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
            Mood Insights
          </h1>
        </header>

        {loading || fetchingJournal ? (
          <section
            className="text-[clamp(1rem,3vw,1.5rem)] px-8 py-6 text-center"
            style={{ color: C.navy }}
          >
            Loading mood insight...
          </section>
        ) : !journal ? (
          <section
            className="text-[clamp(1rem,3vw,1.5rem)] px-8 py-6 text-center"
            style={{ color: C.navy }}
          >
            Entry not found.
          </section>
        ) : (
          <>
            {/* journal summary */}
            <div
              className="rounded-[10px] border mb-3.75 p-4"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
            >
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
                style={{ color: C.navy }}
              >
                {format(new Date(journal.jrnl_created_at), 'dd MMMM yyyy, p')}
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
                      className="w-full overflow-hidden text-justify text-ellipsis line-clamp-3 wrap-break-word text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{
                        color: C.navy,
                      }}
                    >
                      {journal.entryText
                        ? journal.entryText
                        : 'No preview available.'}
                    </p>
                  </div>

                  {/* <div className="flex gap-10 mt-3"> */}
                  <div className="w-full sm:w-[40%] md:w-[60%] mx-auto flex flex-wrap items-stretch justify-center gap-3 md:justify-between md:gap-0 mt-4">
                    {/* view more button */}
                    <button
                      onClick={() => setOpenDetail(true)}
                      // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
                      className={`${buttonGradient}`}
                    >
                      {'View More'}
                    </button>

                    <EntryDetailModal
                      open={openDetail}
                      onClose={() => setOpenDetail(false)}
                      date={format(
                        new Date(journal.jrnl_created_at),
                        'dd MMMM yyyy, p',
                      )}
                      lastUpdated={format(
                        new Date(journal.jrnl_updated_at),
                        'dd MMMM yyyy, p',
                      )}
                      journal={journal}
                    />

                    {/* edit entry */}
                    <button
                      onClick={() => handleEdit(journal.jrnl_id)}
                      // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
                      className={`${buttonGradient}`}
                    >
                      Edit Entry
                    </button>

                    {/* submit/edit entry button */}
                    {isDraft && (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
                        className={`${buttonGradient}`}
                      >
                        {submitting ? 'Submitting...' : 'Submit Entry'}
                      </button>
                    )}

                    {/* delete button */}
                    <button
                      // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                      className={`${buttonRed}`}
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
              className="rounded-[10px] border mb-3.75 p-4"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
            >
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
                style={{ color: C.navy }}
              >
                From your entry, you felt:
              </h3>
              <div className="flex flex-col items-center">
                {/* mood icon */}
                {fetchingMoodData ? (
                  <p
                    className="text-[clamp(1rem,3vw,1.5rem)]"
                    style={{ color: C.navy }}
                  >
                    Loading mood insight...
                  </p>
                ) : !moodData?.mood_id ? (
                  <h5
                    className="m-5 text-center text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-semibold"
                    style={{ color: C.navy }}
                  >
                    Mood not available yet. Submit your entry first.
                  </h5>
                ) : (
                  <>
                    {/* mood emoji */}
                    <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 w-18 h-18 flex items-center justify-center">
                      {getMoodStyle(moodData?.mood_name).emoji}
                    </div>
                    <h5
                      className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                      style={{ color: C.navy }}
                    >
                      {toTitleCase(moodData.mood_name) ?? 'Unknown'}
                    </h5>
                  </>
                )}
              </div>

              {moodData?.mood_id && (
                <>
                  <div
                    className="rounded-[10px] border mb-3.75 p-4"
                    style={{
                      backgroundColor: 'white',
                      boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                      border: '1px solid #eef2f9',
                    }}
                  >
                    {/* mood confidence */}
                    <p
                      className="text-[clamp(0.875rem,1.5vw,1rem)] mb-1"
                      style={{ color: C.muted }}
                    >
                      Confidence:{' '}
                      {moodData.mood_confidence
                        ? `${(parseFloat(moodData.mood_confidence) * 100).toFixed(0)}%`
                        : 'Unknown'}
                    </p>

                    {/* explanation mood  */}
                    <p
                      className="text-[clamp(0.875rem,1.5vw,1rem)] mb-2"
                      style={{ color: C.navy }}
                    >
                      {moodData.mood_explain?.replace(/^"+|"+$/g, '') ??
                        'Unknown'}
                    </p>

                    {/* disclaimer */}
                    <p
                      className="text-[clamp(0.7rem,1.5vw,0.85rem)] mt-0 mb-2.5 italic"
                      style={{ color: C.muted }}
                    >
                      Your mood is estimated using AI based on the submitted
                      entry. The detected mood may not always accurately reflect
                      your actual emotional state. Please refer to a
                      professional for further advice or help.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* coping exercise recommendation */}
            <div
              className="rounded-[10px] border mb-3.75 p-4"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
            >
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
                style={{ color: C.navy }}
              >
                Recommended Coping Exercise:
              </h3>
              <div className="flex flex-col items-center">
                {/* recommended exercise */}
                {fetchingExercise ? (
                  <p
                    className="text-[clamp(1rem,3vw,1.5rem)]"
                    style={{ color: C.navy }}
                  >
                    Loading exercise recommendation...
                  </p>
                ) : !exerciseData ? (
                  <h5
                    className="m-5 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-semibold"
                    style={{ color: C.navy }}
                  >
                    Coping exercise recommendation not available yet. Submit
                    your entry first.
                  </h5>
                ) : (
                  <>
                    <h5
                      className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
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

                        const mobileVisibleMoods = moods.slice(0, 1);
                        const desktopVisibleMoods = moods.slice(0, 2);

                        return (
                          <div className="flex flex-wrap gap-3 mb-2">
                            {/* Mobile: show 1 pill */}
                            <div className="flex gap-3 sm:hidden">
                              {mobileVisibleMoods.map((mood) => {
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

                              {moods.length > 1 && (
                                <div
                                  onClick={() => setOpenExcDetail(true)}
                                  className="cursor-pointer"
                                >
                                  <Pill
                                    bgColor="#f1f3f8"
                                    borderColor="#dde1ea"
                                    textColor={C.muted}
                                    title={moods
                                      .slice(1)
                                      .map(toTitleCase)
                                      .join(', ')}
                                  >
                                    +{moods.length - 1} more
                                  </Pill>
                                </div>
                              )}
                            </div>

                            {/* Desktop: show 2 pills */}
                            <div className="hidden sm:flex gap-3">
                              {desktopVisibleMoods.map((mood) => {
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

                              {moods.length > 2 && (
                                <div
                                  onClick={() => setOpenExcDetail(true)}
                                  className="cursor-pointer"
                                >
                                  <Pill
                                    bgColor="#f1f3f8"
                                    borderColor="#dde1ea"
                                    textColor={C.muted}
                                    title={moods
                                      .slice(2)
                                      .map(toTitleCase)
                                      .join(', ')}
                                  >
                                    +{moods.length - 2} more
                                  </Pill>
                                </div>
                              )}
                            </div>

                            <Pill>{toTitleCase(exerciseData.exc_type)}</Pill>
                          </div>
                        );
                      })()}
                    <p
                      className="mt-0 mb-2.5 text-[clamp(0.875rem,1.5vw,1rem)]"
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
                      className="text-[clamp(0.7rem,1.5vw,0.85rem)] mt-0 mb-2.5 italic w-full"
                      style={{ color: C.muted }}
                    >
                      AI-generated recommendation. Suggestions are not a
                      substitute for professional medical or mental health
                      advice.
                    </p>
                    {/* // perform exercise button if the date is today and exercise not done */}
                    {exerciseData?.uex_status === 'incomplete' &&
                      isSameDay(exerciseData.uex_created_at, new Date()) && (
                        <button
                          onClick={performExercise}
                          // className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
                          className={`${buttonGradient}`}
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
              className="rounded-[10px] border mb-3.75 p-4 flex flex-col items-center"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
            >
              {/* mood chart */}
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold w-full"
                style={{ color: C.navy }}
              >
                {barRange.mode === 'days'
                  ? 'Mood This Week'
                  : 'Mood Around This Entry'}
              </h3>
              <StackedBarChart range={barRange} key={journal.jrnl_updated_at} />
              {/* mood dashboard button */}
              <button
                onClick={moodDashboard}
                // className={`mt-2 mb-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
                className={`${buttonGradient}`}
              >
                {'View Mood Dashboard'}
              </button>
            </div>
          </>
        )}
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
      <DetectMoodModal open={detecting} onClose={() => setDetecting(false)} />
    </section>
  );
}
