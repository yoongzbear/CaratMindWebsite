export type Journal = {
  jrnl_id: string;
  jrnl_entry_key: string;
  jrnl_created_at: string;
  jrnl_submitted_at: string;
  jrnl_updated_at: string;
  jrnl_status: StatusKey;
  mood_id?: string;
  uex_id?: string;
  user_id: string;
};

export type StatusKey = 'draft' | 'submitted';

export const STATUS_LABEL: Record<StatusKey, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
};
