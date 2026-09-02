'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let globalToastHandler: ((toast: Omit<ToastItem, 'id'>) => string) | null = null;

export const toast = {
  success: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.({ type: 'success', message, title, duration }),
  error: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.({ type: 'error', message, title, duration }),
  warning: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.({ type: 'warning', message, title, duration }),
  info: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.({ type: 'info', message, title, duration }),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) =>
      showToast({ type: 'success', message, title, duration }),
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) =>
      showToast({ type: 'error', message, title, duration }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) =>
      showToast({ type: 'warning', message, title, duration }),
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) =>
      showToast({ type: 'info', message, title, duration }),
    [showToast]
  );

  useEffect(() => {
    globalToastHandler = showToast;
    return () => {
      globalToastHandler = null;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, warning, info }}
    >
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      showToast: (t: Omit<ToastItem, 'id'>) => globalToastHandler?.(t) || '',
      removeToast: () => {},
      toasts: [],
    };
  }
  return context;
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const typeConfigs = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
      progressBg: 'bg-emerald-500',
      borderColor: 'border-emerald-500/30',
      defaultTitle: 'Success',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/20',
      progressBg: 'bg-rose-500',
      borderColor: 'border-rose-500/30',
      defaultTitle: 'Error',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20',
      progressBg: 'bg-amber-500',
      borderColor: 'border-amber-500/30',
      defaultTitle: 'Attention',
    },
    info: {
      icon: Info,
      iconColor: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 border-sky-500/20',
      progressBg: 'bg-sky-500',
      borderColor: 'border-sky-500/30',
      defaultTitle: 'Notice',
    },
  };

  const config = typeConfigs[item.type];
  const Icon = config.icon;

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-md border ${config.borderColor} p-4 text-slate-100 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon Badge */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${config.badgeBg}`}
        >
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-xs font-bold text-white tracking-wide">
            {item.title || config.defaultTitle}
          </h4>
          <p className="mt-0.5 text-xs text-slate-300 leading-relaxed break-words">
            {item.message}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          title="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress Bar Animation */}
      {item.duration && item.duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-0.5 w-full ${config.progressBg} opacity-60`}
          style={{
            animation: `toastProgress ${item.duration}ms linear forwards`,
          }}
        />
      )}

      <style jsx>{`
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
