"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PricingCopy } from "@/lib/i18n/pricing-page";
import { getSiteUrlString } from "@/lib/site-url";

type Props = {
  t: PricingCopy;
  open: boolean;
  onClose: () => void;
  /** Backdrop + panel sit above other modals (e.g. package picker at z-[95]). */
  elevated?: boolean;
  /** Personal referral URL; defaults to site root. */
  shareUrl?: string;
  /** Overrides default pricing share blurb (e.g. expert recruit copy). */
  shareBlurb?: string;
  /** Optional dialog intro override. */
  shareIntro?: string;
};

/** Opens the network’s share UI in a centered popup so the user stays on our site. */
function openShareComposer(url: string) {
  if (typeof window === "undefined") return;
  const w = Math.min(640, window.screen.width - 48);
  const h = Math.min(720, window.screen.height - 96);
  const sx = window.screenX ?? window.screenLeft ?? 0;
  const sy = window.screenY ?? window.screenTop ?? 0;
  const sw = window.outerWidth ?? document.documentElement.clientWidth ?? 1024;
  const sh = window.outerHeight ?? document.documentElement.clientHeight ?? 768;
  const left = Math.max(0, sx + (sw - w) / 2);
  const top = Math.max(0, sy + (sh - h) / 2);
  const feat = `popup=yes,noopener,noreferrer,width=${Math.floor(w)},height=${Math.floor(h)},left=${Math.floor(left)},top=${Math.floor(top)},scrollbars=yes,resizable=yes`;
  const win = window.open(url, "lde_share", feat);
  if (!win || win.closed) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    win.focus();
  }
}

function IconBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

function IconFacebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

function IconTelegram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      />
    </svg>
  );
}

function IconReddit() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-2.597-.805-.805-.805.805-2.597 2.597a1.25 1.25 0 0 1-1.496.092 1.25 1.25 0 0 1-.554-1.042 1.25 1.25 0 0 1 .302-.832l3.402-3.402a1.25 1.25 0 0 1 1.768 0l3.402 3.402c.24.24.373.562.373.9zm-5.01 4.256c-2.21 0-4.18.93-5.58 2.41-.18.19-.28.45-.28.71 0 .26.1.52.28.71.19.18.45.28.71.28.26 0 .52-.1.71-.28 1.09-1.15 2.62-1.87 4.18-1.87 1.56 0 3.09.72 4.18 1.87.19.18.45.28.71.28.26 0 .52-.1.71-.28.18-.19.28-.45.28-.71 0-.26-.1-.52-.28-.71-1.4-1.48-3.37-2.41-5.58-2.41zm-2.5 4.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm5 0c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"
      />
    </svg>
  );
}

/** Official-style Instagram glyph (white on brand gradient). */
function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  );
}

function IconThreads() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.659 1.546 12.001c.046-3.658.896-6.439 2.495-8.49C5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C22.15 5.562 23 8.343 22.954 12.001c-.046 3.658-.896 6.439-2.495 8.49C18.655 22.795 15.902 23.976 12.321 24h-.135zm.014-21.75c-2.94.02-5.109.944-6.445 2.744C4.39 6.842 3.75 9.151 3.705 12c.045 2.85.685 5.158 2.05 7.006 1.336 1.8 3.505 2.724 6.445 2.744h.014c2.94-.02 5.109-.944 6.445-2.744 1.365-1.848 2.005-4.156 2.05-7.006-.045-2.849-.685-5.158-2.05-7.006C17.323 3.194 15.154 2.27 12.214 2.25h-.014z"
      />
    </svg>
  );
}

function IconViber() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11.4 0C9.48.03 5.34.34 3.02 2.47 1.39 3.93.57 5.89.49 8.55c-.05 1.86.11 6.36.11 6.36s-.14 1.53.1 2.39c.24.85 1.42 2.63 3.22 3.48 1.8.85 3.67.53 3.67.53l.01 2.14s.02.66.34.8c.38.16.63-.04 1.68-.7 1.63-1.02 2.74-1.74 3.57-2.26 3.11.27 5.48-.34 6.48-.67 1.52-.5 3.38-2.12 3.68-5.21.04-.41.36-6.59.4-8.2C23.08 2.4 19.9.17 11.4 0zm.33 3.66c6.03.02 7.57 1.5 7.66 7.8-.02 1.03-.07 4.74-.1 5.3-.16 1.7-.98 2.58-1.88 2.88-.86.28-2.82.75-5.3.49l-.7-.06-1.09.69c-.5.32-1.2.76-1.83 1.16v-1.8l-.3-.1s-1.45.28-2.64-.28c-.98-.46-1.76-1.54-1.92-2.18-.16-.55-.07-1.72-.07-1.72s-.14-3.97-.1-5.42c.1-3.57 1.6-6.72 8.27-6.76z"
      />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
      />
    </svg>
  );
}

function IconSms() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
      />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
      />
    </svg>
  );
}

function IconSystemShare() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
      />
    </svg>
  );
}

export default function SocialShareModal({
  t,
  open,
  onClose,
  elevated = false,
  shareUrl,
  shareBlurb,
  shareIntro,
}: Props) {
  const [siteUrl, setSiteUrl] = useState(getSiteUrlString);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const zBackdrop = elevated ? "z-[100]" : "z-[95]";
  const zPanel = elevated ? "z-[101]" : "z-[96]";
  const blurb = shareBlurb?.trim() || t.premiumShareBlurb;
  const intro = shareIntro?.trim() || t.premiumShareIntro;

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" &&
        typeof navigator.share === "function",
    );
    if (shareUrl) {
      setSiteUrl(shareUrl);
      return;
    }
    if (process.env.NODE_ENV === "development") {
      setSiteUrl(window.location.origin);
    } else {
      setSiteUrl(getSiteUrlString());
    }
  }, [shareUrl]);

  const fullText = useMemo(
    () => `${blurb} ${siteUrl}`.trim(),
    [siteUrl, blurb],
  );

  const urls = useMemo(() => {
    const u = encodeURIComponent(siteUrl);
    const title = encodeURIComponent(blurb);
    const body = encodeURIComponent(fullText);
    const subject = encodeURIComponent(t.shareEmailSubject);
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      x: `https://twitter.com/intent/tweet?text=${body}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      whatsapp: `https://api.whatsapp.com/send?text=${body}`,
      telegram: `https://t.me/share/url?url=${u}&text=${title}`,
      reddit: `https://www.reddit.com/submit?url=${u}&title=${title}`,
      threads: `https://www.threads.net/intent/post?text=${body}`,
      viber: `viber://forward?text=${body}`,
      email: `mailto:?subject=${subject}&body=${body}`,
      sms: `sms:?&body=${body}`,
    };
  }, [blurb, fullText, siteUrl, t.shareEmailSubject]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [siteUrl]);

  const onNative = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: t.shareEmailSubject,
        text: blurb,
        url: siteUrl,
      });
    } catch {
      /* absent or user cancelled */
    }
  }, [blurb, siteUrl, t.shareEmailSubject]);

  const onInstagram = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      openShareComposer("https://www.instagram.com/");
    } catch {
      /* ignore */
    }
  }, [fullText]);

  const onViber = useCallback(async () => {
    try {
      window.location.href = urls.viber;
    } catch {
      /* fall through */
    }
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [fullText, urls.viber]);

  const rowClass =
    "inline-flex w-full items-center gap-3 rounded-xl border border-[rgb(var(--ink)/0.1)] bg-[rgb(var(--surface))] px-3 py-2.5 text-sm font-medium text-[rgb(var(--ink))] transition hover:border-[rgb(var(--ink)/0.18)] hover:bg-white";

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zBackdrop} flex items-center justify-center p-4`}
      id="premium-share-panel"
      role="dialog"
      aria-modal="true"
      aria-label={t.ctaShare}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close share options"
        className="absolute inset-0 bg-[rgb(28_30_36/0.45)] backdrop-blur-[2px]"
      />
      <div
        className={`relative ${zPanel} flex max-h-[min(88vh,40rem)] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-[rgb(var(--ink)/0.1)] bg-white p-4 shadow-[0_28px_80px_-28px_rgba(28,30,36,0.45)]`}
      >
        <div className="mb-3 flex shrink-0 items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug text-[rgb(var(--ink))] [text-wrap:pretty]">
            {intro}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-white/15 px-2 py-1 text-xs text-[rgb(var(--ink-soft))] hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 space-y-2 overflow-y-auto overscroll-contain pe-0.5">
          {canNativeShare ? (
            <button type="button" onClick={onNative} className={rowClass}>
              <IconBox className="bg-slate-600 text-white">
                <IconSystemShare />
              </IconBox>
              <span className="flex-1 text-start">{t.shareNative}</span>
              <span aria-hidden className="text-[rgb(var(--ink-soft))]">
                →
              </span>
            </button>
          ) : null}
          <button
            type="button"
            className={rowClass}
            onClick={() => openShareComposer(urls.whatsapp)}
          >
            <IconBox className="bg-[#25D366] text-white">
              <IconWhatsApp />
            </IconBox>
            <span className="flex-1 text-start">{t.shareWhatsApp}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button
            type="button"
            className={rowClass}
            onClick={() => openShareComposer(urls.telegram)}
          >
            <IconBox className="bg-[#26A5E4] text-white">
              <IconTelegram />
            </IconBox>
            <span className="flex-1 text-start">{t.shareTelegram}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button type="button" onClick={onViber} className={rowClass}>
            <IconBox className="bg-[#7360F2] text-white">
              <IconViber />
            </IconBox>
            <span className="flex-1 text-start">{t.shareViber}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button
            type="button"
            className={rowClass}
            onClick={() => openShareComposer(urls.facebook)}
          >
            <IconBox className="bg-[#1877F2] text-white">
              <IconFacebook />
            </IconBox>
            <span className="flex-1 text-start">{t.shareFacebook}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button type="button" onClick={onInstagram} className={rowClass}>
            <IconBox className="bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
              <IconInstagram />
            </IconBox>
            <span className="flex-1 text-start">{t.shareInstagram}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button
            type="button"
            className={rowClass}
            onClick={() => openShareComposer(urls.threads)}
          >
            <IconBox className="bg-black text-white">
              <IconThreads />
            </IconBox>
            <span className="flex-1 text-start">{t.shareThreads}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button
            type="button"
            className={rowClass}
            onClick={() => openShareComposer(urls.x)}
          >
            <IconBox className="bg-black text-white">
              <IconX />
            </IconBox>
            <span className="flex-1 text-start">{t.shareX}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button
            type="button"
            className={rowClass}
            onClick={() => openShareComposer(urls.linkedin)}
          >
            <IconBox className="bg-[#0A66C2] text-white">
              <IconLinkedIn />
            </IconBox>
            <span className="flex-1 text-start">{t.shareLinkedIn}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <button
            type="button"
            className={rowClass}
            onClick={() => openShareComposer(urls.reddit)}
          >
            <IconBox className="bg-[#FF4500] text-white">
              <IconReddit />
            </IconBox>
            <span className="flex-1 text-start">{t.shareReddit}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </button>
          <a href={urls.email} className={rowClass}>
            <IconBox className="bg-[#EA4335] text-white">
              <IconEmail />
            </IconBox>
            <span className="flex-1 text-start">{t.shareEmail}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </a>
          <a href={urls.sms} className={rowClass}>
            <IconBox className="bg-emerald-600 text-white">
              <IconSms />
            </IconBox>
            <span className="flex-1 text-start">{t.shareSms}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              ↗
            </span>
          </a>
          <button type="button" onClick={onCopy} className={rowClass}>
            <IconBox className="bg-gradient-to-br from-violet-500 to-teal-500 text-white">
              <IconLink />
            </IconBox>
            <span className="flex-1 text-start">{t.copySiteLink}</span>
            <span aria-hidden className="text-[rgb(var(--ink-soft))]">
              →
            </span>
          </button>
        </div>
        {copied ? (
          <p className="mt-3 shrink-0 text-xs text-emerald-300/95" role="status">
            {t.siteLinkCopied}
          </p>
        ) : null}
      </div>
    </div>
  );
}
