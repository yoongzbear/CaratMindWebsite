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
  hideClose?: boolean;
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  width = 700,
  children,
  footer,
  hideClose = false,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
      style={{
        background: 'rgba(20,30,50,0.35)',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-md overflow-hidden modal-pop"
        style={{
          maxWidth: `${width}px`,
          background: 'white',
          border: `1px solid ${C.border}`,
          boxShadow: '0 20px 60px rgba(58,74,107,0.18)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            {title && (
              <h2
                className="sm:text-[26px] md:text-[30px] font-bold m-0"
                style={{
                  color: C.navy,
                }}
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <p
                className="mt-1 sm:text-[14px] md:text-[16px]"
                style={{
                  color: C.faint,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {!hideClose && (
            <button
              onClick={onClose}
              className="cursor-pointer pt-0 rounded-lg hover:bg-slate-100 transition"
            >
              <X size={24} color={C.muted} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 py-2">{children}</div>

        {/* Footer */}
        {footer && <div className="p-6 pt-0">{footer}</div>}
      </div>

      {/* animation like sweetalert2 */}
      <style jsx>{`
        .modal-backdrop {
          animation: fadeIn 0.18s ease-out;
        }

        .modal-pop {
          animation: popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.75) translateY(10px);
          }
          60% {
            opacity: 1;
            transform: scale(1.03) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
