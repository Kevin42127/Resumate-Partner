"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { ArrowRightIcon, CheckIcon, CopyIcon, DownloadIcon, FileIcon, GlobeIcon, LockIcon, ScanIcon } from "@/components/ui/icons";
import { FAQ_KEYS } from "@/lib/faq";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export { FAQ_KEYS };

const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

const FEATURE_ICONS = { word: FileIcon, private: LockIcon, ats: ScanIcon, bilingual: GlobeIcon, library: CopyIcon, health: CheckIcon } as const;

export function Hero() {
  const t = useTranslations("Home.hero");
  const trust = ["noSignup", "local", "ats"] as const;
  return (
    <section id="hero" className="relative isolate flex min-h-dvh items-center overflow-hidden bg-brand-soft">
      <div aria-hidden className="absolute -top-48 -left-48 -z-10 size-[36rem] rounded-full bg-gradient-to-br from-orange-200/80 via-brand-muted to-transparent blur-3xl" />
      <div aria-hidden className="absolute -right-48 -bottom-48 -z-10 size-[36rem] rounded-full bg-gradient-to-tl from-amber-200/70 via-brand-muted to-transparent blur-3xl" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-multiply" />
      <div className={cn(CONTAINER, "fade-in py-20 text-center")}>
        <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-xs">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {t("badge")}
        </p>
        <h1 className="mx-auto mt-7 max-w-5xl text-4xl leading-[1.12] font-bold tracking-tight break-keep text-balance text-zinc-950 [overflow-wrap:anywhere] sm:text-6xl xl:text-7xl">
          {t.rich("title", { hl: (chunks) => <span className="text-brand">{chunks}</span> })}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-600 sm:text-xl">
          {t("subtitle")}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/editor"
            className={buttonClass({ size: "lg" }, "shadow-lg shadow-brand/25")}
          >
            {t("cta")}
            <ArrowRightIcon />
          </Link>
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-zinc-600">
          {trust.map((k) => (
            <li key={k} className="inline-flex items-center gap-1.5">
              <CheckIcon className="text-emerald-600" />
              {t(`trust.${k}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Features() {
  const t = useTranslations("Home.features");
  const items = Object.entries(FEATURE_ICONS).map(([key, Icon]) => ({ key: key as keyof typeof FEATURE_ICONS, Icon }));
  return (
    <section className="flex min-h-[80dvh] items-center bg-white py-24">
      <div className={CONTAINER}>
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{t("title")}</h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 90} className="h-full">
              <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
                <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon width={22} height={22} />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">{t(`${key}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-zinc-600">{t(`${key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  const t = useTranslations("Home.steps");
  const items = [
    { key: "fill", Icon: FileIcon },
    { key: "preview", Icon: ScanIcon },
    { key: "download", Icon: DownloadIcon },
  ] as const;
  return (
    <section className="flex min-h-[80dvh] items-center bg-stone-50 py-24">
      <div className={CONTAINER}>
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{t("title")}</h2>
        </Reveal>
        <ol className="mt-16 grid gap-10 md:grid-cols-3">
          {items.map(({ key, Icon }, i) => (
            <Reveal as="li" key={key} delay={i * 90} className="relative flex flex-col items-center text-center">
              {i < items.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-8 left-[calc(50%+48px)] hidden h-0.5 w-[calc(100%-96px)] rounded-full bg-zinc-200 md:block"
                />
              )}
              <span className="relative grid size-16 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
                <Icon width={26} height={26} />
                <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-white text-xs font-bold text-zinc-900 shadow ring-1 ring-zinc-200">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">{t(`${key}.title`)}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-zinc-600">{t(`${key}.desc`)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white px-6 shadow-xs transition-all duration-200",
        open ? "border-orange-200 shadow-lg shadow-zinc-900/5" : "border-zinc-200",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-4 py-5 text-left font-medium text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-brand" />
        <span className="flex-1">{q}</span>
        <span
          aria-hidden
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-lg leading-none text-zinc-500 transition-all duration-200",
            open ? "rotate-45 bg-brand text-white" : "",
          )}
        >
          +
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-250 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-6 pl-6.5 leading-relaxed text-zinc-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const t = useTranslations("Home.faq");
  return (
    <section className="flex min-h-[80dvh] items-center bg-white py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{t("title")}</h2>
        </Reveal>
        <div className="mt-12 flex flex-col gap-3">
          {FAQ_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 50}>
              <FaqItem
                q={t(`${key}.q`)}
                a={t(`${key}.a`)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const t = useTranslations("Home.cta");
  return (
    <section className="relative isolate flex min-h-[60dvh] items-center overflow-hidden bg-brand-soft py-24 text-center text-zinc-950">
      <div aria-hidden className="absolute -top-48 -left-48 -z-10 size-[36rem] rounded-full bg-gradient-to-br from-orange-200/80 via-brand-muted to-transparent blur-3xl" />
      <div aria-hidden className="absolute -right-48 -bottom-48 -z-10 size-[36rem] rounded-full bg-gradient-to-tl from-amber-200/70 via-brand-muted to-transparent blur-3xl" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-multiply" />
      <div className={CONTAINER}>
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">{t("title")}</h2>
        </Reveal>
        <Reveal delay={120}>
          <Link
            href="/editor"
            className={buttonClass({ size: "lg" }, "mt-10 shadow-lg shadow-brand/25")}
          >
            {t("button")}
            <ArrowRightIcon />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
