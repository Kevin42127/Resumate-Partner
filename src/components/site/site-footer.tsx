import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  return (
    <footer className="relative overflow-hidden bg-zinc-50/60 text-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
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
    </footer>
  );
}
