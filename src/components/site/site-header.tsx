"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";
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
      <Image src="/android-chrome-192x192.png" alt="" width={24} height={24} className="rounded-md" />
      {t("siteName")}
    </Link>
  );
}

export function SiteHeader({
  showCta = true,
  backHome = false,
  wide = false,
  className,
}: {
  showCta?: boolean;
  backHome?: boolean;
  wide?: boolean;
  className?: string;
}) {
  const t = useTranslations("Nav");
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-zinc-200 bg-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 w-full items-center justify-between gap-4",
          wide ? "px-3 sm:px-4" : "px-5 sm:px-8 lg:px-12",
        )}
      >
        <Logo />
        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          {backHome && (
            <Link href="/" className={buttonClass({ variant: "outline", size: "sm" }, "mr-1 px-2.5 sm:mr-0 sm:px-3")}>
              <ArrowLeftIcon />
              {t("home")}
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
          {showCta && (
            <Link href="/editor" className={buttonClass({ size: "sm" }, "ml-1 px-2.5 sm:ml-0 sm:px-3")}>
              {t("start")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
