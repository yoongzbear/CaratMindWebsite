'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { buttonGradient, getLogoLong } from '@/app/styles/ui';
import { HeartCrack } from 'lucide-react';

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-[calc(100vh-140px)] flex flex-col px-3 items-center justify-center text-center"
      style={{ background: 'var(--bg-page)' }}
    >
      <Image
        src={getLogoLong(theme)}
        alt="CaratMind"
        width={140}
        height={0}
        className="h-auto w-32 sm:w-36 mb-6"
      />

      <h1
        className="text-[clamp(3rem,10vw,5rem)] font-extrabold leading-none"
        style={{ color: 'var(--text)' }}
      >
        404
      </h1>

      <h2
        className="flex gap-2 items-center text-[clamp(1.25rem,4vw,1.75rem)] font-bold mt-2 mb-3"
        style={{ color: 'var(--text)' }}
      >
        Page not found <HeartCrack />
      </h2>

      <p
        className="text-[clamp(0.9rem,2vw,1.05rem)] max-w-md mb-8"
        style={{ color: 'var(--muted)' }}
      >
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>

      <Link href="/" className={buttonGradient(theme)}>
        Back to home
      </Link>
    </div>
  );
}
