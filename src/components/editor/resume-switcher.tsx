"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CheckIcon, ChevronIcon, CopyIcon, FileIcon, PencilIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { Menu, MenuItem } from "@/components/ui/menu";
import { createEmptyResume } from "@/lib/schema";
import { useResumeStore, type ResumeEntry } from "@/lib/store";
import { cn } from "@/lib/utils";

function RenameInput({
  defaultValue,
  placeholder,
  label,
  onCommit,
  onCancel,
}: {
  defaultValue: string;
  placeholder: string;
  label: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const commit = () => onCommit(value.trim());
  return (
    <div className="flex items-center gap-1 px-1.5 py-1">
      <input
        autoFocus
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-8 min-w-0 flex-1 rounded-lg border border-zinc-300 px-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        onKeyDown={(ev) => {
          if (ev.key === "Enter") commit();
          if (ev.key === "Escape") onCancel();
        }}
        onBlur={commit}
      />
      <button
        type="button"
        aria-label={label}
        title={label}
        onMouseDown={(ev) => ev.preventDefault()}
        onClick={commit}
        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg bg-brand text-white hover:bg-brand-hover"
      >
        <CheckIcon width={15} height={15} />
      </button>
    </div>
  );
}

export function ResumeSwitcher({ onNotify }: { onNotify?: () => void }) {
  const t = useTranslations("Editor.library");
  const tAction = useTranslations("Editor.actions");
  const uiLocale = useLocale();
  const entries = useResumeStore((s) => s.entries);
  const activeId = useResumeStore((s) => s.activeId);
  const switchResume = useResumeStore((s) => s.switchResume);
  const createResume = useResumeStore((s) => s.createResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const renameResume = useResumeStore((s) => s.renameResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const label = (e: ResumeEntry) => e.name || e.resume.basics.name || t("untitled");
  const active = entries.find((e) => e.id === activeId);
  const deleteEntry = entries.find((e) => e.id === deleteId);
  const locale = uiLocale === "en" ? "en" : "zh-TW";

  const iconBtn = "grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-zinc-400 hover:bg-zinc-200/70 hover:text-zinc-700";

  return (
    <>
      <Menu
        align="start"
        className="w-64"
        trigger={({ open, ...props }) => (
          <button
            {...props}
            className={cn(
              "inline-flex h-8 max-w-40 cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 text-sm text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-brand/40 sm:max-w-56",
              open && "bg-zinc-50",
            )}
          >
            <FileIcon className="shrink-0 text-zinc-400" />
            <span className="truncate font-medium">{active ? label(active) : t("untitled")}</span>
            <ChevronIcon width={14} height={14} className={cn("shrink-0 text-zinc-400 transition-transform", open && "rotate-180")} />
          </button>
        )}
      >
        {entries.map((e) =>
          renamingId === e.id ? (
            <RenameInput
              key={e.id}
              defaultValue={e.name || e.resume.basics.name}
              placeholder={t("untitled")}
              label={t("rename")}
              onCommit={(value) => {
                renameResume(e.id, value);
                setRenamingId(null);
                onNotify?.();
              }}
              onCancel={() => setRenamingId(null)}
            />
          ) : (
            <div key={e.id} role="none" className="group flex items-center gap-0.5 rounded-lg px-1 hover:bg-brand-soft">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={e.id === activeId}
                tabIndex={-1}
                onClick={() => switchResume(e.id)}
                className="flex h-9 min-w-0 flex-1 cursor-pointer items-center gap-2 px-1.5 text-left text-sm text-zinc-700 outline-none focus-visible:text-zinc-950"
              >
                <CheckIcon className={cn("shrink-0 text-brand-strong", e.id !== activeId && "invisible")} width={14} height={14} />
                <span className="truncate">{label(e)}</span>
              </button>
              <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button type="button" aria-label={t("rename")} title={t("rename")} tabIndex={-1} onClick={() => setRenamingId(e.id)} className={iconBtn}>
                  <PencilIcon width={13} height={13} />
                </button>
                <button
                  type="button"
                  aria-label={t("duplicate")}
                  title={t("duplicate")}
                  tabIndex={-1}
                  onClick={() => duplicateResume(e.id, `${label(e)} ${t("copySuffix")}`)}
                  className={iconBtn}
                >
                  <CopyIcon width={13} height={13} />
                </button>
                <button
                  type="button"
                  aria-label={t("delete")}
                  title={t("delete")}
                  tabIndex={-1}
                  onClick={() => setDeleteId(e.id)}
                  className={cn(iconBtn, "hover:text-red-600")}
                >
                  <TrashIcon width={13} height={13} className="text-red-500" />
                </button>
              </span>
            </div>
          ),
        )}
        <div role="separator" className="my-1 h-px bg-zinc-100" />
        <MenuItem icon={<PlusIcon />} onSelect={() => createResume("", createEmptyResume(locale))}>
          {t("new")}
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={deleteId !== null}
        title={t("delete")}
        desc={t("deleteConfirm", { name: deleteEntry ? label(deleteEntry) : "" })}
        confirmLabel={t("delete")}
        cancelLabel={tAction("cancel")}
        danger
        onConfirm={() => {
          if (deleteId) deleteResume(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
