"use client";

import { useLocale } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { CalendarIcon, ChevronIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const MONTHS_ZH = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthPickerProps {
  label: string;
  hint?: string;
  value: string; // "YYYY-MM" or ""
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MonthPicker({
  label,
  hint,
  value,
  onValueChange,
  disabled = false,
  placeholder = "YYYY-MM",
  className,
}: MonthPickerProps) {
  const id = useId();
  const locale = useLocale();
  const months = locale === "en" ? MONTHS_EN : MONTHS_ZH;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial year from value, or default to current year
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const parsedYear = value ? parseInt(value.split("-")[0], 10) : currentYear;
  const parsedMonth = value ? parseInt(value.split("-")[1], 10) : 0;

  const [viewYear, setViewYear] = useState(parsedYear || currentYear);

  // Synchronize viewYear when value changes
  useEffect(() => {
    if (value) {
      const y = parseInt(value.split("-")[0], 10);
      if (y) setViewYear(y);
    }
  }, [value]);

  // Close on outside click or Esc
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectMonth = (mIndex: number) => {
    const mStr = String(mIndex + 1).padStart(2, "0");
    onValueChange(`${viewYear}-${mStr}`);
    setOpen(false);
  };

  const handleClear = () => {
    onValueChange("");
    setOpen(false);
  };

  const handleThisMonth = () => {
    const mStr = String(currentMonth).padStart(2, "0");
    onValueChange(`${currentYear}-${mStr}`);
    setOpen(false);
  };

  // Formatted display
  const displayValue = value ? value.replace("-", " / ") : "";

  return (
    <div ref={containerRef} className={cn("relative flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-zinc-600">
        {label}
      </label>

      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 text-sm shadow-xs transition-colors hover:border-zinc-300 focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none",
          disabled && "cursor-not-allowed bg-zinc-50 text-zinc-400 hover:border-zinc-200",
          open && "border-brand ring-2 ring-brand/15",
        )}
      >
        <span className={displayValue ? "text-zinc-900 font-medium" : "text-zinc-400"}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon className="text-zinc-400 size-4 shrink-0" />
      </button>

      {hint && (
        <p id={`${id}-hint`} className="text-xs text-zinc-400">
          {hint}
        </p>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="menu-in absolute top-full left-0 z-50 mt-1.5 w-64 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl ring-1 ring-zinc-950/5"
        >
          {/* Year navigation header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="grid size-7 place-items-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
              aria-label="Previous year"
            >
              <ChevronIcon className="rotate-90 size-3.5" />
            </button>
            <span className="text-sm font-semibold text-zinc-900">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="grid size-7 place-items-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
              aria-label="Next year"
            >
              <ChevronIcon className="-rotate-90 size-3.5" />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-2.5">
            {months.map((mName, i) => {
              const isSelected = viewYear === parsedYear && i + 1 === parsedMonth;
              const isCurrent = viewYear === currentYear && i + 1 === currentMonth;
              return (
                <button
                  key={mName}
                  type="button"
                  onClick={() => selectMonth(i)}
                  className={cn(
                    "cursor-pointer rounded-lg py-1.5 text-xs font-medium transition-colors text-center",
                    isSelected
                      ? "bg-brand text-white shadow-xs font-semibold"
                      : isCurrent
                        ? "bg-orange-50 text-brand-strong hover:bg-orange-100"
                        : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                  )}
                >
                  {mName}
                </button>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-zinc-500 hover:text-red-600 cursor-pointer font-medium px-1.5 py-0.5 rounded hover:bg-zinc-50"
            >
              {locale === "en" ? "Clear" : "清除"}
            </button>
            <button
              type="button"
              onClick={handleThisMonth}
              className="text-brand font-medium hover:underline cursor-pointer px-1.5 py-0.5 rounded hover:bg-orange-50"
            >
              {locale === "en" ? "This month" : "本月"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
