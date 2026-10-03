"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { A4Page } from "@/components/preview/a4-page";
import { ResumePreview } from "@/components/preview/resume-preview";
import { Button } from "@/components/ui/button";
import { ChevronIcon } from "@/components/ui/icons";
import { getSampleResume } from "@/lib/sample-data";
import { createEmptyResume, type ResumeLocale, type SectionKey } from "@/lib/schema";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  AutobiographyForm,
  BasicsForm,
  CertLangForm,
  CertLangVisibility,
  EducationForm,
  LayoutPanel,
  ProjectsForm,
  SectionVisibility,
  SkillsForm,
  WorkForm,
} from "./section-forms";
import { HealthPanel } from "./health-panel";
import { Toolbar } from "./toolbar";

const STEPS = [
  { key: "basics", Form: BasicsForm },
  { key: "education", Form: EducationForm, section: "education" },
  { key: "work", Form: WorkForm, section: "work" },
  { key: "projects", Form: ProjectsForm, section: "projects" },
  { key: "skills", Form: SkillsForm, section: "skills" },
  { key: "certLang", Form: CertLangForm },
  { key: "autobiography", Form: AutobiographyForm, section: "autobiography" },
] as const satisfies readonly { key: string; Form: React.ComponentType; section?: SectionKey }[];

type StepKey = (typeof STEPS)[number]["key"];

function Card({
  id,
  title,
  index,
  open,
  onToggle,
  action,
  children,
}: {
  id: string;
  title: string;
  index?: number;
  open: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs transition-shadow",
        open && "shadow-md shadow-zinc-900/5",
      )}
    >
      {open && <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand" />}
      <div className="flex items-center gap-2 pr-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          className="flex flex-1 cursor-pointer items-center gap-3 px-4 py-3.5 text-left"
        >
          {index !== undefined && (
            <span className="grid size-6 place-items-center rounded-full bg-brand text-xs font-semibold text-white shadow-sm shadow-brand/30">
              {index + 1}
            </span>
          )}
          <h2 className="text-[15px] font-semibold tracking-tight text-zinc-900">{title}</h2>
          <ChevronIcon className={cn("ml-auto text-zinc-400 transition-transform", open && "rotate-180")} />
        </button>
        {action}
      </div>
      {open && (
        <div id={`${id}-body`} className="fade-in border-t border-zinc-100 p-4">
          {children}
        </div>
      )}
    </section>
  );
}

function Stepper({ active, onSelect }: { active: StepKey; onSelect: (k: StepKey) => void }) {
  const t = useTranslations("Editor.steps");
  const activeIndex = STEPS.findIndex((s) => s.key === active);
  return (
    <nav aria-label={t("label")} className="sticky top-0 z-10 -mx-4 border-b border-zinc-200 bg-zinc-50/90 px-4 py-2.5 backdrop-blur">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {activeIndex + 1}/{STEPS.length} · <span className="font-medium text-zinc-800">{t(active)}</span>
        </span>
      </div>
      <ol className="flex gap-1">
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex-1">
            <button
              type="button"
              onClick={() => onSelect(s.key)}
              aria-current={s.key === active ? "step" : undefined}
              aria-label={t(s.key)}
              title={t(s.key)}
              className="group block w-full cursor-pointer py-1.5"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-colors",
                  i <= activeIndex ? "bg-brand" : "bg-zinc-200 group-hover:bg-zinc-300",
                )}
              />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function WelcomeDialog() {
  const t = useTranslations("Editor.welcome");
  const uiLocale = useLocale();
  const initialized = useResumeStore((s) => s.initialized);
  const reset = useResumeStore((s) => s.reset);
  const firstRef = useRef<HTMLButtonElement>(null);
  useEffect(() => firstRef.current?.focus(), [initialized]);
  if (initialized) return null;
  const resumeLocale = uiLocale === "en" ? "en" : "zh-TW";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-900/30 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="fade-in w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
      >
        <h2 id="welcome-title" className="text-lg font-semibold tracking-tight">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t("desc")}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => reset(createEmptyResume(resumeLocale))}>
            {t("blank")}
          </Button>
          <Button
            ref={firstRef}
            className="shadow-md shadow-brand/25"
            onClick={() => reset(getSampleResume(resumeLocale))}
          >
            {t("sample")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EditorApp() {
  const t = useTranslations("Editor");
  const uiLocale = useLocale();
  const resume = useResumeStore((s) => s.resume);
  const setResumeLocale = useResumeStore((s) => s.setResumeLocale);
  const [open, setOpen] = useState<Record<string, boolean>>({ basics: true });
  const [active, setActive] = useState<StepKey>("basics");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const targetLocale: ResumeLocale = uiLocale === "en" ? "en" : "zh-TW";
  useEffect(() => {
    if (resume.meta.resumeLocale !== targetLocale) setResumeLocale(targetLocale);
  }, [resume.meta.resumeLocale, targetLocale, setResumeLocale]);

  const toggle = (key: string) => setOpen((o) => ({ ...o, [key]: !o[key] }));
  const select = (key: StepKey) => {
    setActive(key);
    setOpen((o) => ({ ...o, [key]: true }));
    setTab("edit");
    requestAnimationFrame(() => document.getElementById(`step-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Toolbar />
      <div role="tablist" className="flex border-b border-zinc-200 bg-white lg:hidden">
        {(["edit", "preview"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 cursor-pointer border-b-2 py-2.5 text-sm font-medium",
              tab === k ? "border-brand text-brand-strong" : "border-transparent text-zinc-500",
            )}
          >
            {t(`tabs.${k}`)}
          </button>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(420px,1fr)_minmax(0,1.15fr)]">
        <div
          className={cn(
            "min-h-0 overflow-y-auto bg-zinc-50 px-4 pb-16 lg:block lg:border-r lg:border-zinc-200",
            tab === "edit" ? "block" : "hidden",
          )}
        >
          <Stepper active={active} onSelect={select} />
          <div className="mx-auto flex max-w-2xl flex-col gap-3 pt-4">
            {STEPS.map(({ key, Form, ...rest }, i) => (
              <Card
                key={key}
                id={`step-${key}`}
                index={i}
                title={t(`steps.${key}`)}
                open={!!open[key]}
                onToggle={() => {
                  toggle(key);
                  setActive(key);
                }}
                action={
                  key === "certLang" ? (
                    <CertLangVisibility />
                  ) : "section" in rest ? (
                    <SectionVisibility section={rest.section} />
                  ) : undefined
                }
              >
                <Form />
              </Card>
            ))}
            <Card id="layout" title={t("layout.title")} open={!!open.layout} onToggle={() => toggle("layout")}>
              <LayoutPanel />
            </Card>
            <Card id="health" title={t("health.title")} open={!!open.health} onToggle={() => toggle("health")}>
              <HealthPanel />
            </Card>
          </div>
        </div>
        <div
          className={cn(
            "min-h-0 overflow-y-auto bg-stone-100 px-4 py-6 sm:px-8 lg:block",
            tab === "preview" ? "block" : "hidden",
          )}
        >
          <div className="mx-auto max-w-[794px]">
            <A4Page label={t("tabs.preview")}>
              <ResumePreview resume={resume} />
            </A4Page>
            <p className="mt-3 text-center text-xs text-zinc-500">{t("previewNote")}</p>
          </div>
        </div>
      </div>
      <WelcomeDialog />
    </div>
  );
}
