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
            ? "inline-flex rounded-xl bg-[rgb(var(--accent))] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-110"
            : "inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[rgb(var(--accent))] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_32px_-16px_rgb(var(--accent)/0.55)] transition hover:brightness-110 motion-safe:active:scale-[0.98]"
        }
      >
        {t.ctaRegister}
      </Link>
      <button
        type="button"
        onClick={() => setShareOpen(true)}
        className={
          variant === "compact"
            ? "inline-flex rounded-xl border border-[rgb(var(--ink)/0.12)] bg-white px-4 py-2.5 text-xs font-semibold text-[rgb(var(--ink))] transition hover:bg-[rgb(var(--ink)/0.04)]"
            : "inline-flex min-h-[48px] items-center justify-center rounded-xl border border-[rgb(var(--ink)/0.12)] bg-white px-5 py-2.5 text-sm font-semibold text-[rgb(var(--ink))] transition hover:bg-[rgb(var(--ink)/0.04)]"
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
          className={`relative overflow-hidden rounded-2xl border border-[rgb(var(--ink)/0.1)] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(28,30,36,0.18)] sm:p-5 ${className}`.trim()}
          aria-label={t.eyebrow}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
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
        className={`experts-recruit-shimmer relative mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-[rgb(var(--ink)/0.1)] bg-white px-5 py-7 shadow-[0_24px_60px_-36px_rgba(28,30,36,0.2)] sm:px-8 sm:py-9 ${
          spotlight ? "experts-recruit-spotlight" : ""
        } ${className}`.trim()}
        aria-label={t.eyebrow}
      >
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
                {t.eyebrow}
              </p>
              {spotlight ? (
                <span className="experts-recruit-live-badge inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--accent)/0.25)] bg-[rgb(var(--accent)/0.08)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[rgb(var(--accent))]">
                  <span
                    className="size-1.5 rounded-full bg-[rgb(var(--accent))]"
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
