'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { buttonGradientColor, buttonRed, C, styles } from '@/app/styles/styles';
import { toastError, toastSuccess } from '@/utils/toast';
import { Dices } from 'lucide-react';
import { generateRandomName } from '@/app/utils/generateName';

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
      <div className="w-[85%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0 0 8px' }}>User Profile</h1>
        </header>
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3 style={{ ...styles.header3, marginTop: 0 }}>User Details</h3>

          <dl className="m-0 text-[14px]" style={{ color: C.navy }}>
            {/* Username */}
            <dt style={{ color: C.faint, fontSize: '12px' }}>Username</dt>
            <dd className="mt-1 mb-4">{user.username}</dd>

            {/* Preferred name — editable */}
            <dt
              style={{ color: C.faint, fontSize: '12px', marginBottom: '4px' }}
            >
              Preferred Name
            </dt>
            <dd className="mb-1">
              {editing ? (
                <>
                  <div className="relative mb-3.5 w-55">
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') handleCancel();
                      }}
                      className="w-full rounded-lg px-2.5 py-1.5 pr-8 text-[14px] outline-none"
                      style={{
                        border: `1.5px solid ${C.serenity}`,
                        color: C.navy,
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setDraft(generateRandomName())}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
                      style={{ color: C.faint }}
                    >
                      <Dices size={16} />
                    </button>
                  </div>
                </>
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
                    className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
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
                  className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200`}
                >
                  Edit Name
                </button>
              )}
            </dd>

            {/* Email */}
            {user.email && (
              <>
                <dt style={{ color: C.faint, fontSize: '12px' }}>Email</dt>
                <dd className="mt-1">{user.email}</dd>
              </>
            )}

            {/* Delete account */}
            <button
              onClick={handleEditClick}
              className={`mt-4 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              Delete Account
            </button>
          </dl>
        </div>
      </div>
    </section>
  );
}
