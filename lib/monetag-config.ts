/**
 * Monetag — all active zone formats.
 * Zone IDs override via env; set a zone to empty string to disable that format only.
 * Master kill switch: NEXT_PUBLIC_MONETAG_ENABLED=0
 */

export const MONETAG_CONSENT_STORAGE_KEY = "lde.consent.v1";
export const MONETAG_CONSENT_EVENT = "lde-consent-change";

/** In-Page Push (nap5k.com/tag.min.js) */
export function monetagInPageZone(): string {
  const v = process.env.NEXT_PUBLIC_MONETAG_INPAGE_ZONE;
  if (v !== undefined) return v.trim();
  return "11546283";
}

/** Vignette banner (n6wxm.com/vignette.min.js) */
export function monetagVignetteZone(): string {
  const v = process.env.NEXT_PUBLIC_MONETAG_VIGNETTE_ZONE;
  if (v !== undefined) return v.trim();
  return "11546678";
}

/** MultiTag (quge5) — can include Onclick + Classic Push when enabled in dashboard */
export function monetagMultitagZone(): string {
  const v = process.env.NEXT_PUBLIC_MONETAG_MULTITAG_ZONE;
  if (v !== undefined) return v.trim();
  return "268879";
}

/**
 * Classic Push — must match `public/sw.js` zoneId for HTTPS push.
 * Page tag host defaults to 5gvci.com (same as sw.js).
 */
export function monetagClassicPushZone(): string {
  const v = process.env.NEXT_PUBLIC_MONETAG_PUSH_ZONE;
  if (v !== undefined) return v.trim();
  return "11474462";
}

export function monetagClassicPushScriptSrc(): string {
  return (
    process.env.NEXT_PUBLIC_MONETAG_PUSH_SCRIPT?.trim() ||
    "https://5gvci.com/act/files/js/sdk.js"
  );
}

/**
 * Onclick (Popunder) classic tag.
 * Prefer the exact script URL from Monetag → Get tag.
 */
export function monetagOnclickPopunderZone(): string {
  const v = process.env.NEXT_PUBLIC_MONETAG_ONCLICK_POPUNDER_ZONE;
  if (v !== undefined) return v.trim();
  return "11547423";
}

export function monetagOnclickPopunderScriptSrc(): string {
  return (
    process.env.NEXT_PUBLIC_MONETAG_ONCLICK_POPUNDER_SCRIPT?.trim() ||
    "https://quge5.com/88/tag.min.js"
  );
}

/**
 * Extra Monetag tag zones (nap5k.com/tag.min.js).
 * Comma-separated override: NEXT_PUBLIC_MONETAG_EXTRA_ZONES=...
 */
const DEFAULT_EXTRA_ZONES = [
  "11547425",
  "11547422",
  "11547424",
] as const;

export function monetagExtraZones(): string[] {
  const raw = process.env.NEXT_PUBLIC_MONETAG_EXTRA_ZONES;
  if (raw !== undefined) {
    return raw
      .split(",")
      .map((z) => z.trim())
      .filter(Boolean);
  }
  return [...DEFAULT_EXTRA_ZONES];
}

/** Master switch — Monetag removed from the product (always off). */
export function monetagEnabled(): boolean {
  return false;
}

/** Sensitive surfaces only — Monetag runs on all other public pages (incl. /analyze). */
const BLOCK_PREFIXES = ["/admin", "/experts/register", "/api"] as const;

export function isMonetagPathAllowed(pathname: string): boolean {
  const path = pathname.split("?")[0] || "/";
  for (const blocked of BLOCK_PREFIXES) {
    if (path === blocked || path.startsWith(`${blocked}/`)) return false;
  }
  return true;
}
