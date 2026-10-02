"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const MenuContext = createContext<{ close: () => void } | null>(null);

type TriggerProps = {
  id: string;
  ref: React.RefObject<HTMLButtonElement | null>;
  type: "button";
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
  "aria-controls": string;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

const ITEM_SELECTOR = '[role^="menuitem"]:not([disabled])';

/** Accessible dropdown menu: click/Enter/ArrowDown opens, arrow keys move focus, Escape/outside click closes. */
export function Menu({
  trigger,
  children,
  side = "bottom",
  align = "end",
  className,
}: {
  trigger: (props: TriggerProps & { open: boolean }) => React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef<"first" | "last" | "checked">("checked");
  const id = useId();

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const list = items();
    const target =
      focusOnOpen.current === "last"
        ? list.at(-1)
        : focusOnOpen.current === "first"
          ? list[0]
          : (list.find((el) => el.getAttribute("aria-checked") === "true") ?? list[0]);
    target?.focus();

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const openWith = (focus: typeof focusOnOpen.current) => {
    focusOnOpen.current = focus;
    setOpen(true);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openWith(e.key === "ArrowUp" ? "last" : "checked");
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = (i: number) => list[(i + list.length) % list.length]?.focus();
    if (e.key === "ArrowDown") move(index + 1);
    else if (e.key === "ArrowUp") move(index - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(list.length - 1);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") return close(false);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={rootRef} className="relative inline-flex">
      {trigger({
        id: `${id}-trigger`,
        ref: triggerRef,
        type: "button",
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": `${id}-menu`,
        onClick: () => (open ? close(false) : openWith("checked")),
        onKeyDown: onTriggerKeyDown,
        open,
      })}
      {open && (
        <div
          ref={menuRef}
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-trigger`}
          onKeyDown={onMenuKeyDown}
          className={cn(
            "menu-in absolute z-50 min-w-44 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg shadow-zinc-900/10",
            side === "bottom" ? "top-full mt-2 origin-top" : "bottom-full mb-2 origin-bottom",
            align === "end" ? "right-0" : "left-0",
            className,
          )}
        >
          <MenuContext.Provider value={{ close }}>{children}</MenuContext.Provider>
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  onSelect,
  checked,
  danger,
  icon,
  hint,
  children,
}: {
  onSelect: () => void;
  checked?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(MenuContext);
  const isRadio = checked !== undefined;
  return (
    <button
      type="button"
      role={isRadio ? "menuitemradio" : "menuitem"}
      aria-checked={isRadio ? checked : undefined}
      tabIndex={-1}
      onClick={() => {
        ctx?.close();
        onSelect();
      }}
      className={cn(
        "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left text-sm whitespace-nowrap outline-none",
        danger
          ? "text-red-600 hover:bg-red-50 focus-visible:bg-red-50"
          : "text-zinc-700 hover:bg-brand-soft hover:text-zinc-950 focus-visible:bg-brand-soft focus-visible:text-zinc-950",
        checked && "font-medium text-zinc-950",
      )}
    >
      {icon && <span className="shrink-0 text-zinc-400">{icon}</span>}
      <span className="flex-1">{children}</span>
      {hint && <span className="text-xs text-zinc-400">{hint}</span>}
      {isRadio && <CheckIcon className={cn("shrink-0 text-brand-strong", !checked && "invisible")} />}
    </button>
  );
}
