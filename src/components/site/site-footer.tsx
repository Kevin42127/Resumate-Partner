import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  return (
    <footer className="relative bg-zinc-50/60">
      <div className="flex w-full flex-col items-center gap-3 px-5 py-8 text-sm text-zinc-500 sm:px-8 lg:px-12">
        <nav className="flex items-center gap-5">
          <Link href="/privacy" className="transition-colors hover:text-zinc-900">
            {tNav("privacy")}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-zinc-900">
            {tNav("terms")}
          </Link>
          <Link href="/about" className="transition-colors hover:text-zinc-900">
            {tNav("about")}
          </Link>
        </nav>
        <p>{t("rights", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
