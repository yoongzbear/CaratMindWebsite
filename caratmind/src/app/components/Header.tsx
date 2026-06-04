'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  buttonBase,
  buttonGradientColor,
  C,
} from '@/app/styles/styles';
import DropdownItem from './DropdownItem';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  {
    label: 'Journal Entry',
    children: [
      { label: 'New Entry', href: '/journal/new' },
      { label: 'Past Entry', href: '/journal/past' },
    ],
  },
  { label: 'Mood', href: '/mood' },
  {
    label: 'Coping Exercise',
    children: [
      { label: 'Exercise Tracking', href: '/exercise/progress' },
      { label: 'Exercise Catalogue', href: '/exercise/catalogue' },
    ],
  },
  { label: 'Helpline', href: '/helpline' },
];

function ProfileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 21a8 8 0 10-16 0"
      />
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.push('/login');
    router.refresh();
  }

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

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <DropdownItem key={item.label} item={item} />
          ))}

          {!loading && user ? (
            <>
              <Link
                href="/profile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: '8px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: C.navy,
                  background: 'white',
                  border: `1px solid ${C.border}`,
                  textDecoration: 'none',
                }}
                aria-label="Profile"
              >
                <ProfileIcon />
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`${buttonBase} ${buttonGradientColor}`}
                style={{ width: 'auto' }}
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`${buttonBase} ${buttonGradientColor}`}
            >
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
