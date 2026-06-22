type PillItems = {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  size?: 'sm' | 'md';
};

export default function Pill({
  children,
  bgColor = '#f4f7fc', // default
  textColor = '#3a4a6b',
  borderColor = '#dde4f0',
  size = 'md',
}: PillItems) {
  return (
    // pill
    //   pill: {
    //     borderRadius: '20px',
    //     padding: '3px 10px',
    //     fontSize: '11px',
    //     fontWeight: 600,
    //     whiteSpace: 'nowrap',
    //   },
    <span
      className="sm:text-[12px] md:text-[14px]"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        borderRadius: '999px',
        border: `1px solid ${borderColor}`,
        background: bgColor,
        color: textColor,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        padding: size === 'sm' ? '4px 10px' : '6px 12px',
      }}
    >
      {children}
    </span>
  );
}
