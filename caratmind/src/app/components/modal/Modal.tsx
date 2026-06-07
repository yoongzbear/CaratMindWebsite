'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { C } from '@/app/styles/styles';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  width?: number;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  width = 700,
  children,
  footer,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: 'rgba(20,30,50,0.35)',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-md overflow-hidden"
        style={{
          //   width: '100%',
          maxWidth: `${width}px`,
          background: 'white',
          //   borderRadius: '20px',
          border: `1px solid ${C.border}`,
          boxShadow: '0 20px 60px rgba(58,74,107,0.18)',
          //   overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            {title && (
              <h2
                style={{
                  color: C.navy,
                  fontSize: '24px',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <p
                style={{
                  marginTop: '4px',
                  fontSize: '13px',
                  color: C.faint,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-2 pt-0 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={20} color={C.muted} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-2 pb-1">{children}</div>

        {/* Footer */}
        {footer && <div className="p-6 pt-0">{footer}</div>}
      </div>
    </div>
  );
}
