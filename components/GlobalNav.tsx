"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { getExpertsCopy } from "@/lib/i18n/experts-network";
import { getCommunityCopy } from "@/lib/i18n/community-page";
import { getMonetizeCopy } from "@/lib/i18n/monetization-page";
import { getPricingCopy } from "@/lib/i18n/pricing-page";
import { DEFAULT_LOCALE } from "@/lib/locale-default";
import { isAppLocale, isRtlLocale, type AppLocale } from "@/lib/i18n/locale";
import LocaleSelect from "@/components/LocaleSelect";
import { getPostAnalysisCopy } from "@/lib/i18n/post-analysis";
import { getSiteExtras } from "@/lib/i18n/site-extras";
import { getNoveltyCopy } from "@/lib/i18n/novelty-extras";
import { getUi } from "@/lib/i18n/ui";
import {
  readLocaleCookieClient,
  syncLocaleCookieClient,
} from "@/lib/locale-cookie";
import {
  LOCALE_CHANGE_EVENT,
  applyClientLocaleChange,
} from "@/lib/locale-sync";
import NavRoutePrefetch from "@/components/NavRoutePrefetch";

const LOCALE_KEY = "lde-locale";

const navLinkClass =
  "shrink-0 whitespace-nowrap rounded-xl px-2.5 py-2 text-[rgb(var(--ink-soft))] transition-all duration-200 hover:bg-[rgb(var(--ink)/0.05)] hover:text-[rgb(var(--ink))] sm:px-3";

const mobileNavLinkClass =
  "block rounded-xl px-3 py-3.5 text-base font-medium text-[rgb(var(--ink))] transition hover:bg-[rgb(var(--ink)/0.05)] active:bg-[rgb(var(--ink)/0.08)]";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type MoreLink = { href: string; label: string };

function NavMoreMenu({ label, links }: { label: string; links: MoreLink[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        className={`${navLinkClass} inline-flex items-center gap-1 font-medium`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <span className="text-[0.65em] opacity-80" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-full z-[200] mt-1 min-w-[min(100vw-2rem,16rem)] max-h-[min(70vh,24rem)] overflow-y-auto rounded-xl border border-white/[0.12] bg-[rgb(var(--surface-elevated))]/[0.98] py-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              className="block px-3 py-2 text-sm text-[rgb(var(--ink))] transition hover:bg-white/[0.08]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function GlobalNav() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<AppLocale>(DEFAULT_LOCALE);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(LOCALE_KEY);
    const fromCookie = readLocaleCookieClient();
    let resolved: AppLocale = DEFAULT_LOCALE;
    if (raw !== null && isAppLocale(raw)) {
      resolved = raw;
    } else if (fromCookie !== null) {
      resolved = fromCookie;
    }
    setLocale(resolved);
    if (raw === null || !isAppLocale(raw)) {
      localStorage.setItem(LOCALE_KEY, resolved);
    }
    document.documentElement.lang = resolved;
    document.documentElement.setAttribute(
      "dir",
      isRtlLocale(resolved) ? "rtl" : "ltr"
    );
  }, []);

  /** Skip first run so DEFAULT_LOCALE does not overwrite a saved cookie before hydrate. */
  const skipLocalePersist = useRef(true);
  useEffect(() => {
    if (skipLocalePersist.current) {
      skipLocalePersist.current = false;
      return;
    }
    syncLocaleCookieClient(locale);
    document.documentElement.lang = locale;
    document.documentElement.setAttribute(
      "dir",
      isRtlLocale(locale) ? "rtl" : "ltr"
    );
  }, [locale]);

  useEffect(() => {
    function syncFromApp() {
      const raw = localStorage.getItem(LOCALE_KEY);
      if (raw && isAppLocale(raw)) setLocale(raw);
    }
    window.addEventListener(LOCALE_CHANGE_EVENT, syncFromApp);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, syncFromApp);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const ec = getExpertsCopy(locale);
  const pr = getPricingCopy(locale);
  const mz = getMonetizeCopy(locale);
  const cq = getCommunityCopy(locale);
  const t = getUi(locale);
  const sx = getSiteExtras(locale);
  const pa = getPostAnalysisCopy(locale);
  const nx = getNoveltyCopy(locale);

  const moreLinks: MoreLink[] = [
    { href: "/monetize", label: mz.navLabel },
    { href: "/journal", label: sx.navJournal },
    { href: "/field-notes", label: nx.navFieldNotes },
    { href: "/checklists", label: sx.navChecklists },
    { href: "/how-we-use-ai", label: sx.navHowAi },
    { href: "/playbooks", label: pa.playbooksCta },
    { href: "/community/guidelines", label: pa.guidelinesCta },
    { href: "/faq", label: t.navFaq },
    { href: "/about", label: t.navAbout },
  ];

  const primaryLinks: MoreLink[] = [
    { href: "/analyze?package=1", label: ec.navHome },
    { href: "/experts", label: ec.navExperts },
    { href: "/community", label: cq.navLabel },
    { href: "/pricing", label: pr.navPricing },
    { href: "/blog", label: t.navBlog },
  ];

  const mobileMenuPortal =
    mounted && mobileOpen
      ? createPortal(
          <div
            id="global-mobile-nav"
            className="fixed inset-0 z-[300] flex flex-col bg-[rgb(var(--surface))]"
            role="dialog"
            aria-modal="true"
            aria-label={t.navMobileMenuTitle}
            style={{
              paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.1] bg-[rgb(var(--surface))] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
              <span className="font-display text-lg font-bold text-[rgb(var(--ink))]">
                {t.navMobileMenuTitle}
              </span>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.06] text-[rgb(var(--ink))]"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav
              className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain bg-[rgb(var(--surface))] px-4 pb-8"
              aria-label="Main"
            >
              <div className="mt-3 rounded-2xl border border-white/[0.1] bg-black/25 p-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--ink-soft))]">
                  {t.langLabel}
                </p>
                <LocaleSelect
                  value={locale}
                  aria-label={t.langLabel}
                  className="mt-2"
                  triggerClassName="min-h-[48px] rounded-xl border-white/[0.14] bg-black/40 px-3 text-base"
                  onChange={(v) => {
                    if (!isAppLocale(v)) return;
                    setLocale(v);
                    applyClientLocaleChange(v);
                  }}
                />
              </div>

              <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--ink-soft))]">
                Pages
              </p>
              <div className="mt-2 flex flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-black/15">
                {[...primaryLinks, ...moreLinks].map((l) => (
                  <Link
                    key={`${l.href}-${l.label}`}
                    href={l.href}
                    className={`${mobileNavLinkClass} border-b border-white/[0.06] last:border-b-0${isNavActive(pathname, l.href) ? " nav-link-active" : ""}`}
                    aria-current={isNavActive(pathname, l.href) ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/experts/register"
                className="mt-6 flex min-h-[52px] items-center justify-center rounded-2xl border border-[rgb(var(--accent))]/45 bg-[rgb(var(--accent))]/16 px-4 text-base font-semibold text-[rgb(var(--ink))]"
                onClick={() => setMobileOpen(false)}
              >
                {ec.navRegister}
              </Link>
            </nav>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <header className="print:hidden relative sticky top-0 z-[60] isolate border-b border-[rgb(var(--ink)/0.08)] bg-[rgb(var(--surface))]/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl shadow-[0_8px_28px_-20px_rgba(28,30,36,0.2)]">
      <div
        className="site-header-edge site-header-edge--motion pointer-events-none absolute inset-x-0 bottom-0 z-10"
        aria-hidden
      />
      <NavRoutePrefetch />
      <div className="mx-auto grid min-w-0 max-w-6xl w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <Link
          href="/"
          title={t.brand}
          className="font-display relative z-0 flex min-w-0 max-w-full overflow-hidden items-center gap-2 text-[0.95rem] font-extrabold leading-tight tracking-tight text-[rgb(var(--ink))] transition hover:text-[rgb(var(--accent-2))] sm:text-lg md:text-xl"
          onClick={() => setMobileOpen(false)}
        >
          <span
            className="site-brand-mark hidden size-9 shrink-0 rounded-xl bg-[rgb(var(--accent))] shadow-[0_10px_24px_-12px_rgb(var(--accent)/0.55)] sm:inline-block"
            aria-hidden
          />
          <span className="min-w-0 truncate">{t.brand}</span>
        </Link>

        <div className="relative z-10 flex min-w-0 items-center justify-end gap-1 ps-1 md:gap-2 md:ps-2">
          {/* Desktop / tablet nav — grid so primary links always get a real minmax(0,1fr) lane */}
          <nav
            className="hidden min-w-0 gap-1 text-[0.9rem] font-medium md:flex-1 md:grid md:w-full md:min-w-0 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-center md:text-[0.9rem] lg:text-base"
            aria-label="Main"
          >
            <div className="flex min-w-0 flex-nowrap items-center justify-end gap-0.5 overflow-x-auto overscroll-x-contain scrollbar-none md:justify-end">
              {primaryLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${navLinkClass}${isNavActive(pathname, l.href) ? " nav-link-active font-semibold" : ""}`}
                  aria-current={isNavActive(pathname, l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex shrink-0 justify-end">
              <NavMoreMenu label={t.navMore} links={moreLinks} />
            </div>
            <div className="flex min-w-0 shrink-0 items-center justify-end ps-0.5">
              <LocaleSelect
                value={locale}
                aria-label={t.langLabel}
                className="max-w-[11rem]"
                triggerClassName="max-w-[11rem]"
                onChange={(v) => {
                  if (!isAppLocale(v)) return;
                  setLocale(v);
                  applyClientLocaleChange(v);
                }}
              />
            </div>
            <div className="flex shrink-0 justify-end">
              <Link
                href="/experts/register"
                className="btn-extrude-3d shrink-0 rounded-xl border border-[rgb(var(--accent))]/45 bg-[rgb(var(--accent))]/16 px-3 py-2 text-sm font-semibold text-[rgb(var(--ink))] shadow-[0_0_28px_-12px_rgb(var(--accent)/0.5)] transition-colors hover:border-[rgb(var(--accent))]/65 hover:bg-[rgb(var(--accent))]/22 lg:px-4"
              >
                {ec.navRegister}
              </Link>
            </div>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--ink)/0.12)] bg-white text-[rgb(var(--ink))] transition hover:bg-[rgb(var(--ink)/0.04)] md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="global-mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
    {mobileMenuPortal}
    </>
  );
}
