"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { useResumeStore } from "@/lib/store";
import type { ListItem, ListKey } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { DragHandle, SortableItem, SortableList } from "./sortable-list";

export function ItemList<K extends ListKey>({
  listKey,
  summary,
  renderFields,
  addLabel,
}: {
  listKey: K;
  summary: (item: ListItem<K>) => string;
  renderFields: (item: ListItem<K>, patch: (p: Partial<ListItem<K>>) => void) => React.ReactNode;
  addLabel?: string;
}) {
  const t = useTranslations("Editor.actions");
  const items = useResumeStore((s) => s.resume[listKey]) as ListItem<K>[];
  const { addItem, updateItem, removeItem, reorderItems } = useResumeStore.getState();
  const [openId, setOpenId] = useState<string | null>(items.length === 1 ? items[0].id : null);

  const add = () => {
    addItem(listKey);
    const list = useResumeStore.getState().resume[listKey];
    setOpenId(list[list.length - 1].id);
  };

  return (
    <div className="flex flex-col gap-2">
      <SortableList ids={items.map((i) => i.id)} onReorder={(ids) => reorderItems(listKey, ids)}>
        {items.map((item) => {
          const open = openId === item.id;
          const title = summary(item) || t("untitled");
          return (
            <SortableItem key={item.id} id={item.id} className="rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-1 py-1.5 pr-1.5 pl-1">
                <DragHandle label={t("drag")} />
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-left text-sm font-medium text-zinc-800 hover:text-zinc-950"
                >
                  <span className="truncate">{title}</span>
                  <ChevronIcon className={cn("ml-auto shrink-0 text-zinc-400 transition-transform", open && "rotate-180")} />
                  <span className="sr-only">{open ? t("collapse") : t("expand")}</span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${t("remove")} ${title}`}
                  title={t("remove")}
                  onClick={() => removeItem(listKey, item.id)}
                  className="text-zinc-400 hover:text-red-600"
                >
                  <TrashIcon />
                </Button>
              </div>
              {open && (
                <div className="fade-in grid grid-cols-1 gap-3 border-t border-zinc-100 p-3 sm:grid-cols-2">
                  {renderFields(item, (p) => updateItem(listKey, item.id, p))}
                </div>
              )}
            </SortableItem>
          );
        })}
      </SortableList>
      <Button variant="outline" size="sm" onClick={add} className="self-start border-dashed">
        <PlusIcon />
        {addLabel ?? t("add")}
      </Button>
    </div>
  );
}
