import { MoodName } from './mood';

export type Journal = {
  jrnl_id: string;
  jrnl_entry_key: string;
  jrnl_created_at: string;
  jrnl_submitted_at: string;
  jrnl_updated_at: string;
  jrnl_status: StatusKey;
  jrnl_preview?: string;
  mood_id?: string;
  mood_name?: MoodName;
  uex_id?: string;
  user_id: string;
};

export type StatusKey = 'draft' | 'submitted';

export const STATUS_LABEL: Record<StatusKey, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
};

export type JournalDetail = Journal & { entryText: string };
