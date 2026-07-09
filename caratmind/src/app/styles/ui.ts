// UI components

import { buttonGradientColor } from './styles';
import { C, ThemeName, themes } from './themes';

/*
clamp(minimum, preferred, maximum)
Minimum: 3rem (48px, assuming 1rem = 16px)
Preferred: 8vw (8% of the viewport width)
Maximum: 5.5rem (88px)

h1 - className="text-[22px] sm:text-[28px] md:text-[32px] font-bold mt-0 mb-2"
            style={{ color: C.navy }}
h1 (splash) - text-[clamp(3rem,8vw,5.5rem)]
h1 - text-[clamp(1.38rem,7vw,2rem)]

h2 - sm:text-[26px] md:text-[30px]
// h2 - text-[clamp(2.75rem,7vw,5.25rem)]

h3 - text-[20px] sm:text-[24px] md:text-[28px]
h3 - text-[clamp(1.25rem,5vw,1.75rem)]

h4 - sm:text-[22px] md:text-[26px]
h4 - text-[clamp(1.15rem,4vw,1.65rem)]

h5 - text-[16px] sm:text-[20px] md:text-[24px]
h5 - text-[clamp(1rem,3vw,2rem)]

footer title - text-[16px] md:text-[18px]
text-[clamp(1rem,2vw,1.15rem)]

loading... - text-[clamp(1rem,3vw,2rem)]

normal text - text-[15px] sm:text-[14px] md:text-[16px]
normal text - text-[clamp(0.875rem,1.5vw,1rem)]

subtitle text - text-[10px] sm:text-[11px] md:text-[13px]
text-[clamp(0.7rem,1.5vw,0.85rem)]

button - font-bold text-[13px] sm:text-[12px] md:text-[14px]
button - text-[clamp(0.875rem,1.5vw,1rem)]
*/

// Tailwind classes
// className={...}
// className={`w-full ${buttonGradient}`}

// texts
export const labelStyle = `block sm:text-[14px] md:text-[16px] font-semibold mb-1`;
//   export const labelStyle = `block text-[12px] sm:text-[14px] md:text-[16px] font-semibold mb-[6px]`;

export const inputStyle = `w-full box-border px-3 py-2.75 rounded-lg border border-slate-200 sm:text-[14px] md:text-[16px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 mb-3.5 font-inherit`;
// export const inputStyle = `w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300`;

export const preInputStyle = `w-full box-border px-3 py-2.75 flex items rounded-lg flex items-center justify-between bg-[${C.backgroundFaint}] border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 mb-3.5 font-inherit`;

export const textareaStyle = `w-full min-h-24 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 resize-y focus:outline-none focus:ring-2 focus:ring-slate-300`;

export const selectStyle = `w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300`;

export const dateInputStyle = `box-border px-3 py-2.75 rounded-[10px] text-sm font-inherit bg-white outline-none cursor-pointer appearance-none`;

export const dropdownStyle = `w-full px-3 py-2.25 rounded-[10px] text-[13px] font-inherit bg-white outline-none cursor-pointer appearance-none`;

export const header1 = `text-2xl font-bold text-slate-800`;

export const header3 = `text-xl font-bold text-slate-800`;

export const title = `text-lg font-semibold text-slate-800`;

export const subtitle = `text-xs text-slate-400 mt-1`;

export const errorTextStyle = `text-red-500 text-xs pb-2`;

export const pText = `mt-0 mb-2.5`;

// buttons
export const buttonGradient = `inline-flex cursor-pointer items-center px-4 justify-center gap-1.5 ${buttonGradientColor} border-2 text-white sm:text-[14px] md:text-[16px] font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 disabled:opacity-50`;

// export const buttonBase = `inline-flex items-center justify-center gap-1 px-5 py-2 rounded-xl text-sm font-semibold transition-opacity duration-150`;
// export const buttonBase = `
//   w-full
//   px-5 py-2
//   rounded-[10px]
//   font-semibold
//   text-[13px]
//   text-white
//   no-underline
//   ml-2
//   transition-opacity
//   duration-150
// `;

// export const buttonGradient = `bg-gradient-to-r from-slate-400 to-pink-300 text-white hover:opacity-90`;

// export const buttonOutlined = `border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-400 bg-white`;

// export const buttonDanger = `bg-red-500 text-white hover:bg-red-600`;

// export const buttonSuccess = `bg-green-500 text-white hover:bg-green-600`;

// export const buttonGradientColor = `bg-[linear-gradient(130deg,#92A8D1,#F7CAC9)]
//   hover:[background:linear-gradient(#fff,#fff)_padding-box,_linear-gradient(130deg,#F7CAC9,#92A8D1)_border-box]
//   hover:border-2
//   hover:border-transparent
//   hover:text-[#1B2A41]
// `;

// export const buttonOutlined = `mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium
// rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-[#9aa8c4] border border-[#dde4f0] bg-white
// hover:text-[#3a4a6b] hover:border-[#9aa8c4] hover:bg-[#f8faff]`;

export const buttonStyle = `w-full px-5 py-2.5 rounded-[10px] border-0 font-semibold text-[13px] font-inherit text-white ml-2 cursor-pointer transition-opacity duration-150 ease-in-out`;

// export const buttonGradientColor = (theme: ThemeName) => `
//   bg-[${themes[theme].gradient}]
//   hover:[background:linear-gradient(#fff,#fff)_padding-box,_${themes[theme].gradient}_border-box]
//   hover:border-2
//   hover:border-transparent
//   hover:text-[${themes[theme].text}]
// `;

// export const buttonOutlined = (theme: ThemeName) => `
//   mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium
//   rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-[${themes[theme].muted}]
//   border border-[${themes[theme].border}] bg-[${themes[theme].bg}]
//   hover:text-[${themes[theme].text}] hover:border-[${themes[theme].muted}] hover:bg-[#f8faff]
// `;

export const buttonRed = `mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium 
rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-[#e57373] border border-[#f3caca] bg-white 
hover:text-[#c62828] hover:border-[#e57373] hover:bg-[#fff5f5]`;

export const buttonGreen = `mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium 
rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-[#66bb6a] border border-[#c8e6c9] bg-white 
hover:text-[#2e7d32] hover:border-[#66bb6a] hover:bg-[#f1f8f4]`;

// section / div
export const table = `w-full border-collapse table-fixed`;

export const th = `px-4 py-2 text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50`;

export const td = `px-4 py-3 text-sm text-slate-600 truncate`; // maxWidth: '200px',

export const containerStyle = `max-w-2xl mx-auto`;

export const cardStyle = `bg-white rounded-xl border border-slate-100 shadow-sm p-4`;
