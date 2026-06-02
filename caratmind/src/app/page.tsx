'use client';

// ─── CaratMind Splash Page ────────────────────────────────────────────────────
// Route: app/(public)/page.tsx  (or wherever your root page lives)
//
// A full-screen welcome page with a gentle animated entrance.
// Replace the "Enter" button href with your actual first page route.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import Image from 'next/image';
import { C } from '@/app/styles/styles';

export default function SplashPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.bgPage,
        padding: '12px',
        fontFamily: '"DM Sans", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Soft decorative blobs ──────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.serenity}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.roseQuartz}44 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Card ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          alignContent: 'center',
          maxWidth: '480px',
          width: '100%',
          background: 'white',
          borderRadius: '24px',
          border: `1.5px solid ${C.border}`,
          boxShadow:
            '0 8px 48px rgba(146,168,209,0.16), 0 2px 12px rgba(146,168,209,0.08)',
          padding: '56px 48px 48px',
        }}
      >
        {/* logo */}

        {/* Eyebrow */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.serenity,
            marginBottom: '12px',
          }}
        >
          Welcome to
        </div>
        <Image
          src="/assets/CM_long.png"
          alt="Mental Health System logo"
          width={320}
          height={0}
          style={{
            height: 'auto',
            borderRadius: '8px',
            margin: '0 auto',
          }}
        />

        {/* Tagline */}
        <p
          style={{
            margin: '0 0 36px',
            fontSize: '15px',
            color: C.muted,
            lineHeight: 1.65,
          }}
        >
          A thoughtful space for your mental wellbeing.
          <br />
          You are not alone — we are here with you.
        </p>

        {/* CTA button */}
        <Link
          href="/home"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            borderRadius: '12px',
            background: `linear-gradient(130deg, ${C.roseQuartz}, ${C.serenity})`,
            color: C.navy,
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 16px rgba(146,168,209,0.35)',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.88';
            (e.currentTarget as HTMLElement).style.transform =
              'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Enter CaratMind →
        </Link>

        {/* Crisis nudge */}
        <p
          style={{
            margin: '24px 0 0',
            fontSize: '11px',
            color: C.faint,
            lineHeight: 1.6,
          }}
        >
          In crisis?{' '}
          <Link
            href="/get-help"
            style={{
              color: C.serenity,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Get immediate help
          </Link>
        </p>
      </div>

      {/* ── Google Font ───────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
      `}</style>
    </div>
  );
}
