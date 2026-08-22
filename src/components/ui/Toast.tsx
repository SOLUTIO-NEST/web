import { useEffect, useState, useCallback, type ReactNode, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import {
  type ToastType,
  type ToastItem,
  toast,
  toastManager,
  ToastContext,
} from "./toastStore";

const TYPE_CONFIG: Record<
  ToastType,
  {
    borderColor: string;
    iconColor: string;
    icon: ComponentType<{ size?: number; className?: string }>;
    defaultTitle: string;
  }
> = {
  success: {
    borderColor: "border-l-emerald-500",
    iconColor: "text-emerald-600",
    icon: CheckCircle2,
    defaultTitle: "성공",
  },
  error: {
    borderColor: "border-l-rose-500",
    iconColor: "text-rose-600",
    icon: AlertCircle,
    defaultTitle: "오류",
  },
  warning: {
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-600",
    icon: AlertTriangle,
    defaultTitle: "경고",
  },
  info: {
    borderColor: "border-l-purple-600",
    iconColor: "text-purple-600",
    icon: Info,
    defaultTitle: "안내",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((items) => {
      setToasts(items);
    });
    return unsubscribe;
  }, []);

  const handleDismiss = useCallback((id: string) => {
    toastManager.dismiss(id);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div
        aria-live="assertive"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence mode="sync">
          {toasts.map((item) => {
            const config = TYPE_CONFIG[item.type];
            const IconComponent = config.icon;
            const title = item.title ?? config.defaultTitle;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto bg-white border border-neutral-200 border-l-4 ${config.borderColor} shadow-xl overflow-hidden flex items-start p-4 gap-3`}
              >
                <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
                  <IconComponent size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black tracking-tight text-neutral-900 uppercase">
                    {title}
                  </h4>
                  <p className="text-xs font-medium text-neutral-600 mt-1 leading-relaxed break-words whitespace-pre-line">
                    {item.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDismiss(item.id)}
                  className="shrink-0 p-1 -mr-1 -mt-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  aria-label="닫기"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
