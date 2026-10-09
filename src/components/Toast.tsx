"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Trash2, 
  LogOut, 
  Camera,
  Film
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  duration?: number;
}

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: 'trash' | 'logout' | 'alert' | 'film';
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, options?: ToastOptions) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    options: { title: '', message: '' },
  });

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', options?: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const duration = options?.duration ?? (type === 'error' ? 4500 : 3500);

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type,
          title: options?.title,
          duration,
        },
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmDialog({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirmClose = (result: boolean) => {
    if (confirmDialog.resolve) {
      confirmDialog.resolve(result);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Close confirm modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmDialog.isOpen) {
        handleConfirmClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog.isOpen]);

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Toast Notifications Container */}
      <div 
        className="fixed top-5 right-5 sm:right-6 z-[160] flex flex-col gap-3 pointer-events-none w-[calc(100vw-2.5rem)] sm:w-96 max-w-full"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';
            const isInfo = toast.type === 'info';

            const defaultTitle = isSuccess
              ? 'Berhasil'
              : isError
              ? 'Terjadi Kesalahan'
              : isWarning
              ? 'Perhatian'
              : 'Informasi';

            const title = toast.title || defaultTitle;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-[#082032]/95 border shadow-2xl backdrop-blur-xl p-4 flex gap-3.5 items-start transition-colors duration-200 ${
                  isSuccess
                    ? 'border-[#FF4C29]/40 shadow-[#FF4C29]/10'
                    : isError
                    ? 'border-red-500/50 shadow-red-500/10'
                    : isWarning
                    ? 'border-amber-500/50 shadow-amber-500/10'
                    : 'border-sky-500/50 shadow-sky-500/10'
                }`}
              >
                {/* Left accent indicator strip */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isSuccess
                      ? 'bg-[#FF4C29]'
                      : isError
                      ? 'bg-red-500'
                      : isWarning
                      ? 'bg-amber-400'
                      : 'bg-sky-400'
                  }`}
                />

                {/* Ambient glow in background */}
                <div
                  className={`absolute -top-10 -left-10 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 ${
                    isSuccess
                      ? 'bg-[#FF4C29]'
                      : isError
                      ? 'bg-red-500'
                      : isWarning
                      ? 'bg-amber-400'
                      : 'bg-sky-400'
                  }`}
                />

                {/* Icon Container with glowing badge */}
                <div
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${
                    isSuccess
                      ? 'bg-[#FF4C29]/15 border-[#FF4C29]/30 text-[#FF4C29]'
                      : isError
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : isWarning
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      : 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                  }`}
                >
                  {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                  {isError && <AlertCircle className="w-5 h-5" />}
                  {isWarning && <AlertTriangle className="w-5 h-5" />}
                  {isInfo && <Info className="w-5 h-5" />}
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold tracking-wider uppercase text-gray-300">
                      {title}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-500 inline-block" />
                    <span className="text-[10px] text-gray-400 tracking-widest font-mono">
                      PHOLET
                    </span>
                  </div>
                  <p className="text-sm text-gray-100 font-normal leading-relaxed mt-0.5 break-words">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Tutup notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Bottom Countdown Progress Bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-[2px] ${
                    isSuccess
                      ? 'bg-[#FF4C29]/80'
                      : isError
                      ? 'bg-red-500/80'
                      : isWarning
                      ? 'bg-amber-400/80'
                      : 'bg-sky-400/80'
                  }`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Custom Analog Darkroom Confirmation Modal */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#082032] border border-[#334756] rounded-2xl p-6 shadow-2xl text-white overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* Background Ambient Glow */}
              <div 
                className={`absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-25 ${
                  confirmDialog.options.variant === 'danger'
                    ? 'bg-red-500'
                    : confirmDialog.options.variant === 'warning'
                    ? 'bg-[#FF4C29]'
                    : 'bg-sky-500'
                }`}
              />

              {/* Decorative Film Perforation motif */}
              <div className="flex items-center gap-1.5 mb-5 opacity-40">
                <div className="w-2.5 h-1.5 bg-gray-400 rounded-xs" />
                <div className="w-2.5 h-1.5 bg-gray-400 rounded-xs" />
                <div className="w-2.5 h-1.5 bg-gray-400 rounded-xs" />
                <span className="text-[10px] tracking-widest text-gray-400 uppercase font-mono ml-1">
                  PHOLET DIALOG // {confirmDialog.options.variant?.toUpperCase() || 'CONFIRM'}
                </span>
              </div>

              {/* Header with Icon */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg ${
                    confirmDialog.options.variant === 'danger'
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : confirmDialog.options.variant === 'warning'
                      ? 'bg-[#FF4C29]/15 border-[#FF4C29]/30 text-[#FF4C29]'
                      : 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                  }`}
                >
                  {confirmDialog.options.icon === 'trash' ? (
                    <Trash2 className="w-6 h-6" />
                  ) : confirmDialog.options.icon === 'logout' ? (
                    <LogOut className="w-6 h-6" />
                  ) : confirmDialog.options.variant === 'danger' ? (
                    <Trash2 className="w-6 h-6" />
                  ) : confirmDialog.options.variant === 'warning' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <Info className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl font-bold tracking-tight text-white">
                    {confirmDialog.options.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                    {confirmDialog.options.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#334756]/60">
                <button
                  type="button"
                  onClick={() => handleConfirmClose(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#334756] text-gray-300 hover:text-white hover:bg-[#334756]/50 transition-all font-medium text-sm"
                >
                  {confirmDialog.options.cancelText || 'Batal'}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmClose(true)}
                  className={`px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-2 ${
                    confirmDialog.options.variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                      : 'bg-[#FF4C29] hover:bg-[#ff3b14] shadow-[#FF4C29]/25'
                  }`}
                >
                  {confirmDialog.options.confirmText || 'Konfirmasi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

