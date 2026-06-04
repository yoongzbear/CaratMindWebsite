'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { C, styles } from '@/app/styles/styles';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section style={{ padding: '32px 24px', textAlign: 'center', color: C.faint }}>
        Loading profile…
      </section>
    );
  }

  if (!user) {
    return (
      <section style={{ padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: C.muted }}>You are not signed in.</p>
        <Link href="/login" style={{ color: C.serenity, fontWeight: 600 }}>
          Log in
        </Link>
      </section>
    );
  }

  return (
    <section style={{ minHeight: 'calc(100vh - 140px)', padding: '32px 24px' }}>
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          ...styles.form,
        }}
      >
        <h1 style={{ ...styles.header1, marginTop: 0 }}>Profile</h1>
        <dl style={{ margin: 0, fontSize: '14px', color: C.navy }}>
          <dt style={{ color: C.faint, fontSize: '12px' }}>Username</dt>
          <dd style={{ margin: '4px 0 16px' }}>{user.username}</dd>
          {user.preferredUsername && (
            <>
              <dt style={{ color: C.faint, fontSize: '12px' }}>Preferred username</dt>
              <dd style={{ margin: '4px 0 16px' }}>{user.preferredUsername}</dd>
            </>
          )}
          {user.email && (
            <>
              <dt style={{ color: C.faint, fontSize: '12px' }}>Email</dt>
              <dd style={{ margin: '4px 0 0' }}>{user.email}</dd>
            </>
          )}
        </dl>
      </div>
    </section>
  );
}
