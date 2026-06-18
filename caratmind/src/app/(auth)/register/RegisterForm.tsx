'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/app/components/AuthCard';
import { SocialAuthButtons } from '@/app/components/SocialAuthButtons';
import { C, styles } from '@/app/styles/styles';
import { toastError, toastSuccess } from '@/utils/toast';

export function RegisterForm({
  requestedNext,
}: {
  requestedNext: string | null;
}) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [preferredUsername, setPreferredUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sub, setSub] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          needsConfirmation
            ? { username, confirmationCode, sub, email, preferredUsername }
            : { username, preferredUsername, email, password, confirmPassword },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Registration failed');
        return;
      }

      if (needsConfirmation) {
        toastSuccess('Email confirmed. You can sign in now.');
        const loginHref = requestedNext
          ? `/login?next=${encodeURIComponent(requestedNext)}`
          : '/login';
        router.push(loginHref);
        return;
      }

      if (data.userConfirmed) {
        toastSuccess('Account created. You can sign in now.');
        router.push(
          requestedNext
            ? `/login?next=${encodeURIComponent(requestedNext)}`
            : '/login',
        );
      } else {
        setSub(data.sub ?? '');
        setNeedsConfirmation(true);
        toastSuccess('Check your email for the verification code.');
      }
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Register">
      <form onSubmit={onSubmit}>
        {!needsConfirmation ? (
          <>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Preferred username</label>
            <input
              type="text"
              autoComplete="nickname"
              required
              value={preferredUsername}
              onChange={(e) => setPreferredUsername(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Confirm password</label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </>
        ) : (
          <>
            <p className="text-[13px] mt-0" style={{ color: C.navy }}>
              Enter the verification code sent to <strong>{email}</strong>.
            </p>
            <p className="text-[11px] mt-0" style={{ color: C.muted }}>
              You may check your spam emails for the code.
            </p>
            <label style={styles.label}>Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              style={styles.input}
            />
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            ...styles.button,
            opacity: submitting ? 0.75 : 1,
            cursor: submitting ? 'wait' : 'pointer',
          }}
        >
          {submitting
            ? 'Please wait…'
            : needsConfirmation
              ? 'Confirm email'
              : 'Create account'}
        </button>
      </form>

      {/* {!needsConfirmation && <SocialAuthButtons nextPath={requestedNext} />} */}

      <p
        className="mt-5.5 text-center text-[13px]"
        style={{
          color: C.faint,
        }}
      >
        Already have an account?{' '}
        <Link
          href={
            requestedNext
              ? `/login?next=${encodeURIComponent(requestedNext)}`
              : '/login'
          }
          style={{ color: C.serenity, fontWeight: 600 }}
        >
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
