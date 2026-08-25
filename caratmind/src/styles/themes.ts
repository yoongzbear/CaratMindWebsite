// themes
export type ThemeName =
  | 'light'
  | 'dark'
  | 'cherryBlossoms'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'winter'
  | 'emeraldSea'
  | 'midnightSun';

export const themes: Record<ThemeName, Record<string, string>> = {
  // default
  light: {
    text: '#000000',
    muted: '#9aa8c4',
    faint: '#b0bcd4',
    border: '#dde4f0',
    bg: '#ffffff',
    firstColor: '#F7CAC9',
    secondColor: '#92A8D1',
    gradient: 'linear-gradient(130deg,#F7CAC9,#92A8D1)',
    bgPage: 'linear-gradient(150deg, #f9f4f5 0%, #f0f4fa 100%)',
    bgTopbar: 'rgba(253,250,251)',
    bgDiv: '#ffffff',
  },

  dark: {
    text: '#f8fafc',
    muted: '#d1d5db',
    faint: '#b6beca',
    border: '#4b5563',
    bg: '#0f172a',
    firstColor: '#c98f92',
    secondColor: '#5b6f99',
    gradient: 'linear-gradient(130deg,#c98f92,#5b6f99)',
    bgPage: 'linear-gradient(150deg, #111827 0%, #0f172a 100%)',
    bgTopbar: 'rgba(15,23,42)',
    bgDiv: '#3e4554',
  },

  cherryBlossoms: {
    text: '#7a1550',
    muted: '#c17ba0',
    faint: '#e8b8d0',
    border: '#f7dcea',
    bg: '#fff5fa',
    firstColor: '#FBD3E9',
    secondColor: '#BB377D',
    gradient: 'linear-gradient(130deg,#FBD3E9,#BB377D)',
    bgPage: 'linear-gradient(150deg, #fff5fa 0%, #fbe8f2 100%)',
    bgTopbar: 'rgba(255,250,253)',
    bgDiv: '#ffffff',
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
    bgPage: 'linear-gradient(150deg, #f2f9ff 0%, #e8f3fd 100%)',
    bgTopbar: 'rgba(247,251,255)',
    bgDiv: '#ffffff',
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
    bgPage: 'linear-gradient(150deg, #f2fbf4 0%, #eef7f0 100%)',
    bgTopbar: 'rgba(248,253,249)',
    bgDiv: '#ffffff',
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
    bgPage: 'linear-gradient(150deg, #fff6ec 0%, #fdeee4 100%)',
    bgTopbar: 'rgba(255,250,245)',
    bgDiv: '#ffffff',
  },

  winter: {
    text: '#1c2e33',
    muted: '#7d9298',
    faint: '#a9bcc0',
    border: '#dfe7e8',
    bg: '#f7f9f9',
    firstColor: '#E6DADA',
    secondColor: '#274046',
    gradient: 'linear-gradient(130deg,#E6DADA,#274046)',
    bgPage: 'linear-gradient(150deg, #f7f4f4 0%, #eef3f3 100%)',
    bgTopbar: 'rgba(250,249,249)',
    bgDiv: '#ffffff',
  },

  emeraldSea: {
    text: '#04283f',
    muted: '#3f8a72',
    faint: '#8fd6b8',
    border: '#cdeee0',
    bg: '#f0fbf6',
    firstColor: '#05386b',
    secondColor: '#5cdb95',
    gradient: 'linear-gradient(130deg,#05386b,#5cdb95)',
    bgPage: 'linear-gradient(150deg, #eef6fb 0%, #eafbf3 100%)',
    bgTopbar: 'rgba(247,253,251)',
    bgDiv: '#ffffff',
  },

  midnightSun: {
    text: '#3a0d2b',
    muted: '#c76a8f',
    faint: '#f5c66e',
    border: '#fadfba',
    bg: '#fff8ef',
    firstColor: '#ff1493',
    secondColor: '#fdda25',
    gradient: 'linear-gradient(130deg,#ff1493,#fdda25)',
    bgPage: 'linear-gradient(150deg, #fff0f6 0%, #fffaeb 100%)',
    bgTopbar: 'rgba(255,251,248)',
    bgDiv: '#ffffff',
  },
};

export const buttonGradientColor: Record<ThemeName, string> = {
  light: 'bg-gradient-to-r from-[#F7CAC9] to-[#92A8D1] text-[#000000]',
  dark: 'bg-gradient-to-r from-[#c98f92] to-[#5b6f99] text-white',
  cherryBlossoms: 'bg-gradient-to-r from-[#FBD3E9] to-[#BB377D] text-white',
  ocean: 'bg-gradient-to-r from-[#92A8D1] to-[#60a5fa] text-[#1e3a8a]',
  forest: 'bg-gradient-to-r from-[#8fc9a3] to-[#F7CAC9] text-[#14532d]',
  sunset: 'bg-gradient-to-r from-[#F7CAC9] to-[#f97316] text-[#7c2d12]',
  winter: 'bg-gradient-to-r from-[#E6DADA] to-[#274046] text-white',
  emeraldSea: 'bg-gradient-to-r from-[#05386b] to-[#5cdb95] text-white',
  midnightSun: 'bg-gradient-to-r from-[#ff1493] to-[#fdda25] text-[#3a0d2b]',
};

export const buttonOutlined = buttonGradientColor;
