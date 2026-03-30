import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((message, variant = "info", timeout = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, variant }]);
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout);
    }
    return id;
  }, [remove]);

  return (
    <ToastContext.Provider value={{ show, remove, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function Toaster() {
  const { toasts, remove } = useToast();
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          onClick={() => remove(t.id)}
          className={[
            "px-4 py-3 rounded-xl shadow-lg border text-sm cursor-pointer select-none backdrop-blur-md",
            "bg-white/10 border-white/15 text-white",
            t.variant === "success" && "bg-green-500/20 border-green-500/30",
            t.variant === "error" && "bg-red-500/20 border-red-500/30",
            t.variant === "warning" && "bg-yellow-500/20 border-yellow-500/30",
          ].filter(Boolean).join(" ")}
          aria-live="polite"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
