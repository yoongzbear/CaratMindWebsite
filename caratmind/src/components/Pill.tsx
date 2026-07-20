type PillItems = {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  size?: 'sm' | 'md';
  title?: string;
  className?: string;
  shaded?: boolean;
};

export default function Pill({
  children,
  bgColor = 'var(--bg-div)',
  textColor = 'var(--text)',
  borderColor = 'var(--border)',
  size = 'md',
  title,
  className = '',
  shaded = false,
}: PillItems) {
  return (
    <span
      className={`text-[clamp(0.875rem,1.5vw,1rem)] ${className}`}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        borderRadius: '999px',
        border: `1px solid ${borderColor}`,
        background: bgColor,
        filter: shaded ? 'brightness(0.95)' : undefined,
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
