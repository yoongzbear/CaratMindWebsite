'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { buttonGradientColor, buttonRed, C, styles } from '@/app/styles/styles';
import { toastError, toastSuccess } from '@/utils/toast';
import { Dices } from 'lucide-react';
import { generateRandomName } from '@/app/utils/generateName';
import DeleteAccountModal from '@/app/components/modal/DeleteAccountModal';

export default function ProfilePage() {
  const { user, loading, refreshUser, accessToken } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);

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
          <h1
            className="sm:text-[28px] md:text-[32px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
          >
            User Profile
          </h1>
        </header>
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            color: C.navy,
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3 className="sm:text-[24px] md:text-[28px] font-semibold">
            User Details
          </h3>

          {/* <div className="m-3" style={{ color: C.navy }}> */}
          {/* Username */}
          <p
            className="sm:text-[14px] md:text-[16px]"
            style={{ color: C.muted }}
          >
            Username
          </p>
          <p className="mt-1 mb-4 sm:text-[14px] md:text-[16px]">
            {user.username}
          </p>

          {/* Preferred name */}
          <p
            className="sm:text-[14px] md:text-[16px]"
            style={{ color: C.muted }}
          >
            Preferred Name
          </p>
          <p className="mb-1">
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
                    className="w-full rounded-lg px-2.5 py-1.5 pr-8 sm:text-[14px] md:text-[16px] outline-none"
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
                    <Dices size={24} />
                  </button>
                </div>
              </>
            ) : (
              <span className="mt-1 mb-4 sm:text-[14px] md:text-[16px]">
                {user.preferredUsername ?? '—'}
              </span>
            )}
          </p>

          {/* Error */}
          {error && (
            <p
              className="sm:text-[14px] md:text-[16px] mt-1 mb-2"
              style={{ color: '#e05' }}
            >
              {error}
            </p>
          )}

          {/* Action buttons */}
          <p style={{ margin: '8px 0 16px', display: 'flex', gap: '8px' }}>
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
                  className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
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
          </p>

          {/* Email */}
          {user.email && (
            <>
              <p
                className="sm:text-[14px] md:text-[16px]"
                style={{ color: C.muted }}
              >
                Email
              </p>
              <p className="mt-1 sm:text-[14px] md:text-[16px]">{user.email}</p>
            </>
          )}

          {/* Delete account */}
          <button
            onClick={() => setOpenDeleteAccount(true)}
            className={`mt-4 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            Delete Account
          </button>
          {/* </div> */}
        </div>
      </div>
      <DeleteAccountModal
        open={openDeleteAccount}
        onClose={() => setOpenDeleteAccount(false)}
      />
    </section>
  );
}
