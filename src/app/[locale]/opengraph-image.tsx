import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const alt = "Resumate Partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.hero" });
  const m = await getTranslations({ locale, namespace: "Meta" });
  const title = t.markup("title", { hl: (chunks) => chunks });
  const siteName = m("siteName");
  const badge = t("badge");
  const font = await loadFont(`${title}${siteName}${badge}.docx`);
  const fallback = !font && locale !== "en";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#FFF7ED",
          borderBottom: "16px solid #EA580C",
          fontFamily: font ? "Noto Sans TC" : "sans-serif",
          color: "#18181b",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>{siteName}</div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.2, maxWidth: 980, color: "#18181b" }}>
          {fallback ? "A clean resume in 3 minutes. Download Word, edit anytime." : title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#52525b" }}>{fallback ? ".docx · No sign-up" : `.docx · ${badge}`}</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Noto Sans TC", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
