'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { djangoApiUrl } from '@/utils/api/django';

/**
 * Calls the Django API with `Authorization: Bearer <Cognito access token>`.
 * Backend validates the JWT and returns allowed/forbidden.
 */
export function useDjangoApi() {
  const { authFetch } = useAuth();

  const getMe = useCallback(async () => {
    const res = await authFetch(djangoApiUrl('/api/me/'));
    return res.json() as Promise<{
      allowed: boolean;
      user?: { username: string; email: string; sub: string };
      error?: string;
    }>;
  }, [authFetch]);

  return { authFetch, getMe, djangoApiUrl };
}
