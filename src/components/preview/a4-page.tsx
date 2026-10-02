"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { ZoomInIcon, ZoomOutIcon } from "@/components/ui/icons";
import { PAGE } from "@/lib/design";

const MM_TO_PX = 96 / 25.4;
const PAGE_W = PAGE.widthMm * MM_TO_PX;
const PAGE_H = PAGE.heightMm * MM_TO_PX;
const MARGIN_X = PAGE.marginXMm * MM_TO_PX;
const MARGIN_Y = PAGE.marginYMm * MM_TO_PX;
const CONTENT_W = PAGE_W - 2 * MARGIN_X;
const CONTENT_H = PAGE_H - 2 * MARGIN_Y;

interface PageSlice {
  offset: number;
  height: number;
}

function computePageSlices(measureEl: HTMLElement): PageSlice[] {
  const parentRect = measureEl.getBoundingClientRect();
  const article = measureEl.querySelector("article");
  const totalH = measureEl.scrollHeight;
  if (!article || totalH === 0) return [{ offset: 0, height: CONTENT_H }];

  // Collect boundary points between blocks so we never break inside a block
  const candidates: { top: number; bottom: number }[] = [];

  const sections = article.querySelectorAll("section");
  for (const s of sections) {
    const h2 = s.querySelector("h2");
    const firstBlock = s.querySelector(":scope > div, :scope > p");
    if (h2) {
      const h2Rect = h2.getBoundingClientRect();
      const firstRect = firstBlock ? firstBlock.getBoundingClientRect() : h2Rect;
      // Heading must stay with its first block (keep-with-next)
      candidates.push({
        top: h2Rect.top - parentRect.top,
        bottom: firstRect.bottom - parentRect.top,
      });
    }

    const blocks = Array.from(s.querySelectorAll(":scope > div, :scope > p"));
    blocks.forEach((block) => {
      const bRect = block.getBoundingClientRect();
      candidates.push({
        top: bRect.top - parentRect.top,
        bottom: bRect.bottom - parentRect.top,
      });
      // Individual list items can be break points for very long entries
      const lis = Array.from(block.querySelectorAll("li"));
      lis.forEach((li) => {
        const liRect = li.getBoundingClientRect();
        candidates.push({
          top: liRect.top - parentRect.top,
          bottom: liRect.bottom - parentRect.top,
        });
      });
    });
  }

  candidates.sort((a, b) => a.top - b.top);

  const slices: PageSlice[] = [];
  let currentStart = 0;

  while (currentStart < totalH) {
    const pageLimit = currentStart + CONTENT_H;

    if (pageLimit >= totalH) {
      slices.push({ offset: currentStart, height: totalH - currentStart });
      break;
    }

    // Find the block candidate that straddles the pageLimit
    let breakPoint = pageLimit;
    for (const c of candidates) {
      if (c.top > currentStart && c.top < pageLimit && c.bottom > pageLimit) {
        breakPoint = c.top;
        break;
      }
    }

    // Fallback: if a single block is taller than an entire page
    if (breakPoint <= currentStart) {
      breakPoint = pageLimit;
    }

    slices.push({ offset: currentStart, height: breakPoint - currentStart });
    currentStart = breakPoint;
  }

  return slices.length > 0 ? slices : [{ offset: 0, height: CONTENT_H }];
}

export function A4Page({ children, label }: { children: React.ReactNode; label?: string }) {
  const t = useTranslations("Editor");
  const outerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [slices, setSlices] = useState<PageSlice[]>([{ offset: 0, height: CONTENT_H }]);

  useEffect(() => {
    const outer = outerRef.current;
    const measure = measureRef.current;
    if (!outer || !measure) return;

    const update = () => {
      setFitScale(Math.min(1, outer.clientWidth / PAGE_W));
      setSlices(computePageSlices(measure));
    };

    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(measure);
    update();
    return () => ro.disconnect();
  }, []);

  const scale = zoomed ? 1 : fitScale;
  const pages = slices.length;

  return (
    <div ref={outerRef} className="w-full" aria-label={label}>
      {/* Hidden measurement container at printable width – zero visual height */}
      <div aria-hidden style={{ height: 0, overflow: "hidden", width: CONTENT_W }}>
        <div ref={measureRef}>{children}</div>
      </div>

      {fitScale < 1 && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            aria-pressed={zoomed}
            onClick={() => setZoomed((z) => !z)}
            className={buttonClass({ variant: "outline", size: "sm" })}
          >
            {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
            {zoomed ? t("zoomFit") : t("zoomIn")}
          </button>
        </div>
      )}

      {/* One A4 sheet per page */}
      <div className="flex flex-col gap-6" style={zoomed ? { minWidth: PAGE_W } : undefined}>
        {slices.map((slice, i) => (
          <div
            key={i}
            className="relative mx-auto overflow-hidden bg-white shadow-[0_1px_2px_rgb(0_0_0/0.06),0_12px_32px_-8px_rgb(0_0_0/0.18)] ring-1 ring-zinc-900/5"
            style={{ width: PAGE_W * scale, height: PAGE_H * scale }}
          >
            {pages > 1 && (
              <span className="absolute top-2 right-2 z-20 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-600 ring-1 ring-sky-200/50">
                {i + 1} / {pages}
              </span>
            )}

            {/*
             * Content window:
             * Located at (MARGIN_X, MARGIN_Y).
             * Height is bounded to slice.height so no text beyond the clean break point leaks out.
             * overflow: hidden ensures the slice is contained without leaking to the margins.
             */}
            <div
              className="absolute overflow-hidden"
              style={{
                top: MARGIN_Y * scale,
                left: MARGIN_X * scale,
                width: CONTENT_W * scale,
                height: slice.height * scale,
              }}
            >
              <div
                className="origin-top-left"
                style={{
                  width: CONTENT_W,
                  transform: `scale(${scale}) translateY(${-slice.offset}px)`,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
