'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
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
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: 'rgba(20,30,50,0.35)',
            backdropFilter: 'blur(3px)',
            paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
          }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[90vh] rounded-md overflow-hidden modal-pop"
            style={{
              maxWidth: `${width}px`,
              background: 'white',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 60px rgba(58,74,107,0.18)',
            }}
            initial={{ opacity: 0, scale: 0.75, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                {title && (
                  <h2
                    className="text-[clamp(1.3rem,6vw,1.85rem)] font-bold m-0"
                    style={{
                      color: 'var(--text)',
                    }}
                  >
                    {title}
                  </h2>
                )}

                {subtitle && (
                  <p
                    className="mt-1 text-[clamp(0.875rem,1.5vw,1rem)]"
                    style={{
                      color: 'var(--muted)',
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
                  <X size={24} color={'var(--muted)'} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 py-2">{children}</div>

            {/* Footer */}
            {footer && <div className="p-6 pt-0">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
