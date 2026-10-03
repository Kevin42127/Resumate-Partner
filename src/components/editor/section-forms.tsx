"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "@/components/ui/field";
import { MonthPicker } from "@/components/ui/month-picker";
import { EyeIcon, EyeOffIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { useResumeStore } from "@/lib/store";
import { newId, RESUME_LOCALES, type ResumeLocale, type SectionKey } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { DateRangeFields } from "./fields";
import { ItemList } from "./item-list";
import { DragHandle, SortableItem, SortableList } from "./sortable-list";

const useT = () => useTranslations("Editor");

const LOCALE_LABEL: Record<ResumeLocale, "toolbar.zh" | "toolbar.en"> = { "zh-TW": "toolbar.zh", en: "toolbar.en" };

export function BasicsForm() {
  const t = useT();
  const basics = useResumeStore((s) => s.resume.basics);
  const setBasics = useResumeStore((s) => s.setBasics);
  const resumeLocale = useResumeStore((s) => s.resume.meta.resumeLocale);
  const setResumeLocale = useResumeStore((s) => s.setResumeLocale);
  const text = (key: "name" | "title" | "phone" | "email" | "location" | "desiredPosition" | "desiredSalary", extra?: object) => (
    <TextField label={t(`fields.${key}`)} value={basics[key]} onValueChange={(v) => setBasics({ [key]: v })} {...extra} />
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="text-xs font-medium text-zinc-600">{t("toolbar.resumeLocale")}</span>
        <div role="group" className="flex w-fit items-center gap-1 rounded-full border border-zinc-200 bg-white p-1">
          {RESUME_LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={resumeLocale === l}
              onClick={() => setResumeLocale(l)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-colors",
                resumeLocale === l ? "bg-brand text-white shadow-sm shadow-brand/30" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800",
              )}
            >
              {t(LOCALE_LABEL[l])}
            </button>
          ))}
        </div>
      </div>
      {text("name", { placeholder: t("placeholders.name"), autoComplete: "name" })}
      {text("title", { placeholder: t("placeholders.title"), autoComplete: "organization-title" })}
      {text("phone", { type: "tel", autoComplete: "tel" })}
      {text("email", { type: "email", autoComplete: "email" })}
      {text("location", { autoComplete: "address-level2" })}
      <div className="hidden sm:block" />
      {text("desiredPosition")}
      {text("desiredSalary")}
      <div className="flex flex-col gap-2 sm:col-span-2">
        <span className="text-xs font-medium text-zinc-600">{t("fields.links")}</span>
        {basics.links.map((link) => (
          <div key={link.id} className="grid grid-cols-[1fr_2fr_auto] items-end gap-2">
            <TextField
              label={t("fields.linkLabel")}
              value={link.label}
              placeholder="GitHub"
              onValueChange={(label) => setBasics({ links: basics.links.map((l) => (l.id === link.id ? { ...l, label } : l)) })}
            />
            <TextField
              type="url"
              label={t("fields.linkUrl")}
              value={link.url}
              placeholder="https://"
              onValueChange={(url) => setBasics({ links: basics.links.map((l) => (l.id === link.id ? { ...l, url } : l)) })}
            />
            <Button
              variant="ghost"
              size="icon"
              className="mb-0.5 text-zinc-400 hover:text-red-600"
              aria-label={t("actions.remove")}
              onClick={() => setBasics({ links: basics.links.filter((l) => l.id !== link.id) })}
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="self-start border-dashed"
          onClick={() => setBasics({ links: [...basics.links, { id: newId(), label: "", url: "" }] })}
        >
          <PlusIcon />
          {t("fields.links")}
        </Button>
      </div>
    </div>
  );
}

function DescriptionField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useT();
  return (
    <TextAreaField
      className="sm:col-span-2"
      label={t("fields.description")}
      hint={t("fields.descriptionHint")}
      placeholder={t("placeholders.description")}
      value={value}
      onValueChange={onChange}
    />
  );
}

export function EducationForm() {
  const t = useT();
  return (
    <ItemList
      listKey="education"
      summary={(i) => [i.school, i.field].filter(Boolean).join(" · ")}
      renderFields={(item, patch) => (
        <>
          <TextField className="sm:col-span-2" label={t("fields.school")} value={item.school} onValueChange={(school) => patch({ school })} />
          <TextField label={t("fields.field")} value={item.field} onValueChange={(field) => patch({ field })} />
          <TextField label={t("fields.degree")} value={item.degree} onValueChange={(degree) => patch({ degree })} />
          <DateRangeFields value={item} onChange={patch} />
          <DescriptionField value={item.description} onChange={(description) => patch({ description })} />
        </>
      )}
    />
  );
}

export function WorkForm() {
  const t = useT();
  return (
    <ItemList
      listKey="work"
      summary={(i) => [i.company, i.position].filter(Boolean).join(" · ")}
      renderFields={(item, patch) => (
        <>
          <TextField label={t("fields.company")} value={item.company} onValueChange={(company) => patch({ company })} />
          <TextField label={t("fields.position")} value={item.position} onValueChange={(position) => patch({ position })} />
          <TextField label={t("fields.workLocation")} value={item.location} onValueChange={(location) => patch({ location })} />
          <div className="hidden sm:block" />
          <DateRangeFields value={item} onChange={patch} />
          <DescriptionField value={item.description} onChange={(description) => patch({ description })} />
        </>
      )}
    />
  );
}

export function ProjectsForm() {
  const t = useT();
  return (
    <ItemList
      listKey="projects"
      summary={(i) => i.name}
      renderFields={(item, patch) => (
        <>
          <TextField label={t("fields.projectName")} value={item.name} onValueChange={(name) => patch({ name })} />
          <TextField label={t("fields.role")} value={item.role} onValueChange={(role) => patch({ role })} />
          <TextField
            className="sm:col-span-2"
            type="url"
            label={t("fields.link")}
            placeholder="https://"
            value={item.link}
            onValueChange={(link) => patch({ link })}
          />
          <DateRangeFields value={item} onChange={patch} />
          <DescriptionField value={item.description} onChange={(description) => patch({ description })} />
        </>
      )}
    />
  );
}

export function SkillsForm() {
  const t = useT();
  return (
    <ItemList
      listKey="skills"
      summary={(i) => i.group || i.items}
      renderFields={(item, patch) => (
        <>
          <TextField label={t("fields.group")} value={item.group} onValueChange={(group) => patch({ group })} />
          <TextField
            label={t("fields.items")}
            hint={t("fields.itemsHint")}
            placeholder={t("placeholders.items")}
            value={item.items}
            onValueChange={(items) => patch({ items })}
          />
        </>
      )}
    />
  );
}

export function SectionVisibility({ section }: { section: SectionKey }) {
  const t = useT();
  const hidden = useResumeStore((s) => s.resume.meta.hiddenSections.includes(section));
  const toggle = useResumeStore((s) => s.toggleSection);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-pressed={hidden}
      aria-label={`${hidden ? t("actions.show") : t("actions.hide")}：${t(`sections.${section}`)}`}
      title={hidden ? t("actions.show") : t("actions.hide")}
      onClick={() => toggle(section)}
      className={hidden ? "text-zinc-400" : "text-zinc-600"}
    >
      {hidden ? <EyeOffIcon /> : <EyeIcon />}
    </Button>
  );
}

export function CertLangVisibility() {
  const t = useT();
  const hiddenSections = useResumeStore((s) => s.resume.meta.hiddenSections);
  const toggle = useResumeStore((s) => s.toggleSection);

  const certsHidden = hiddenSections.includes("certificates");
  const langsHidden = hiddenSections.includes("languages");
  const allHidden = certsHidden && langsHidden;

  const handleToggle = () => {
    if (allHidden) {
      if (certsHidden) toggle("certificates");
      if (langsHidden) toggle("languages");
    } else {
      if (!certsHidden) toggle("certificates");
      if (!langsHidden) toggle("languages");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-pressed={allHidden}
      aria-label={`${allHidden ? t("actions.show") : t("actions.hide")}：${t("steps.certLang")}`}
      title={allHidden ? t("actions.show") : t("actions.hide")}
      onClick={handleToggle}
      className={allHidden ? "text-zinc-400" : "text-zinc-600"}
    >
      {allHidden ? <EyeOffIcon /> : <EyeIcon />}
    </Button>
  );
}

export function CertLangForm() {
  const t = useT();
  return (
    <div className="flex flex-col gap-5">
      {(["certificates", "languages"] as const).map((key) => (
        <div key={key} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-800">{t(`sections.${key}`)}</h3>
            <SectionVisibility section={key} />
          </div>
          {key === "certificates" ? (
            <ItemList
              listKey="certificates"
              summary={(i) => i.name}
              renderFields={(item, patch) => (
                <>
                  <TextField className="sm:col-span-2" label={t("fields.certName")} value={item.name} onValueChange={(name) => patch({ name })} />
                  <TextField label={t("fields.issuer")} value={item.issuer} onValueChange={(issuer) => patch({ issuer })} />
                  <MonthPicker
                    label={t("fields.date")}
                    placeholder={t("placeholders.month")}
                    value={item.date}
                    onValueChange={(date) => patch({ date })}
                  />
                </>
              )}
            />
          ) : (
            <ItemList
              listKey="languages"
              summary={(i) => [i.name, i.level].filter(Boolean).join(" · ")}
              renderFields={(item, patch) => (
                <>
                  <TextField label={t("fields.language")} value={item.name} onValueChange={(name) => patch({ name })} />
                  <TextField
                    label={t("fields.level")}
                    placeholder={t("placeholders.level")}
                    value={item.level}
                    onValueChange={(level) => patch({ level })}
                  />
                </>
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function AutobiographyForm() {
  const t = useT();
  const value = useResumeStore((s) => s.resume.autobiography);
  const set = useResumeStore((s) => s.setAutobiography);
  return (
    <TextAreaField
      label={t("fields.autobiography")}
      hint={t("fields.autobiographyHint")}
      rows={10}
      value={value}
      onValueChange={set}
    />
  );
}

export function LayoutPanel() {
  const t = useT();
  const order = useResumeStore((s) => s.resume.meta.sectionOrder);
  const hidden = useResumeStore((s) => s.resume.meta.hiddenSections);
  const setOrder = useResumeStore((s) => s.setSectionOrder);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-zinc-500">{t("layout.desc")}</p>
      <SortableList ids={order} onReorder={setOrder}>
        {order.map((key) => (
          <SortableItem key={key} id={key} className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white py-1 pr-1 pl-1">
            <DragHandle label={t("actions.drag")} />
            <span className={cn("flex-1 text-sm", hidden.includes(key) ? "text-zinc-400 line-through" : "text-zinc-800")}>
              {t(`sections.${key}`)}
            </span>
            <SectionVisibility section={key} />
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
}
