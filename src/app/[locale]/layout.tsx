import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SwRegister } from "@/components/site/sw-register";
import { routing, type AppLocale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// URL slugs ("zh") → real language tags for <html lang>, hreflang, and og:locale.
const HTML_TAGS: Record<AppLocale, string> = { zh: "zh-TW", en: "en" };
const OG_LOCALES: Record<AppLocale, string> = { zh: "zh_TW", en: "en_US" };

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const noto = Noto_Sans_TC({ weight: ["400", "500", "700"], variable: "--font-noto-tc", display: "swap", preload: false });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("siteName"),
    description: t("description"),
    applicationName: t("siteName"),
    manifest: "/site.webmanifest",
    verification: { google: "ikA4eMUhLTjnxBSzCa1RpgmEg5SL_scysFac4hD4b-k" },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { "x-default": "/zh", ...Object.fromEntries(routing.locales.map((l) => [HTML_TAGS[l], `/${l}`])) },
    },
    openGraph: { type: "website", siteName: t("siteName"), title: t("title"), description: t("description"), locale: OG_LOCALES[locale as AppLocale] },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={HTML_TAGS[locale]} className={`${inter.variable} ${noto.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          {children}
          <SwRegister />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
