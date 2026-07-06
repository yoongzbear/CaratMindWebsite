'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/app/components/AuthCard';
import { useAuth } from '@/context/AuthContext';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { toastError } from '@/utils/toast';
import { Eye, EyeOff } from 'lucide-react';
import { buttonGradient, inputStyle, labelStyle } from '@/app/styles/ui';

function resolvePostLoginPath(requestedNext: string | null): string {
  if (
    requestedNext &&
    requestedNext.startsWith('/') &&
    !requestedNext.startsWith('//')
  ) {
    return requestedNext;
  }
  return '/home';
}

export function LoginForm({ requestedNext }: { requestedNext: string | null }) {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(resolvePostLoginPath(requestedNext));
    }
  }, [loading, user, router, requestedNext]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(identifier.trim(), password);
      router.replace(resolvePostLoginPath(requestedNext));
      router.refresh();
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Log In">
      <form onSubmit={onSubmit}>
        <label className={labelStyle} style={{ color: C.muted }}>
          Username or email
        </label>
        <input
          type="text"
          autoComplete="username"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={inputStyle}
          style={{ color: C.navy }}
          suppressHydrationWarning
        />

        <label className={labelStyle} style={{ color: C.muted }}>
          Password
        </label>
        <div className="relative mb-3.5">
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            className={inputStyle}
            onChange={(e) => setPassword(e.target.value)}
            style={{ color: C.navy, paddingRight: '44px', marginBottom: 0 }}
            suppressHydrationWarning
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0 flex items-center"
            style={{
              color: C.faint,
            }}
          >
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>

        <button
          className={`w-full ${buttonGradient}`}
          type="submit"
          disabled={submitting}
          style={{
            opacity: submitting ? 0.75 : 1,
            cursor: submitting ? 'wait' : 'pointer',
          }}
        >
          {submitting ? 'Signing in…' : 'Log In'}
        </button>
      </form>

      <p
        className="mt-5.5 text-center sm:text-[14px] md:text-[16px]"
        style={{
          color: C.faint,
        }}
      >
        Don&apos;t have an account?{' '}
        <Link
          href={
            requestedNext
              ? `/register?next=${encodeURIComponent(requestedNext)}`
              : '/register'
          }
          className="hover:underline"
          style={{ color: C.serenity, fontWeight: 600 }}
        >
          Register here
        </Link>
      </p>
    </AuthCard>
  );
}
