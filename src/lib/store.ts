"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createEmptyResume,
  createListItem,
  resumeSchema,
  SCHEMA_VERSION,
  type ListItem,
  type ListKey,
  type Resume,
  type ResumeLocale,
  type SectionKey,
} from "./schema";

type State = {
  resume: Resume;
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
};

export const useResumeStore = create<State>()(
  persist(
    (set) => {
      const update = (fn: (r: Resume) => Resume) => set((s) => ({ resume: fn(s.resume) }));
      return {
        resume: createEmptyResume(),
        initialized: false,
        setResume: (resume) => set({ resume }),
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
        reset: (resume) => set({ resume, initialized: true }),
      };
    },
    {
      name: "resume-builder",
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ resume: s.resume, initialized: s.initialized }),
      migrate: (persisted) => {
        const p = persisted as { resume?: unknown; initialized?: boolean } | undefined;
        const parsed = resumeSchema.safeParse(p?.resume ?? {});
        return { resume: parsed.success ? parsed.data : createEmptyResume(), initialized: Boolean(p?.initialized) };
      },
      merge: (persisted, current) => {
        const p = persisted as { resume?: unknown; initialized?: boolean } | undefined;
        const parsed = resumeSchema.safeParse(p?.resume);
        return {
          ...current,
          resume: parsed.success ? parsed.data : current.resume,
          initialized: Boolean(p?.initialized),
        };
      },
    },
  ),
);
