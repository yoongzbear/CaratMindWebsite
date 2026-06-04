'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  buttonBase,
  buttonGradientColor,
  C,
  styles,
} from '@/app/styles/styles';
import DropdownItem from './DropdownItem';

// ─── Nav items — add or remove routes here ───────────────────────────────────
const NAV_LINKS = [
  {
    label: 'Journal Entry',
    children: [
      { label: 'New Entry', href: '/entry/new' },
      { label: 'Past Entry', href: '/entry/past' },
    ],
  },
  { label: 'Mood', href: '/mood' },
  {
    label: 'Coping Exercise',
    children: [
      { label: 'Exercise Tracking', href: '/exercise_track' },
      { label: 'Exercise Catalogue', href: '/exercise_catalogue' },
    ],
  },
  { label: 'Helpline', href: '/helpline' },
];

// ─── Header ──────────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b-[1.5px]"
      style={{
        backgroundColor: C.bgTopbar,
        borderBottom: `1.5px solid ${C.serenity}`,
        boxShadow: '0 2px 12px rgba(146,168,209,0.10)',
      }}
    >
      <div className="max-w-300 mx-auto px-8 h-17 items-center flex justify-between">
        <Link href="/" className="no-underline flex items-center">
          <Image
            src="/assets/CM_long.png"
            alt="Mental Health System logo"
            width={140}
            height={0}
            className="h-auto rounded-lg"
          />
        </Link>

        {/* ── Nav links ────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <DropdownItem key={item.label} item={item} />
          ))}

          {/* login */}
          {/* if logged in, change button to log out */}
          <Link
            href="/login"
            className={`${buttonBase} ${buttonGradientColor}`}
          >
            Log In
          </Link>
        </nav>
      </div>
    </header>
  );
}
