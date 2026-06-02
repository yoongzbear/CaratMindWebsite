'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { C } from '@/app/styles/styles';
import DropdownItem from './DropdownItem';

// ─── Nav items — add or remove routes here ───────────────────────────────────
const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Journal Entry',
    children: [
      { label: 'New Entry', href: '/entry/new' },
      { label: 'Past Entry', href: '/entry/past' },
    ],
  },
  { label: 'Mood', href: '/mood' },
  { label: 'Exercise', href: '/exercise' },
];

// ─── Header ──────────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: C.bgTopbar,
        borderBottom: `1.5px solid ${C.serenity}`,
        boxShadow: '0 2px 12px rgba(146,168,209,0.10)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Image
            src="/assets/CM_long.png"
            alt="Mental Health System logo"
            width={140}
            height={0}
            style={{ height: 'auto', borderRadius: '8px' }}
          />
        </Link>

        {/* ── Nav links ────────────────────────────────────────────────── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {NAV_LINKS.map((item) => (
            <DropdownItem key={item.label} item={item} />
          ))}
          {/* {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: 'none',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: active ? 600 : 500,
                  color: active ? C.navy : C.muted,
                  background: active
                    ? `linear-gradient(130deg, rgba(247,202,201,0.4), rgba(146,168,209,0.3))`
                    : 'transparent',
                  border: active
                    ? `1px solid rgba(146,168,209,0.25)`
                    : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      'rgba(146,168,209,0.08)';
                    (e.currentTarget as HTMLElement).style.color = C.navy;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      'transparent';
                    (e.currentTarget as HTMLElement).style.color = C.muted;
                  }
                }}
              >
                {label}
              </Link>
            );
          })} */}

          {/* ── CTA button ──────────────────────────────────────────────── */}
          <Link
            href="/get-help"
            style={{
              marginLeft: '8px',
              textDecoration: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'white',
              background: `linear-gradient(130deg, ${C.roseQuartz}, ${C.serenity})`,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = '0.88')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = '1')
            }
          >
            Log In
          </Link>
        </nav>
      </div>
    </header>
  );
}
