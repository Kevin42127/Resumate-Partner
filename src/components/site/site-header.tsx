"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { HomeIcon, MenuIcon, XIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

export function Logo() {
  const t = useTranslations("Meta");
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="flex shrink-0 cursor-pointer items-center gap-2 text-lg font-bold tracking-tight text-zinc-900"
    >
      {t("siteName")}
    </Link>
  );
}

export function SiteHeader({
  showCta = true,
  backHome = false,
  wide = false,
  pill = true,
  className,
}: {
  showCta?: boolean;
  backHome?: boolean;
  wide?: boolean;
  pill?: boolean;
  className?: string;
}) {
  const t = useTranslations("Nav");
  const [menu, setMenu] = useState<"closed" | "open" | "closing">("closed");
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setMenu((s) => (s === "open" ? "closing" : s));
    window.setTimeout(() => setMenu((s) => (s === "closing" ? "closed" : s)), 200);
  };

  useEffect(() => {
    if (menu !== "open") return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menu]);
  const content = (
    <>
      <Logo />
      <nav className="flex shrink-0 items-center gap-0.5 sm:gap-2">
        {backHome && (
          <Link
            href="/"
            aria-label={t("home")}
            title={t("home")}
            className={buttonClass({ variant: "ghost", size: "icon" })}
          >
            <HomeIcon width={20} height={20} />
          </Link>
        )}
        <Link
          href="/privacy"
          className={buttonClass({ variant: "ghost", size: "sm" }, "hidden px-1.5 sm:px-3 md:inline-flex")}
        >
          {t("privacy")}
        </Link>
        <Link
          href="/terms"
          className={buttonClass({ variant: "ghost", size: "sm" }, "hidden px-1.5 sm:px-3 md:inline-flex")}
        >
          {t("terms")}
        </Link>
        <Link
          href="/about"
          className={buttonClass({ variant: "ghost", size: "sm" }, "hidden px-1.5 sm:px-3 md:inline-flex")}
        >
          {t("about")}
        </Link>
        <LanguageSwitcher />
        {pill && (
          <button
            type="button"
            onClick={() => (menu === "open" ? closeMenu() : setMenu("open"))}
            aria-expanded={menu === "open"}
            aria-label={t("menu")}
            className={buttonClass({ variant: "ghost", size: "icon" }, "md:hidden")}
          >
            {menu !== "closed" ? <XIcon /> : <MenuIcon />}
          </button>
        )}
        {showCta && !pill && (
          <Link href="/editor" className={buttonClass({ size: "sm" }, "ml-1 px-2.5 sm:ml-0 sm:px-3")}>
            {t("start")}
          </Link>
        )}
      </nav>
    </>
  );

  if (!pill) {
    return (
      <header className={cn("sticky top-0 z-40 w-full border-b border-zinc-200 bg-white", className)}>
        <div
          className={cn(
            "flex h-14 w-full items-center justify-between gap-4",
            wide ? "px-3 sm:px-4" : "px-5 sm:px-8 lg:px-12",
          )}
        >
          {content}
        </div>
      </header>
    );
  }

  return (
    <header className={cn("fixed inset-x-0 top-6 z-40 w-full px-5 sm:px-8 lg:px-12", className)}>
      <div ref={menuRef} className="relative mx-auto w-full max-w-7xl">
        <div className="flex h-14 w-full items-center justify-between gap-2 rounded-2xl border border-zinc-200/80 bg-white px-3 shadow-lg shadow-zinc-900/5 sm:px-4">
          {content}
        </div>
        {menu !== "closed" && (
          <nav
            onAnimationEnd={() => setMenu((s) => (s === "closing" ? "closed" : s))}
            className={cn(
              "absolute inset-x-0 top-full z-50 mt-2 flex flex-col gap-0.5 rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-lg shadow-zinc-900/5 md:hidden",
              menu === "closing" ? "menu-out" : "menu-in",
            )}
          >
            <Link
              href="/privacy"
              onClick={closeMenu}
              className={buttonClass({ variant: "ghost", size: "md" }, "w-full justify-start")}
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              onClick={closeMenu}
              className={buttonClass({ variant: "ghost", size: "md" }, "w-full justify-start")}
            >
              {t("terms")}
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className={buttonClass({ variant: "ghost", size: "md" }, "w-full justify-start")}
            >
              {t("about")}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
