/**
 * Modal.tsx — Generic reusable modal dialog.
 *
 * Handles all the shell behaviour so feature modals only deal with content:
 *   - Renders via createPortal (always on top of everything, no z-index fights)
 *   - Animated open/close with framer-motion (fade backdrop, slide+fade panel)
 *   - Closes on: backdrop click, X button, Escape key
 *   - Locks body scroll while open; restores it on close/unmount
 *
 * Usage:
 *   <Modal isOpen={isOpen} onClose={handleClose}>
 *     <p>Any content here</p>
 *   </Modal>
 *
 * Props:
 *   isOpen     — controls visibility; AnimatePresence handles exit animation
 *   onClose    — called for every close trigger (Escape / backdrop / X)
 *   children   — the dialog content
 *   maxWidth   — optional panel max-width (default "520px")
 *   hideCloseButton — hide the X button when true (e.g. forced confirmation)
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  hideCloseButton?: boolean;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1    },
  exit:    { opacity: 0, y: 16, scale: 0.97 },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = '520px',
  hideCloseButton = false,
}: ModalProps) {

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Backdrop click — only close when clicking the backdrop itself, not children
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.18 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal
        >
          {/* Panel */}
          <motion.div
            className={styles.panel}
            style={{ maxWidth }}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            // Stop propagation so clicks inside panel don't hit backdrop handler
            onClick={(e) => e.stopPropagation()}
          >
            {!hideCloseButton && (
              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
