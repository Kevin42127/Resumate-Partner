"use client";

import { track } from "@vercel/analytics";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CheckIcon, ChevronIcon, DownloadIcon, FileIcon, SparklesIcon, TrashIcon, UploadIcon } from "@/components/ui/icons";
import { Menu, MenuItem } from "@/components/ui/menu";
import { ResumeSwitcher } from "./resume-switcher";
import { resumeFileName } from "@/lib/resume-content";
import { getSampleResume } from "@/lib/sample-data";
import { createEmptyResume, parseResumeJson } from "@/lib/schema";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

type Notice = { tone: "info" | "error" | "success"; text: string } | null;

function SaveIndicator() {
  const t = useTranslations("Editor.toolbar");
  const resume = useResumeStore((s) => s.resume);
  const [saving, setSaving] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSaving(true);
    const id = setTimeout(() => setSaving(false), 600);
    return () => clearTimeout(id);
  }, [resume]);
  return (
    <span role="status" className="hidden items-center gap-1 text-xs text-zinc-500 md:inline-flex">
      {saving ? (
        t("saving")
      ) : (
        <>
          <CheckIcon className="text-emerald-600" width={14} height={14} />
          {t("saved")}
        </>
      )}
    </span>
  );
}

export function Toolbar() {
  const t = useTranslations("Editor.toolbar");
  const tAction = useTranslations("Editor.actions");
  const uiLocale = useLocale();
  const locale = uiLocale === "en" ? "en" : "zh-TW";
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [confirmAction, setConfirmAction] = useState<"clear" | "sample" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), notice.tone === "error" ? 8000 : 5000);
    return () => clearTimeout(id);
  }, [notice]);

  const download = async () => {
    setBusy(true);
    try {
      const resume = useResumeStore.getState().resume;
      const { buildDocxBlob } = await import("@/docx/build-docx");
      saveBlob(await buildDocxBlob(resume), resumeFileName(resume));
      track("download_docx", { resumeLocale: resume.meta.resumeLocale });
      if (isIOS()) setNotice({ tone: "info", text: t("iosHint") });
    } catch {
      setNotice({ tone: "error", text: t("downloadError") });
    } finally {
      setBusy(false);
    }
  };

  const exportJson = () => {
    const resume = useResumeStore.getState().resume;
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    saveBlob(blob, resumeFileName(resume).replace(/\.docx$/, ".json"));
  };

  const importJson = async (file?: File) => {
    if (!file) return;
    const result = parseResumeJson(await file.text());
    if (result.ok) {
      useResumeStore.getState().reset(result.resume);
      setNotice({ tone: "success", text: t("importSuccess") });
    } else {
      setNotice({ tone: "error", text: t("importError", { detail: result.error }) });
    }
  };

  const handleClear = () => {
    useResumeStore.getState().reset(createEmptyResume(locale));
    setConfirmAction(null);
  };

  const handleLoadSample = () => {
    useResumeStore.getState().reset(getSampleResume(locale));
    setConfirmAction(null);
  };

  return (
    <div className="relative border-b border-zinc-200 bg-white">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        <ResumeSwitcher onNotify={() => setNotice({ tone: "success", text: t("renameSuccess") })} />
        <div className="hidden items-center gap-1 sm:flex">
          <Button variant="ghost" size="sm" onClick={() => setConfirmAction("sample")}>
            <SparklesIcon />
            {t("loadSample")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
            <UploadIcon />
            {t("import")}
          </Button>
          <Button variant="ghost" size="sm" onClick={exportJson}>
            <FileIcon />
            {t("export")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmAction("clear")} className="hover:text-red-600">
            <TrashIcon />
            {t("clear")}
          </Button>
        </div>

        <div className="sm:hidden">
          <Menu
            align="start"
            trigger={({ open, ...props }) => (
              <button
                {...props}
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2.5 text-sm text-zinc-600 outline-none hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-brand/40",
                  open && "bg-zinc-100 text-zinc-900",
                )}
              >
                {t("more")}
                <ChevronIcon width={14} height={14} className={cn("text-zinc-400 transition-transform", open && "rotate-180")} />
              </button>
            )}
          >
            <MenuItem icon={<SparklesIcon />} onSelect={() => setConfirmAction("sample")}>
              {t("loadSample")}
            </MenuItem>
            <MenuItem icon={<UploadIcon />} onSelect={() => fileRef.current?.click()}>
              {t("import")}
            </MenuItem>
            <MenuItem icon={<FileIcon />} onSelect={exportJson}>
              {t("export")}
            </MenuItem>
            <div role="separator" className="my-1 h-px bg-zinc-100" />
            <MenuItem danger icon={<TrashIcon className="text-red-500" />} onSelect={() => setConfirmAction("clear")}>
              {t("clear")}
            </MenuItem>
          </Menu>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          data-testid="import-input"
          onChange={(e) => {
            void importJson(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="ml-auto flex items-center gap-3">
          <SaveIndicator />
          <Button onClick={download} disabled={busy} className="shadow-md shadow-brand/25">
            <DownloadIcon />
            {busy ? t("downloading") : t("download")}
          </Button>
        </div>
      </div>
      {notice && (
        <p
          role={notice.tone === "error" ? "alert" : "status"}
          className={cn(
            "fade-in absolute top-full right-3 z-50 mt-2 max-w-sm rounded-lg border px-3 py-2 text-sm shadow-lg",
            notice.tone === "error" && "border-red-200 bg-red-50 text-red-700",
            notice.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
            notice.tone === "info" && "border-zinc-200 bg-white text-zinc-700",
          )}
        >
          {notice.text}
        </p>
      )}

      <ConfirmDialog
        open={confirmAction === "clear"}
        title={t("clear")}
        desc={t("clearConfirm")}
        confirmLabel={t("clear")}
        cancelLabel={tAction("cancel")}
        danger
        onConfirm={handleClear}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === "sample"}
        title={t("loadSample")}
        desc={t("loadSampleConfirm")}
        confirmLabel={t("loadSample")}
        cancelLabel={tAction("cancel")}
        onConfirm={handleLoadSample}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
