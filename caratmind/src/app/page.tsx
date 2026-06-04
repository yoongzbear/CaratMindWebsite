'use client';

import Link from 'next/link';
import Image from 'next/image';
import { buttonGradientColor } from './styles/styles';

const cards = [
  {
    title: 'Journal',
    description:
      'Write your thoughts and feelings daily. Mood is detected through your entry.',
    href: '/journal',
    buttonLabel: 'Write an entry',
    accent: 'from-rose-100 to-pink-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-400',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    ),
  },
  {
    title: 'Mood',
    description:
      'View summary of detected moods over time. Informative insights are generated based on the moods and the journal entry.',
    href: '/mood',
    buttonLabel: 'View mood',
    accent: 'from-violet-100 to-purple-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-400',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
  {
    title: 'Coping Exercise',
    description:
      'View a collection of coping exercises to help with your daily mental health care.',
    href: '/coping',
    buttonLabel: 'Browse exercise',
    accent: 'from-teal-100 to-emerald-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-500',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
];

export default function SplashPage() {
  return (
    // if not logged in, show the splash page, if logged in, show the home page
    <main className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden font-(family-name:--font-dm-sans)">
      {/* ── Background decoration ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-rose-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-120 h-120 rounded-full bg-violet-100/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-75 rounded-full bg-teal-50/30 blur-3xl" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative z-10 text-center mb-8 flex flex-col items-center gap-4">
        {/* Logo */}
        <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-light leading-none tracking-tight text-slate-800">
          Welcome to CaratMind
        </h1>
        <p className="text-slate-500 text-base max-w-sm leading-relaxed">
          A thoughtful space for your mental wellbeing.
        </p>
      </div>

      {/* ── Cards ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5 px-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* Image placeholder */}
            <div
              className={`relative w-full h-44 bg-linear-to-br ${card.accent} flex items-center justify-center`}
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
                className={`relative z-10 w-14 h-14 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}
              >
                {card.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h2 className="text-slate-800 text-xl font-semibold tracking-tight">
                {card.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                {card.description}
              </p>

              <Link
                href={card.href}
                className={`mt-1 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                {card.buttonLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// first page when accessing the site
// - change to decide to bring to home page or splash page

// import { redirect } from 'next/navigation';
// import { getServerProfile } from '@/utils/auth';

// export default async function Home() {
//   const profile = await getServerProfile();
//   if (profile) {
//     redirect(profile.role === 'admin' ? '/admin' : '/home');
//   }
//   redirect('/login');
// }
