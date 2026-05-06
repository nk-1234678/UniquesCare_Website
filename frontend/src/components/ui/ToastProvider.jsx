/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

const toneStyles = {
  success: { bg: "#ecfdf5", border: "#a7f3d0", color: "#065f46" },
  error: { bg: "#fef2f2", border: "#fecaca", color: "#991b1b" },
  warning: { bg: "#fffbeb", border: "#fde68a", color: "#92400e" },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = ({ type = "success", message = "Done", duration = 2600 }) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => removeToast(id), duration);
  };

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 1000,
          display: "grid",
          gap: 10,
          width: "min(360px, calc(100vw - 32px))",
        }}
      >
        {toasts.map((toast) => {
          const tone = toneStyles[toast.type] || toneStyles.success;
          return (
            <div
              key={toast.id}
              style={{
                background: tone.bg,
                color: tone.color,
                border: `1px solid ${tone.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                boxShadow: "0 10px 22px rgba(0,0,0,0.1)",
              }}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
