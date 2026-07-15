// preview page for mood insights

import StackedBarChart from '@/app/components/chart/StackedBarChart';
import Pill from '@/app/components/Pill';
import { C } from '@/app/styles/styles';
import { buttonGradient, buttonRed } from '@/app/styles/ui';
import { getExerciseStyle } from '@/app/utils/exerciseUtils';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle } from '@/app/utils/moodUtils';
import { format } from 'date-fns';

// sample, not real data
const sampleJournal = {
  jrnl_created_at: new Date().toISOString(),
  entryText:
    "Had a pretty good day overall. Finished a project I've been stuck on for a while and it felt great to finally get it working.",
};

const sampleMood = {
  mood_name: 'joy',
  mood_confidence: '0.86',
  mood_explain:
    'The entry expresses relief and satisfaction after completing a difficult task, which points to a positive, upbeat mood.',
};

const sampleExercise = {
  exc_name: 'Gratitude Journaling',
  exc_type: 'positivity',
  exc_mood: ['joy', 'calm'],
  exc_desc:
    'Write down things you are grateful for, including both positive experiences and challenges that have helped you grow. It encourages a balanced perspective, fosters appreciation, and promotes emotional well-being.',
};

export default function MoodInsightPreviewPage() {
  // const { user, loading, accessToken } = useAuth();
  // const { jrnl_id } = useParams<{ jrnl_id: string }>();
  // const [entry, setEntry] = useState('');
  // const router = useRouter();
  // const [journal, setJournal] = useState<JournalDetail | null>(null);
  // const [fetchingJournal, setFetchingJournal] = useState(false);
  // const [date, setDate] = useState(new Date());
  // const [openDetail, setOpenDetail] = useState(false);
  // const [openDelete, setOpenDelete] = useState(false);
  // const [openMoodDetail, setOpenMoodDetail] = useState(false);
  // const [submitting, setSubmitting] = useState(false);
  // const [fetchingMoodData, setFetchingMoodData] = useState(false);
  // const [moodData, setMoodData] = useState<Mood | null>(null);
  // const [fetchingExercise, setFetchingExercise] = useState(false);
  // const [exerciseData, setExerciseData] = useState<UserExerciseDetail | null>(
  //   null,
  // );
  // const [openExcDetail, setOpenExcDetail] = useState(false);
  // const [detecting, setDetecting] = useState(false);

  // useEffect(() => {
  //   if (!accessToken || !jrnl_id || jrnl_id === 'undefined') return;

  //   async function loadEntry() {
  //     setFetchingJournal(true);
  //     try {
  //       const res = await fetch(`/api/journal/${jrnl_id}`, {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       });
  //       const data = await res.json();
  //       if (!res.ok) {
  //         toastError(data.error ?? 'Failed to load entry.');
  //         setJournal(null);
  //         return;
  //       }
  //       setJournal(data);
  //       setEntry(data.entryText);
  //     } catch {
  //       toastError('Something went wrong loading the entry.');
  //     } finally {
  //       setFetchingJournal(false);
  //     }
  //   }

  //   loadEntry();
  // }, [jrnl_id, accessToken]);

  // useEffect(() => {
  //   if (
  //     !accessToken ||
  //     !jrnl_id ||
  //     jrnl_id === 'undefined' ||
  //     journal?.jrnl_status !== 'submitted'
  //   )
  //     return;

  //   async function loadMood() {
  //     setFetchingMoodData(true);
  //     try {
  //       const res = await fetch(`/api/mood/${jrnl_id}`, {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       });
  //       const data = await res.json();
  //       if (!res.ok) {
  //         toastError(data.error ?? 'Failed to load mood.');
  //         setMoodData(null);
  //         return;
  //       }
  //       setMoodData(data);
  //     } catch {
  //       toastError('Something went wrong loading the mood.');
  //     } finally {
  //       setFetchingMoodData(false);
  //     }
  //   }

  //   loadMood();
  // }, [jrnl_id, accessToken, journal?.jrnl_status]);

  // useEffect(() => {
  //   if (
  //     !accessToken ||
  //     !jrnl_id ||
  //     jrnl_id === 'undefined' ||
  //     journal?.jrnl_status !== 'submitted'
  //   )
  //     return;

  //   async function loadRecExercise() {
  //     setFetchingExercise(true);
  //     try {
  //       const res = await fetch(`/api/user_exercise/${jrnl_id}`, {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       });
  //       const data = await res.json();
  //       if (!res.ok) {
  //         toastError(
  //           data.error ?? 'Failed to load recommended coping exercise.',
  //         );
  //         setExerciseData(null);
  //         return;
  //       }
  //       setExerciseData(data);
  //     } catch {
  //       toastError('Something went wrong loading recommended coping exercise.');
  //     } finally {
  //       setFetchingExercise(false);
  //     }
  //   }

  //   loadRecExercise();
  // }, [jrnl_id, accessToken, journal?.jrnl_status]);

  // // update entry
  // async function updateEntry(status: StatusKey) {
  //   const content = entry.trim() || journal?.entryText;

  //   if (!content) {
  //     toastError('Entry text is required.');
  //     return;
  //   }

  //   setSubmitting(true);

  //   if (status === 'submitted') {
  //     setDetecting(true);
  //   }

  //   try {
  //     const res = await fetch(`/api/journal/${jrnl_id}/edit`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify({ entry: content, status }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       toastError(data.error ?? 'Failed to save.');
  //       return;
  //     }
  //     toastSuccess(status === 'draft' ? 'Saved as draft.' : 'Entry submitted.');
  //     setJournal((prev) =>
  //       prev
  //         ? {
  //             ...prev,
  //             jrnl_status: status,
  //           }
  //         : prev,
  //     );
  //     // if (status === 'submitted') {
  //     //   const refresh = await fetch(`/api/journal/${jrnl_id}`, {
  //     //     headers: {
  //     //       Authorization: `Bearer ${accessToken}`,
  //     //     },
  //     //   });

  //     //   const updatedJournal = await refresh.json();
  //     //   setJournal(updatedJournal);
  //     // }
  //   } catch {
  //     toastError('Something went wrong. Please try again.');
  //   } finally {
  //     setSubmitting(false);
  //     if (status === 'submitted') {
  //       setDetecting(false);
  //     }
  //   }
  // }

  // const barRange: DateRangeValue = useMemo(() => {
  //   if (!journal) return { mode: 'days', days: 7 };

  //   const journalDate = startOfDay(new Date(journal.jrnl_created_at));
  //   const sevenDaysAgo = startOfDay(subDays(new Date(), 6));

  //   if (
  //     isAfter(journalDate, sevenDaysAgo) ||
  //     journalDate.getTime() === sevenDaysAgo.getTime()
  //   ) {
  //     return { mode: 'days', days: 7 };
  //   }

  //   const start = subDays(journalDate, 6);
  //   return {
  //     mode: 'range',
  //     startDate: format(start, 'yyyy-MM-dd'),
  //     endDate: format(journalDate, 'yyyy-MM-dd'),
  //   };
  // }, [journal]);

  // const handleSubmit = () => updateEntry('submitted');
  // const handleSave = () => updateEntry('draft');

  // const handleEdit = (jrnl_id: string) => {
  //   router.push(`/journal/edit/${jrnl_id}`);
  // };

  // const performExercise = () => {
  //   router.push('/exercise/tracking');
  // };

  // const moodDashboard = () => {
  //   router.push('/mood/');
  // };

  // const isDraft = journal?.jrnl_status === 'draft';

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
            {format(new Date(sampleJournal.jrnl_created_at), 'dd MMMM yyyy, p')}
          </h3>

          <div className="mt-0 mb-2">
            <Pill bgColor="#f1f8f4" textColor="#2e7d32" borderColor="#c8e6c9">
              Submitted
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
              {sampleJournal.entryText}
            </p>
          </div>

          <div className="w-full sm:w-[40%] md:w-[70%] mx-auto flex flex-wrap items-stretch justify-center gap-3 md:justify-between md:gap-0 mt-4">
            {/* view more button */}
            <button
              // onClick={() => setOpenDetail(true)}
              className={buttonGradient}
            >
              View More
            </button>

            {/* <EntryDetailModal
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
            /> */}

            {/* edit entry */}
            <button
              // onClick={() => handleEdit(journal.jrnl_id)}
              className={buttonGradient}
            >
              Edit Entry
            </button>

            {/* submit/edit entry button */}
            <button
              // onClick={handleSubmit}
              // disabled={submitting}
              className={buttonGradient}
            >
              Submit Entry
            </button>

            {/* delete button */}
            <button className={buttonRed}>Delete Entry</button>

            {/* <DeleteEntryModal
              open={openDelete}
              onClose={() => setOpenDelete(false)}
            /> */}
          </div>
        </div>

        <div className="w-full mb-3.75 flex flex-col gap-2 md:grid md:grid-cols-2 md:grid-rows-[auto_auto_auto_1fr_auto_auto] md:gap-3">
          {/* mood insight */}
          <div
            className="flex flex-col rounded-[10px] border p-4 md:grid md:grid-rows-subgrid md:row-span-6"
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

            {/* emoji */}
            <div className="flex items-center justify-center">
              {/* {!fetchingMoodData && moodData?.mood_id && ( */}
              <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 flex items-center justify-center">
                {getMoodStyle(sampleMood.mood_name).emoji}
              </div>
              {/* )} */}
            </div>

            {/* mood name */}
            <div className="flex items-center justify-center text-center">
              <h5
                className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                style={{ color: C.navy }}
              >
                {toTitleCase(sampleMood.mood_name) ?? 'Unknown'}
              </h5>
              {/* {fetchingMoodData ? (
                <p
                  className="text-[clamp(1rem,3vw,1.5rem)]"
                  style={{ color: C.muted }}
                >
                  Loading mood insight...
                </p>
              ) : !moodData?.mood_id ? (
                <h5
                  className="text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-semibold"
                  style={{ color: C.muted }}
                >
                  Mood not available yet. Submit your entry first.
                </h5>
              ) : (
                
              )} */}
            </div>

            <div />

            {/* disclaimer */}
            <div>
              {/* {!fetchingMoodData && moodData?.mood_id && ( */}
              <p
                className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic text-justify"
                style={{ color: C.muted }}
              >
                Your mood is estimated using AI based on the submitted entry.
                The detected mood may not always accurately reflect your actual
                emotional state. Please refer to a professional for further
                advice or help.
              </p>
              {/* )} */}
            </div>

            {/* button */}
            <div className="w-fit mx-auto mt-3 lg:mt-0 flex gap-4">
              {/* {!fetchingMoodData && moodData?.mood_id && ( */}
              <button
                className={buttonGradient}
                // onClick={() => setOpenMoodDetail(true)}
              >
                View Details
              </button>
              {/* )} */}
            </div>
          </div>

          {/* coping exercise recommendation */}
          <div
            className="flex flex-col rounded-[10px] border p-4 md:grid md:grid-rows-subgrid md:row-span-6"
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

            {/* emoji */}
            <div className="flex items-center justify-center">
              {/* {!fetchingExercise && exerciseData && ( */}
              <div className="relative text-[clamp(1.38rem,10vw,3rem)] z-10 flex items-center justify-center">
                {getExerciseStyle(sampleExercise.exc_type).emoji}
              </div>
              {/* )} */}
            </div>

            {/* name + status / states */}
            <div className="flex items-center justify-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <h5
                  className="m-0 text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-bold"
                  style={{ color: C.navy }}
                >
                  {sampleExercise.exc_name}
                </h5>
                {/* {sampleExercise.uex_status === 'completed' && (
                  <Pill
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
                      bgColor="#fff5f5"
                      borderColor="#e57373"
                      textColor="#c62828"
                    >
                      Incomplete
                    </Pill>
                  )} */}
              </div>
              {/* {fetchingExercise ? (
                <p
                  className="text-[clamp(1rem,3vw,1.5rem)]"
                  style={{ color: C.muted }}
                >
                  Loading exercise recommendation...
                </p>
              ) : !exerciseData ? (
                <h5
                  className="text-[clamp(1rem,3vw,1.5rem)] leading-[1.65] font-semibold"
                  style={{ color: C.muted }}
                >
                  Coping exercise recommendation not available yet. Submit your
                  entry first.
                </h5>
              ) : (
                
              )} */}
            </div>

            <div />

            {/* disclaimer */}
            <div>
              {/* {!fetchingExercise && exerciseData && ( */}
              <p
                className="text-[clamp(0.7rem,1.5vw,0.85rem)] italic text-justify"
                style={{ color: C.muted }}
              >
                AI-generated recommendation. Suggestions are not a substitute
                for professional medical or mental health advice.
              </p>
              {/* )} */}
            </div>

            {/* buttons */}
            <div className="w-fit mx-auto mt-3 lg:mt-0 flex gap-4">
              {/* {!fetchingExercise && exerciseData && ( */}
              <>
                <button
                  className={buttonGradient}
                  // onClick={() => setOpenExcDetail(true)}
                >
                  View Details
                </button>
                {/* {exerciseData.uex_status === 'incomplete' &&
                    isSameDay(exerciseData.uex_created_at, new Date()) && ( */}
                <button
                  className={buttonGradient}
                  // onClick={performExercise}
                >
                  Perform Exercise
                </button>
                {/* )} */}
              </>
              {/* )} */}
            </div>
          </div>
        </div>

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
            Mood This Week
          </h3>
          <StackedBarChart range={{ mode: 'days', days: 7 }} />
          {/* mood dashboard button */}
          <button className={buttonGradient}>View Mood Dashboard</button>
        </div>

        {/* {loading || fetchingJournal ? (
          <section
            className="text-[clamp(1rem,3vw,1.5rem)] px-8 py-6 text-center"
            style={{ color: C.muted }}
          >
            Loading mood insight...
          </section>
        ) : !journal ? (
          <section
            className="text-[clamp(1rem,3vw,1.5rem)] px-8 py-6 text-center"
            style={{ color: C.muted }}
          >
            Entry not found.
          </section>
        ) : (
          <></>
        )} */}
      </div>
    </section>
  );
}
