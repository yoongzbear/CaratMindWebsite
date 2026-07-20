'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
// import { styles } from '@/app/styles/styles';
import { toastError, toastSuccess } from '@/utils/toast';
import { Dices, Eye, EyeOff } from 'lucide-react';
import { generateRandomName } from '@/utils/generateName';
import { buttonGradient, inputStyle, labelStyle } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';

export function RegisterForm({
  requestedNext,
}: {
  requestedNext: string | null;
}) {
  const { theme } = useTheme();
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
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    if (consent) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            needsConfirmation
              ? { username, confirmationCode, sub, email, preferredUsername }
              : {
                  username,
                  preferredUsername,
                  email,
                  password,
                  confirmPassword,
                },
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
    } else {
      // no consent --> cannot register
      toastError(
        'Unable to register due to no acknowledgement, click the checkbox to acknowledge.',
      );
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Register" width={840}>
      <form onSubmit={onSubmit}>
        {!needsConfirmation ? (
          <>
            <div className="w-full sm:flex gap-4">
              <div className="w-full">
                <label className={labelStyle} style={{ color: 'var(--text)' }}>
                  Username
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputStyle}
                  style={{ color: 'var(--text)' }}
                />
              </div>

              <div className="w-full">
                <label className={labelStyle} style={{ color: 'var(--text)' }}>
                  Preferred Name
                </label>
                <div className="relative mb-3.5">
                  <input
                    type="text"
                    autoComplete="nickname"
                    required
                    value={preferredUsername}
                    onChange={(e) => setPreferredUsername(e.target.value)}
                    className={`${inputStyle} pr-11 mb-0`}
                    style={{
                      color: 'var(--text)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPreferredUsername(generateRandomName())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0 flex items-center"
                    style={{
                      color: 'var(--text)',
                    }}
                  >
                    <Dices size={24} />
                  </button>
                </div>
              </div>
            </div>

            <label className={labelStyle} style={{ color: 'var(--text)' }}>
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              style={{ color: 'var(--text)' }}
            />

            <div className="w-full sm:flex gap-4">
              <div className="w-full">
                <label className={labelStyle} style={{ color: 'var(--text)' }}>
                  Password
                </label>
                <div className="relative mb-3.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputStyle} pr-11 mb-0`}
                    style={{
                      color: 'var(--text)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0 flex items-center"
                    style={{
                      color: 'var(--faint)',
                    }}
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>
              <div className="w-full">
                <label className={labelStyle} style={{ color: 'var(--text)' }}>
                  Confirm Password
                </label>
                <div className="relative mb-3.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputStyle} pr-11 mb-0`}
                    style={{
                      color: 'var(--text)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0 flex items-center"
                    style={{
                      color: 'var(--text)',
                    }}
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
              </div>
            </div>

            {/* consent checkbox */}
            <div className="flex items-start gap-3 mb-3.5">
              <input
                type="checkbox"
                className="mt-0.5 h-7 w-7 cursor-pointer"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label
                className={`${labelStyle} text-justify`}
                style={{ color: 'var(--text)' }}
              >
                I am <b>above 18</b> and I acknowledge my data such as journal
                entries will be used for data processing by AI
              </label>
            </div>
          </>
        ) : (
          <>
            <p
              className="text-[clamp(0.875rem,1.5vw,1rem)]"
              style={{ color: 'var(--text)' }}
            >
              Enter the verification code sent to <strong>{email}</strong>.
            </p>
            <p
              className="text-[clamp(0.875rem,1.5vw,1rem)]"
              style={{ color: 'var(--text)' }}
            >
              You may check your spam emails for the code.
            </p>
            <label className={labelStyle} style={{ color: 'var(--text)' }}>
              Verification code
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className={inputStyle}
              style={{ color: 'var(--text)' }}
            />
          </>
        )}

        <button
          className={`w-full ${buttonGradient(theme)}`}
          type="submit"
          disabled={submitting}
          style={{
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

      <p
        className="mt-5.5 text-center text-[clamp(0.875rem,1.5vw,1rem)]"
        style={{
          color: 'var(--text)',
        }}
      >
        Already have an account?{' '}
        <Link
          href={
            requestedNext
              ? `/login?next=${encodeURIComponent(requestedNext)}`
              : '/login'
          }
          className="hover:underline"
          style={{ color: 'var(--second-color)', fontWeight: 600 }}
        >
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
