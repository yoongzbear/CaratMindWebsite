'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { C, navBarStyle } from '@/app/styles/styles';

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
          style={navBarStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.label}
          {hasChildren && <span>▸</span>}
        </Link>
      ) : (
        <button
          style={{
            ...navBarStyle,
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
          className="absolute bg-white rounded-xl shadow-[0_8px_24px_rgba(146,168,209,0.18)] min-w-50 p-1.5 z-100 border border-[C.border]
  top-[110%] left-0 peer-hover:top-0 peer-hover:left-full"
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
