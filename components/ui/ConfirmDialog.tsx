"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  requireTypedPhrase?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  requireTypedPhrase,
}) => {
  const [typedInput, setTypedInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTypedInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isConfirmDisabled =
    requireTypedPhrase !== undefined &&
    typedInput.trim().toLowerCase() !== requireTypedPhrase.trim().toLowerCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-2xl glass-panel bg-[#10111A]/95 border border-border-subtle p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDestructive
                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                  : "bg-violet-500/15 text-violet-400 border border-violet-500/30"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="confirm-dialog-title"
                className="text-base font-bold text-text-primary"
              >
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          {description}
        </p>

        {requireTypedPhrase && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] text-text-muted block">
              Type <strong className="text-rose-400 font-mono">{requireTypedPhrase}</strong> to proceed:
            </label>
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={requireTypedPhrase}
              autoFocus
              className="w-full bg-surface-base border border-border-subtle rounded-xl px-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-rose-500/60 font-mono"
            />
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white bg-surface-base hover:bg-surface-hover border border-border-subtle transition-all"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isConfirmDisabled}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30 disabled:opacity-40 disabled:hover:bg-rose-600 cursor-pointer disabled:cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-500 shadow-violet-600/30 disabled:opacity-40 disabled:hover:bg-violet-600 cursor-pointer disabled:cursor-not-allowed"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
