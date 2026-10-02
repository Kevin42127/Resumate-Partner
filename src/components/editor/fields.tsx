"use client";

import { useTranslations } from "next-intl";
import { CheckboxField } from "@/components/ui/field";
import { MonthPicker } from "@/components/ui/month-picker";

type Range = { start: string; end: string; current: boolean };

export function DateRangeFields({ value, onChange }: { value: Range; onChange: (p: Partial<Range>) => void }) {
  const t = useTranslations("Editor");
  return (
    <div className="grid grid-cols-2 items-end gap-3 sm:col-span-2 sm:grid-cols-[1fr_1fr_auto]">
      <MonthPicker
        label={t("fields.start")}
        placeholder={t("placeholders.month")}
        value={value.start}
        onValueChange={(start) => onChange({ start })}
      />
      <MonthPicker
        label={t("fields.end")}
        placeholder={t("placeholders.month")}
        value={value.current ? "" : value.end}
        disabled={value.current}
        onValueChange={(end) => onChange({ end })}
      />
      <div className="col-span-2 pb-2 sm:col-span-1">
        <CheckboxField label={t("fields.current")} checked={value.current} onCheckedChange={(current) => onChange({ current })} />
      </div>
    </div>
  );
}
