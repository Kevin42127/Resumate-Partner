"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createEmptyResume,
  createListItem,
  newId,
  resumeSchema,
  SCHEMA_VERSION,
  type ListItem,
  type ListKey,
  type Resume,
  type ResumeLocale,
  type SectionKey,
} from "./schema";

export type ResumeEntry = { id: string; name: string; updatedAt: number; resume: Resume };

const makeEntry = (resume: Resume, name = ""): ResumeEntry => ({
  id: newId(),
  name,
  updatedAt: Date.now(),
  resume,
});

const syncEntry = (entries: ResumeEntry[], activeId: string, resume: Resume) =>
  entries.map((e) => (e.id === activeId ? { ...e, resume, updatedAt: Date.now() } : e));

type Persisted = {
  resume?: unknown;
  entries?: ResumeEntry[];
  activeId?: string;
  initialized?: boolean;
};

function parsePersisted(p: Persisted | undefined): {
  entries: ResumeEntry[];
  activeId: string;
  resume: Resume;
} {
  // Legacy shape: { resume, initialized } — wrap into a single entry.
  if (p?.resume !== undefined && p?.entries === undefined) {
    const parsed = resumeSchema.safeParse(p.resume);
    const entry = makeEntry(parsed.success ? parsed.data : createEmptyResume());
    return { entries: [entry], activeId: entry.id, resume: entry.resume };
  }
  const entries = (Array.isArray(p?.entries) ? p.entries : [])
    .map((e) => {
      const parsed = resumeSchema.safeParse(e?.resume);
      if (!parsed.success || typeof e?.id !== "string") return null;
      return {
        id: e.id,
        name: typeof e.name === "string" ? e.name : "",
        updatedAt: typeof e.updatedAt === "number" ? e.updatedAt : 0,
        resume: parsed.data,
      };
    })
    .filter((e): e is ResumeEntry => e !== null);
  if (entries.length === 0) {
    const entry = makeEntry(createEmptyResume());
    return { entries: [entry], activeId: entry.id, resume: entry.resume };
  }
  const activeId = entries.some((e) => e.id === p?.activeId) ? (p?.activeId as string) : entries[0].id;
  return { entries, activeId, resume: entries.find((e) => e.id === activeId)!.resume };
}

type State = {
  resume: Resume;
  entries: ResumeEntry[];
  activeId: string;
  initialized: boolean;
  setResume: (resume: Resume) => void;
  update: (fn: (resume: Resume) => Resume) => void;
  setBasics: (patch: Partial<Resume["basics"]>) => void;
  setAutobiography: (text: string) => void;
  setResumeLocale: (locale: ResumeLocale) => void;
  addItem: (key: ListKey) => void;
  updateItem: <K extends ListKey>(key: K, id: string, patch: Partial<ListItem<K>>) => void;
  removeItem: (key: ListKey, id: string) => void;
  reorderItems: (key: ListKey, ids: string[]) => void;
  setSectionOrder: (order: SectionKey[]) => void;
  toggleSection: (key: SectionKey) => void;
  reset: (resume: Resume) => void;
  switchResume: (id: string) => void;
  createResume: (name: string, resume?: Resume) => void;
  duplicateResume: (id: string, name: string) => void;
  renameResume: (id: string, name: string) => void;
  deleteResume: (id: string) => void;
};

export const useResumeStore = create<State>()(
  persist(
    (set) => {
      const update = (fn: (r: Resume) => Resume) =>
        set((s) => {
          const resume = fn(s.resume);
          return { resume, entries: syncEntry(s.entries, s.activeId, resume) };
        });
      const initialEntry = makeEntry(createEmptyResume());
      return {
        resume: initialEntry.resume,
        entries: [initialEntry],
        activeId: initialEntry.id,
        initialized: false,
        setResume: (resume) => set((s) => ({ resume, entries: syncEntry(s.entries, s.activeId, resume) })),
        update,
        setBasics: (patch) => update((r) => ({ ...r, basics: { ...r.basics, ...patch } })),
        setAutobiography: (autobiography) => update((r) => ({ ...r, autobiography })),
        setResumeLocale: (resumeLocale) => update((r) => ({ ...r, meta: { ...r.meta, resumeLocale } })),
        addItem: (key) => update((r) => ({ ...r, [key]: [...r[key], createListItem(key)] })),
        updateItem: (key, id, patch) =>
          update((r) => ({
            ...r,
            [key]: (r[key] as ListItem<typeof key>[]).map((item) => (item.id === id ? { ...item, ...patch } : item)),
          })),
        removeItem: (key, id) =>
          update((r) => ({ ...r, [key]: (r[key] as { id: string }[]).filter((i) => i.id !== id) })),
        reorderItems: (key, ids) =>
          update((r) => {
            const byId = new Map((r[key] as { id: string }[]).map((i) => [i.id, i]));
            return { ...r, [key]: ids.map((id) => byId.get(id)).filter(Boolean) };
          }),
        setSectionOrder: (sectionOrder) => update((r) => ({ ...r, meta: { ...r.meta, sectionOrder } })),
        toggleSection: (key) =>
          update((r) => {
            const hidden = r.meta.hiddenSections;
            return {
              ...r,
              meta: {
                ...r.meta,
                hiddenSections: hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key],
              },
            };
          }),
        reset: (resume) =>
          set((s) => ({ resume, initialized: true, entries: syncEntry(s.entries, s.activeId, resume) })),
        switchResume: (id) =>
          set((s) => {
            const entry = s.entries.find((e) => e.id === id);
            return entry ? { activeId: id, resume: entry.resume } : {};
          }),
        createResume: (name, resume = createEmptyResume()) =>
          set((s) => {
            const entry = makeEntry(resume, name);
            return { entries: [...s.entries, entry], activeId: entry.id, resume: entry.resume, initialized: true };
          }),
        duplicateResume: (id, name) =>
          set((s) => {
            const src = s.entries.find((e) => e.id === id);
            if (!src) return {};
            const entry = makeEntry(structuredClone(src.resume), name);
            const entries = [...s.entries];
            entries.splice(entries.indexOf(src) + 1, 0, entry);
            return { entries, activeId: entry.id, resume: entry.resume };
          }),
        renameResume: (id, name) =>
          set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, name } : e)) })),
        deleteResume: (id) =>
          set((s) => {
            let entries = s.entries.filter((e) => e.id !== id);
            if (entries.length === 0) entries = [makeEntry(createEmptyResume())];
            if (s.activeId === id) {
              return { entries, activeId: entries[0].id, resume: entries[0].resume };
            }
            return { entries };
          }),
      };
    },
    {
      name: "resume-builder",
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ entries: s.entries, activeId: s.activeId, initialized: s.initialized }),
      migrate: (persisted) => {
        const { entries, activeId, resume } = parsePersisted(persisted as Persisted | undefined);
        const p = persisted as Persisted | undefined;
        return { entries, activeId, resume, initialized: Boolean(p?.initialized) };
      },
      merge: (persisted, current) => {
        const { entries, activeId, resume } = parsePersisted(persisted as Persisted | undefined);
        const p = persisted as Persisted | undefined;
        return { ...current, resume, entries, activeId, initialized: Boolean(p?.initialized) };
      },
    },
  ),
);
