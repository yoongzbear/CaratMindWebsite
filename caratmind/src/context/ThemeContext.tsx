'use client';

import { createContext, useContext, useState } from 'react';
import { themes, ThemeName } from '@/app/styles/themes';

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  colors: (typeof themes)['light'];
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('light');

  const value = {
    theme,
    setTheme,
    colors: themes[theme],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
