'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { SessionUser } from '@/lib/auth/session-response';

type AuthContextValue = {
  user: SessionUser | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  authFetch: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);

  const applySession = useCallback(
    (payload: { accessToken: string; user: SessionUser } | null) => {
      if (!payload) {
        accessTokenRef.current = null;
        setAccessToken(null);
        setUser(null);
        return;
      }
      accessTokenRef.current = payload.accessToken;
      setAccessToken(payload.accessToken);
      setUser(payload.user);
    },
    [],
  );

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) {
        applySession(null);
        return false;
      }
      const data = await res.json();
      applySession({
        accessToken: data.accessToken,
        user: data.user,
      });
      return true;
    } catch {
      applySession(null);
      return false;
    }
  }, [applySession]);

  useEffect(() => {
    const init = async () => {
      await refreshSession();
      setLoading(false);
    };

    init();
  }, [refreshSession]);

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Sign in failed');
      }
      applySession({ accessToken: data.accessToken, user: data.user });
    },
    [applySession],
  );

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ accessToken: accessTokenRef.current }),
    });
    applySession(null);
  }, [applySession]);

  const authFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const token = accessTokenRef.current;
      const headers = new Headers(init.headers);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return fetch(input, { ...init, headers, credentials: 'include' });
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    await refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      signIn,
      signOut,
      refreshSession,
      authFetch,
      refreshUser,
    }),
    [
      user,
      accessToken,
      loading,
      signIn,
      signOut,
      refreshSession,
      authFetch,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
