'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import DropdownItem from './DropdownItem';
import { useAuth } from '@/context/AuthContext';

import { useEffect, useRef, useState } from 'react';
import { SessionUser } from '../types/user';
import { ChevronDown, HelpCircle, Menu, X } from 'lucide-react';
import { useNextStep } from 'nextstepjs';
import { getLogoLong, gradientButton } from '../styles/ui';
import { useTheme } from '@/context/ThemeContext';

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
  // '/': 'welcome',
  '/home': 'home-tour',
  '/journal/new': 'new-entry-tour',
  '/journal/past': 'past-entry-tour',
  '/mood': 'mood-charts-tour',
  '/exercise/tracking': 'exercise-track-tour',
  '/exercise/catalogue': 'exercise-catalogue-tour',
  '/helpline': 'helpline-tour',
  '/profile': 'profile-tour',
  '/theme_select': 'theme-tour',
};

export function HelpButton() {
  const pathname = usePathname();
  const { startNextStep } = useNextStep();

  let tourName: string | undefined;

  if (pathname.startsWith('/journal/edit')) {
    tourName = 'edit-entry-tour';
  } else if (pathname.startsWith('/mood/insight')) {
    tourName = 'mood-insight-tour';
  } else {
    tourName = pageTours[pathname];
  }

  if (!tourName) return null;

  return (
    <button
      id="help-button"
      className="cursor-pointer"
      onClick={() => startNextStep(tourName)}
      aria-label="Show tour"
      style={{ color: 'var(--text)' }}
    >
      <HelpCircle />
    </button>
  );
}

export default function Header() {
  const router = useRouter();
  const { theme, resetTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [mobile, setMobile] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    await signOut();
    resetTheme();
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
        backgroundColor: 'var(--bg-topbar)',
        borderBottom: '1.5px solid var(--second-color)',
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
            src={getLogoLong(theme)}
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
                  className="w-10.5 h-10.5 rounded-full flex items-center justify-center cursor-pointer font-bold sm:text-sm md:text-base transition-all duration-150 ease-in-out"
                  style={{
                    color: theme === 'light' ? 'white' : 'var(--text)',
                    border: profileOpen
                      ? '1px solid var(--second-color)'
                      : '1px solid var(--border)',
                    background:
                      'linear-gradient(135deg, var(--first-color), var(--second-color))',
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
                    className="absolute top-12 right-0 w-55 bg-(--bg-div) border rounded-[14px] shadow-[0_16px_48px_rgba(92,112,160,0.16)] overflow-hidden z-50"
                    style={{
                      border: `1px solid var(--border)`,
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
                          color: 'var(--text)',
                        }}
                      >
                        {user.preferredUsername}
                      </div>

                      <div
                        className="text-[clamp(0.7rem,1.5vw,0.85rem)] mt-0.5"
                        style={{
                          color: 'var(--second-color)',
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
                          color: 'var(--text)',
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

                      {/* theme */}
                      <button
                        type="button"
                        onClick={() => router.push('/theme_select')}
                        className="w-full px-3 py-2.5 rounded-[10px] border-none bg-transparent text-left cursor-pointer text-[clamp(0.875rem,1.5vw,1rem)] font-medium transition-colors duration-150 ease-in-out border hover:bg-[rgba(146,168,209,0.08)]"
                        style={{
                          color: 'var(--text)',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            'rgba(146,168,209,0.08)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = 'transparent')
                        }
                      >
                        Theme
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
              // className={`${buttonBase} ${buttonGradientColor} border-2 text-[clamp(0.875rem,1.5vw,1rem)] font-bold`}
              {...gradientButton(theme)}
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
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px]"
                style={{
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  background:
                    'linear-gradient(135deg, var(--first-color), var(--second-color))',
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
              border: '1px solid var(--border)',
              color: 'var(--text)',
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
            backgroundColor: 'var(--bg-topbar)',
            borderTop: `1px solid var(--border)`,
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
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded((cur) =>
                        cur === item.label ? null : item.label,
                      )
                    }
                    className="w-full flex items-center justify-between py-3.5 text-[clamp(0.95rem,1.5vw,1rem)] font-bold"
                    style={{ color: 'var(--text)' }}
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
                          style={{ color: 'var(--second-color)' }}
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
                  style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                >
                  {item.label}
                </Link>
              ),
            )}

            {!loading && user ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push('/theme_select')}
                  className="text-start py-3.5 text-[clamp(0.95rem,1.5vw,1rem)] font-bold border-b"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                >
                  Theme
                </button>

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
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobile}
                {...gradientButton(theme)}
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
