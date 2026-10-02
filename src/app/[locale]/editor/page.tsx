import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EditorLoader } from "@/components/editor/editor-loader";
import { SiteHeader } from "@/components/site/site-header";

export async function generateMetadata({ params }: PageProps<"/[locale]/editor">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: { canonical: `/${locale}/editor` } };
}

export default async function EditorPage({ params }: PageProps<"/[locale]/editor">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex h-dvh flex-col">
      <SiteHeader showCta={false} backHome wide pill={false} className="relative" />
      <main className="flex min-h-0 flex-1 flex-col">
        <EditorLoader />
      </main>
    </div>
  );
}
