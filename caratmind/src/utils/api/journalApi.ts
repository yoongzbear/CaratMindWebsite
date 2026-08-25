// simplify calling APIs

import {
  Journal,
  JournalDetail,
  JournalInsightToDownload,
  StatusKey,
} from '../../types/journal';
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

export async function getJournalCalendarDates(
  month: string,
  accessToken: string,
): Promise<{ journalDates: string[] }> {
  return request<{ journalDates: string[] }>(
    `/api/journal/calendar_dates?month=${month}`,
    {
      accessToken,
    },
  );
  // return data.entries;
}

export async function downloadJournalEntry(
  accessToken: string,
): Promise<{ entries: JournalInsightToDownload[] }> {
  return request<{ entries: JournalInsightToDownload[] }>(
    '/api/journal/download',
    {
      accessToken,
    },
  );
}
