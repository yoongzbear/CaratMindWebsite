'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { buttonGradient, inputStyle, labelStyle } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';

export default function ForgetPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const { theme } = useTheme();

  const [identifier, setIdentifier] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(identifier.trim());
      toastSuccess(
        'Sent reset code to your email! Please check your inbox or spam.',
      );
      router.push(
        `/reset_password?identifier=${encodeURIComponent(identifier.trim())}`,
      );
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : 'Failed to send reset code',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Forgot Password">
      <form onSubmit={onSubmit}>
        <label className={labelStyle} style={{ color: 'var(--text)' }}>
          Username / Email
        </label>
        <input
          type="text"
          autoComplete="username"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={inputStyle}
          style={{ color: 'var(--text)' }}
          suppressHydrationWarning
        />

        <button
          className={`w-full ${buttonGradient(theme)}`}
          type="submit"
          disabled={submitting}
          style={{
            opacity: submitting ? 0.75 : 1,
            cursor: submitting ? 'wait' : 'pointer',
          }}
        >
          {submitting ? 'Sending…' : 'Send Reset Code'}
        </button>
      </form>
    </AuthCard>
  );
}
