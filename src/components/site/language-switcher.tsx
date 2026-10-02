"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { ChevronIcon, GlobeIcon } from "@/components/ui/icons";
import { Menu, MenuItem } from "@/components/ui/menu";
import { cn } from "@/lib/utils";

const LABELS: Record<AppLocale, { name: string; code: string }> = {
  "zh-TW": { name: "繁體中文", code: "ZH" },
  en: { name: "English", code: "EN" },
};

export function LanguageSwitcher({ side = "bottom" }: { side?: "top" | "bottom" }) {
  const t = useTranslations("Nav");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <Menu
      side={side}
      trigger={({ open, ...props }) => (
        <button
          {...props}
          disabled={pending}
          aria-label={`${t("language")}：${LABELS[locale].name}`}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-1.5 text-sm whitespace-nowrap sm:gap-1.5 sm:px-2.5 text-zinc-600 transition-colors outline-none hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60",
            open && "bg-zinc-100 text-zinc-900",
          )}
        >
          <GlobeIcon />
          <span className="hidden sm:inline">{LABELS[locale].name}</span>
          <ChevronIcon
            width={14}
            height={14}
            className={cn("text-zinc-400 transition-transform", open !== (side === "top") && "rotate-180")}
          />
        </button>
      )}
    >
      {routing.locales.map((l) => (
        <MenuItem
          key={l}
          checked={l === locale}
          hint={LABELS[l].code}
          onSelect={() => {
            if (l !== locale) startTransition(() => router.replace(pathname, { locale: l }));
          }}
        >
          <span lang={l}>{LABELS[l].name}</span>
        </MenuItem>
      ))}
    </Menu>
  );
}
