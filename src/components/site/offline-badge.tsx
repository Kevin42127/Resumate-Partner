"use client";

import { useTranslations } from "next-intl";
import { WifiIcon } from "@/components/ui/icons";
import { useOfflineReady } from "./offline-ready";

export function OfflineBadge() {
  const t = useTranslations("Pwa");
  const ready = useOfflineReady();

  if (!ready) return null;
  return (
    <span
      role="status"
      title={t("offlineReady")}
      aria-label={t("offlineReady")}
      className="relative inline-flex h-8 w-8 items-center justify-center text-emerald-600"
    >
      <WifiIcon width={18} height={18} />
      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
    </span>
  );
}
