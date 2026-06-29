type PillItems = {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  size?: 'sm' | 'md';
  title?: string;
};

export default function Pill({
  children,
  bgColor = '#f4f7fc', // default
  textColor = '#3a4a6b',
  borderColor = '#dde4f0',
  size = 'md',
  title,
}: PillItems) {
  return (
    <span
      className="sm:text-[12px] md:text-[14px]"
      title={title}
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
