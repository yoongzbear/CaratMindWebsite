'use client';
import ExerciseDetailModal from '@/app/components/modal/ExerciseModal';
import Pill from '@/app/components/Pill';
import {
  buttonGradientColor,
  buttonGreen,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { Eye } from 'lucide-react';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function ExerciseTrackingPage() {
  const { user, loading } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openDetail, setopenDetail] = useState(false);

  const redirectInsight = () => {};

  const handleCancel = () => {};

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[90%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0' }}>
            Coping Exercise Tracking
          </h1>
        </header>

        {/* streak banner */}
        <div
          className="flex mx-auto items-center rounded-[10px] border mb-3.75 p-2.5 w-[80%]"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <div className="flex flex-col items-center px-3">
            {/* mood icon */}
            <div
              className={`relative mb-2 z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300`}
            >
              <Eye size={16} />
            </div>
            <p style={styles.pText}>XX Days</p>
          </div>
          <p
            style={{
              ...styles.pText,
            }}
          >
            You have not performed a coping exercise today. Complete one to
            continue your streak!
          </p>
        </div>

        {/* today's exercise */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h1 style={styles.header1}>Today&apos;s Exercise</h1>
          <h3 style={{ ...styles.header3, color: C.muted, fontWeight: 500 }}>
            Date
          </h3>

          {/* exercise cards */}
          <div
            className="rounded-[10px] border mb-3.75 p-2.5 mt-2"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              border: '1px solid #eef2f9',
            }}
          >
            <h1 style={styles.header1}>Exercise 1</h1>
            <div className="flex gap-3 mb-2">
              {/* mood */}
              <Pill bgColor="#edf9f0" borderColor="#cdebd5" textColor="#2e7d32">
                Happy
              </Pill>
              {/* exercise type */}
              <Pill>Breathing</Pill>
            </div>
            {/* desc - max 3 lines*/}
            <p style={styles.pText}>
              Proin in odio sodales, sagittis tortor a, mollis eros. Vestibulum
              vitae bibendum sapien. In at euismod diam. Vivamus sed tellus sit
              amet nibh condimentum ornare. Nunc non purus lectus. Vestibulum
              nec cursus turpis, in pretium diam. Aenean vitae placerat ni...
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setopenDetail(true)}
                className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'View More'}
              </button>

              <button
                // onClick={() => setopenDetail(true)}
                onClick={redirectInsight}
                className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'View Insights'}
              </button>

              <button
                onClick={handleCancel}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGreen} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'Completed It'}
              </button>

              <button
                onClick={handleCancel}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {'Did not complete'}
              </button>
            </div>

            <ExerciseDetailModal
              open={openDetail}
              onClose={() => setopenDetail(false)}
              name="Exercise 1"
              mood="Happy"
              type="Breathing"
              steps="Proin in odio sodales, sagittis tortor a, mollis eros. Vestibulum
              vitae bibendum sapien. In at euismod diam. Vivamus sed tellus sit
              amet nibh condimentum ornare. Nunc non purus lectus. Vestibulum
              nec cursus turpis, in pretium diam. Aenean vitae placerat ni..."
            />
          </div>
        </div>

        {/* recommended exercises history */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h1 style={styles.header1}>Recommended Exercises History</h1>

          <div className="flex">
            {/* calendar - 30% */}
            <div className="w-[30%]">
              <h1 style={styles.header1}>Calendar</h1>
            </div>

            {/* saved entries section - 70% */}
            <div className="w-[70%]">
              <h1 style={styles.header1}>Date</h1>
              <div
                className="rounded-[10px] border mb-3.75 p-2.5"
                style={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
                  border: '1px solid #eef2f9',
                }}
              >
                <h3 style={{ ...styles.header3, fontWeight: 500 }}>
                  Exercise 1
                </h3>

                <div className="flex gap-3 mb-2">
                  {/* mood */}
                  <Pill
                    bgColor="#edf9f0"
                    borderColor="#cdebd5"
                    textColor="#2e7d32"
                  >
                    Happy
                  </Pill>
                  {/* exercise type */}
                  <Pill>Breathing</Pill>
                </div>
                {/* desc - max 3 lines*/}
                <p style={styles.pText}>
                  Proin in odio sodales, sagittis tortor a, mollis eros.
                  Vestibulum vitae bibendum sapien. In at euismod diam. Vivamus
                  sed tellus sit amet nibh condimentum ornare. Nunc non purus
                  lectus. Vestibulum nec cursus turpis, in pretium diam. Aenean
                  vitae placerat ni...
                </p>
                <button
                  onClick={() => setopenDetail(true)}
                  className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                >
                  {'View More'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
