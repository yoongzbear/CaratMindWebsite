'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getLogoMini } from '../styles/ui';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { theme, resetTheme } = useTheme();

  const divider = 'rgba(58,74,107,0.15)';

  return (
    <footer
      className="w-full"
      style={{
        background:
          'linear-gradient(130deg, var(--first-color) 0%, var(--second-color) 100%)',
        borderTop: '1.5px solid rgba(58,74,107,0.12)',
      }}
    >
      {/* Main footer row */}
      <div
        className="max-w-300 mx-auto px-8 pt-10 pb-7 flex items-start justify-between gap-8 flex-wrap"
        style={{
          // dynamic island
          paddingLeft: 'max(2rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(2rem, env(safe-area-inset-right, 0px))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Logo + tagline */}
        <div className="flex items-center gap-3.5 shrink-0">
          <Image
            src={getLogoMini(theme)}
            alt="CaratMind"
            width={100}
            height={100}
            className="object-contain"
          />
          <div>
            <div
              className="font-extrabold text-[clamp(1.25rem,5vw,1.75rem)] leading-[1.1] tracking-[-0.5px]"
              style={{
                color: 'var(--text)',
              }}
            >
              CaratMind
            </div>
            <div
              className="text-[clamp(0.875rem,1.5vw,1rem)] mt-0.75 tracking-[0.06em]"
              style={{
                color: 'var(--text)',
              }}
            >
              Mental Health System
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <div
            className="text-[clamp(1rem,2vw,1.15rem)] font-extrabold tracking-[0.12em] uppercase mb-3"
            style={{
              color: 'var(--text)',
            }}
          >
            Journal
          </div>
          {[
            { label: 'New Entry', href: '/journal/new' },
            { label: 'Past Entry', href: '/journal/past' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block text-[clamp(0.875rem,1.5vw,1rem)] no-underline mb-1.75 font-medium transition-colors duration-130"
              style={{
                color: 'var(--text)',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--text)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--text)')
              }
            >
              {label}
            </Link>
          ))}
        </div>
        <div>
          <div
            className="text-[clamp(1rem,2vw,1.15rem)] font-extrabold tracking-[0.12em] uppercase mb-3"
            style={{
              color: 'var(--text)',
            }}
          >
            Mood
          </div>
          {[{ label: 'Mood Dashboard', href: '/mood' }].map(
            ({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block text-[clamp(0.875rem,1.5vw,1rem)] no-underline mb-1.75 font-medium transition-colors duration-130"
                style={{
                  color: 'var(--text)',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--text)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--text)')
                }
              >
                {label}
              </Link>
            ),
          )}
        </div>
        <div>
          <div
            className="text-[clamp(1rem,2vw,1.15rem)] font-extrabold tracking-[0.12em] uppercase mb-3"
            style={{
              color: 'var(--text)',
            }}
          >
            Coping Exercise
          </div>
          {[
            { label: 'Exercise Tracking', href: '/exercise_track' },
            { label: 'Exercise Catalogue', href: '/exercise_catalogue' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block text-[clamp(0.875rem,1.5vw,1rem)] no-underline mb-1.75 font-medium transition-colors duration-130"
              style={{
                color: 'var(--text)',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--text)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--text)')
              }
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="py-4.5 max-w-300 mx-auto"
        style={{
          borderTop: `1px solid ${divider}`,
          paddingLeft: 'max(2rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(2rem, env(safe-area-inset-right, 0px))',
          paddingBottom: 'max(1.125rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <p
          className="m-0 text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.75] text-center"
          style={{
            color: 'var(--text)',
          }}
        >
          Mental well-being improves through long-term and consistent
          commitment. Be patient with your progress as mental health improvement
          may not always be immediate.
        </p>
        <br />
        <p
          className="m-0 text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.75] text-center"
          style={{
            color: 'var(--text)',
          }}
        >
          <strong style={{ color: 'var(--text)' }}>Disclaimer:</strong> This
          system supports mental health management using AI-integrated features.
          It should not be relied fully as a substitute for licensed mental
          health professionals or emergency services. If you are experiencing
          severe emotional distress, thoughts of self-harm, or a crisis, please
          contact a qualified professional or emergency support immediately.
        </p>
        <p
          className="m-0 text-[clamp(0.875rem,1.5vw,1rem)] leading-[1.75] text-center"
          style={{
            color: 'var(--text)',
          }}
        >
          <Link
            href="/helpline"
            className="underline font-semibold"
            style={{
              color: 'var(--text)',
            }}
          >
            Emergency Helplines
          </Link>
        </p>
        <p
          className="mt-2.5 text-[clamp(0.875rem,1.5vw,1rem)] text-center"
          style={{
            color: 'var(--muted)',
          }}
        >
          © {year} CaratMind Mental Health System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
