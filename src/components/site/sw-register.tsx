"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useOfflineReady } from "./offline-ready";

export function SwRegister() {
  const t = useTranslations("Pwa");
  const ready = useOfflineReady();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!ready || hidden) return;
    const id = setTimeout(() => setHidden(true), 6000);
    return () => clearTimeout(id);
  }, [ready, hidden]);

  if (!ready || hidden) return null;
  return (
    <p
      role="status"
      className="fade-in fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-lg"
    >
      {t("offlineReady")}
    </p>
  );
}
