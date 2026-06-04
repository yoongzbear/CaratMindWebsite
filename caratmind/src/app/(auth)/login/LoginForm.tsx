'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toastError } from '@/utils/toast';
// import { C, styles } from '@/styles/styles';
// import type { Profile } from '@/types/profile';
// import { Eye, EyeOff } from 'lucide-react';

function resolvePostLoginPath(
  //   profile: Profile,
  requestedNext: string | null,
): string {
  if (requestedNext) return requestedNext;
  // Role-based default redirect
  return '/home';
}

export function LoginForm({ requestedNext }: { requestedNext: string | null }) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(data.error ?? 'Sign in failed');
        return;
      }

      const dest = resolvePostLoginPath(data.profile, requestedNext);
      router.replace(dest);
      router.refresh();
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '16px',
        border: `1px solid ${C.border}`,
        boxShadow: '0 8px 40px rgba(146,168,209,0.15)',
        padding: '32px 28px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={styles.header1}>SVT Smart Chain</div>
        <div style={styles.subtitle}>Sign in to continue</div>
      </div>

      <form onSubmit={onSubmit}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          suppressHydrationWarning
        />

        <label style={styles.label}>Password</label>
        <div
          style={{
            position: 'relative',
            marginBottom: styles.input.marginBottom,
          }}
        >
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, paddingRight: '40px', marginBottom: 0 }}
            suppressHydrationWarning
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: C.faint,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: submitting ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            color: 'white',
            background: `linear-gradient(130deg, ${C.roseQuartz}, ${C.serenity})`,
            opacity: submitting ? 0.75 : 1,
          }}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p
        style={{
          marginTop: '22px',
          textAlign: 'center',
          fontSize: '12px',
          color: C.faint,
        }}
      >
        New accounts are created by the admin. Please contact your admin for
        registration.
      </p>
    </div>
  );
}
