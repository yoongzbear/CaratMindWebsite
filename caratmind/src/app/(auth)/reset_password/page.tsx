'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { Eye, EyeOff } from 'lucide-react';
import { buttonGradient, inputStyle, labelStyle } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const { theme } = useTheme();

  const [username, setUsername] = useState(
    searchParams.get('identifier') ?? '',
  );
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resetPassword({
        username: username.trim(),
        confirmationCode: code.trim(),
        newPassword,
        confirmPassword,
      });
      toastSuccess('Successfully reset your password! Please log in.');
      router.push('/login');
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : 'Failed to reset password',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Suspense fallback={null}>
      <AuthCard title="Reset Password">
        <form onSubmit={onSubmit}>
          <label className={labelStyle} style={{ color: 'var(--text)' }}>
            Username / Email
          </label>
          <input
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputStyle}
            style={{ color: 'var(--text)' }}
            suppressHydrationWarning
          />

          <label className={labelStyle} style={{ color: 'var(--text)' }}>
            Verification Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={inputStyle}
            style={{ color: 'var(--text)' }}
            suppressHydrationWarning
          />

          <label className={labelStyle} style={{ color: 'var(--text)' }}>
            New Password
          </label>
          <div className={`${inputStyle} relative items-center`}>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-none focus:outline-none"
              style={{ color: 'var(--text)' }}
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 cursor-pointer"
              style={{ color: 'var(--text)' }}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          <label className={labelStyle} style={{ color: 'var(--text)' }}>
            Confirm New Password
          </label>
          <div className={`${inputStyle} relative items-center`}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-none focus:outline-none"
              style={{ color: 'var(--text)' }}
              suppressHydrationWarning
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 cursor-pointer"
              style={{ color: 'var(--text)' }}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          <button
            className={`w-full ${buttonGradient(theme)}`}
            type="submit"
            disabled={submitting}
            style={{
              opacity: submitting ? 0.75 : 1,
              cursor: submitting ? 'wait' : 'pointer',
            }}
          >
            {submitting ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </AuthCard>
    </Suspense>
  );
}
