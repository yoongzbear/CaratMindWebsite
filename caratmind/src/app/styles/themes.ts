// themes
export type ThemeName =
  | 'light'
  | 'dark'
  | 'rose'
  | 'ocean'
  | 'forest'
  | 'sunset';

export const themes: Record<ThemeName, Record<string, string>> = {
  // default
  light: {
    text: '#3a4a6b',
    muted: '#9aa8c4',
    faint: '#b0bcd4',
    border: '#dde4f0',
    bg: '#ffffff',
    firstColor: '#F7CAC9',
    secondColor: '#92A8D1',
    gradient: 'linear-gradient(130deg,#F7CAC9,#92A8D1)',
    bgSidebar: 'linear-gradient(180deg, #eef2f9 0%, #f9f0f1 100%)',
    bgPage: 'linear-gradient(150deg, #f9f4f5 0%, #f0f4fa 100%)',
    bgTopbar: 'rgba(253,250,251,1)',
  },

  dark: {
    text: '#e5e7eb',
    muted: '#9ca3af',
    faint: '#6b7280',
    border: '#374151',
    bg: '#0f172a',
    firstColor: '#c98f92',
    secondColor: '#5b6f99',
    gradient: 'linear-gradient(130deg,#c98f92,#5b6f99)',
    bgSidebar: 'linear-gradient(180deg, #1e293b 0%, #172033 100%)',
    bgPage: 'linear-gradient(150deg, #111827 0%, #0f172a 100%)',
    bgTopbar: 'rgba(15,23,42,0.9)',
  },

  rose: {
    text: '#3a4a6b',
    muted: '#b48d95',
    faint: '#e0b8c0',
    border: '#f3e1e8',
    bg: '#fff7f8',
    firstColor: '#F7CAC9',
    secondColor: '#ffd6d6',
    gradient: 'linear-gradient(130deg,#F7CAC9,#ffd6d6)',
    bgSidebar: 'linear-gradient(180deg, #fdf0f2 0%, #fbe6ea 100%)',
    bgPage: 'linear-gradient(150deg, #fff5f6 0%, #fdeef0 100%)',
    bgTopbar: 'rgba(255,249,250,1)',
  },

  ocean: {
    text: '#1e3a8a',
    muted: '#7a93c4',
    faint: '#a9c0e8',
    border: '#cbd8ef',
    bg: '#f0f9ff',
    firstColor: '#92A8D1',
    secondColor: '#60a5fa',
    gradient: 'linear-gradient(130deg,#92A8D1,#60a5fa)',
    bgSidebar: 'linear-gradient(180deg, #eaf2fb 0%, #e3f0fb 100%)',
    bgPage: 'linear-gradient(150deg, #f2f9ff 0%, #e8f3fd 100%)',
    bgTopbar: 'rgba(247,251,255,1)',
  },

  forest: {
    text: '#14532d',
    muted: '#7c9885',
    faint: '#a8c9b3',
    border: '#d6ebdc',
    bg: '#f0fdf4',
    firstColor: '#8fc9a3',
    secondColor: '#F7CAC9',
    gradient: 'linear-gradient(130deg,#8fc9a3,#F7CAC9)',
    bgSidebar: 'linear-gradient(180deg, #eaf7ee 0%, #f5efe9 100%)',
    bgPage: 'linear-gradient(150deg, #f2fbf4 0%, #eef7f0 100%)',
    bgTopbar: 'rgba(248,253,249,1)',
  },

  sunset: {
    text: '#7c2d12',
    muted: '#c68a72',
    faint: '#e3b7a4',
    border: '#fadbc8',
    bg: '#fff7ed',
    firstColor: '#F7CAC9',
    secondColor: '#f97316',
    gradient: 'linear-gradient(130deg,#F7CAC9,#f97316)',
    bgSidebar: 'linear-gradient(180deg, #fdf0e6 0%, #f9e6df 100%)',
    bgPage: 'linear-gradient(150deg, #fff6ec 0%, #fdeee4 100%)',
    bgTopbar: 'rgba(255,250,245,1)',
  },
};

export const buttonGradientColor: Record<ThemeName, string> = {
  light: 'bg-gradient-to-r from-[#F7CAC9] to-[#92A8D1] text-[#3a4a6b]',
  dark: 'bg-gradient-to-r from-[#c98f92] to-[#5b6f99] text-white',
  rose: 'bg-gradient-to-r from-[#F7CAC9] to-[#ffd6d6] text-[#3a4a6b]',
  ocean: 'bg-gradient-to-r from-[#92A8D1] to-[#60a5fa] text-[#1e3a8a]',
  forest: 'bg-gradient-to-r from-[#8fc9a3] to-[#F7CAC9] text-[#14532d]',
  sunset: 'bg-gradient-to-r from-[#F7CAC9] to-[#f97316] text-[#7c2d12]',
};

export const buttonOutlined = buttonGradientColor;
