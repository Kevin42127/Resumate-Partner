import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/site/page-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { POSTS } from "@/lib/posts";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: { canonical: `/${locale}/blog` } };
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Blog" });
  return (
    <>
      <SiteHeader />
      <PageShell>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 pt-28 pb-16 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">{t("title")}</h1>
          <ul className="mt-8 space-y-4">
            {POSTS.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/blog/${slug}`}
                  className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg"
                >
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{t(`posts.${slug}.title`)}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{t(`posts.${slug}.desc`)}</p>
                  <p className="mt-4 flex items-center justify-between text-xs">
                    <time className="text-zinc-400">{t(`posts.${slug}.date`)}</time>
                    <span className="font-medium text-brand-strong">{t("readMore")} →</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </PageShell>
      <SiteFooter />
    </>
  );
}
