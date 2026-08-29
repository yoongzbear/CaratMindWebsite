'use client';
import { DateRangeValue } from '@/components/chart/DateRangeSelector';
import StackedBarChart from '@/components/chart/StackedBarChart';
import DetectMoodModal from '@/components/modal/DetectMoodModal';
import EntryDetailModal from '@/components/modal/EntryModal';
import ExerciseDetailModal from '@/components/modal/ExerciseModal';
import MoodExplainModal from '@/components/modal/MoodExplainModal';
import Pill from '@/components/Pill';
import { buttonGradient } from '@/styles/ui';
import { UserExerciseDetail } from '@/types/exercise';
import { JournalDetail, StatusKey } from '@/types/journal';
import { Mood } from '@/types/mood';
import { toTitleCase } from '@/utils/format';
import { getExerciseStyle } from '@/utils/exerciseUtils';
import { getMoodStyle } from '@/utils/moodUtils';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { format, subDays, isAfter, startOfDay, isSameDay } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import StreakBadgeModal from '@/components/modal/StreakBadgeModal';
import { editJournal, getJournalEntry } from '@/utils/api/journalApi';
import { confirmMood, getMood, saveCorrectMood } from '@/utils/api/moodApi';
import { getJournalExercise } from '@/utils/api/exerciseApi';

export default function MoodInsightPage() {
  const { theme } = useTheme();
  const { loading, accessToken } = useAuth();
  const isDark = theme === 'dark';
  const { jrnl_id } = useParams<{ jrnl_id: string }>();
  const [entry, setEntry] = useState('');
  const router = useRouter();
  const [journal, setJournal] = useState<JournalDetail | null>(null);
  const [fetchingJournal, setFetchingJournal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openMoodDetail, setOpenMoodDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingMoodData, setFetchingMoodData] = useState(false);
  const [moodData, setMoodData] = useState<Mood | null>(null);
  const [fetchingExercise, setFetchingExercise] = useState(false);
  const [exerciseData, setExerciseData] = useState<UserExerciseDetail | null>(
    null,
  );
  const [openExcDetail, setOpenExcDetail] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [badge, setBadge] = useState<string | null>(null);

  const checkBadge = async () => {
    try {
      const res = await fetch('/api/journal/streak', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.new_badge) {
        setBadge(data.new_badge);
      }
    } catch {}
  };

  const loadEntry = async () => {
    setFetchingJournal(true);
    try {
      if (accessToken) {
        const data = await getJournalEntry(jrnl_id, accessToken);

        setJournal(data);
        setEntry(data.entryText);
      }
    } catch {
      toastError('Something went wrong loading the entry.');
      setJournal(null);
    } finally {
      setFetchingJournal(false);
    }
  };

  const loadMood = async () => {
    setFetchingMoodData(true);
    try {
      if (accessToken) {
        const data = await getMood(jrnl_id, accessToken);

        setMoodData(data);
      }
    } catch {
      toastError('Something went wrong loading the mood.');
    } finally {
      setFetchingMoodData(false);
    }
  };

  const loadRecExercise = async () => {
    setFetchingExercise(true);
    try {
      if (accessToken) {
        const data = await getJournalExercise(jrnl_id, accessToken);

        setExerciseData(data);
      }
    } catch {
      toastError('Something went wrong loading recommended coping exercise.');
    } finally {
      setFetchingExercise(false);
    }
  };

  useEffect(() => {
    if (!accessToken || !jrnl_id || jrnl_id === 'undefined') return;

    startTransition(() => {
      loadEntry();
    });
  }, [jrnl_id, accessToken]);

  useEffect(() => {
    if (
      !accessToken ||
      !jrnl_id ||
      jrnl_id === 'undefined' ||
      journal?.jrnl_status !== 'submitted'
    )
      return;
    startTransition(() => {
      loadMood();
    });
  }, [jrnl_id, accessToken, journal?.jrnl_status]);

  useEffect(() => {
    if (
      !accessToken ||
      !jrnl_id ||
      jrnl_id === 'undefined' ||
      journal?.jrnl_status !== 'submitted'
    )
      return;
    startTransition(() => {
      loadRecExercise();
    });
  }, [jrnl_id, accessToken, journal?.jrnl_status]);

  useEffect(() => {
    if (
      !accessToken ||
      !jrnl_id ||
      jrnl_id === 'undefined' ||
      journal?.jrnl_status !== 'submitted'
    )
      return;
    startTransition(() => {
      checkBadge();
    });
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
      if (accessToken) {
        await editJournal(jrnl_id, content, status, accessToken);
        toastSuccess(
          status === 'draft' ? 'Saved as draft.' : 'Entry submitted.',
        );
        setJournal((prev) =>
          prev
            ? {
                ...prev,
                jrnl_status: status,
              }
            : prev,
        );
        // refresh
        await Promise.all([loadEntry(), loadMood(), loadRecExercise()]);
      }
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

  const handleConfirmMood = async () => {
    if (!moodData) return;
    console.log('mood data: ', moodData);
    const mood_id = moodData.mood_id;
    try {
      if (accessToken) {
        await confirmMood(mood_id, accessToken);
        toastSuccess('Saved confirmed mood.');

        await Promise.all([loadEntry(), loadMood(), loadRecExercise()]);
      }
    } catch {
      toastError('Something went wrong. Please try again.');
    }
  };

  const handleCorrectMood = async (correctMood: string) => {
    if (!moodData) return;
    const mood_id = moodData.mood_id;
    try {
      if (accessToken) {
        await saveCorrectMood(mood_id, correctMood, accessToken);
        toastSuccess('Saved corrected mood.');
        await Promise.all([loadEntry(), loadMood(), loadRecExercise()]);
      }
    } catch {
      toastError('Something went wrong. Please try again.');
    }
  };

  return (
    <section
      className="min-h-[calc(100vh-140px)] pt-4 sm:pt-6 pb-12"
      style={{
        background: 'var(--bg)',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-2"
            style={{ color: 'var(--text)' }}
          >
            Journal Insights
          </h1>
        </header>

        {loading || fetchingJournal ? (
          <section
            className="text-[clamp(1rem,3vw,1.5rem)] px-8 py-6 text-center"
            style={{ color: 'var(--muted)' }}
          >
            Loading journal insight...
          </section>
        ) : !journal ? (
          <section
            className="text-[clamp(1rem,3vw,1.5rem)] px-8 py-6 text-center"
            style={{ color: 'var(--muted)' }}
          >
            Entry not found.
          </section>
        ) : (
          <>
            {/* journal summary */}
            <div
              className="rounded-[10px] border mb-3.75 p-4"
              style={{
                backgroundColor: 'var(--bg-div)',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
              id="journal-summary"
            >
              <div className="flex gap-2 items-center mb-2">
                <h3
                  className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {format(new Date(journal.jrnl_created_at), 'dd MMMM yyyy, p')}
                </h3>
                {!fetchingJournal && (
                  <div className="mt-0 mb-2">
                    <Pill
                      shaded
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
                )}
              </div>

              {!fetchingJournal && (
                <>
                  <div
                    className="px-4 py-2 rounded-xl"
                    style={{ border: '1px solid var(--border)' }}
                  >
                    <p
                      className="w-full overflow-hidden text-justify text-ellipsis line-clamp-3 wrap-break-word text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{
                        color: 'var(--text)',
                      }}
                    >
                      {journal.entryText
                        ? journal.entryText
                        : 'No preview available.'}
                    </p>
                  </div>

                  <div className="w-full sm:w-[40%] mx-auto flex flex-wrap items-stretch justify-center gap-3 md:justify-between md:gap-0 mt-4">
                    {/* view more button */}
                    <button
                      onClick={() => setOpenDetail(true)}
                      className={buttonGradient(theme)}
                      id="button-view-entry"
                    >
                      View More
                    </button>

                    {/* edit entry */}
                    <button
                      onClick={() => handleEdit(journal.jrnl_id)}
                      className={buttonGradient(theme)}
                      id="button-edit-entry"
                    >
                      Edit Entry
                    </button>

                    {/* submit entry button */}
                    {isDraft && (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={buttonGradient(theme)}
                        id="button-submit-entry"
                      >
                        {submitting ? 'Submitting...' : 'Submit Entry'}
                      </button>
                    )}

                    {/* delete button */}
                    {/* <button
                      {...redButton(theme)}
                      onClick={() => setOpenDelete(true)}
                      id="button-delete-entry"
                    >
                      Delete Entry
                    </button> */}
                  </div>
                </>
              )}
            </div>

            <div className="w-full mb-3.75 flex flex-col gap-2 md:grid md:grid-cols-2 md:grid-rows-[auto_auto_auto_1fr_auto_auto] md:gap-3">
              {/* mood insight */}
              <div
                className="flex flex-col rounded-[10px] border p-4 md:grid md:grid-rows-subgrid md:row-span-6"
                style={{
                  backgroundColor: 'var(--bg-div)',
                  boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                  border: '1px solid #eef2f9',
                }}
                id="mood"
              >
                <h3
                  className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  From your entry, you felt
                </h3>

                {/* emoji */}
                <div className="items-center justify-center text-center">
                  {!fetchingMoodData && moodData?.mood_id && (
                    <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 flex items-center justify-center">
                      {getMoodStyle(moodData.mood_name, isDark).emoji}
                    </div>
                  )}

                  {/* mood name */}
                  {fetchingMoodData ? (
                    <p
                      className="text-[clamp(1rem,3vw,1.5rem)]"
                      style={{ color: 'var(--muted)' }}
                    >
                      Loading mood insight...
                    </p>
                  ) : !moodData?.mood_id ? (
                    <h5
                      className="text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-semibold"
                      style={{ color: 'var(--muted)' }}
                    >
                      Mood not available yet. Submit your entry first.
                    </h5>
                  ) : (
                    <>
                      <h5
                        className="m-0 mb-2 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                        style={{ color: 'var(--text)' }}
                      >
                        {toTitleCase(moodData.mood_name) ?? 'Unknown'}
                      </h5>
                      <div className="mb-2 lg:mb-0">
                        {moodData?.mood_confirmed === true && (
                          <Pill
                            shaded
                            bgColor="#f1f8f4"
                            borderColor="#66bb6a"
                            textColor="#2e7d32"
                          >
                            Agreed
                          </Pill>
                        )}
                        {moodData?.mood_confirmed === false &&
                          moodData.mood_corrected && (
                            <div className="lg:flex gap-2 items-center justify-center">
                              <Pill
                                shaded
                                bgColor="#fff5f5"
                                borderColor="#e57373"
                                textColor="#c62828"
                              >
                                Disagreed
                              </Pill>
                              <p
                                className="text-[clamp(0.875rem,1.5vw,1rem)] mt-2 lg:mt-0"
                                style={{ color: 'var(--text)' }}
                              >
                                Chosen Mood:{' '}
                                {
                                  getMoodStyle(moodData.mood_corrected, isDark)
                                    .emoji
                                }
                                {toTitleCase(moodData.mood_corrected)}
                              </p>
                            </div>
                          )}
                      </div>
                    </>
                  )}
                </div>

                {/* <div /> */}

                {/* disclaimer */}
                <div>
                  {!fetchingMoodData && moodData?.mood_id && (
                    <p
                      className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic text-justify"
                      style={{ color: 'var(--muted)' }}
                    >
                      Your mood is estimated using AI based on the submitted
                      entry. The detected mood may not always accurately reflect
                      your actual emotional state. Please refer to a
                      professional for further advice or help.
                    </p>
                  )}
                </div>

                {/* button */}
                <div className="w-fit mx-auto mt-3 lg:mt-0 flex gap-4">
                  {!fetchingMoodData && moodData?.mood_id && (
                    <button
                      className={buttonGradient(theme)}
                      onClick={() => setOpenMoodDetail(true)}
                      id="button-view-mood"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>

              {/* coping exercise recommendation */}
              <div
                className="flex flex-col rounded-[10px] border p-4 md:grid md:grid-rows-subgrid md:row-span-6"
                style={{
                  backgroundColor: 'var(--bg-div)',
                  boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                  border: '1px solid #eef2f9',
                }}
                id="exercise"
              >
                <h3
                  className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Recommended Coping Exercise
                </h3>

                {/* emoji */}
                <div className="items-center justify-center">
                  {!fetchingExercise && exerciseData && (
                    <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 flex items-center justify-center">
                      {getExerciseStyle(exerciseData.exc_type).emoji}
                    </div>
                  )}

                  {/* name + status / states */}
                  {fetchingExercise ? (
                    <p
                      className="text-[clamp(1rem,3vw,1.5rem)]"
                      style={{ color: 'var(--muted)' }}
                    >
                      Loading exercise recommendation...
                    </p>
                  ) : !exerciseData ? (
                    <h5
                      className="text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-semibold"
                      style={{ color: 'var(--muted)' }}
                    >
                      Coping exercise recommendation not available yet. Submit
                      your entry first.
                    </h5>
                  ) : (
                    <div className="mb-2 text-center items-center justify-center">
                      <h5
                        className="m-0 mb-2 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                        style={{ color: 'var(--text)' }}
                      >
                        {exerciseData.exc_name}
                      </h5>
                      <div className="mb-2 lg:mb-0">
                        {exerciseData.uex_status === 'completed' && (
                          <Pill
                            shaded
                            bgColor="#f1f8f4"
                            borderColor="#66bb6a"
                            textColor="#2e7d32"
                          >
                            Completed
                          </Pill>
                        )}
                        {exerciseData.uex_status === 'incomplete' &&
                          exerciseData.uex_reason && (
                            <Pill
                              shaded
                              bgColor="#fff5f5"
                              borderColor="#e57373"
                              textColor="#c62828"
                            >
                              Incomplete
                            </Pill>
                          )}
                      </div>
                    </div>
                  )}
                </div>

                {/* disclaimer */}
                <div>
                  {!fetchingExercise && exerciseData && (
                    <p
                      className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic text-justify"
                      style={{ color: 'var(--muted)' }}
                    >
                      AI-generated recommendation. Suggestions are not a
                      substitute for professional medical or mental health
                      advice.
                    </p>
                  )}
                </div>

                {/* buttons */}
                <div className="w-fit mx-auto mt-3 lg:mt-0 flex gap-4">
                  {!fetchingExercise && exerciseData && (
                    <>
                      <button
                        className={buttonGradient(theme)}
                        onClick={() => setOpenExcDetail(true)}
                        id="button-view-exercise"
                      >
                        View Details
                      </button>
                      {exerciseData.uex_status === 'incomplete' &&
                        isSameDay(exerciseData.uex_created_at, new Date()) && (
                          <button
                            className={buttonGradient(theme)}
                            onClick={performExercise}
                            id="button-track-exercise"
                          >
                            Perform Exercise
                          </button>
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className="rounded-[10px] border mb-3.75 p-4 flex flex-col items-center"
              style={{
                backgroundColor: 'var(--bg-div)',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
              id="mood-chart-div"
            >
              {/* mood chart */}
              <h3
                className="text-[clamp(1.25rem,5vw,1.75rem)] font-semibold w-full"
                style={{ color: 'var(--text)' }}
              >
                {barRange.mode === 'days'
                  ? 'Mood This Week'
                  : 'Mood Around This Entry'}
              </h3>
              <div className="w-full" id="mood-chart">
                <StackedBarChart
                  range={barRange}
                  key={journal.jrnl_updated_at}
                />
              </div>
              {/* mood dashboard button */}
              <button
                onClick={moodDashboard}
                id="button-mood-chart"
                className={buttonGradient(theme)}
              >
                View Mood Dashboard
              </button>
            </div>
          </>
        )}
      </div>
      {/* modals */}
      {journal && openDetail == true && (
        <EntryDetailModal
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          date={format(new Date(journal.jrnl_created_at), 'dd MMMM yyyy, p')}
          lastUpdated={format(
            new Date(journal.jrnl_updated_at),
            'dd MMMM yyyy, p',
          )}
          journal={journal}
        />
      )}
      {/* <DeleteEntryModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      /> */}
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
      {moodData && openMoodDetail == true && (
        <MoodExplainModal
          open={openMoodDetail}
          onClose={() => setOpenMoodDetail(false)}
          moodData={moodData}
          onConfirm={handleConfirmMood}
          onCorrect={handleCorrectMood}
        />
      )}
      <DetectMoodModal open={detecting} onClose={() => setDetecting(false)} />
      <StreakBadgeModal
        open={!!badge}
        badgeId={badge}
        onClose={() => setBadge(null)}
      />
    </section>
  );
}
