// for entry details

'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useRouter } from 'next/navigation';
import { JournalDetail } from '@/types/journal';
import { gradientButton } from '@/styles/ui';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  open: boolean;
  onClose: () => void;
  date: string;
  lastUpdated: string;
  // entry: string;
  journal: JournalDetail;
};

export default function EntryDetailModal({
  open,
  onClose,
  date,
  lastUpdated,
  journal,
}: Props) {
  const { theme } = useTheme();
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();
  const handleEdit = (jrnl_id: string) => {
    router.push(`/journal/edit/${jrnl_id}`);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        width={900}
        title={date}
        subtitle={`Last updated: ${lastUpdated}`}
        footer={
          <div className="flex justify-start gap-3">
            <button
              onClick={() => handleEdit(journal.jrnl_id)}
              {...gradientButton(theme)}
            >
              Edit Entry
            </button>
            {/* <button {...redButton(theme)} onClick={() => setOpenDelete(true)}>
              Delete Entry
            </button> */}
          </div>
        }
      >
        <p
          className="text-[clamp(0.875rem,1.5vw,1rem)] text-justify mt-0 mb-2.5"
          style={{ color: 'var(--text)' }}
        >
          {journal.entryText}
        </p>
      </Modal>

      {/* <DeleteEntryModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      /> */}
    </>
  );
}

// show delete entry modal
type DeleteProps = {
  open: boolean;
  onClose: () => void;
};

export function DeleteEntryModal({ open, onClose }: DeleteProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      width={600}
      title="Cannot delete entry!"
    >
      <p
        className="text-[clamp(1rem,1.5vw,1.5rem)] mt-0 mb-2.5 text-justify"
        style={{ color: 'var(--text)' }}
      >
        You are not allowed to delete a journal entry after submitted. Do not
        worry, no one will see your entry!
      </p>
    </Modal>
  );
}
