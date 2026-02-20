"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm z-50`}
      role="alert"
      data-testid="toast"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">{message}</p>
        <button
          onClick={onDismiss}
          className="text-white/80 hover:text-white text-lg leading-none"
          aria-label="Dismiss"
        >
          x
        </button>
      </div>
    </div>
  );
}
