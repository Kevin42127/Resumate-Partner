import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: { canonical: `/${locale}/privacy` } };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return (
    <>
      <SiteHeader backHome />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-28 pb-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">{t("title")}</h1>
        <p className="mt-2 text-sm text-zinc-500">{t("updated")}</p>
        <div className="mt-8 space-y-4 leading-relaxed text-zinc-700">
          {(["p1", "p2", "p3", "p4"] as const).map((k) => (
            <p key={k}>{t(k)}</p>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
