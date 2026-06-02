'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { C } from '@/app/styles/styles';

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

function DropdownItem({ item, level = 0 }: { item: NavItem; level?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const hasChildren = !!item.children?.length;
  const active = item.href ? pathname === item.href : false;

  const commonStyle: React.CSSProperties = {
    textDecoration: 'none',
    padding: '9px 16px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: active ? 600 : 500,
    color: active ? C.navy : C.muted,
    background: active
      ? 'linear-gradient(130deg, rgba(247,202,201,0.4), rgba(146,168,209,0.3))'
      : 'transparent',
    border: active
      ? '1px solid rgba(146,168,209,0.25)'
      : '1px solid transparent',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    width: 'max-content',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!active) {
      e.currentTarget.style.background = 'rgba(146,168,209,0.08)';
      e.currentTarget.style.color = C.navy;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!active) {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = C.muted;
    }
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Parent Item */}
      {item.href ? (
        <Link
          href={item.href}
          style={commonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.label}
          {hasChildren && <span>▸</span>}
        </Link>
      ) : (
        <button
          style={{
            ...commonStyle,
            backgroundColor: 'transparent',
            border: active ? '1px solid rgba(146,168,209,0.25)' : 'none',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.label}
          {hasChildren && <span>{level === 0 ? '▾' : '▸'}</span>}
        </button>
      )}

      {/* Dropdown Menu */}
      {hasChildren && open && (
        <div
          style={{
            position: 'absolute',
            top: level === 0 ? '110%' : 0,
            left: level === 0 ? 0 : '100%',
            background: 'white',
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(146,168,209,0.18)',
            minWidth: '200px',
            padding: '6px',
            zIndex: 100,
          }}
        >
          {item.children?.map((child) => (
            <DropdownItem key={child.label} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownItem;
