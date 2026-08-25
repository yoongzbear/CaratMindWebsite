// simplify calling APIs

import { Journal, JournalDetail, StatusKey } from '../../types/journal';
import { request } from './apiUtils';

type JournalStreakResponse = {
  streak: number;
  submitted_today: boolean;
  new_badge: string;
};

type NewJournalResponse = {
  jrnl_id: string;
  status: string;
  createdAt: string;
};

type EditJournalResponse = {
  success: boolean;
  jrnl_id: string;
};

export async function getJournalEntry(
  jrnlId: string,
  accessToken: string,
): Promise<JournalDetail> {
  return request<JournalDetail>(`/api/journal/${jrnlId}`, { accessToken });
}

export async function getJournalStreak(
  accessToken: string,
): Promise<JournalStreakResponse> {
  return request<JournalStreakResponse>('/api/journal/streak', { accessToken });
}

export async function createNewJournal(
  entry: string,
  status: StatusKey,
  accessToken: string,
): Promise<NewJournalResponse> {
  const data = await request<NewJournalResponse>('/api/journal/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entry, status }),
    accessToken,
    cache: 'no-store',
  });

  return data;
}

export async function editJournal(
  jrnl_id: string,
  entry: string,
  status: StatusKey,
  accessToken: string,
): Promise<EditJournalResponse> {
  const data = await request<EditJournalResponse>(
    `/api/journal/${jrnl_id}/edit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entry, status }),
      accessToken,
      cache: 'no-store',
    },
  );

  return data;
}

export async function getEntriesList(
  date: string,
  accessToken: string,
): Promise<Journal[]> {
  const data = await request<{ entries: Journal[] }>(
    `/api/journal/list?date=${date}`,
    {
      accessToken,
    },
  );
  return data.entries;
}

type JournalEntryToDownload = { jrnl_created_at: string; entryText: string };

export async function downloadJournalEntry(
  accessToken: string,
): Promise<{ entries: JournalEntryToDownload[] }> {
  return request<{ entries: JournalEntryToDownload[] }>(
    '/api/journal/download',
    {
      accessToken,
    },
  );
  // return data.entries;
}
