// delete account + download journal entries

'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toastError, toastSuccess } from '@/utils/toast';
import { gradientButton, redButton } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';
import { downloadJournalEntry } from '@/utils/api/journalApi';
import { Download, Loader, X } from 'lucide-react';
import { JournalInsightToDownload } from '@/types/journal';
import {
  downloadInsightsAsPdf,
  downloadTextFile,
  formatJournalInsightsAsText,
} from '@/utils/downloadJournalInsight';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({ open, onClose }: Props) {
  const { user, accessToken, signOut } = useAuth();
  const router = useRouter();
  const { theme, resetTheme } = useTheme();

  const [confirmInput, setConfirmInput] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'text' | 'pdf'>('text');
  const [deleting, setDeleting] = useState(false);

  const isConfirmed = confirmInput.trim() === user?.username;

  async function handleDownload(fileFormat: 'text' | 'pdf') {
    setDownloading(true);
    try {
      if (accessToken) {
        const data = await downloadJournalEntry(accessToken);

        const insights: JournalInsightToDownload[] = data.entries ?? [];

        if (insights.length === 0) {
          toastError('No journal insights to download.');
          return;
        }

        if (fileFormat === 'pdf') {
          downloadInsightsAsPdf(
            insights,
            `caratmind_journal_insights_${Date.now()}.pdf`,
          );
        } else {
          const combined = formatJournalInsightsAsText(insights);
          downloadTextFile(
            combined,
            `caratmind_journal_insights_${Date.now()}.txt`,
          );
        }

        toastSuccess('Journal insights downloaded.');
        setShowFormat(false);
      }
    } catch {
      toastError('Something went wrong downloading your journal insights.');
    } finally {
      setDownloading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!isConfirmed)
      toastError('Please enter your username to confirm account deletion.');

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
      resetTheme();
      router.push('/login');
    } catch {
      toastError('Something went wrong deleting your account.');
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    setConfirmInput('');
    setShowFormat(false);
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
              {...redButton(theme, !isConfirmed || deleting)}
            >
              {deleting ? 'Deleting...' : 'Confirm Delete Account'}
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

        <div className="flex flex-col gap-2 w-fit">
          {/* download button */}
          {!showFormat ? (
            <button
              onClick={() => setShowFormat(true)}
              disabled={downloading}
              {...gradientButton(theme)}
            >
              Download Journal Insights
            </button>
          ) : (
            <div className="flex gap-2 items-center">
              {/* dropdown for file type */}
              <select
                className="flex-1 text-[clamp(0.875rem,1.5vw,1rem)] w-fit px-3 py-2.25 mt-3 lg:mt-0 rounded-[10px] bg-white cursor-pointer"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                value={downloadFormat}
                onChange={(e) =>
                  setDownloadFormat(e.target.value as 'text' | 'pdf')
                }
              >
                <option value="text">Text File</option>
                <option value="pdf">PDF File</option>
              </select>
              <button
                onClick={() => handleDownload(downloadFormat)}
                disabled={downloading}
                {...gradientButton(theme)}
              >
                {!downloading ? <Download /> : <Loader />}
              </button>
              <button
                onClick={() => setShowFormat(false)}
                {...redButton(theme)}
              >
                <X />
              </button>
            </div>
          )}
        </div>

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
