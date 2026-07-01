'use client';
import Link from 'next/link';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { Eye } from 'lucide-react';
import StackedBarChart from '@/app/components/chart/StackedBarChart';
import { useState } from 'react';
import { DateRangeValue } from '@/app/components/chart/DateRangeSelector';

export default function HomePage() {
  const { user, loading } = useAuth();

  const [barRange, setBarRange] = useState<DateRangeValue>({
    mode: 'days',
    days: 7,
  });

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[80%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0 0 8px' }}>
            Welcome back, {user?.preferredUsername}!
          </h1>
        </header>

        {/* banner for basic habits */}
        <div
          className="rounded-[10px] border mb-4 p-2.5 flex gap-3"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <p style={{ ...styles.subtitle, fontSize: '14px' }}>
            Basic habits hoho
          </p>

          <button
            // onClick={handleSave}
            // disabled={saving}
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            {'Action Button'}
          </button>
        </div>

        {/* cards */}
        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto">
          {/* journal */}
          <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h2 className="text-slate-800 text-xl font-semibold tracking-tight">
                Journal
              </h2>
              <h2 className="text-slate-800 text-xl font-semibold tracking-tight">
                Current Journal Streak
              </h2>
              {/* journal streak */}
              <div
                className={`relative w-full h-44 bg-linear-to-br flex items-center justify-center`}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-current"
                      style={{
                        width: `${60 + i * 30}px`,
                        height: `${60 + i * 30}px`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 1 - i * 0.14,
                      }}
                    />
                  ))}
                </div>
                {/* Center icon */}
                <div
                  className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300`}
                >
                  <Eye size={16} />
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                You have not written an entry today. Write one to continue your
                streak!
                {/* if not written yet */}
              </p>
              <Link
                href="/journal/new"
                className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                Write an entry
              </Link>
            </div>
          </div>

          {/* mood */}
          <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h2 className="text-slate-800 text-xl font-semibold tracking-tight">
                Mood
              </h2>
              {/* mood chart */}
              <StackedBarChart range={barRange} height={280} />
              <Link
                href="/mood"
                className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                View more
              </Link>
            </div>
          </div>

          {/* exercise */}
          <div className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h2 className="text-slate-800 text-xl font-semibold tracking-tight">
                Coping Exercise
              </h2>
              <h2 className="text-slate-800 text-xl font-semibold tracking-tight">
                Current Exercise Streak
              </h2>
              {/* exercise streak */}
              <div
                className={`relative w-full h-44 bg-linear-to-br flex items-center justify-center`}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-current"
                      style={{
                        width: `${60 + i * 30}px`,
                        height: `${60 + i * 30}px`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 1 - i * 0.14,
                      }}
                    />
                  ))}
                </div>
                {/* Center icon */}
                <div
                  className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300`}
                >
                  <Eye size={16} />
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                You have not performed a coping exercise today. Complete one to
                continue your streak!
                {/* if not done yet */}
              </p>
              <Link
                href="/exercise_catalogue"
                className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                Browse exercise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
