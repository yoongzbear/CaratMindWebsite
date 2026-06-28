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
import { useAuth } from '@/context/AuthContext';
import { toastError } from '@/utils/toast';
import { useEffect, useRef, useState } from 'react';
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
                className="w-full sm:text-[14px] md:text-[16px]"
                style={styles.input}
                type="search"
                placeholder="Search Exercise..."
              ></input>
            </div>

            {/* mood dropdown */}
            <div className="w-40">
              <select
                // className={`w-full sm:text-[14px] md:text-[16px] ${dropdownStyle}`}
                style={styles.dropdown}
                // style={{ border: `1px solid ${C.border}`, color: C.navy }}
              >
                <option>Select Mood</option>
              </select>
            </div>

            {/* type dropdown */}
            <div className="w-40">
              {/* <label style={styles.label}>Period</label> */}
              <select className="w-full" style={styles.dropdown}>
                <option>Select Type</option>
              </select>
            </div>
          </div>

          {/* exercise card */}
          {exercises.map((ex) => (
            <div
              key={ex.exc_id}
              className="rounded-[10px] border mb-3.75 p-2.5"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                border: '1px solid #eef2f9',
              }}
            >
              <h1 style={styles.header1}>{ex.exc_name}</h1>

              <div className="flex gap-3 mb-2">
                <Pill
                  bgColor="#edf9f0"
                  borderColor="#cdebd5"
                  textColor="#2e7d32"
                >
                  {Array.isArray(ex.exc_mood) ? ex.exc_mood[0] : ex.exc_mood}
                </Pill>

                <Pill>{ex.exc_type}</Pill>
              </div>

              <p style={styles.pText}>
                {ex.exc_desc.length > 180
                  ? ex.exc_desc.slice(0, 180) + '...'
                  : ex.exc_desc}
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
          ))}
          {selectedExercise && (
            <ExerciseDetailModal
              open={openDetail}
              onClose={() => setOpenDetail(false)}
              name={selectedExercise.exc_name}
              mood={
                Array.isArray(selectedExercise.exc_mood)
                  ? selectedExercise.exc_mood.join(', ')
                  : selectedExercise.exc_mood
              }
              type={selectedExercise.exc_type}
              steps={selectedExercise.exc_steps}
            />
          )}
        </div>
      </div>
    </section>
  );
}
