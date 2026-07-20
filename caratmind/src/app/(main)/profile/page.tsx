'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { Dices } from 'lucide-react';
import { generateRandomName } from '@/utils/generateName';
import DeleteAccountModal from '@/components/modal/DeleteAccountModal';
import { gradientButton, greyButton, redButton } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';
import { StreakBadgeDisplay } from '@/components/StreakBadgeDisplay';

export default function ProfilePage() {
  const { user, loading, refreshUser, accessToken } = useAuth();
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [fetchingBadges, setFetchingBadges] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    async function loadBadges() {
      setFetchingBadges(true);
      try {
        const res = await fetch('/api/badge', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!res.ok) {
          toastError(data.error ?? 'Failed to load badges.');
          return;
        }
        setBadges(data.badges ?? []);
      } catch {
        toastError('Something went wrong loading your badges.');
      } finally {
        setFetchingBadges(false);
      }
    }

    loadBadges();
  }, [accessToken]);

  if (loading) {
    return (
      <section
        className="px-8 py-6 text-center text-[clamp(1rem,3vw,1.5rem)]"
        style={{ color: 'var(--muted)' }}
      >
        Loading profile...
      </section>
    );
  }

  if (!user) {
    return (
      <section className="px-8 py-6 text-center text-[clamp(1rem,3vw,1.5rem)]">
        <p style={{ color: 'var(--muted)' }}>You are not signed in.</p>
        <Link
          href="/login"
          style={{ color: 'var(--second-color)', fontWeight: 600 }}
        >
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
      className="min-h-[calc(100vh-320px)] pt-4 sm:pt-6 pb-10"
      style={{
        background: 'var(--bg)',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="w-full sm:w-[95%] md:w-[85%] mx-auto">
        <header className="mb-3">
          <h1
            className="text-[clamp(1.38rem,7vw,2rem)] font-bold mt-0 mb-0.5"
            style={{ color: 'var(--text)' }}
          >
            User Profile
          </h1>
        </header>
        <div
          className="rounded-[10px] border mb-3.75 p-4"
          style={{
            color: 'var(--text)',
            backgroundColor: 'var(--bg-div)',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
          id="profile"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4">
            <div>
              <p
                className="text-[clamp(0.875rem,1.5vw,1rem)]"
                style={{ color: 'var(--muted)' }}
              >
                Username
              </p>
              <p
                className="mt-1 mb-2 text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
                style={{ color: 'var(--text)' }}
              >
                {user.username}
              </p>
            </div>
            <div>
              {/* Email */}
              {user.email && (
                <>
                  <p
                    className="text-[clamp(0.875rem,1.5vw,1rem)]"
                    style={{ color: 'var(--muted)' }}
                  >
                    Email
                  </p>
                  <p
                    className="mt-1 mb-2 text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
                    style={{ color: 'var(--text)' }}
                  >
                    {user.email}
                  </p>
                </>
              )}
            </div>

            <div>
              {/* Preferred name */}
              <p
                className="text-[clamp(0.875rem,1.5vw,1rem)]"
                style={{ color: 'var(--muted)' }}
              >
                Preferred Name
              </p>
              <div className="mb-1">
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
                        className="w-full rounded-lg px-2.5 py-1.5 pr-8 text-[clamp(0.875rem,1.5vw,1rem)] outline-none"
                        style={{
                          border: '1.5px solid var(--second-color)',
                          color: 'var(--text)',
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setDraft(generateRandomName())}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                        style={{ color: 'var(--muted)' }}
                      >
                        <Dices size={24} />
                      </button>
                    </div>
                  </>
                ) : (
                  <p
                    className="mt-1 mb-4 text-[clamp(0.875rem,1.5vw,1rem)] font-bold"
                    style={{ color: 'var(--text)' }}
                  >
                    {user.preferredUsername ?? '—'}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p
                  className="text-[clamp(0.875rem,1.5vw,1rem)] mt-1 mb-2"
                  style={{ color: '#e05' }}
                >
                  {error}
                </p>
              )}

              {/* Action buttons */}
              <div className="mt-2 mb-4 flex gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      {...gradientButton(theme)}
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      {...greyButton(theme)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditClick}
                    {...gradientButton(theme)}
                    id="button-edit-name"
                  >
                    Edit Name
                  </button>
                )}
              </div>
            </div>

            <div>
              <p
                className="text-[clamp(0.875rem,1.5vw,1rem)]"
                style={{ color: 'var(--muted)' }}
              >
                Badges
              </p>
              <StreakBadgeDisplay badges={badges} fetching={fetchingBadges} />
            </div>
          </div>

          {/* Delete account */}
          <button
            onClick={() => setOpenDeleteAccount(true)}
            {...redButton(theme)}
            id="button-delete-account"
          >
            Delete Account
          </button>
        </div>
      </div>
      <DeleteAccountModal
        open={openDeleteAccount}
        onClose={() => setOpenDeleteAccount(false)}
      />
    </section>
  );
}
