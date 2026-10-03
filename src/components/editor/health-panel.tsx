"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { checkResume, type HealthLevel } from "@/lib/health";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const DOT: Record<HealthLevel, string> = {
  error: "bg-red-500",
  warn: "bg-amber-500",
  tip: "bg-sky-500",
};

export function HealthPanel() {
  const t = useTranslations("Editor.health");
  const resume = useResumeStore((s) => s.resume);
  const issues = useMemo(() => checkResume(resume), [resume]);

  if (issues.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm text-emerald-700">
        <CheckIcon className="shrink-0" width={16} height={16} />
        {t("ok")}
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {issues.map((issue) => (
        <li key={issue.id} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-700">
          <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[issue.level])} />
          <span>{t(`issues.${issue.id}`, issue.values ?? {})}</span>
        </li>
      ))}
    </ul>
  );
}
