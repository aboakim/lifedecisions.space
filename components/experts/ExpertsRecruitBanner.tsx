"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SocialShareModal from "@/components/sharing/SocialShareModal";
import { getExpertsRecruitCopy } from "@/lib/i18n/experts-recruit";
import type { AppLocale } from "@/lib/i18n/locale";
import { getPricingCopy } from "@/lib/i18n/pricing-page";
import { getSiteUrlString } from "@/lib/site-url";

type Props = {
  locale: AppLocale;
  /** hero = default; compact = inline; spotlight = home “What this does” attention magnet */
  variant?: "hero" | "compact" | "spotlight";
  className?: string;
};

export default function ExpertsRecruitBanner({
  locale,
  variant = "hero",
  className = "",
}: Props) {
  const t = getExpertsRecruitCopy(locale);
  const pricing = useMemo(() => getPricingCopy(locale), [locale]);
  const [shareOpen, setShareOpen] = useState(false);
  const [registerUrl, setRegisterUrl] = useState(
    () => `${getSiteUrlString().replace(/\/$/, "")}/experts/register`,
  );

  useEffect(() => {
    setRegisterUrl(`${window.location.origin}/experts/register`);
  }, []);

  const shareControls = (
    <>
      <Link
        href="/experts/register"
        className={
          variant === "compact"
            ? "inline-flex rounded-xl bg-gradient-to-r from-rose-400 via-[rgb(var(--accent))] to-[rgb(var(--accent-magenta))] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
            : "inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-rose-400 via-[rgb(var(--accent))] to-[rgb(var(--accent-magenta))] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_40px_-14px_rgb(244_122_148/0.7)] ring-1 ring-white/30 transition hover:brightness-110 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.98]"
        }
      >
        {t.ctaRegister}
      </Link>
      <button
        type="button"
        onClick={() => setShareOpen(true)}
        className={
          variant === "compact"
            ? "inline-flex rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-[rgb(var(--ink))] transition hover:bg-white/[0.1]"
            : "inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-rose-200/30 bg-black/35 px-5 py-2.5 text-sm font-semibold text-[rgb(var(--ink))] backdrop-blur transition hover:border-rose-200/50 hover:bg-white/[0.1]"
        }
      >
        {t.ctaShare}
      </button>
    </>
  );

  const shareModal = (
    <SocialShareModal
      t={pricing}
      open={shareOpen}
      onClose={() => setShareOpen(false)}
      elevated
      shareUrl={registerUrl}
      shareBlurb={t.shareBlurb}
      shareIntro={
        locale === "hy"
          ? "Կիսվիր գրանցման հղումով՝ WhatsApp, Viber, Telegram, Facebook, Instagram և այլ հարթակներով։"
          : "Share the registration link on WhatsApp, Viber, Telegram, Facebook, Instagram, and more."
      }
    />
  );

  if (variant === "compact") {
    return (
      <>
        <aside
          className={`relative overflow-hidden rounded-2xl border border-rose-300/30 bg-gradient-to-br from-rose-400/[0.16] via-[rgb(var(--accent))]/[0.1] to-transparent p-4 sm:p-5 ${className}`.trim()}
          aria-label={t.eyebrow}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-100/90">
            {t.eyebrow}
          </p>
          <p className="mt-1.5 text-sm font-semibold leading-snug text-[rgb(var(--ink))] [text-wrap:pretty]">
            {t.title}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty]">
            {t.body}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">{shareControls}</div>
        </aside>
        {shareModal}
      </>
    );
  }

  const spotlight = variant === "spotlight";

  return (
    <>
      <aside
        className={`experts-recruit-shimmer relative mx-auto max-w-6xl overflow-hidden rounded-[1.85rem] border border-rose-300/45 bg-gradient-to-br from-rose-400/[0.22] via-[rgb(var(--accent))]/[0.16] to-[rgb(var(--accent-magenta))]/[0.14] px-5 py-7 ring-1 ring-inset ring-white/[0.1] sm:px-8 sm:py-9 ${
          spotlight
            ? "experts-recruit-spotlight shadow-[0_32px_90px_-36px_rgb(244_122_148/0.65)]"
            : "shadow-[0_28px_80px_-48px_rgb(244_122_148/0.45)]"
        } ${className}`.trim()}
        aria-label={t.eyebrow}
      >
        <div
          className="pointer-events-none absolute -end-16 -top-20 size-56 rounded-full bg-rose-400/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -start-10 bottom-0 size-40 rounded-full bg-[rgb(var(--accent-magenta))]/25 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-100/95">
                {t.eyebrow}
              </p>
              {spotlight ? (
                <span className="experts-recruit-live-badge inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-100">
                  <span
                    className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgb(110_231_183)]"
                    aria-hidden
                  />
                  Live
                </span>
              ) : null}
            </div>
            <h2
              className={`mt-2 font-display font-extrabold tracking-tight text-[rgb(var(--ink))] [text-wrap:balance] ${
                spotlight
                  ? "text-[clamp(1.55rem,1.1rem+2vw,2.35rem)]"
                  : "text-2xl sm:text-3xl"
              }`}
            >
              {t.title}
            </h2>
            <p
              className={`mt-3 leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty] ${
                spotlight ? "text-[0.95rem] sm:text-base" : "text-sm sm:text-[0.9375rem]"
              }`}
            >
              {t.body}
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:max-w-xs">
            {shareControls}
          </div>
        </div>
      </aside>
      {shareModal}
    </>
  );
}
