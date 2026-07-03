'use client';
import ExerciseDetailModal from '@/app/components/modal/ExerciseModal';
import Pill from '@/app/components/Pill';
import {
  buttonGradientColor,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { dropdownStyle } from '@/app/styles/ui';
import { Exercise } from '@/app/types/exercise';
import { toTitleCase } from '@/app/utils/format';
import { getMoodStyle, MOOD_EMOJIS } from '@/app/utils/moodUtils';
import { useAuth } from '@/context/AuthContext';
import { toastError } from '@/utils/toast';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function ExerciseCatalogPage() {
  const { user, loading, accessToken } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [fetching, setFetching] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (!accessToken) return;

    async function loadEntries() {
      setFetching(true);
      try {
        const res = await fetch(`/api/exercise/list`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(data.error ?? 'Failed to load coping exercises.');
          setExercises([]);
          return;
        }
        setExercises(data.exercises ?? []);
      } catch {
        toastError('Something went wrong loading coping exercises.');
      } finally {
        setFetching(false);
      }
    }

    loadEntries();
  }, [accessToken]);

  const moodOptions = useMemo(() => {
    return Object.keys(MOOD_EMOJIS)
      .sort()
      .map((mood) => ({
        value: mood,
        label: `${MOOD_EMOJIS[mood].emoji} ${toTitleCase(mood)}`,
      }));
  }, []);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach((ex) => {
      if (ex.exc_type) set.add(ex.exc_type);
    });
    return Array.from(set).sort();
  }, [exercises]);

  const filtered = useMemo(() => {
    const key = search.trim().toLowerCase();

    return exercises.filter((ex) => {
      const matchesSearch = !key || ex.exc_name.toLowerCase().includes(key);

      const moods = Array.isArray(ex.exc_mood) ? ex.exc_mood : [ex.exc_mood];
      const matchesMood = !selectedMood || moods.includes(selectedMood);

      const matchesType = !selectedType || ex.exc_type === selectedType;

      return matchesSearch && matchesMood && matchesType;
    });
  }, [exercises, search, selectedMood, selectedType]);

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
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-0.5"
            style={{ color: C.navy }}
          >
            Coping Exercise Catalogue
          </h1>
        </header>

        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <div className="flex w-full gap-5">
            {/* search */}
            <div className="w-50">
              <input
                className="w-full pl-10 sm:text-[14px] md:text-[16px]"
                style={styles.input}
                type="search"
                placeholder="Search Exercise"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
            </div>

            {/* mood dropdown */}
            <div className="w-50">
              <select
                className={`sm:text-[14px] md:text-[16px] w-full px-3 py-2.25 rounded-[10px] bg-white cursor-pointer`}
                style={{ border: `1px solid ${C.border}`, color: C.navy }}
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
              >
                <option value="">Select Mood</option>
                {moodOptions.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {toTitleCase(mood.label)}
                  </option>
                ))}
              </select>
            </div>

            {/* type dropdown */}
            <div className="w-40">
              <select
                className={`sm:text-[14px] md:text-[16px] w-full px-3 py-2.25 rounded-[10px] bg-white cursor-pointer`}
                style={{ border: `1px solid ${C.border}`, color: C.navy }}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Select Type</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {toTitleCase(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {fetching && (
            <p
              className="sm:text-[20px] md:text-[24px]"
              style={{ color: C.faint }}
            >
              Loading coping exercises...
            </p>
          )}

          {!fetching && filtered.length === 0 && (
            <p
              className="sm:text-[20px] md:text-[24px]"
              style={{ color: C.faint }}
            >
              {exercises.length === 0
                ? 'No exercise is available.'
                : 'No exercise matches your search.'}
            </p>
          )}

          {/* exercise card */}
          {filtered.map((ex) => {
            const moods = Array.isArray(ex.exc_mood)
              ? ex.exc_mood
              : [ex.exc_mood];
            const MAX_VISIBLE_MOODS = 3;
            const visibleMoods = moods.slice(0, MAX_VISIBLE_MOODS);
            const remainingCount = moods.length - visibleMoods.length;
            return (
              <div
                key={ex.exc_id}
                className="rounded-[10px] border mb-3.75 p-2.5"
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                  border: '1px solid #eef2f9',
                }}
              >
                <h3
                  className="sm:text-[24px] md:text-[28px] font-bold mt-0 mb-0.5"
                  style={{ color: C.navy }}
                >
                  {ex.exc_name}
                </h3>

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
                        setSelectedExercise(ex);
                        setOpenDetail(true);
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

                  <Pill>{toTitleCase(ex.exc_type)}</Pill>
                </div>

                <p
                  className="w-full pb-2 overflow-hidden text-justify text-ellipsis line-clamp-2 wrap-break-word sm:text-[14px] md:text-[16px]"
                  style={{ color: C.navy }}
                >
                  {ex.exc_desc}
                </p>

                <button
                  onClick={() => {
                    setSelectedExercise(ex);
                    setOpenDetail(true);
                  }}
                  className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                >
                  View More
                </button>
              </div>
            );
          })}
          {selectedExercise && (
            <ExerciseDetailModal
              open={openDetail}
              onClose={() => setOpenDetail(false)}
              name={selectedExercise.exc_name}
              moods={
                Array.isArray(selectedExercise.exc_mood)
                  ? selectedExercise.exc_mood
                  : [selectedExercise.exc_mood]
              }
              desc={selectedExercise.exc_desc}
              type={selectedExercise.exc_type}
              steps={selectedExercise.exc_steps}
            />
          )}
        </div>
      </div>
    </section>
  );
}
