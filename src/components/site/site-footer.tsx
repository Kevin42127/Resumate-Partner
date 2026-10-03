import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tMeta = useTranslations("Meta");
  return (
    <footer className="relative overflow-hidden bg-zinc-50/60 text-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/about" className="text-zinc-600 transition-colors hover:text-zinc-950">
              {tNav("about")}
            </Link>
            <Link href="/blog" className="text-zinc-600 transition-colors hover:text-zinc-950">
              {tNav("blog")}
            </Link>
            <Link href="/privacy" className="text-zinc-600 transition-colors hover:text-zinc-950">
              {tNav("privacy")}
            </Link>
            <Link href="/terms" className="text-zinc-600 transition-colors hover:text-zinc-950">
              {tNav("terms")}
            </Link>
          </nav>
          <p className="text-xs text-zinc-500">{t("rights", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none overflow-hidden text-center select-none">
        <span className="block text-[clamp(1.5rem,6vw,4.5rem)] leading-[0.9] font-bold tracking-tighter whitespace-nowrap text-zinc-950 uppercase">
          {tMeta("siteName")}
        </span>
      </div>
    </footer>
  );
}
