"use client";

import dynamic from "next/dynamic";

const EditorApp = dynamic(() => import("./editor-app"), {
  ssr: false,
  loading: () => (
    <div className="grid flex-1 place-items-center">
      <span className="size-6 animate-spin rounded-full border-2 border-zinc-200 border-t-brand" aria-hidden />
    </div>
  ),
});

export function EditorLoader() {
  return <EditorApp />;
}
