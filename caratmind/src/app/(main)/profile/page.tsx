'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { buttonGradientColor, C, styles } from '@/app/styles/styles';
import { toastError, toastSuccess } from '@/utils/toast';

export default function ProfilePage() {
  const { user, loading, refreshUser, accessToken } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <section className="px-8 py-6 text-center" style={{ color: C.faint }}>
        Loading profile…
      </section>
    );
  }

  if (!user) {
    return (
      <section className="px-8 py-6 text-center">
        <p style={{ color: C.muted }}>You are not signed in.</p>
        <Link href="/login" style={{ color: C.serenity, fontWeight: 600 }}>
          Log in
        </Link>
      </section>
    );
  }

  function handleEditClick() {
    setDraft(user!.preferredUsername ?? '');
    setError('');
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setError('');
  }

  async function handleSave() {
    if (!draft.trim()) {
      setError('Preferred username cannot be empty.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/auth/profile/update-name', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ preferredUsername: draft.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to update.');
        return;
      }
      await refreshUser?.();
      toastSuccess('Preferred name updated.');
      setEditing(false);
    } catch {
      toastError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{ background: C.bgPage }}
    >
      <div className="w-[90%] mx-auto" style={{ ...styles.form }}>
        <h1 style={{ ...styles.header1, marginTop: 0 }}>Profile</h1>

        <dl style={{ margin: 0, fontSize: '14px', color: C.navy }}>
          {/* Username */}
          <dt style={{ color: C.faint, fontSize: '12px' }}>Username</dt>
          <dd style={{ margin: '4px 0 16px' }}>{user.username}</dd>

          {/* Preferred username — editable */}
          <dt style={{ color: C.faint, fontSize: '12px', marginBottom: '4px' }}>
            Preferred username
          </dt>
          <dd style={{ margin: '0 0 4px' }}>
            {editing ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                style={{
                  border: `1.5px solid ${C.serenity}`,
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '14px',
                  color: C.navy,
                  outline: 'none',
                  width: '220px',
                }}
              />
            ) : (
              <span>{user.preferredUsername ?? '—'}</span>
            )}
          </dd>

          {/* Error */}
          {error && (
            <dd
              style={{ margin: '4px 0 8px', fontSize: '12px', color: '#e05' }}
            >
              {error}
            </dd>
          )}

          {/* Action buttons */}
          <dd style={{ margin: '8px 0 16px', display: 'flex', gap: '8px' }}>
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
                  style={{
                    color: C.muted,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              >
                Edit name
              </button>
            )}
          </dd>

          {/* Email */}
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
