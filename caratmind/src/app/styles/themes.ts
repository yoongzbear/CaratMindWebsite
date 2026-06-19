// themes
export type ThemeName =
  | 'light'
  | 'dark'
  | 'rose'
  | 'ocean'
  | 'forest'
  | 'sunset';

export const C = {
  faint: '#b0bcd4',
  backgroundFaint: '#f8f8fb',
};

export const themes: Record<ThemeName, Record<string, string>> = {
  light: {
    text: '#3a4a6b',
    muted: '#9aa8c4',
    border: '#dde4f0',
    bg: '#ffffff',
    firstColor: '#92A8D1',
    secondColor: '#F7CAC9',
    gradient: 'linear-gradient(130deg,#92A8D1,#F7CAC9)',
  },

  dark: {
    text: '#e5e7eb',
    muted: '#9ca3af',
    border: '#374151',
    bg: '#0f172a',
    firstColor: '#1e293b',
    secondColor: '#334155',
    gradient: 'linear-gradient(130deg,#1e293b,#334155)',
  },

  rose: {
    text: '#3a4a6b',
    muted: '#9aa8c4',
    border: '#f3e1e8',
    bg: '#fff7f8',
    firstColor: '#F7CAC9',
    secondColor: '#ffd6d6',
    gradient: 'linear-gradient(130deg,#F7CAC9,#ffd6d6)',
  },

  ocean: {
    text: '#1e3a8a',
    muted: '#64748b',
    border: '#cbd5e1',
    bg: '#f0f9ff',
    firstColor: '#3b82f6',
    secondColor: '#60a5fa',
    gradient: 'linear-gradient(130deg,#3b82f6,#60a5fa)',
  },

  forest: {
    text: '#14532d',
    muted: '#4b5563',
    border: '#d1fae5',
    bg: '#f0fdf4',
    firstColor: '#22c55e',
    secondColor: '#86efac',
    gradient: 'linear-gradient(130deg,#22c55e,#86efac)',
  },

  sunset: {
    text: '#7c2d12',
    muted: '#9a3412',
    border: '#fed7aa',
    bg: '#fff7ed',
    firstColor: '#fb7185',
    secondColor: '#f97316',
    gradient: 'linear-gradient(130deg,#fb7185,#f97316)',
  },
};

export const buttonGradientColor: Record<ThemeName, string> = {
  light: 'bg-gradient-to-r from-[#92A8D1] to-[#F7CAC9] text-white',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#334155] text-white',
  rose: 'bg-gradient-to-r from-[#F7CAC9] to-[#ffd6d6] text-[#3a4a6b]',
  ocean: 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-[#1e3a8a]',
  forest: 'bg-gradient-to-r from-[#22c55e] to-[#86efac] text-[#14532d]',
  sunset: 'bg-gradient-to-r from-[#fb7185] to-[#f97316] text-[#7c2d12]',
};

export const buttonOutlined: Record<ThemeName, string> = {
  light: 'bg-gradient-to-r from-[#92A8D1] to-[#F7CAC9] text-white',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#334155] text-white',
  rose: 'bg-gradient-to-r from-[#F7CAC9] to-[#ffd6d6] text-[#3a4a6b]',
  ocean: 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-[#1e3a8a]',
  forest: 'bg-gradient-to-r from-[#22c55e] to-[#86efac] text-[#14532d]',
  sunset: 'bg-gradient-to-r from-[#fb7185] to-[#f97316] text-[#7c2d12]',
};
