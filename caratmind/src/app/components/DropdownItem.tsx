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
          className="text-[clamp(0.875rem,1.5vw,1rem)] no-underline px-4 py-2.25 rounded-lg font-medium bg-transparent border border-transparent transition-all duration-150 ease-in-out flex items-center justify-between gap-2 whitespace-nowrap cursor-pointer w-max"
          style={{ color: C.muted }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.label}
          {hasChildren && <span>▸</span>}
        </Link>
      ) : (
        <button
          className="text-[clamp(0.875rem,1.5vw,1rem)] no-underline px-4 py-2.25 rounded-lg font-medium bg-transparent border border-transparent transition-all duration-150 ease-in-out flex items-center justify-between gap-2 whitespace-nowrap cursor-pointer w-max"
          style={{ color: C.muted }}
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
          className="absolute bg-white rounded-xl text-[clamp(0.875rem,1.5vw,1rem)] font-bold
        shadow-[0_8px_24px_rgba(146,168,209,0.18)] min-w-50 p-1.5 z-100 border top-full left-0 peer-hover:top-0 peer-hover:left-full"
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
