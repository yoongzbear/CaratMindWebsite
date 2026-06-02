'use client';

import Link from 'next/link';
import Image from 'next/image';
import { C } from '@/app/styles/styles';

// ─── Footer ──────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  // Text colours that stay readable on the light pastel gradient
  const textDark = C.navy; // #3a4a6b — headings / bold
  const textMid = '#5a6e99'; // mid-tone — body text
  const textLight = '#7a90b8'; // secondary / copyright
  const divider = 'rgba(58,74,107,0.15)'; // subtle navy divider

  return (
    <footer
      style={{
        width: '100%',
        background: `linear-gradient(130deg, ${C.roseQuartz} 0%, ${C.serenity} 100%)`,
        borderTop: `1.5px solid rgba(58,74,107,0.12)`,
      }}
    >
      {/* ── Main footer row ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 32px 28px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        {/* ── Logo + tagline ────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexShrink: 0,
          }}
        >
          {/*
           * Replace src with your wide/horizontal logo asset.
           * Remove the <Image> block if using text-only logo.
           */}
          <Image
            src="/assets/CM_mini.png"
            alt="CaratMind"
            width={100}
            height={100}
            style={{ objectFit: 'contain' }}
          />
          <div
          // style={{ borderLeft: `3px solid ${C.navy}`, paddingLeft: '14px' }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: '22px',
                color: textDark,
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
              }}
            >
              CaratMind
            </div>
            <div
              style={{
                fontSize: '11px',
                color: textMid,
                marginTop: '3px',
                letterSpacing: '0.06em',
              }}
            >
              Mental Health System
            </div>
          </div>
        </div>

        {/* ── Quick links ──────────────────────────────────────────── */}
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: textMid,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Quick Links
          </div>
          {[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Resources', href: '/resources' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block',
                fontSize: '13px',
                color: textMid,
                textDecoration: 'none',
                marginBottom: '7px',
                fontWeight: 500,
                transition: 'color 0.13s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = textDark)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = textMid)
              }
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Crisis / emergency line ──────────────────────────────── */}
        <div
          style={{
            background: 'rgba(58,74,107,0.09)',
            border: `1px solid rgba(58,74,107,0.18)`,
            borderRadius: '12px',
            padding: '18px 22px',
            maxWidth: '240px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: textMid,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Crisis Line
          </div>
          {/* Replace with your actual emergency contact */}
          <div
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: textDark,
              marginBottom: '4px',
              letterSpacing: '-0.5px',
            }}
          >
            1-800-XXX-XXXX
          </div>
          <div style={{ fontSize: '12px', color: textMid, lineHeight: 1.5 }}>
            Available 24 hours a day,
            <br />7 days a week
          </div>
        </div>
      </div>

      {/* ── Disclaimer strip ─────────────────────────────────────────── */}
      <div
        style={{
          borderTop: `1px solid ${divider}`,
          padding: '18px 32px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            color: textMid,
            lineHeight: 1.75,
            textAlign: 'center',
          }}
        >
          <strong style={{ color: textDark }}>Disclaimer:</strong> The
          information provided on this platform is for general informational and
          educational purposes only and is not a substitute for professional
          medical advice, diagnosis, or treatment. If you or someone you know is
          in crisis, please contact a licensed mental health professional or
          your local emergency services immediately. Use of this system is
          subject to our{' '}
          <Link
            href="/privacy"
            style={{
              color: textDark,
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link
            href="/terms"
            style={{
              color: textDark,
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            Terms of Use
          </Link>
          .
        </p>
        <p
          style={{
            margin: '10px 0 0',
            fontSize: '11px',
            color: textLight,
            textAlign: 'center',
          }}
        >
          © {year} CaratMind Mental Health System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
