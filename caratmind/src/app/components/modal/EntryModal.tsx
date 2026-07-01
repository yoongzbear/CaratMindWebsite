// for entry details

'use client';

import { useState } from 'react';
import Modal from './Modal';
import { buttonGradientColor, buttonRed, C, styles } from '@/app/styles/styles';
import { useRouter } from 'next/navigation';
import { JournalDetail } from '@/app/types/journal';

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
  // entry,
  journal,
}: Props) {
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
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white sm:text-[12px] md:text-[14px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              Edit Entry
            </button>
            <button className={buttonRed} onClick={() => setOpenDelete(true)}>
              Delete Entry
            </button>
          </div>
        }
      >
        <p
          className="sm:text-[14px] md:text-[16px] mt-0 mb-2.5"
          style={{ color: C.navy }}
        >
          {journal.entryText}
        </p>
      </Modal>

      <DeleteEntryModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      />
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
      title="Cannot delete entry"
    >
      <p
        className="sm:text-[18px] md:text-[20px] mt-0 mb-2.5"
        style={{ color: C.navy }}
      >
        You are not allowed to delete a journal entry after submitted. Do not
        worry, no one will see your entry!
      </p>
    </Modal>
  );
}
