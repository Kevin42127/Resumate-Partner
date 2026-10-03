"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  desc?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  desc,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = useTranslations("Editor.actions");
  const confirmText = confirmLabel ?? t("confirm");
  const cancelText = cancelLabel ?? t("cancel");
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={desc ? "confirm-dialog-desc" : undefined}
      className="fixed inset-0 z-50 grid place-items-center bg-zinc-900/30 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="fade-in w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
        <h2 id="confirm-dialog-title" className="text-base font-semibold tracking-tight text-zinc-900">
          {title}
        </h2>
        {desc && (
          <p id="confirm-dialog-desc" className="mt-2 text-sm leading-relaxed text-zinc-600">
            {desc}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            ref={confirmBtnRef}
            size="sm"
            onClick={onConfirm}
            className={
              danger
                ? "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                : "shadow-md shadow-brand/25"
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
