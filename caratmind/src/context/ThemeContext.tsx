'use client';

import { ThemeName, themes } from '@/app/styles/themes';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { toastSuccess } from '@/utils/toast';

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  saving: boolean;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const STORAGE_KEY = 'app-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, accessToken } = useAuth();
  const [theme, setThemeState] = useState<ThemeName>('light');
  const [saving, setSaving] = useState(false);

  // load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved && themes[saved]) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (!user || !accessToken) return;

    fetch('/api/theme/get_theme', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.theme && themes[data.theme as ThemeName]) {
          setThemeState(data.theme);
          localStorage.setItem(STORAGE_KEY, data.theme);
        }
      })
      .catch(() => {});
  }, [user, accessToken]);

  // apply CSS variables whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback(
    async (t: ThemeName) => {
      setThemeState(t);
      localStorage.setItem(STORAGE_KEY, t);

      if (!user || !accessToken) return;

      setSaving(true);
      try {
        await fetch('/api/theme/update_theme', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme: t }),
        });

        toastSuccess('Saved theme successfully.');
      } catch {
      } finally {
        setSaving(false);
      }
    },
    [user, accessToken],
  );

  // reset when logout
  const resetTheme = useCallback(() => {
    setThemeState('light');
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, saving, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
