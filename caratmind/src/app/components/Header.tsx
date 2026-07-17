'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { buttonBase, buttonGradientColor, C } from '@/app/styles/styles';
import DropdownItem from './DropdownItem';
import { useAuth } from '@/context/AuthContext';

import { useEffect, useRef, useState } from 'react';
import { SessionUser } from '../types/user';
import { ChevronDown, HelpCircle, Menu, X } from 'lucide-react';
import { useNextStep } from 'nextstepjs';

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
      { label: 'Exercise Tracking', href: '/exercise/tracking' },
      { label: 'Exercise Catalogue', href: '/exercise/catalogue' },
    ],
  },
  { label: 'Helpline', href: '/helpline' },
];

// onboarding quick start
const pageTours: Record<string, string> = {
  '/': 'welcome',
  '/home': 'home-tour',
  // TODO: add after checking main onboarding
  '/mood': 'mood-tour',
  '/exercise/tracking': 'exercise-tour',
  '/journal/new': 'journal-tour',
  '/profile': 'profile-tour',
};

export function HelpButton() {
  const pathname = usePathname();
  const { startNextStep } = useNextStep();
  const tourName = pageTours[pathname];

  if (!tourName) return null;

  return (
    <button
      id="help-button"
      className="cursor-pointer"
      onClick={() => startNextStep(tourName)}
      aria-label="Show page tour"
      style={{ color: C.navy }}
    >
      <HelpCircle />
    </button>
  );
}

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [mobile, setMobile] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

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
      if (
        mobileRef.current &&
        !mobileRef.current.contains(event.target as Node)
      ) {
        setMobile(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function closeMobile() {
    setMobile(false);
    setMobileExpanded(null);
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b-[1.5px]"
      style={{
        backgroundColor: C.bgTopbar,
        borderBottom: `1.5px solid ${C.serenity}`,
        boxShadow: '0 2px 12px rgba(146,168,209,0.10)',
        // dynamic island safe (iPhone)
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div
        className="w-full lg:w-[90%] mx-auto h-16 lg:h-17 items-center flex justify-between"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
        }}
      >
        <Link href="/" className="no-underline flex items-center shrink-0">
          <Image
            src="/assets/CM_long.png"
            alt="Mental Health System logo"
            width={140}
            height={0}
            className="h-auto w-27.5 sm:w-32.5 lg:w-35 rounded-lg"
          />
        </Link>

        {/* desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* onboarding */}
          <div id="help-button">
            <HelpButton />
          </div>

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
                        className="font-bold text-[clamp(0.875rem,1.5vw,1rem)]"
                        style={{
                          color: C.navy,
                        }}
                      >
                        {user.preferredUsername}
                      </div>

                      <div
                        className="text-[clamp(0.7rem,1.5vw,0.85rem)] mt-0.5"
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
                        className="w-full px-3 py-2.5 rounded-[10px] border-none bg-transparent text-left cursor-pointer text-[clamp(0.875rem,1.5vw,1rem)] font-medium transition-colors duration-150 ease-in-out border hover:bg-[rgba(146,168,209,0.08)]"
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
                        className="w-full px-3 py-2.5 rounded-[10px] border-none bg-transparent text-left cursor-pointer text-[clamp(0.875rem,1.5vw,1rem)] font-medium transition-colors duration-150 ease-in-out border hover:bg-[rgba(146,168,209,0.08)]"
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
              className={`${buttonBase} ${buttonGradientColor} border-2 text-[clamp(0.875rem,1.5vw,1rem)] font-bold`}
            >
              Log In
            </Link>
          )}
        </nav>

        {/* mobile */}
        <div className="flex lg:hidden items-center gap-2">
          {!loading && user && (
            <>
              {/* onboarding */}
              <div id="help-button-mobile">
                <HelpButton />
              </div>
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px]"
                style={{
                  border: `1px solid ${C.border}`,
                  background: `linear-gradient(135deg, ${C.roseQuartz}, ${C.serenity})`,
                }}
                aria-label="Profile"
              >
                {avatarInitials(user)}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setMobile((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150"
            style={{
              border: `1px solid ${C.border}`,
              color: C.navy,
            }}
            aria-label={mobile ? 'Close menu' : 'Open menu'}
          >
            {mobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {mobile && (
        <div
          ref={mobileRef}
          className="lg:hidden w-full border-t max-h-[calc(100vh-4rem)] overflow-y-auto"
          style={{
            backgroundColor: C.bgTopbar,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <nav
            className="flex flex-col px-4 py-2"
            style={{
              paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
              paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {NAV_LINKS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="border-b"
                  style={{ borderColor: C.border }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded((cur) =>
                        cur === item.label ? null : item.label,
                      )
                    }
                    className="w-full flex items-center justify-between py-3.5 text-[clamp(0.95rem,1.5vw,1rem)] font-bold"
                    style={{ color: C.navy }}
                  >
                    {item.label}
                    <ChevronDown
                      size={18}
                      className="transition-transform duration-200"
                      style={{
                        transform:
                          mobileExpanded === item.label
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="pb-2 pl-3 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMobile}
                          className="py-2.5 text-[clamp(0.95rem,1.5vw,1rem)] font-bold"
                          style={{ color: C.serenity }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className="py-3.5 text-[clamp(0.95rem,1.5vw,1rem)] font-bold border-b"
                  style={{ color: C.navy, borderColor: C.border }}
                >
                  {item.label}
                </Link>
              ),
            )}

            {!loading && user ? (
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  handleLogout();
                }}
                className="mt-3 mb-3 w-full text-left py-3 rounded-[10px] text-[clamp(0.95rem,1.5vw,1rem)] font-bold"
                style={{ color: '#dc2626' }}
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMobile}
                className={`w-fit mt-1 mb-2 sm:mb-0 inline-flex items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white text-[clamp(0.95rem,1.5vw,1rem)] font-bold rounded-xl px-5 py-2.5 transition-colors duration-200`}
              >
                Log In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
