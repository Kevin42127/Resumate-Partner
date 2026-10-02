"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const controlClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-xs transition-colors placeholder:text-zinc-400 hover:border-zinc-300 focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-400";

type BaseProps = { label: string; hint?: string; className?: string };

function FieldShell({ id, label, hint, className, children }: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-zinc-600">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-zinc-400">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  hint,
  className,
  value,
  onValueChange,
  ...props
}: BaseProps & Omit<React.ComponentProps<"input">, "onChange" | "value" | "className"> & {
  value: string;
  onValueChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <input
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(controlClass, "h-9")}
        {...props}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  className,
  value,
  onValueChange,
  rows = 4,
  ...props
}: BaseProps & Omit<React.ComponentProps<"textarea">, "onChange" | "value" | "className"> & {
  value: string;
  onValueChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(controlClass, "resize-y py-2 leading-relaxed")}
        {...props}
      />
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-700 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="size-4 cursor-pointer rounded border-zinc-300 accent-brand"
      />
      {label}
    </label>
  );
}
