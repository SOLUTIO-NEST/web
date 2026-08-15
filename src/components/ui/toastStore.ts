import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  id?: string;
  title?: string;
  duration?: number;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
}

export type ToastListener = (toasts: ToastItem[]) => void;

// Global Toast State Manager for standalone toast.xxx() calls
class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();
  private maxToasts = 4;

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(type: ToastType, message: string, options?: ToastOptions): string {
    const id = options?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const defaultDuration = type === "error" || type === "warning" ? 5000 : 3500;
    const duration = options?.duration ?? defaultDuration;

    const newToast: ToastItem = {
      id,
      type,
      title: options?.title,
      message,
      duration,
    };

    // Keep max 4 toasts
    this.toasts = [newToast, ...this.toasts.filter((t) => t.id !== id)].slice(0, this.maxToasts);
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  dismiss(id?: string) {
    if (id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    } else {
      this.toasts = [];
    }
    this.notify();
  }
}

export const toastManager = new ToastManager();

export const toast = {
  success: (message: string, options?: ToastOptions | string) => {
    const opts = typeof options === "string" ? { title: options } : options;
    return toastManager.show("success", message, opts);
  },
  error: (message: string, options?: ToastOptions | string) => {
    const opts = typeof options === "string" ? { title: options } : options;
    return toastManager.show("error", message, opts);
  },
  warning: (message: string, options?: ToastOptions | string) => {
    const opts = typeof options === "string" ? { title: options } : options;
    return toastManager.show("warning", message, opts);
  },
  info: (message: string, options?: ToastOptions | string) => {
    const opts = typeof options === "string" ? { title: options } : options;
    return toastManager.show("info", message, opts);
  },
  dismiss: (id?: string) => {
    toastManager.dismiss(id);
  },
};

export interface ToastContextType {
  toast: typeof toast;
}

export const ToastContext = createContext<ToastContextType>({ toast });

export function useToast() {
  return useContext(ToastContext);
}
