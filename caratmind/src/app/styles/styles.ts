import { CSSProperties } from 'react';
import { ThemeName, themes } from './themes';

// export const C = {
//   roseQuartz: '#F7CAC9', // second
//   serenity: '#92A8D1', // first
//   navy: '#3a4a6b',
//   muted: '#9aa8c4',
//   faint: '#b0bcd4',
//   border: '#dde4f0',
//   bgSidebar: 'linear-gradient(180deg, #eef2f9 0%, #f9f0f1 100%)',
//   bgPage: 'linear-gradient(150deg, #f9f4f5 0%, #f0f4fa 100%)',
//   bgTopbar: 'rgba(253,250,251,0.92)',
// };

// shared style for clamped text cells
// export const clampedCell: React.CSSProperties = {
//   padding: '14px 20px',
//   fontSize: '13px',
//   color: '#6a7fa8',
//   maxWidth: '120px',
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
//   textOverflow: 'ellipsis',
// };

// nav bar style
export const navBarStyle = (theme: ThemeName): React.CSSProperties => ({
  textDecoration: 'none',
  padding: '9px 16px',
  borderRadius: '8px',
  fontSize: '13.5px',
  fontWeight: 500,
  color: themes[theme].faint,
  background: 'transparent',
  border: '1px solid transparent',
  transition: 'all 0.15s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  width: 'max-content',
});

// font
export const fontType: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
};

// text class
// export const labelStyle = `block text-[12px] sm:text-[14px] md:text-[16px] font-semibold mb-[6px]`;

// button
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

// export const buttonGradientColor = `bg-[linear-gradient(130deg,#92A8D1,#F7CAC9)]
//   hover:[background:linear-gradient(#fff,#fff)_padding-box,_linear-gradient(130deg,#F7CAC9,#92A8D1)_border-box]
//   hover:border-2
//   hover:border-transparent
//   hover:text-[#1B2A41]
// `;

// export const buttonOutlined = `mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium
// rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-[#9aa8c4] border border-[#dde4f0] bg-white
// hover:text-[#3a4a6b] hover:border-[#9aa8c4] hover:bg-[#f8faff]`;

// export const buttonRed = `mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium
// rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-[#e57373] border border-[#f3caca] bg-white
// hover:text-[#c62828] hover:border-[#e57373] hover:bg-[#fff5f5]`;

// export const buttonGreen = `mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium
// rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-[#66bb6a] border border-[#c8e6c9] bg-white
// hover:text-[#2e7d32] hover:border-[#66bb6a] hover:bg-[#f1f8f4]`;

// base styles
// export const td: React.CSSProperties = {
//   padding: '14px 16px',
//   fontSize: '12px',
//   color: '#6a7fa8',
//   maxWidth: '200px',
// };

export const styles: Record<string, CSSProperties> = {
  // container: {
  //   maxWidth: '520px',
  // },

  // not used yet (NU)
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '22px',
  },

  // NU
  // parent div of content
  mainDiv: { display: 'flex', gap: '18px', alignItems: 'flex-start' },

  // nu
  div: {
    background: 'white',
    borderRadius: '14px',
    border: '1px solid #eef2f9',
    boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
    marginBottom: '30px',
  },

  // header1: {
  //   fontWeight: 700,
  //   fontSize: '24px',
  //   // color: C.navy,
  // },

  // header3: {
  //   fontWeight: 700,
  //   fontSize: '20px',
  //   // color: C.navy,
  // },

  // title: {
  //   fontWeight: 700,
  //   fontSize: '18px',
  //   // color: C.navy,
  // },

  // subtitle: {
  //   fontSize: '12px',
  //   // color: C.faint,
  //   marginTop: '2px',
  // },

  // errorTextStyle: {
  //   color: '#FF0000',
  //   fontSize: '12px',
  //   paddingBottom: '10px',
  // },

  // nu
  form: {
    background: 'white',
    borderRadius: '14px',
    // border: `1px solid ${C.border}`,
    boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
    padding: '24px',
  },

  // label: {
  //   display: 'block',
  //   fontSize: '12px',
  //   fontWeight: 600,
  //   color: C.muted,
  //   marginBottom: '6px',
  // },

  // pText: {
  //   marginTop: 0,
  //   marginBottom: 10,
  //   // color: C.navy,
  // },

  // input: {
  //   width: '100%',
  //   boxSizing: 'border-box',
  //   padding: '11px 12px',
  //   borderRadius: '10px',
  //   // border: `1px solid ${C.border}`,
  //   fontSize: '14px',
  //   marginBottom: '14px',
  //   fontFamily: 'inherit',
  //   color: '#000',
  // },

  // preInput: {
  //   width: '100%',
  //   boxSizing: 'border-box',
  //   padding: '11px 12px',
  //   borderRadius: '10px',
  //   // border: `1px solid ${C.border}`,
  //   fontSize: '14px',
  //   marginBottom: '14px',
  //   fontFamily: 'inherit',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   background: '#f8f8fb',
  //   // color: C.navy,
  // },

  // dateInput: {
  //   boxSizing: 'border-box',
  //   padding: '11px 12px',
  //   borderRadius: '10px',
  //   // border: `1px solid ${C.border}`,
  //   fontSize: '14px',
  //   fontFamily: 'inherit',
  //   // color: C.navy,
  //   background: 'white',
  //   outline: 'none',
  //   cursor: 'pointer',
  //   appearance: 'none',
  // },

  // textarea: {
  //   width: '100%',
  //   minHeight: '96px',
  //   padding: '10px 12px',
  //   borderRadius: '8px',
  //   // border: `1px solid ${C.border}`,
  //   fontSize: '14px',
  //   fontFamily: 'inherit',
  //   // color: C.navy,
  //   background: 'white',
  //   resize: 'vertical',
  //   boxSizing: 'border-box',
  //   outline: 'none',
  // },

  // select: {
  //   width: '100%',
  //   boxSizing: 'border-box',
  //   padding: '11px 12px',
  //   borderRadius: '10px',
  //   // border: `1px solid ${C.border}`,
  //   fontSize: '14px',
  //   marginBottom: '14px',
  //   fontFamily: 'inherit',
  //   background: 'white',
  //   color: '#000',
  // },

  // button: {
  //   width: '100%',
  //   padding: '8px 20px',
  //   borderRadius: '10px',
  //   border: 'none',
  //   fontWeight: 600,
  //   fontSize: '13px',
  //   fontFamily: 'inherit',
  //   color: 'white',
  //   // background: `linear-gradient(130deg, ${C.serenity}, ${C.roseQuartz})`,
  //   textDecoration: 'none',
  //   marginLeft: '8px',
  //   cursor: 'pointer',
  //   transition: 'opacity 0.15s',
  // },

  // NU
  // for in mini div
  // button2: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   gap: '4px',
  //   padding: '9px 18px',
  //   borderRadius: '10px',
  //   border: 'none',
  //   fontWeight: 600,
  //   fontSize: '13px',
  //   fontFamily: 'inherit',
  //   color: 'white',
  //   cursor: 'pointer',
  //   // background: `linear-gradient(130deg, ${C.roseQuartz}, ${C.serenity})`,
  //   whiteSpace: 'nowrap',
  // },

  //NU
  // button in table
  // buttonTable: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   gap: '4px',
  //   padding: '5px 10px',
  //   borderRadius: '8px',
  //   // border: `1px solid ${C.border}`,
  //   background: 'white',
  //   fontSize: '12px',
  //   fontWeight: 600,
  //   // color: C.serenity,
  //   cursor: 'pointer',
  //   fontFamily: 'inherit',
  //   whiteSpace: 'nowrap',
  // },

  // NU
  // search: {
  //   paddingLeft: '34px',
  //   paddingRight: '12px',
  //   paddingTop: '9px',
  //   paddingBottom: '9px',
  //   borderRadius: '10px',
  //   // border: `1px solid ${C.border}`,
  //   fontSize: '13px',
  //   fontFamily: 'inherit',
  //   // color: C.navy,
  //   outline: 'none',
  //   width: '180px',
  // },

  // dropdown: {
  //   padding: '9px 12px',
  //   borderRadius: '10px',
  //   // border: `1px solid ${C.border}`,
  //   fontSize: '13px',
  //   fontFamily: 'inherit',
  //   // color: C.navy,
  //   background: 'white',
  //   outline: 'none',
  //   cursor: 'pointer',
  // },

  // NU
  // loading style
  // loadingText: {
  //   padding: '20px',
  //   textAlign: 'center',
  //   // color: C.faint,
  //   fontSize: '13px',
  // },

  // loadingTd: {
  //   padding: '40px',
  //   textAlign: 'center',
  //   // color: C.faint,
  //   fontSize: '14px',
  // },

  // // table styles
  // allDocsTable: {
  //   width: '100%',
  //   borderCollapse: 'collapse',
  //   tableLayout: 'fixed',
  // },

  // tableHeader: {
  //   padding: '10px 16px',
  //   textAlign: 'left',
  //   fontSize: '11px',
  //   fontWeight: 600,
  //   // color: C.faint,
  //   letterSpacing: '0.08em',
  //   textTransform: 'uppercase',
  //   background: '#fafbfd',
  // },

  // emptyTd: {
  //   padding: '24px',
  //   textAlign: 'center',
  //   // color: C.faint,
  //   fontSize: '13px',
  // },

  // faintTd: {
  //   ...td,
  //   // color: C.faint,
  // },

  // tdButton: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   gap: '5px',
  //   padding: '6px 12px',
  //   borderRadius: '8px',
  //   // border: `1px solid ${C.border}`,
  //   background: 'white',
  //   fontSize: '12px',
  //   fontWeight: 600,
  //   // color: C.serenity,
  //   cursor: 'pointer',
  //   fontFamily: 'inherit',
  //   whiteSpace: 'nowrap',
  //   transition: 'all 0.12s',
  // },

  // // for smaller tables
  // narrowBoldTd: {
  //   fontWeight: 600,
  //   padding: '10px 16px',
  //   fontSize: '12px',
  //   // color: C.navy,
  //   marginBottom: '2px',
  // },

  // narrowTd: {
  //   padding: '10px 16px',
  //   fontSize: '12px',
  //   // color: C.faint,
  // },

  // singleIconButton: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: '5px 8px',
  //   borderRadius: '8px',
  //   // border: `1px solid ${C.border}`,
  //   background: 'white',
  //   // color: C.serenity,
  //   cursor: 'pointer',
  //   transition: 'background 0.12s',
  // },
};
