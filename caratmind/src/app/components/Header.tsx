'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { buttonBase, buttonGradientColor, C } from '@/app/styles/styles';
import DropdownItem from './DropdownItem';
import { useAuth } from '@/context/AuthContext';

import { useEffect, useRef, useState } from 'react';
import { SessionUser } from '../types/user';

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

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    await signOut();
    router.push('/login');
    router.refresh();
  }

  function avatarInitials(user: SessionUser | null) {
    const n = user?.preferredUsername?.trim();
    if (n) {
      const parts = n.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return n.slice(0, 2).toUpperCase();
    }
    return '?';
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b-[1.5px]"
      style={{
        backgroundColor: C.bgTopbar,
        borderBottom: `1.5px solid ${C.serenity}`,
        boxShadow: '0 2px 12px rgba(146,168,209,0.10)',
      }}
    >
      <div className="w-[90%] mx-auto px-8 h-17 items-center flex justify-between">
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
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((val) => !val)}
                  className="w-10.5 h-10.5 rounded-full flex items-center justify-center cursor-pointer text-white font-bold sm:text-sm md:text-base transition-all duration-150 ease-in-out"
                  style={{
                    border: profileOpen
                      ? `1px solid ${C.serenity}`
                      : `1px solid ${C.border}`,
                    background: `linear-gradient(135deg, ${C.roseQuartz}, ${C.serenity})`,
                    boxShadow: profileOpen
                      ? '0 4px 16px rgba(146,168,209,0.18)'
                      : 'none',
                  }}
                  aria-label="Profile"
                >
                  {loading ? '…' : avatarInitials(user)}
                </button>

                {profileOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-12 right-0 w-55 bg-white border rounded-[14px] shadow-[0_16px_48px_rgba(92,112,160,0.16)] overflow-hidden z-50"
                    style={{
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {/* user info */}
                    <div
                      className="px-3.25 py-4"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(247,202,201,0.15), rgba(146,168,209,0.12))',
                      }}
                    >
                      <div
                        className="font-bold sm:text-[14px] md:text-[16px]"
                        style={{
                          color: C.navy,
                        }}
                      >
                        {user.preferredUsername}
                      </div>

                      <div
                        className="sm:text-[11px] md:text-[13px] mt-0.5"
                        style={{
                          color: C.serenity,
                        }}
                      >
                        {user.email || '—'}
                      </div>
                    </div>

                    {/* buttons */}
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => router.push('/profile')}
                        className="w-full px-3 py-2.5 rounded-[10px] border-none bg-transparent text-left cursor-pointer sm:text-[14px] md:text-[16px] font-medium transition-colors duration-150 ease-in-out border hover:bg-[rgba(146,168,209,0.08)]"
                        style={{
                          color: C.navy,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            'rgba(146,168,209,0.08)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = 'transparent')
                        }
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-3 py-2.5 rounded-[10px] border-none bg-transparent text-left cursor-pointer sm:text-[14px] md:text-[16px] font-medium transition-colors duration-150 ease-in-out border hover:bg-[rgba(146,168,209,0.08)]"
                        style={{
                          color: '#dc2626',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            'rgba(220,38,38,0.06)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = 'transparent')
                        }
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className={`${buttonBase} ${buttonGradientColor} sm:text-[14px] md:text-[16px]`}
            >
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
