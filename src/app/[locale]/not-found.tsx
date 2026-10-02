import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <main className="grid flex-1 place-items-center px-4 py-24 text-center">
      <div>
        <p className="text-sm font-semibold text-brand-strong">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{t("title")}</h1>
        <Link href="/" className={buttonClass({}, "mt-6")}>
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
