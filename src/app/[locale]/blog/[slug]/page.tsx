import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/site/page-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { isPostSlug, JOB_SITE_URLS, type PostSection } from "@/lib/posts";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isPostSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t(`posts.${slug}.title`),
    description: t(`posts.${slug}.desc`),
    alternates: { canonical: `/${locale}/blog/${slug}` },
    openGraph: { type: "article", title: t(`posts.${slug}.title`), description: t(`posts.${slug}.desc`) },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isPostSlug(slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Blog" });
  const sections = t.raw(`posts.${slug}.body`) as PostSection[];
  return (
    <>
      <SiteHeader backHome />
      <PageShell>
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 pt-28 pb-16 sm:px-6">
          <article>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              <ArrowLeftIcon width={14} height={14} />
              {t("back")}
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">{t(`posts.${slug}.title`)}</h1>
            <time className="mt-2 block text-sm text-zinc-500">{t(`posts.${slug}.date`)}</time>
            {sections.map((section, i) => (
              <section key={i} className="mt-8">
                {section.h && <h2 className="text-lg font-semibold tracking-tight text-zinc-900">{section.h}</h2>}
                {section.p?.map((paragraph, j) => (
                  <p key={j} className="mt-3 leading-relaxed text-zinc-700">
                    {paragraph}
                  </p>
                ))}
                {section.table && (
                  <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-brand bg-brand">
                          {section.table.head.map((cell) => (
                            <th key={cell} className="px-4 py-2.5 font-medium whitespace-nowrap text-white">
                              {cell}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, i) => (
                          <tr key={i} className="border-b border-zinc-100 last:border-0">
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className={
                                  j === 0
                                    ? "px-4 py-2.5 align-top font-medium whitespace-nowrap text-zinc-900"
                                    : "px-4 py-2.5 align-top leading-relaxed text-zinc-600"
                                }
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {section.sites && (
                  <ul className="mt-4 space-y-3">
                    {section.sites.map((site) => (
                      <li key={site.key}>
                        <a
                          href={JOB_SITE_URLS[site.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-brand/40 hover:shadow-md"
                        >
                          <span className="font-medium text-zinc-900">
                            {site.name} <span className="text-zinc-400">↗</span>
                          </span>
                          <span className="mt-0.5 block text-sm leading-relaxed text-zinc-600">{site.note}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </main>
      </PageShell>
      <SiteFooter />
    </>
  );
}
