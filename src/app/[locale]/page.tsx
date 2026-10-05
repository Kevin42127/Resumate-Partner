import { getTranslations, setRequestLocale } from "next-intl/server";
import { Demo, Faq, Features, FinalCta, Hero, Steps } from "@/components/home/home-sections";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { FAQ_KEYS } from "@/lib/faq";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home.faq" });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`${key}.q`),
      acceptedAnswer: { "@type": "Answer", text: t(`${key}.a`) },
    })),
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Steps />
        <Demo />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
