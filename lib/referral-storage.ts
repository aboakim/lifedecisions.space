"use client";

import {
  REFERRAL_FREE_HITS,
  REFERRAL_PREMIUM_HITS,
  type ReferralStatusPayload,
} from "@/lib/referral-shared";

const CODE_KEY = "lde-referral-code";
const FREE_KEY = "lde-referral-free-unlocked";
const PREMIUM_KEY = "lde-referral-premium-unlocked";

export function getStoredReferralCode(): string | null {
  try {
    const v = localStorage.getItem(CODE_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

export function setStoredReferralCode(code: string): void {
  try {
    localStorage.setItem(CODE_KEY, code);
  } catch {
    /* ignore */
  }
}

export function getLocalFreeUnlocked(): boolean {
  try {
    return localStorage.getItem(FREE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Free package — unlock on this device with no share requirement. */
export function grantLocalFreeUnlocked(): void {
  try {
    localStorage.setItem(FREE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function getLocalPremiumUnlocked(): boolean {
  try {
    return localStorage.getItem(PREMIUM_KEY) === "1";
  } catch {
    return false;
  }
}

export function persistReferralStatus(status: ReferralStatusPayload): void {
  setStoredReferralCode(status.code);
  try {
    if (status.freeUnlocked) localStorage.setItem(FREE_KEY, "1");
    if (status.premiumUnlocked) localStorage.setItem(PREMIUM_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function buildReferralShareUrl(code: string, origin?: string): string {
  const base =
    (origin ??
      (typeof window !== "undefined" ? window.location.origin : "")) ||
    "https://example.com";
  const url = new URL("/analyze", base);
  url.searchParams.set("ref", code);
  return url.toString();
}

export async function ensureReferralCode(): Promise<ReferralStatusPayload | null> {
  const existing = getStoredReferralCode();
  try {
    const res = await fetch("/api/referral/ensure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: existing ?? undefined }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ReferralStatusPayload;
    persistReferralStatus(data);
    return data;
  } catch {
    return null;
  }
}

export async function fetchReferralStatus(
  code?: string | null,
): Promise<ReferralStatusPayload | null> {
  const c = code ?? getStoredReferralCode();
  if (!c) return ensureReferralCode();
  try {
    const res = await fetch(
      `/api/referral/status?code=${encodeURIComponent(c)}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ReferralStatusPayload;
    persistReferralStatus(data);
    return data;
  } catch {
    return null;
  }
}

export function isAnalyzeEntitledLocally(): boolean {
  return getLocalFreeUnlocked() || getLocalPremiumUnlocked();
}

export { REFERRAL_FREE_HITS, REFERRAL_PREMIUM_HITS };
