// delete account + download journal entries

'use client';

import { useState } from 'react';
import Modal from './Modal';
// import { C } from '@/app/styles/styles';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { buttonGradient, buttonRed } from '@/app/styles/ui';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({ open, onClose }: Props) {
  const { user, accessToken, signOut } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const [confirmInput, setConfirmInput] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (jrnl_id: string) => {
    router.push(`/journal/edit/${jrnl_id}`);
  };

  const isConfirmed = confirmInput.trim() === user?.username;

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch('/api/journal/download', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to download journal entries.');
        return;
      }

      const entries: { jrnl_created_at: string; entryText: string }[] =
        data.entries ?? [];

      if (entries.length === 0) {
        toastError('No journal entries to download.');
        return;
      }

      // combine all entries into one .txt file
      const combined = entries
        .map(
          (e) =>
            `Date: ${format(new Date(e.jrnl_created_at), 'dd/MMMM/yyyy, h:mm a')}\n\n${e.entryText}\n\n${'-'.repeat(40)}\n`,
        )
        .join('\n');
      const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      //   create element to enable download
      const entriesFile = document.createElement('a');
      entriesFile.href = url;
      entriesFile.download = `caratmind_journal_entries_${Date.now()}.txt`;
      document.body.appendChild(entriesFile);
      entriesFile.click();
      entriesFile.remove();
      URL.revokeObjectURL(url);

      toastSuccess('Journal entries downloaded.');
    } catch {
      toastError('Something went wrong downloading your entries.');
    } finally {
      setDownloading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!isConfirmed) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/auth/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error ?? 'Failed to delete account.');
        return;
      }

      toastSuccess('Account deleted successfully.');
      await signOut?.();
      router.push('/login');
    } catch {
      toastError('Something went wrong deleting your account.');
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    setConfirmInput('');
    onClose();
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        width={900}
        title="Delete Account"
        footer={
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5 items-stretch sm:items-center">
            {/* enter username to confirm delete */}
            <input
              autoFocus
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={`Type "${user?.username}" to confirm`}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleClose();
              }}
              className="flex-1 rounded-lg h-10 px-2.5 py-1.5 text-[clamp(0.875rem,1.5vw,1rem)] outline-none"
              style={{
                border: '1.5px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <button
              onClick={handleConfirmDelete}
              disabled={!isConfirmed || deleting}
              // className={`inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 ${buttonRed} sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              className={`${buttonRed} w-fit mx-auto sm:w-auto`}
            >
              {deleting ? 'Deleting…' : 'Confirm Delete Account'}
            </button>
          </div>
        }
      >
        <h4
          className="text-[clamp(1.15rem,4vw,1.65rem)] mt-0 mb-2.5"
          style={{ color: 'var(--text)' }}
        >
          Deleting your account will remove all related data including your
          journal entries. Would you like to download your journal entries?
        </h4>
        <p
          className="text-[clamp(0.875rem,1.5vw,1rem)] mt-0 mb-2.5 italic"
          style={{ color: 'var(--muted)' }}
        >
          Journal entries will be downloaded as a .txt file
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={buttonGradient(theme)}
        >
          {downloading
            ? 'Preparing to Download...'
            : 'Download Journal Entries'}
        </button>

        <p
          className="text-[clamp(0.875rem,1.5vw,1rem)] mt-4"
          style={{ color: 'var(--text)' }}
        >
          To confirm deletion, type your username <b>{user?.username}</b> below,
          then click Confirm Delete Account.
        </p>
      </Modal>
    </>
  );
}
