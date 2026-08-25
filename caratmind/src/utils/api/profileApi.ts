import { EmailPreference } from '@/types/notification';
import { request } from './apiUtils';

export async function updateName(
  name: string,
  accessToken: string,
): Promise<void> {
  const data = await request<void>('/api/auth/profile/update-name', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ preferredUsername: name }),
    accessToken,
    cache: 'no-store',
  });

  return data;
}

export async function getUserBadge(accessToken: string): Promise<string[]> {
  const data = await request<{ badges: string[] }>('/api/badge', {
    accessToken,
  });
  return data.badges;
}

// get notifications
export async function getEmailPreference(
  accessToken: string,
): Promise<EmailPreference> {
  const data = await request<EmailPreference>('/api/auth/email/get-email', {
    accessToken,
  });
  return data;
}

export async function updateEmailPreference(
  preference: EmailPreference,
  accessToken: string,
): Promise<void> {
  const data = await request<void>('/api/auth/email/update-email', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notification_pref: preference }),
    accessToken,
    cache: 'no-store',
  });

  return data;
}
