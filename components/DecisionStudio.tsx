"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HeroVisualSlider from "@/components/home/HeroVisualSlider";
import RevealOnScroll from "@/components/home/RevealOnScroll";
import AdSenseBanner from "@/components/ads/AdSenseBanner";
import AmazonAssociatesCta from "@/components/monetization/AmazonAssociatesCta";
import ExpertsRecruitBanner from "@/components/experts/ExpertsRecruitBanner";
import TiltPlane from "@/components/ui/TiltPlane";
import { getExpertsCopy } from "@/lib/i18n/experts-network";
import { getPricingCopy } from "@/lib/i18n/pricing-page";
import type { DecisionAnalysis, MatchedExpertSummary } from "@/lib/types";
import { roleLabel, type ExpertRoleKey } from "@/lib/i18n/experts-network";
import LocaleFlag from "@/components/LocaleFlag";
import {
  LOCALE_OPTIONS,
  type AppLocale,
  isAppLocale,
  isRtlLocale,
} from "@/lib/i18n/locale";
import { getUi } from "@/lib/i18n/ui";
import { DEFAULT_LOCALE } from "@/lib/locale-default";
import {
  readLocaleCookieClient,
  syncLocaleCookieClient,
} from "@/lib/locale-cookie";
import {
  HERO_SLIDE_IMAGE_URLS,
  PRODUCT_STRIP_IMAGE_URLS,
} from "@/lib/home/hero-slide-images";
import { getDecisionBriefCopy } from "@/lib/i18n/decision-brief";
import {
  LOCALE_CHANGE_EVENT,
  dispatchLocaleChanged,
} from "@/lib/locale-sync";
import {
  type InitialPreset,
  parsePresetQuery,
} from "@/lib/home/initial-preset";
import { getHomeThematicBands } from "@/lib/i18n/home-thematic-bands";
import {
  getDelightCopy,
  milestoneMessage,
} from "@/lib/i18n/delight-extras";
import { getSiteExtras, getWarmPresets } from "@/lib/i18n/site-extras";
import { getNoveltyCopy } from "@/lib/i18n/novelty-extras";
import {
  THEMATIC_BAND_A_IMAGE,
  THEMATIC_BAND_B_IMAGE,
} from "@/lib/home/thematic-banners";
import { getPostAnalysisCopy } from "@/lib/i18n/post-analysis";
import { getSolveSectionCopy } from "@/lib/i18n/home-solve-section";
import {
  getAtAGlanceShortLines,
  getHowShortLines,
  getTrustShortLines,
} from "@/lib/i18n/home-visual-captions";
import { getVisualStoryImage } from "@/lib/home/visual-story-images";
import {
  pushHistory,
  isReminderDue,
  clearReminder,
} from "@/lib/analysis-local";
import { getStoredSubscriberId } from "@/lib/reminder-subscriber-storage";
import { safeDecisionAnalysis } from "@/lib/safe-decision-analysis";
import { buildAnalysisSpeechText } from "@/lib/tts-build-report-text";
import { buildDemoAnalysis } from "@/lib/demo-analysis";
import { fillDecisionAnalysisGaps } from "@/lib/analysis-gap-fill";
import VoiceDictateButton from "@/components/home/VoiceDictateButton";
import VoiceWhisperButton from "@/components/home/VoiceWhisperButton";
import ReadAloudReportButton from "@/components/home/ReadAloudReportButton";
import AnalyzePackageModal from "@/components/home/AnalyzePackageModal";
import ShareToUnlockModal from "@/components/home/ShareToUnlockModal";
import {
  getStoredReferralCode,
  grantLocalFreeUnlocked,
} from "@/lib/referral-storage";
import { PACKAGE_GATE_EVENT } from "@/lib/referral-shared";

const KonamiSurprise = dynamic(
  () => import("@/components/home/KonamiSurprise"),
  { ssr: false, loading: () => null },
);
const ShortcutsHelpModal = dynamic(
  () => import("@/components/home/ShortcutsHelpModal"),
  { ssr: false, loading: () => null },
);

const WelcomeModal = dynamic(() => import("@/components/home/WelcomeModal"), {
  ssr: false,
  loading: () => null,
});
const PreAnalysisEmailModal = dynamic(
  () => import("@/components/home/PreAnalysisEmailModal"),
  { ssr: false, loading: () => null },
);
const WhatItFixesSection = dynamic(
  () => import("@/components/home/WhatItFixesSection"),
);
const ThematicImageBand = dynamic(
  () => import("@/components/home/ThematicImageBand"),
);
const ProductSceneStrip = dynamic(
  () => import("@/components/home/ProductSceneStrip"),
);
const VisualStoryCard = dynamic(
  () => import("@/components/home/VisualStoryCard"),
);

const HeroMomentStrips = dynamic(
  () => import("@/components/home/HeroMomentStrips"),
  { loading: () => <div className="mt-6 h-28" aria-hidden /> },
);
const OrbDecor = dynamic(() => import("@/components/ui/OrbDecor"), {
  ssr: false,
  loading: () => null,
});
const AmbientDriftLayer = dynamic(
  () => import("@/components/ui/AmbientDriftLayer"),
  { ssr: false, loading: () => null },
);
const LatticeSheen = dynamic(() => import("@/components/ui/LatticeSheen"), {
  ssr: false,
  loading: () => null,
});
const ChromeHorizon = dynamic(() => import("@/components/ui/ChromeHorizon"), {
  ssr: false,
  loading: () => null,
});
const HomeSectionNav = dynamic(
  () => import("@/components/home/HomeSectionNav"),
  { loading: () => null },
);

const DecisionBriefWizard = dynamic(
  () => import("@/components/home/DecisionBriefWizard"),
  {
    loading: () => (
      <div
        className="min-h-[10rem] rounded-2xl border border-white/[0.08] bg-white/[0.03]"
        aria-hidden
      />
    ),
  },
);
const AnalysisResultTools = dynamic(
  () => import("@/components/home/AnalysisResultTools"),
);
const SparkShuffleStrip = dynamic(
  () => import("@/components/home/SparkShuffleStrip"),
);
const PlayCorner = dynamic(() => import("@/components/home/PlayCorner"), {
  ssr: false,
});
const TimeCapsuleCard = dynamic(
  () => import("@/components/home/TimeCapsuleCard"),
);
const BriefSignatureStrip = dynamic(
  () => import("@/components/home/BriefSignatureStrip"),
);

const LOCALE_STORAGE_KEY = "lde-locale";
const VISIT_COUNT_KEY = "lde-home-visits";
const VISITOR_BANNER_DISMISS_KEY = "lde-visitor-path-dismissed";
/** Optional floor so the analyzing strip doesn’t flash sub‑frame (ms). 0 = no artificial wait. */
const ANALYSIS_UI_MIN_MS = 0;

/** Scroll after React commits results: double rAF waits for layout; instant avoids slow smooth scroll. */
function scrollSectionResultsIntoView() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el =
        document.getElementById("results-main-heading") ??
        document.getElementById("section-results");
      el?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    });
  });
}

type ApiResponse = {
  analysis: DecisionAnalysis;
  mode: "live" | "demo" | "fallback";
  hint?: string;
  warning?: string;
  matchedExperts?: MatchedExpertSummary[];
};

const NO_MATCHED_EXPERTS: MatchedExpertSummary[] = [];

const DIRECTORY_ROLE_OPTIONS: ExpertRoleKey[] = [
  "PSYCHOLOGIST",
  "LAWYER",
  "FINANCIAL",
  "PHYSICIAN",
  "COACH",
  "IMMIGRATION",
];

function buildExpertsNeedsHref(
  pick: ExpertRoleKey | "UNSURE",
  decisionText: string,
): string {
  const q = decisionText.trim().slice(0, 200);
  if (pick === "UNSURE") {
    return q ? `/experts?q=${encodeURIComponent(q)}` : "/experts";
  }
  const base = `/experts?role=${encodeURIComponent(pick)}`;
  return q ? `${base}&q=${encodeURIComponent(q)}` : base;
}

function buildClientFallbackResult(
  decision: string,
  context: string,
  constraints: string,
  locale: AppLocale,
  stakesLevel: number,
): ApiResponse {
  const analysis = fillDecisionAnalysisGaps(
    buildDemoAnalysis(decision, locale, {
      context,
      constraints,
      stakesLevel,
    }),
    locale,
  );
  return {
    analysis,
    mode: "fallback",
    matchedExperts: NO_MATCHED_EXPERTS,
  };
}

function previewHref(
  section: "workspace" | "product" | "language"
): string {
  const m = {
    workspace: "section-workspace",
    product: "section-product",
    language: "section-language",
  } as const;
  return `#${m[section]}`;
}

/** Non-empty analysis text, or an explicit localized explanation instead of a blank shell */
function AnalysisBody({
  value,
  emptyLabel,
  className = "",
}: {
  value: string;
  emptyLabel: string;
  className?: string;
}) {
  const trimmed = value.trim();
  const empty = trimmed.length === 0;
  return (
    <p
      className={
        empty
          ? `border-s-2 border-amber-400/35 bg-amber-500/[0.07] px-3 py-2.5 text-sm italic leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty] ${className}`
          : `text-sm leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty] ${className}`
      }
    >
      {empty ? emptyLabel : trimmed}
    </p>
  );
}

function ScoreCircle({
  score,
  sublabel,
}: {
  score: number;
  sublabel: string;
}) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div
      className="relative mx-auto size-44 rounded-full p-[3px] score-ring shadow-[0_0_60px_-12px_rgb(var(--glow))]"
      style={{ "--score": pct } as React.CSSProperties}
    >
      <div className="flex size-full items-center justify-center rounded-full bg-[rgb(var(--surface))]">
        <div className="text-center">
          <div className="text-4xl font-bold tabular-nums text-gradient">
            {pct}%
          </div>
          <div className="mt-1 px-2 text-[11px] leading-snug text-[rgb(var(--ink-soft))]">
            {sublabel}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  initialPreset?: InitialPreset;
  focusLayout?: boolean;
  /** Home: static server hero already painted — skip duplicate carousel. */
  skipHero?: boolean;
};

export default function DecisionStudio({
  initialPreset = null,
  focusLayout = false,
  skipHero = false,
}: Props) {
  const [locale, setLocale] = useState<AppLocale>(DEFAULT_LOCALE);
  const t = getUi(locale);
  const sx = getSiteExtras(locale);
  const warmPresets = useMemo(() => getWarmPresets(locale), [locale]);
  const pa = useMemo(() => getPostAnalysisCopy(locale), [locale]);
  const delight = useMemo(() => getDelightCopy(locale), [locale]);
  const novelty = useMemo(() => getNoveltyCopy(locale), [locale]);
  const presetApplied = useRef(false);
  const exNav = getExpertsCopy(locale);
  const homeBands = useMemo(() => getHomeThematicBands(locale), [locale]);
  const solveCopy = useMemo(() => getSolveSectionCopy(locale), [locale]);
  const atAGlanceShort = useMemo(
    () => getAtAGlanceShortLines(locale),
    [locale],
  );
  const trustShort = useMemo(() => getTrustShortLines(locale), [locale]);
  const howShort = useMemo(() => getHowShortLines(locale), [locale]);
  const pr = getPricingCopy(locale);
  const brief = getDecisionBriefCopy(locale);
  const rtl = isRtlLocale(locale);

  const sectionLinks = useMemo(
    () => [
      { id: "section-overview" as const, label: t.sectionNavOverview },
      { id: "section-what-it-fixes" as const, label: t.sectionNavFixes },
      { id: "section-product" as const, label: t.sectionNavProduct },
      { id: "section-trust" as const, label: t.sectionNavTrust },
      { id: "section-how" as const, label: t.sectionNavHow },
      { id: "section-workspace" as const, label: t.sectionNavAnalyzer },
      { id: "section-language" as const, label: t.sectionNavLanguage },
      { id: "section-privacy" as const, label: t.sectionNavPrivacy },
    ],
    [t]
  );

  useEffect(() => {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    const fromCookie = readLocaleCookieClient();
    let resolved: AppLocale = DEFAULT_LOCALE;
    if (raw !== null && isAppLocale(raw)) {
      resolved = raw;
    } else if (fromCookie !== null) {
      resolved = fromCookie;
    }
    setLocale(resolved);
    if (raw === null || !isAppLocale(raw)) {
      localStorage.setItem(LOCALE_STORAGE_KEY, resolved);
    }
    document.documentElement.lang = resolved;
    document.documentElement.setAttribute(
      "dir",
      isRtlLocale(resolved) ? "rtl" : "ltr"
    );
  }, []);

  useEffect(() => {
    function syncFromNav() {
      const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (raw && isAppLocale(raw)) setLocale(raw);
    }
    window.addEventListener(LOCALE_CHANGE_EVENT, syncFromNav);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, syncFromNav);
  }, []);

  const [visitorBannerOpen, setVisitorBannerOpen] = useState(false);
  const [decisionReminderBanner, setDecisionReminderBanner] = useState(false);
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");
  const [constraints, setConstraints] = useState("");
  const [stakesLevel, setStakesLevel] = useState(5);
  const [loading, setLoading] = useState(false);
  const [analyzingLineIdx, setAnalyzingLineIdx] = useState(0);
  const [socialProofIdx, setSocialProofIdx] = useState(0);
  const analysisStartRef = useRef(0);
  const [sessionRuns, setSessionRuns] = useState(0);
  const [resultHelpful, setResultHelpful] = useState<"up" | "down" | null>(
    null,
  );
  const [preAnalysisEmailOpen, setPreAnalysisEmailOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [expertNeedsPick, setExpertNeedsPick] = useState<
    ExpertRoleKey | "UNSURE" | null
  >(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [visitMilestoneN, setVisitMilestoneN] = useState<number | null>(null);
  const [whisperAvailable, setWhisperAvailable] = useState(false);
  const [mobileLensIdx, setMobileLensIdx] = useState(0);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [shareUnlockOpen, setShareUnlockOpen] = useState(false);
  const [shareUnlockGoal, setShareUnlockGoal] = useState<"free" | "premium">(
    "free",
  );
  /** After unlock: scroll to form (CTA) or run analysis (submit). */
  const unlockIntentRef = useRef<"scroll" | "run">("scroll");
  /** Defer welcome modal until idle so LCP can paint hero first (mobile PSI). */
  const [deferWelcomeMount, setDeferWelcomeMount] = useState(false);
  useEffect(() => {
    let cancel = false;
    const runFetch = () => {
      fetch("/api/speech/available")
        .then((r) => r.json() as Promise<{ whisper?: boolean }>)
        .then((data) => {
          if (!cancel && data.whisper) setWhisperAvailable(true);
        })
        .catch(() => {
          /* ignore */
        });
    };
    const w = window as Window & {
      requestIdleCallback?: (
        cb: IdleRequestCallback,
        opts?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const idleMs = 1200;
    const fallbackMs = 700;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(
        () => {
          if (!cancel) runFetch();
        },
        { timeout: idleMs },
      );
      return () => {
        cancel = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const t = window.setTimeout(() => {
      if (!cancel) runFetch();
    }, fallbackMs);
    return () => {
      cancel = true;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    // Dedicated /analyze page: mount welcome promptly.
    // Home embed (skipHero+focusLayout): keep idle deferral below.
    if (focusLayout && !skipHero) {
      setDeferWelcomeMount(true);
      return;
    }
    /**
     * Welcome chunk after DOM ready + brief idle — fast for real users; hero still paints first.
     */
    let cancelled = false;
    let bootTimer: number | undefined;
    let idleHandle: number | undefined;
    let fallbackTimer: number | undefined;

    const clearScheduled = () => {
      if (bootTimer != null) window.clearTimeout(bootTimer);
      if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
      const w = window as Window & {
        cancelIdleCallback?: (handle: number) => void;
      };
      if (idleHandle != null) {
        if (typeof w.cancelIdleCallback === "function") {
          w.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
    };

    const armWelcomeAfterLoad = () => {
      if (cancelled) return;
      const narrow = window.matchMedia("(max-width: 767.98px)").matches;
      /**
       * Desktop Lighthouse was scoring TBT ~2.5s partly because the welcome
       * chunk hydrates in the same window as the giant DecisionStudio tree.
       * Mobile keeps a snappier delay; desktop waits longer so LCP + first
       * hydration burst finish before we mount the modal portal.
       */
      const bootDelayMs = narrow ? 160 : 380;
      const idleTimeoutMs = narrow ? 780 : 2800;

      bootTimer = window.setTimeout(() => {
        if (cancelled) return;
        const w = window as Window & {
          requestIdleCallback?: (
            cb: IdleRequestCallback,
            opts?: IdleRequestOptions,
          ) => number;
        };
        if (typeof w.requestIdleCallback === "function") {
          idleHandle = w.requestIdleCallback(
            () => {
              if (!cancelled) setDeferWelcomeMount(true);
            },
            { timeout: idleTimeoutMs },
          );
        } else {
          fallbackTimer = window.setTimeout(
            () => {
              if (!cancelled) setDeferWelcomeMount(true);
            },
            narrow ? 340 : 960,
          );
        }
      }, bootDelayMs);
    };

    const kick = () => armWelcomeAfterLoad();

    if (document.readyState !== "loading") {
      kick();
    } else {
      document.addEventListener("DOMContentLoaded", kick, { once: true });
    }

    return () => {
      cancelled = true;
      clearScheduled();
      document.removeEventListener("DOMContentLoaded", kick);
    };
  }, [focusLayout, skipHero]);

  /** Free package is open on this device — no share gate. */
  useEffect(() => {
    grantLocalFreeUnlocked();
  }, []);

  /** /analyze or ?package=1: scroll to analyzer (free is already local-unlocked). */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forcePackage = params.get("package") === "1";
    if (!focusLayout && !forcePackage) return;

    if (focusLayout || forcePackage) {
      window.setTimeout(() => {
        document
          .getElementById("section-workspace")
          ?.scrollIntoView({ block: "start" });
        document
          .getElementById("decision-input")
          ?.focus({ preventScroll: true });
      }, 80);
    }

    if (forcePackage) {
      params.delete("package");
      const q = params.toString();
      const path = window.location.pathname;
      window.history.replaceState({}, "", q ? `${path}?${q}` : path);
    }
  }, [focusLayout]);

  useEffect(() => {
    if (focusLayout) return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const scrollToTarget = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    scrollToTarget();
    const t1 = window.setTimeout(scrollToTarget, 120);
    const t2 = window.setTimeout(scrollToTarget, 450);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [focusLayout]);

  useEffect(() => {
    try {
      const prev = parseInt(
        window.localStorage.getItem(VISIT_COUNT_KEY) ?? "0",
        10
      );
      const next = Number.isFinite(prev) ? prev + 1 : 1;
      window.localStorage.setItem(VISIT_COUNT_KEY, String(next));
      if ([5, 10, 25, 50, 100].includes(next)) {
        const seen = window.localStorage.getItem(`lde-ms-seen-${next}`) === "1";
        if (!seen) setVisitMilestoneN(next);
      }
      const dismissed =
        window.localStorage.getItem(VISITOR_BANNER_DISMISS_KEY) === "1";
      if (next >= 3 && !dismissed) setVisitorBannerOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const dismissVisitMilestone = useCallback(() => {
    if (visitMilestoneN != null) {
      try {
        window.localStorage.setItem(`lde-ms-seen-${visitMilestoneN}`, "1");
      } catch {
        /* ignore */
      }
    }
    setVisitMilestoneN(null);
  }, [visitMilestoneN]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (preAnalysisEmailOpen) return;
      const el = e.target;
      if (
        el instanceof HTMLElement &&
        el.closest("textarea, input, select, [contenteditable=true]")
      ) {
        return;
      }
      if (e.key === "Escape" && shortcutsOpen) {
        e.preventDefault();
        setShortcutsOpen(false);
        return;
      }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preAnalysisEmailOpen, shortcutsOpen]);

  useEffect(() => {
    try {
      if (isReminderDue()) setDecisionReminderBanner(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (presetApplied.current) return;
    let preset: InitialPreset = initialPreset;
    if (!preset && typeof window !== "undefined") {
      preset = parsePresetQuery(
        new URLSearchParams(window.location.search).get("preset"),
      );
    }
    if (!preset) return;
    const pack = warmPresets[preset];
    setDecision(pack.decision);
    setContext(pack.context);
    setConstraints(pack.constraints);
    presetApplied.current = true;
  }, [initialPreset, warmPresets]);

  /** Skip first run: initial state is DEFAULT_LOCALE before hydrate from storage. */
  const skipLocalePersist = useRef(true);
  useEffect(() => {
    if (skipLocalePersist.current) {
      skipLocalePersist.current = false;
      return;
    }
    const prev = localStorage.getItem(LOCALE_STORAGE_KEY);
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    syncLocaleCookieClient(locale);
    document.documentElement.lang = locale;
    document.documentElement.setAttribute(
      "dir",
      isRtlLocale(locale) ? "rtl" : "ltr"
    );
    // Avoid re-broadcast when nav already applied the same locale.
    if (prev !== locale) dispatchLocaleChanged();
  }, [locale]);

  const demoMode =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_DEMO_MODE === "1";

  const canSubmit = useMemo(() => decision.trim().length > 0, [decision]);
  const formBusy = loading || preAnalysisEmailOpen || packageModalOpen || shareUnlockOpen;

  const runAnalysis = useCallback(async () => {
    if (!canSubmit) return;
    analysisStartRef.current = Date.now();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          context,
          constraints,
          language: locale,
          stakesLevel,
          referralCode: getStoredReferralCode() ?? undefined,
        }),
      });
      const data = (await res.json()) as ApiResponse & { error?: string };
      if (res.status === 403) {
        setLoading(false);
        setPackageModalOpen(true);
        return;
      }
      if (!res.ok) {
        const fallback = buildClientFallbackResult(
          decision,
          context,
          constraints,
          locale,
          stakesLevel,
        );
        setResult(fallback);
        setError(null);
        setSessionRuns((n) => n + 1);
        scrollSectionResultsIntoView();
        return;
      }
      const analysis = safeDecisionAnalysis(data.analysis);
      setResult({
        ...data,
        analysis,
      });
      setSessionRuns((n) => n + 1);
      try {
        pushHistory({
          decision,
          context,
          constraints,
          stakesLevel,
          analysis,
          mode: data.mode,
        });
    } catch {
        /* ignore */
      }
      scrollSectionResultsIntoView();
    } catch {
      const fallback = buildClientFallbackResult(
        decision,
        context,
        constraints,
        locale,
        stakesLevel,
      );
      setResult(fallback);
      setError(null);
      setSessionRuns((n) => n + 1);
      scrollSectionResultsIntoView();
    } finally {
      const elapsed = Date.now() - analysisStartRef.current;
      const wait = Math.max(0, ANALYSIS_UI_MIN_MS - elapsed);
      if (wait > 0) {
        await new Promise<void>((r) => setTimeout(r, wait));
      }
      setLoading(false);
    }
  }, [canSubmit, context, constraints, decision, locale, stakesLevel, t]);

  useEffect(() => {
    if (!loading) return;
    setAnalyzingLineIdx(0);
    const lines = t.analyzingPhaseLines;
    const n = lines.length;
    if (n <= 1) return;
    const id = window.setInterval(() => {
      setAnalyzingLineIdx((i) => (i + 1) % n);
    }, 880);
    return () => clearInterval(id);
  }, [loading, t.analyzingPhaseLines]);

  useEffect(() => {
    if (focusLayout) return;
    const n = t.socialProofRotator.length;
    if (n <= 1) return;
    const id = window.setInterval(() => {
      setSocialProofIdx((i) => (i + 1) % n);
    }, 9600);
    return () => clearInterval(id);
  }, [focusLayout, t.socialProofRotator]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    unlockIntentRef.current = "run";
    grantLocalFreeUnlocked();
    if (!getStoredSubscriberId()) {
      setPreAnalysisEmailOpen(true);
      return;
    }
    void runAnalysis();
  }

  const a = result?.analysis;
  const matchedExperts = result?.matchedExperts ?? NO_MATCHED_EXPERTS;

  useEffect(() => {
    setResultHelpful(null);
  }, [a?.summary]);

  const workspaceGreeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return delight.greetingMorning;
    if (h < 18) return delight.greetingAfternoon;
    return delight.greetingEvening;
  }, [delight]);

  const resultCheerLine = useMemo(() => {
    if (!a) return null;
    const sum = a.summary?.length ?? 0;
    const idx = (decision.length + sum) % delight.resultCheers.length;
    return delight.resultCheers[idx] ?? null;
  }, [a, decision, delight]);

  const voiceLabels = useMemo(
    () => ({
      dictate: t.voiceDictate,
      listening: t.voiceListening,
      stop: t.voiceStop,
      notSupported: t.voiceNotSupported,
    }),
    [t]
  );

  const whisperLabels = useMemo(
    () => ({
      start: t.voiceWhisperStart,
      stop: t.voiceWhisperStop,
      working: t.voiceWhisperWorking,
      error: t.voiceWhisperError,
      needMic: t.voiceWhisperNeedMic,
    }),
    [t]
  );

  const armenianBrowserSttMessage =
    locale === "hy" ? t.voiceSttArmenianUseCloud : undefined;

  const readAloudText = useMemo(
    () =>
      a
        ? buildAnalysisSpeechText(a, t, locale, {
            experts: matchedExperts,
          })
        : "",
    [a, t, locale, matchedExperts]
  );

  useEffect(() => {
    if (!a) return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        try {
          document
            .getElementById("results-main-heading")
            ?.focus({ preventScroll: true });
        } catch {
          /* some mobile WebKit builds throw on focus() */
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [a]);

  useEffect(() => {
    setExpertNeedsPick(null);
  }, [result]);

  const expertsSearchHref = useMemo(() => {
    const q = decision.trim().slice(0, 160);
    return q ? `/experts?q=${encodeURIComponent(q)}` : "/experts";
  }, [decision]);

  const heroSlideDeck = useMemo(() => {
    const n = Math.min(
      HERO_SLIDE_IMAGE_URLS.length,
      t.heroSlides.length
    );
    return Array.from({ length: n }, (_, i) => ({
      src: HERO_SLIDE_IMAGE_URLS[i]!,
      alt: t.heroSlides[i]!.alt,
      caption: t.heroSlides[i]!.caption,
    }));
  }, [t.heroSlides]);

  const scrollToAnalyzer = useCallback(() => {
    window.setTimeout(() => {
      document.getElementById("analyzer")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.setTimeout(() => {
        document.getElementById("decision-input")?.focus({ preventScroll: true });
      }, 450);
    }, 30);
  }, []);

  useEffect(() => {
    function onGate() {
      unlockIntentRef.current = "scroll";
      grantLocalFreeUnlocked();
      scrollToAnalyzer();
    }
    window.addEventListener(PACKAGE_GATE_EVENT, onGate);
    return () => window.removeEventListener(PACKAGE_GATE_EVENT, onGate);
  }, [scrollToAnalyzer]);

  /** Free is open on-device — CTA scrolls straight to the analyzer. */
  const onAnalyzeCtaClick = useCallback(
    (e?: React.MouseEvent<HTMLElement>) => {
      e?.preventDefault();
      unlockIntentRef.current = "scroll";
      grantLocalFreeUnlocked();
      scrollToAnalyzer();
    },
    [scrollToAnalyzer],
  );

  const continueAfterUnlock = useCallback(() => {
    setShareUnlockOpen(false);
    setPackageModalOpen(false);
    if (unlockIntentRef.current === "scroll") {
      scrollToAnalyzer();
      return;
    }
    if (!getStoredSubscriberId()) {
      setPreAnalysisEmailOpen(true);
      return;
    }
    void runAnalysis();
  }, [runAnalysis, scrollToAnalyzer]);

  const onPickFreePackage = useCallback(() => {
    grantLocalFreeUnlocked();
    setPackageModalOpen(false);
    continueAfterUnlock();
  }, [continueAfterUnlock]);

  const onPickPremiumPackage = useCallback(() => {
    setPackageModalOpen(false);
    window.location.href = "/pricing";
  }, []);

  const onPickPremiumShare = useCallback(() => {
    setPackageModalOpen(false);
    setShareUnlockGoal("premium");
    setShareUnlockOpen(true);
  }, []);

  const loadBriefFromHistory = useCallback(
    (d: string, ctx: string, cons: string, stakes?: number) => {
      setDecision(d);
      setContext(ctx);
      setConstraints(cons);
      if (typeof stakes === "number" && stakes >= 1 && stakes <= 10) {
        setStakesLevel(stakes);
      }
      window.setTimeout(() => scrollToAnalyzer(), 40);
    },
    [scrollToAnalyzer],
  );

  return (
    <div
      className="relative z-10 min-h-screen"
      style={
        rtl
          ? { fontFamily: "var(--font-ar), var(--font-noto), sans-serif" }
          : undefined
      }
    >
      {deferWelcomeMount ? (
        <WelcomeModal locale={locale} onLocaleChange={setLocale} />
      ) : null}
      <AnalyzePackageModal
        open={packageModalOpen}
        t={pr}
        onClose={() => setPackageModalOpen(false)}
        onSelectFree={onPickFreePackage}
        onSelectPremium={onPickPremiumPackage}
        onSelectPremiumShare={onPickPremiumShare}
      />
      <ShareToUnlockModal
        open={shareUnlockOpen}
        goal={shareUnlockGoal}
        t={pr}
        onClose={() => setShareUnlockOpen(false)}
        onUnlocked={continueAfterUnlock}
      />
      <PreAnalysisEmailModal
        open={preAnalysisEmailOpen}
        onClose={() => setPreAnalysisEmailOpen(false)}
        onComplete={() => {
          setPreAnalysisEmailOpen(false);
          void runAnalysis();
        }}
        pa={pa}
        locale={locale}
      />
      <ShortcutsHelpModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        copy={delight}
      />
      <KonamiSurprise copy={delight} />
      {!focusLayout ? <OrbDecor /> : null}
      {!focusLayout ? <AmbientDriftLayer /> : null}
      {!focusLayout ? <LatticeSheen /> : null}
      {!focusLayout ? (
        <div className="relative z-[8] mx-auto max-w-6xl px-4 sm:px-6">
          <ChromeHorizon className="pt-1" />
        </div>
      ) : null}
      {!skipHero ? (
        <HomeSectionNav
          links={sectionLinks}
          navAriaLabel={t.homeSectionNavAria}
          jumpLabel={t.homeSectionJumpLabel}
          jumpPlaceholder={t.homeSectionJumpPlaceholder}
        />
      ) : null}

      {!skipHero && !focusLayout && t.socialProofRotator.length > 0 ? (
        <div
          className="relative z-[20] mx-auto max-w-2xl px-4 pt-2 sm:px-6"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.1] via-white/[0.04] to-transparent px-4 py-3 shadow-[0_18px_50px_-28px_rgb(var(--accent)/0.45)] backdrop-blur-md">
            <div
              className="home-accent-hairline-breathe pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent))]/80 to-transparent"
              aria-hidden
            />
            <div
              className="home-ambient-orb-drift pointer-events-none absolute -end-8 -top-10 size-28 rounded-full bg-[rgb(var(--accent-magenta))]/15 blur-3xl"
              aria-hidden
            />
            <p className="relative text-center text-[12px] font-medium leading-snug tracking-wide text-[rgb(var(--ink))]/95 [text-wrap:pretty] sm:text-[13px]">
              <span
                className="home-glyph-twinkle me-2 inline-block opacity-90"
                aria-hidden
              >
                ◇
              </span>
              {t.socialProofRotator[
                socialProofIdx % t.socialProofRotator.length
              ] ?? ""}
            </p>
          </div>
        </div>
      ) : null}

      {demoMode ? (
        <div className="pointer-events-none fixed start-3 end-3 top-[4.75rem] z-[30] max-w-none rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2 text-center text-[11px] font-medium leading-snug text-[rgb(var(--ink-soft))] shadow-lg backdrop-blur-md sm:start-auto sm:end-4 sm:top-[4.5rem] sm:max-w-[min(100%,20rem)] sm:text-start sm:text-xs">
          {sx.demoBadge}
        </div>
      ) : null}

      {visitorBannerOpen ? (
        <div
          className="relative z-[45] mx-auto max-w-6xl px-4 pt-4 sm:px-6"
          role="region"
          aria-label={sx.visitorTitle}
        >
          <div className="flex flex-col gap-3 rounded-2xl border border-[rgb(var(--accent-2))]/35 bg-gradient-to-br from-[rgb(var(--accent))]/14 via-white/[0.06] to-transparent px-4 py-4 shadow-[0_20px_60px_-40px_rgb(var(--accent)/0.5)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[rgb(var(--accent-2))]">
                {sx.visitorEyebrow}
              </p>
              <p className="mt-1 font-display text-base font-semibold text-[rgb(var(--ink))]">
                {sx.visitorTitle}
              </p>
              <ol className="mt-2 list-decimal space-y-1 ps-5 text-sm text-[rgb(var(--ink-soft))] [text-wrap:pretty]">
                <li>{sx.visitorStep1}</li>
                <li>{sx.visitorStep2}</li>
                <li>{sx.visitorStep3}</li>
              </ol>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-[rgb(var(--ink))] transition hover:bg-white/[0.12]"
              onClick={() => {
                try {
                  window.localStorage.setItem(VISITOR_BANNER_DISMISS_KEY, "1");
                } catch {
                  /* ignore */
                }
                setVisitorBannerOpen(false);
              }}
            >
              {sx.visitorDismiss}
            </button>
          </div>
        </div>
      ) : null}

      {decisionReminderBanner ? (
        <div
          className="relative z-[44] mx-auto max-w-6xl px-4 pt-3 sm:px-6"
          role="region"
        >
          <div className="flex flex-col gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-500/[0.08] px-4 py-3 text-sm text-cyan-50/95 sm:flex-row sm:items-center sm:justify-between">
            <p className="[text-wrap:pretty]">{pa.reminderBanner}</p>
            <button
              type="button"
              className="shrink-0 rounded-xl border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-[rgb(var(--ink))]"
              onClick={() => {
                try {
                  clearReminder();
                } catch {
                  /* ignore */
                }
                setDecisionReminderBanner(false);
              }}
            >
              {pa.reminderDismiss}
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={
          focusLayout
            ? "mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6 sm:pt-6"
            : "mx-auto max-w-6xl max-md:pb-40 px-4 pb-32 pt-6 sm:px-6 sm:pt-8"
        }
      >
        {/* Compact analyze header — writing form follows immediately. */}
        {focusLayout && !skipHero && (
          <header
            className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.1] pb-4"
            aria-labelledby="analyze-focus-h"
          >
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                {t.sectionNavAnalyzer}
              </p>
              <h1
                id="analyze-focus-h"
                className="font-display mt-1 text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-extrabold tracking-tight text-[rgb(var(--ink))] [text-wrap:balance]"
              >
                {t.analyzePageTitle}
              </h1>
            </div>
            <Link
              href="/"
              className="shrink-0 text-sm font-semibold text-[rgb(var(--accent-2))] underline-offset-2 hover:underline"
            >
              ← {t.analyzeBackHome}
            </Link>
          </header>
        )}

        {!focusLayout && (
        <>
        {!skipHero ? (
        <section
          id="section-hero"
          className="home-hero-panel home-section-wash home-section-wash--hero relative overflow-hidden rounded-[1.75rem] border border-white/[0.16] bg-gradient-to-br from-white/[0.1] via-white/[0.05] to-[rgb(var(--surface-elevated))]/55 p-4 shadow-[0_28px_80px_-48px_rgb(var(--accent)/0.35),0_0_0_1px_rgba(255,255,255,0.1)_inset] backdrop-blur-sm max-md:border-white/[0.1] max-md:bg-[rgb(var(--surface-2))] max-md:bg-none max-md:shadow-[0_16px_40px_-24px_rgb(0_0_0/0.45)] max-md:backdrop-blur-none sm:rounded-[2.5rem] sm:p-10 lg:p-14"
        >
          <div className="home-hero-spine-breathe pointer-events-none absolute inset-y-10 start-3 w-[5px] rounded-full bg-gradient-to-b from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] opacity-90 shadow-[0_0_20px_rgb(var(--accent)/0.4)] sm:start-5 sm:w-1.5 max-md:hidden" />
          <div className="home-hero-panel__tint pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgb(var(--accent)/0.1),transparent_40%,rgb(var(--accent-2)/0.07),transparent_60%,rgb(var(--accent-magenta)/0.08))]" />
          <div className="grid-view pointer-events-none absolute inset-0 opacity-[0.5] max-md:hidden" />
          <div className="relative grid gap-12 ps-4 sm:ps-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-center lg:ps-2">
            <div className="home-hero-copy relative z-[1]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.22] bg-white/[0.11] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--ink))] shadow-[0_0_32px_-10px_rgb(var(--accent)/0.45),inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-1 ring-[rgb(var(--accent))]/15 backdrop-blur-sm motion-safe:transition motion-safe:duration-500 motion-safe:hover:ring-[rgb(var(--accent-2))]/25 sm:text-xs max-md:shadow-none max-md:backdrop-blur-none">
                <span className="home-brand-pulse-dot size-2.5 rounded-full bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] shadow-[0_0_16px_rgb(var(--accent)/0.6)]" />
              {t.brand}
            </div>
              <p className="home-hero-ribbon mt-6 text-sm font-semibold leading-snug text-[rgb(var(--accent-2))] [text-wrap:balance] sm:text-base">
              {t.heroRibbon}
            </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onAnalyzeCtaClick}
                  className="touch-manipulation inline-flex min-h-[64px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-8 py-4 text-xl font-extrabold text-white/95 shadow-lg shadow-fuchsia-500/30 ring-1 ring-white/25 transition md:hover:brightness-110 motion-safe:active:scale-[0.98]"
                >
                  {t.heroCtaPrimary}
                  <span aria-hidden>→</span>
                </button>
              </div>
              <h1 className="font-display mt-5 text-[clamp(2.1rem,1.15rem+4vw,4rem)] font-extrabold leading-[1.02] tracking-tight [text-wrap:balance]">
              <span className="text-[rgb(var(--ink))]">{t.heroLine1}</span>{" "}
              <span className="text-gradient">{t.heroAccent}</span>
            </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty] md:text-xl md:leading-relaxed">
              {t.subtitle}
            </p>
              <HeroMomentStrips
                stayEyebrow={sx.stayStripEyebrow}
                stayMoments={sx.stayMoments}
                labEyebrow={sx.labStripEyebrow}
                labMoments={sx.labMoments}
              />
              <div className="mt-6 flex flex-wrap gap-2.5">
                {t.features.map((f, i) => (
                <span
                  key={f}
                    className="home-stagger-reveal chip-interactive rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-2 text-sm font-medium text-[rgb(var(--ink))]"
                    style={{ animationDelay: `${i * 75}ms` }}
                >
                  {f}
                </span>
              ))}
            </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <TiltPlane
                  className="inline-flex min-h-[52px] w-full min-w-[min(100%,18rem)] sm:w-auto"
                  innerClassName="rounded-2xl"
                  maxTilt={9}
                  floatZ={10}
                >
                  <Link
                    href="/analyze"
                    onClick={onAnalyzeCtaClick}
                    className="home-hero-cta inline-flex min-h-[52px] min-w-[min(100%,18rem)] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] px-10 py-4 text-lg font-bold text-white shadow-xl shadow-[rgb(var(--accent)/0.3)] transition hover:brightness-110"
                  >
                    {t.heroCtaPrimary}
                    <span aria-hidden>→</span>
                  </Link>
                </TiltPlane>
              <Link
                href="/experts"
                  className="btn-extrude-3d inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.18] bg-white/[0.07] px-8 py-3.5 text-base font-bold text-[rgb(var(--ink))] transition-colors hover:bg-white/[0.12]"
              >
                  {t.heroCtaSecondary}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/pricing"
                  className="inline-flex items-center justify-center gap-2 text-base font-semibold text-[rgb(var(--accent-warm))] underline-offset-4 hover:underline"
              >
                {pr.navPricing}
              </Link>
              </div>
            </div>

            <div className="home-hero-media-column relative isolate z-[1] space-y-5">
              <div
                className="pointer-events-none absolute -inset-4 -z-10 hidden rounded-[1.75rem] bg-gradient-to-br from-[rgb(var(--accent))]/14 via-[rgb(var(--accent-magenta))]/8 to-[rgb(var(--accent-2))]/12 blur-xl md:block"
                aria-hidden
              />
              <div className="block w-full space-y-5">
                <HeroVisualSlider
                  slides={heroSlideDeck}
                  ariaLabel={t.heroCarouselAriaLabel}
                />
                <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[rgb(var(--surface-2))]/90 shadow-2xl backdrop-blur-xl">
                  <div
                    className="home-accent-hairline-breathe pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-emerald-400/45 to-transparent"
                    aria-hidden
                  />
                  <div
                    className="home-ambient-orb-drift pointer-events-none absolute -end-10 top-8 size-24 rounded-full bg-emerald-400/10 blur-3xl"
                    aria-hidden
                  />
                <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="text-xs font-semibold text-[rgb(var(--ink))]">
                    {t.previewCardTitle}
                  </span>
                  <span className="home-live-badge-soft rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-200/95 ring-1 ring-emerald-400/25">
                    Live
                  </span>
                </div>
                <div className="relative space-y-0 divide-y divide-white/[0.06] p-2">
                  {t.previewRows.map((row, ri) => (
                    <a
                      key={row.label}
                      href={previewHref(row.section)}
                      className="home-stagger-reveal flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.04]"
                      style={{ animationDelay: `${120 + ri * 85}ms` }}
                    >
                      <span className="text-xs text-[rgb(var(--ink-soft))]">
                        {row.label}
                      </span>
                      <span className="text-sm font-semibold text-[rgb(var(--ink))]">
                        {row.value}
                      </span>
                    </a>
                  ))}
                </div>
                <div className="border-t border-white/[0.12] bg-white/[0.06] px-4 py-3">
                  <p className="text-[11px] leading-relaxed text-[rgb(var(--ink-soft))]">
                    {exNav.homePromoLink}
                  </p>
                  <Link
                    href="/experts"
                    className="mt-2 inline-flex text-xs font-semibold text-[rgb(var(--accent-2))] hover:underline"
                  >
                    {exNav.navExperts} →
                  </Link>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {!focusLayout ? (
          <>
            <TiltPlane
              className={`block w-full ${skipHero ? "mt-0" : "mt-6"}`}
              innerClassName="rounded-2xl"
              maxTilt={5}
              floatZ={8}
            >
              <div className="relative overflow-hidden home-section-wash grid gap-3 rounded-2xl border border-white/[0.12] bg-[rgb(var(--surface-elevated))]/60 px-4 py-4 sm:px-6 sm:py-5">
                  <div
                    className="home-accent-hairline-breathe pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent))]/55 to-transparent"
                    aria-hidden
                  />
                  <div
                    className="home-ambient-orb-drift--wide pointer-events-none absolute -end-16 -top-20 size-44 rounded-full bg-[rgb(var(--accent))]/12 blur-3xl"
                    aria-hidden
                  />
                <p className="relative m-0 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                  {t.sectionNavTrust}
                </p>
                <ul className="relative m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-3 sm:gap-3">
                  {t.trustMicroPoints.map((line, i) => (
                    <li
                      key={i}
                      className="home-stagger-reveal flex items-start gap-2.5 rounded-xl border border-white/[0.1] border-s-2 border-s-[rgb(var(--accent))]/40 bg-black/25 px-3 py-2.5 text-sm leading-snug text-white/95 transition hover:border-white/[0.16] hover:bg-white/[0.04] motion-safe:hover:-translate-y-0.5 motion-safe:duration-300"
                      style={{ animationDelay: `${i * 110}ms` }}
                    >
                      <span className="shrink-0 text-base" aria-hidden>
                        {i === 0 ? "🔒" : i === 1 ? "🔐" : "🤝"}
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
          </div>
            </TiltPlane>
            <TiltPlane
              className="mt-4 block w-full"
              innerClassName="rounded-2xl"
              maxTilt={5}
              floatZ={8}
            >
            <div className="relative overflow-hidden home-section-wash rounded-2xl border border-white/[0.12] bg-[rgb(var(--surface-elevated))]/55 px-4 py-5 sm:px-6">
              <div
                className="home-accent-hairline-breathe pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-2))]/65 to-transparent"
                aria-hidden
              />
              <div
                className="home-ambient-orb-drift pointer-events-none absolute -bottom-12 -start-10 size-36 rounded-full bg-[rgb(var(--accent-magenta))]/14 blur-3xl"
                aria-hidden
              />
              <p className="relative m-0 text-xs font-bold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
                {t.homeDemoEyebrow}
              </p>
              <p className="relative font-display mt-1 text-lg font-bold text-[rgb(var(--ink))] [text-wrap:balance]">
                {t.homeDemoTitle}
              </p>
              <ul className="relative mt-3 list-none space-y-2 p-0 text-sm">
                <li>
                  <Link
                    href="/analyze?preset=relocate"
                    className="font-semibold text-[rgb(var(--accent-2))] underline-offset-2 hover:underline"
                  >
                    {t.homeDemoExample1} →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analyze?preset=job"
                    className="font-semibold text-[rgb(var(--accent-2))] underline-offset-2 hover:underline"
                  >
                    {t.homeDemoExample2} →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analyze?preset=relationship"
                    className="font-semibold text-[rgb(var(--accent-2))] underline-offset-2 hover:underline"
                  >
                    {t.homeDemoExample3} →
                  </Link>
                </li>
              </ul>
              <Link
                href="/analyze"
                onClick={onAnalyzeCtaClick}
                className="relative btn-extrude-3d mt-4 inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.1] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/[0.14]"
              >
                {t.homeDemoCta} →
              </Link>
            </div>
            </TiltPlane>
          </>
        ) : null}

        <RevealOnScroll>
        <section
          id={skipHero ? "section-at-a-glance" : "section-overview"}
          className="home-section-wash home-section-wash--overview scroll-mt-36 rounded-[1.85rem] px-3 pt-12 pb-1 sm:px-4 sm:pt-14"
          aria-labelledby="overview-heading"
        >
          <div className="panel-float-hover relative overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-transparent p-6 shadow-[0_20px_60px_-36px_rgb(var(--accent)/0.25),0_0_0_1px_rgba(255,255,255,0.05)_inset] sm:p-8">
            <div
              className="home-accent-hairline-breathe pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-2))]/60 to-transparent"
              aria-hidden
            />
            <div
              className="home-ambient-orb-drift pointer-events-none absolute -end-24 top-12 size-56 rounded-full bg-[rgb(var(--accent-sky))]/15 blur-3xl"
              aria-hidden
            />
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
              {t.atAGlanceEyebrow}
            </p>
            <h2
              id="overview-heading"
              className="relative font-display mt-2 text-[clamp(1.35rem,1rem+1.4vw,1.95rem)] font-extrabold tracking-tight text-[rgb(var(--ink))] [text-wrap:balance]"
            >
              {t.atAGlanceTitle}
          </h2>
            <ul className="relative mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
              {t.atAGlanceCards.map((card, i) => {
                const vis = getVisualStoryImage("overview", i);
                return (
                  <li key={card.title} className="h-full">
                    <VisualStoryCard
                      tone="overview"
                      index={i}
                      title={card.title}
                      shortLine={atAGlanceShort[i] ?? atAGlanceShort[0]}
                      fullDescription={card.body}
                      dir={rtl ? "rtl" : "ltr"}
                      imageSrc={vis.src}
                      imageAlt={vis.alt}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
              <Link
                href="/analyze"
                onClick={onAnalyzeCtaClick}
                className="inline-flex items-center justify-center rounded-xl bg-white/[0.07] px-4 py-2.5 text-sm font-semibold text-[rgb(var(--ink))] ring-1 ring-white/10 transition hover:bg-white/[0.1]"
              >
                {t.heroCtaPrimary}
              </Link>
              <span className="text-xs text-[rgb(var(--ink-soft))]/90">
                {t.sectionNavProduct} → {t.sectionNavHow} → {t.sectionNavAnalyzer}
                </span>
            </div>
          </div>
        </section>
        </RevealOnScroll>

        <RevealOnScroll>
          <WhatItFixesSection copy={solveCopy} />
        </RevealOnScroll>

        <RevealOnScroll>
          <ThematicImageBand
            copy={homeBands.a}
            imageSrc={THEMATIC_BAND_A_IMAGE}
            imageSide="start"
            sectionId="section-thematic-clarity"
          />
        </RevealOnScroll>

        {/* Product — bento */}
        <RevealOnScroll>
        <section
          id="section-product"
          className="home-section-wash home-section-wash--product scroll-mt-36 rounded-[1.85rem] px-3 pt-16 pb-1 sm:px-4 sm:pt-20"
          aria-labelledby="product-heading"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
              {t.sectionNavProduct}
            </p>
            <h2
              id="product-heading"
              className="font-display mt-2 text-[clamp(1.55rem,1.05rem+2vw,2.35rem)] font-extrabold tracking-tight text-[rgb(var(--ink))] [text-wrap:balance]"
            >
              {t.productSectionTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty]">
              {t.productSectionSubtitle}
            </p>
          </div>
          <ProductSceneStrip
            eyebrow={t.productStripEyebrow}
            images={PRODUCT_STRIP_IMAGE_URLS}
            alts={t.productStripAlts}
            ariaLabel={t.productStripAria}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.bentoCards.map((card) => (
              <li
                key={card.title}
                className="group list-none rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--accent))]/35 hover:shadow-[0_24px_56px_-28px_rgb(var(--accent)/0.45)]"
              >
                <span className="inline-block rounded-full bg-[rgb(var(--accent))]/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--accent-2))]">
                  {card.pill}
                </span>
                <h3 className="mt-4 text-base font-semibold text-[rgb(var(--ink))]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--ink-soft))]">
                  {card.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
        </RevealOnScroll>

        {/* Trust */}
        <RevealOnScroll>
        <section
          id="section-trust"
          className="home-section-wash home-section-wash--trust scroll-mt-36 rounded-[1.85rem] px-3 pt-16 pb-1 sm:px-4 sm:pt-20"
          aria-labelledby="trust-heading"
        >
          <h2
            id="trust-heading"
            className="font-display text-[clamp(1.55rem,1.05rem+2vw,2.35rem)] font-extrabold tracking-tight text-[rgb(var(--ink))] [text-wrap:balance]"
          >
            {t.trustSectionTitle}
          </h2>
          <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-3">
            {t.trustCards.map((card, i) => {
              const vis = getVisualStoryImage("trust", i);
              return (
              <li key={card.title} className="h-full">
                <VisualStoryCard
                  tone="trust"
                  index={i}
                  title={card.title}
                  shortLine={trustShort[i] ?? trustShort[0]}
                  fullDescription={card.body}
                  emoji={card.emoji}
                  dir={rtl ? "rtl" : "ltr"}
                  imageSrc={vis.src}
                  imageAlt={vis.alt}
                />
              </li>
              );
            })}
          </ul>
        </section>
        </RevealOnScroll>

        <RevealOnScroll>
          <ThematicImageBand
            copy={homeBands.b}
            imageSrc={THEMATIC_BAND_B_IMAGE}
            imageSide="end"
            sectionId="section-thematic-humans"
          />
        </RevealOnScroll>

        {/* How — timeline */}
        <RevealOnScroll>
        <section
          id="section-how"
          className="home-section-wash home-section-wash--how scroll-mt-36 rounded-[1.85rem] px-3 pt-16 pb-1 sm:px-4 sm:pt-20"
          aria-labelledby="how-heading"
        >
          <h2
            id="how-heading"
            className="font-display text-[clamp(1.55rem,1.05rem+2vw,2.35rem)] font-extrabold tracking-tight text-[rgb(var(--ink))] [text-wrap:balance]"
          >
            {t.howSectionTitle}
          </h2>
          <ol className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
            {t.howSteps.map((step, i) => {
              const vis = getVisualStoryImage("how", i);
              return (
              <li key={step.title} className="h-full">
                <VisualStoryCard
                  tone="how"
                  index={i}
                  stepNumber={i + 1}
                  title={step.title}
                  shortLine={howShort[i] ?? howShort[0]}
                  fullDescription={step.body}
                  dir={rtl ? "rtl" : "ltr"}
                  imageSrc={vis.src}
                  imageAlt={vis.alt}
                />
              </li>
              );
            })}
          </ol>
        </section>
        </RevealOnScroll>

        {/* Language */}
        <RevealOnScroll>
        <section
          id="section-language"
          className="home-section-wash home-section-wash--language scroll-mt-36 rounded-[1.85rem] px-3 pt-16 pb-1 sm:px-4 sm:pt-20"
          aria-labelledby="lang-heading"
        >
          <h2
            id="lang-heading"
            className="font-display text-[clamp(1.55rem,1.05rem+2vw,2.35rem)] font-extrabold tracking-tight text-[rgb(var(--ink))]"
          >
            {t.langLabel}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[rgb(var(--ink-soft))]">
            {t.heroRibbon}
          </p>
          <nav
            className="mt-8 rounded-2xl border border-white/[0.12] bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-4 shadow-[0_24px_64px_-32px_rgb(var(--accent)/0.2)] backdrop-blur-sm sm:p-6"
          aria-label={t.langLabel}
        >
            <div className="flex flex-wrap gap-2">
            {LOCALE_OPTIONS.map((opt) => {
              const active = locale === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLocale(opt.value)}
                  className={
                    active
                      ? "rounded-xl border border-[rgb(var(--accent))]/50 bg-gradient-to-r from-[rgb(var(--accent))]/25 to-[rgb(var(--accent-2))]/18 px-3 py-2 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgb(var(--accent))]"
                        : "rounded-xl border border-white/[0.12] bg-white/[0.06] px-3 py-2 text-sm text-[rgb(var(--ink-soft))] transition hover:border-[rgb(var(--accent-2))]/30 hover:bg-white/[0.1] hover:text-[rgb(var(--ink))]"
                  }
                >
                  <LocaleFlag
                    flagCode={opt.flagCode}
                    className="me-1.5 h-3.5 w-5 opacity-90"
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
            <p className="mt-4 text-xs text-[rgb(var(--ink-soft))]/85">
              ({LOCALE_OPTIONS.length} locales)
            </p>
        </nav>
        </section>
        </RevealOnScroll>
        </>
        )}

        {!focusLayout && (
          <div className="mb-8 px-1 sm:px-0">
            <ExpertsRecruitBanner locale={locale} />
          </div>
        )}

        {!focusLayout && (
          <div className="group relative mb-6 flex flex-col gap-4 overflow-hidden rounded-[1.35rem] border border-[rgb(var(--accent-2))]/35 bg-gradient-to-br from-[rgb(var(--accent))]/[0.14] via-white/[0.05] to-[rgb(var(--accent-magenta))]/[0.08] p-5 shadow-[0_24px_70px_-44px_rgb(var(--accent)/0.55)] ring-1 ring-inset ring-white/[0.07] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
            <div
              className="home-accent-hairline-breathe pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-2))]/85 to-transparent"
              aria-hidden
            />
            <div
              className="home-ambient-orb-drift--wide pointer-events-none absolute -end-20 -top-24 size-56 rounded-full bg-[rgb(var(--accent-magenta))]/20 blur-3xl"
              aria-hidden
            />
            <p className="relative text-sm font-semibold leading-relaxed text-[rgb(var(--ink))] [text-wrap:pretty] sm:text-[0.9375rem]">
              {t.homeAnalyzerPromoLine}
            </p>
            <Link
              href="/analyze"
              onClick={onAnalyzeCtaClick}
              className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_36px_-14px_rgb(var(--accent)/0.55)] ring-1 ring-white/20 transition hover:brightness-110 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
            >
              {t.homeAnalyzerPromoCta}{" "}
              <span className="inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
          </div>
        )}

        {/* Top ad — visible on `/` and `/analyze` (free tier). Renders only when
            NEXT_PUBLIC_ADSENSE_SLOT_HOME is set (i.e. post-AdSense-approval). */}
        <AdSenseBanner placement="top" className="my-2" />

        <div
          className={
            a
              ? "flex flex-col gap-4"
              : undefined
          }
        >
        {/* Workspace: disclaimer + analyzer — below results once an answer exists */}
        <RevealOnScroll className={a ? "order-2" : undefined}>
        <section
          id="section-workspace"
          className="home-section-wash home-section-wash--workspace scroll-mt-32 rounded-[1.85rem] px-3 pt-16 pb-1 sm:px-4 sm:pt-20"
          aria-labelledby="workspace-heading"
        >
          <div className="relative mb-8 max-w-3xl overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-gradient-to-br from-[rgb(var(--accent))]/[0.07] via-white/[0.04] to-transparent px-5 py-6 shadow-[0_22px_60px_-38px_rgb(var(--accent)/0.42)] backdrop-blur-sm ring-1 ring-inset ring-[rgb(var(--accent))]/12 sm:px-7 sm:py-7">
            <div
              className="home-accent-hairline-breathe pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent-2))]/80 to-transparent"
              aria-hidden
            />
            <div
              className="home-ambient-orb-drift pointer-events-none absolute -bottom-16 -start-12 size-48 rounded-full bg-[rgb(var(--accent))]/12 blur-3xl"
              aria-hidden
            />
            <h2
              id="workspace-heading"
              className="relative font-display text-[clamp(1.55rem,1.05rem+2vw,2.35rem)] font-extrabold tracking-tight text-[rgb(var(--ink))] [text-wrap:balance]"
            >
              {t.workspaceTitle}
            </h2>
            <p className="relative mt-3 max-w-3xl text-sm font-medium leading-relaxed text-[rgb(var(--accent-2))]/95 [text-wrap:pretty] sm:text-[0.9375rem]">
              {workspaceGreeting}
            </p>
          </div>
          <div className="max-w-3xl rounded-2xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 sm:px-5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[rgb(var(--accent-dim))]/90">
              {novelty.workspaceFlowEyebrow}
            </p>
            <ol className="mt-2 list-decimal space-y-2 ps-4 text-sm leading-relaxed text-[rgb(var(--ink-soft))]/95 [text-wrap:pretty] marker:font-semibold marker:text-[rgb(var(--accent-2))]">
              <li>{novelty.workspaceFlow1}</li>
              <li>{novelty.workspaceFlow2}</li>
              <li>{novelty.workspaceFlow3}</li>
            </ol>
          </div>
          <p
            className="mt-4 max-w-3xl rounded-2xl border border-[rgb(var(--accent-2))]/30 bg-white/[0.04] px-4 py-3 text-sm font-medium leading-relaxed text-[rgb(var(--ink))] [text-wrap:pretty] sm:px-5"
            role="status"
          >
            <span
              className="me-2 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--accent))]/40 to-[rgb(var(--accent-2))]/30 text-xs font-bold text-white"
              aria-hidden
            >
              1
            </span>
            {t.workspaceFillHint}
          </p>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--accent-2))]">
              {sx.warmEyebrow}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 rounded-2xl ring-1 ring-inset ring-[rgb(var(--accent-2))]/20 bg-white/[0.02] p-2">
              {(
                [
                  ["relocate", sx.warmRelocate, warmPresets.relocate] as const,
                  ["job", sx.warmJob, warmPresets.job] as const,
                  [
                    "relationship",
                    sx.warmRel,
                    warmPresets.relationship,
                  ] as const,
                ] as const
              ).map(([key, label, pack]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setDecision(pack.decision);
                    setContext(pack.context);
                    setConstraints(pack.constraints);
                  }}
                  className="rounded-full border border-white/[0.14] bg-white/[0.07] px-4 py-2 text-sm font-medium text-[rgb(var(--ink))] shadow-sm transition hover:border-[rgb(var(--accent-2))]/45 hover:bg-white/[0.11] hover:shadow-[0_14px_36px_-22px_rgb(var(--accent)/0.4)] motion-safe:hover:-translate-y-0.5 motion-safe:duration-200"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">
              {delight.coldStartEyebrow}
            </p>
            <div className="cold-tray-pulse mt-3 flex flex-wrap gap-2 rounded-2xl ring-1 ring-inset ring-violet-400/20 bg-violet-500/[0.05] p-2">
              {delight.coldStarts.map((pack) => (
                <button
                  key={pack.label}
                  type="button"
                  onClick={() => {
                    setDecision(pack.decision);
                    setContext(pack.context);
                    setConstraints(pack.constraints);
                  }}
                  className="chip-interactive rounded-full border border-white/[0.14] bg-white/[0.06] px-4 py-2 text-sm font-medium text-[rgb(var(--ink))] shadow-sm transition-colors hover:border-violet-400/50 hover:bg-white/[0.12] hover:shadow-[0_14px_36px_-22px_rgb(139_92_246/0.35)] motion-safe:hover:-translate-y-0.5 motion-safe:duration-200"
                >
                  {pack.label}
                </button>
              ))}
            </div>
          </div>
          {visitMilestoneN != null ? (
            <TiltPlane
              className="mt-5 block w-full"
              innerClassName="rounded-2xl overflow-hidden"
              maxTilt={4}
              floatZ={6}
            >
              <div
                className="flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/[0.12] to-orange-500/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                role="status"
              >
                <p className="text-sm leading-relaxed text-[rgb(var(--ink))] [text-wrap:pretty]">
                  {milestoneMessage(delight, visitMilestoneN)}
                </p>
                <button
                  type="button"
                  onClick={dismissVisitMilestone}
                  className="shrink-0 rounded-xl border border-white/15 bg-white/[0.1] px-4 py-2 text-xs font-semibold text-[rgb(var(--ink))] transition hover:bg-white/[0.14]"
                >
                  {delight.milestoneDismiss}
                </button>
              </div>
            </TiltPlane>
          ) : null}
          <TiltPlane
            className="mt-8 block w-full"
            innerClassName="rounded-3xl overflow-hidden"
            maxTilt={6}
            floatZ={10}
          >
            <SparkShuffleStrip
              eyebrow={sx.sparkStripEyebrow}
              shuffleLabel={sx.sparkShuffle}
              moments={sx.sparkMoments}
            />
          </TiltPlane>
          <p className="mt-3 max-w-2xl text-[11px] leading-relaxed text-[rgb(var(--ink-soft))]/75 [text-wrap:pretty]">
            {delight.shortcutTeaser}
          </p>
          <PlayCorner copy={delight} />
          <TimeCapsuleCard
            copy={{
              eyebrow: novelty.capsuleEyebrow,
              title: novelty.capsuleTitle,
              explain: novelty.capsuleExplain,
              placeholder: novelty.capsulePlaceholder,
              daysLabel: novelty.capsuleDaysLabel,
              seal7: novelty.capsuleSeal7,
              seal14: novelty.capsuleSeal14,
              seal30: novelty.capsuleSeal30,
              save: novelty.capsuleSave,
              full: novelty.capsuleFull,
              locked: novelty.capsuleLocked,
              reveal: novelty.capsuleReveal,
              delete: novelty.capsuleDelete,
              listAria: novelty.capsuleListAria,
            }}
          />
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
            <div className="min-h-0 lg:col-span-2">
              <TiltPlane
                className="h-full min-h-[12rem]"
                innerClassName="h-full rounded-3xl"
                maxTilt={5}
                floatZ={8}
              >
                <aside className="relative overflow-hidden glass card-glow h-full min-h-[12rem] rounded-3xl p-5 lg:p-6">
                  <div
                    className="home-accent-hairline-breathe pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
                    aria-hidden
                  />
                  <div
                    className="home-ambient-orb-drift pointer-events-none absolute -bottom-10 -start-8 size-32 rounded-full bg-[rgb(var(--accent-sage))]/18 blur-3xl"
                    aria-hidden
                  />
                  <p className="relative text-sm font-semibold text-[rgb(var(--ink))]">
              {t.disclaimerTitle}
            </p>
                  <p className="relative mt-3 text-sm leading-relaxed text-[rgb(var(--ink-soft))]">
              {t.disclaimerBody}
            </p>
          </aside>
              </TiltPlane>
            </div>

          <form
            id="analyzer"
            onSubmit={onSubmit}
              className="relative overflow-hidden panel-float-hover glass card-glow ring-1 ring-inset ring-[rgb(var(--accent))]/25 rounded-3xl p-5 sm:p-6 lg:col-span-3"
            >
              <div
                className="home-accent-hairline-breathe pointer-events-none absolute inset-x-10 top-0 z-10 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[rgb(var(--accent))]/75 to-transparent opacity-95"
                aria-hidden
              />
              <div
                className="home-ambient-orb-drift--wide pointer-events-none absolute -top-24 end-0 size-44 rounded-full bg-[rgb(var(--accent-magenta))]/18 blur-3xl"
                aria-hidden
              />
              <h3 className="relative text-lg font-semibold text-[rgb(var(--ink))]">
              {t.decision}
              </h3>

              <DecisionBriefWizard
                t={brief}
                onApply={({ decision: d, context: ctx, constraints: cons }) => {
                  setDecision(d);
                  setContext(ctx);
                  setConstraints(cons);
                }}
              />
              {sessionRuns > 0 ? (
                <div className="mt-4 inline-flex max-w-full items-center gap-2.5 rounded-full border border-[rgb(var(--accent-2))]/35 bg-gradient-to-r from-[rgb(var(--accent))]/14 via-[rgb(var(--accent-2))]/12 to-[rgb(var(--accent-magenta))]/10 px-4 py-2 shadow-[0_10px_36px_-18px_rgb(var(--accent)/0.55)] ring-1 ring-inset ring-white/[0.06]">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--accent))]/40 to-[rgb(var(--accent-2))]/30 text-[13px] text-white shadow-inner"
                    aria-hidden
                  >
                    ✦
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgb(var(--accent-2))]">
                    {t.sessionRunsThisVisit.replace(
                      "{n}",
                      String(sessionRuns),
                    )}
                  </span>
                </div>
              ) : null}
              <div className="cold-tray-pulse mt-4 rounded-2xl border border-white/[0.11] bg-gradient-to-br from-[rgb(var(--accent))]/[0.09] via-white/[0.05] to-transparent p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)] ring-1 ring-inset ring-[rgb(var(--accent))]/15 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgb(var(--accent))]/45 via-[rgb(var(--accent-2))]/35 to-[rgb(var(--accent-magenta))]/30 text-lg shadow-[0_12px_32px_-12px_rgb(var(--accent)/0.55)]"
                    aria-hidden
                  >
                    ✨
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-[rgb(var(--ink))] [text-wrap:pretty]">
                      {t.workspaceQuickFillIntro}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {t.workspaceQuickExamples.map((ex) => (
                        <button
                          key={ex.label}
                          type="button"
                          disabled={formBusy}
                          onClick={() => {
                            setDecision(ex.decision);
                            window.requestAnimationFrame(() => {
                              document.getElementById("decision-input")?.focus({
                                preventScroll: false,
                              });
                            });
                          }}
                          className="group relative overflow-hidden rounded-xl border border-white/[0.14] bg-black/30 px-4 py-2.5 text-left text-xs font-bold text-[rgb(var(--ink))] shadow-[0_6px_20px_-14px_rgb(0_0_0/0.8)] transition hover:border-[rgb(var(--accent-2))]/45 hover:bg-white/[0.07] disabled:opacity-40 motion-safe:hover:-translate-y-0.5 motion-safe:duration-200"
                        >
                          <span
                            className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
                            aria-hidden
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--accent))]/20 via-transparent to-[rgb(var(--accent-magenta))]/15" />
                          </span>
                          <span className="relative">{ex.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[rgb(var(--ink-soft))]/85 [text-wrap:pretty]">
                {t.voiceInputHint}
              </p>

              <div className="mt-3">
                <div className="mb-1.5 flex flex-wrap items-start justify-end gap-2">
                  <VoiceWhisperButton
                    locale={locale}
                    onAppend={(chunk) =>
                      setDecision((d) =>
                        d.trim() ? `${d.trimEnd()} ${chunk}` : chunk
                      )
                    }
                    disabled={formBusy}
                    available={whisperAvailable}
                    labels={whisperLabels}
                  />
                  <VoiceDictateButton
                    locale={locale}
                    onAppend={(chunk) =>
                      setDecision((d) =>
                        d.trim() ? `${d.trimEnd()} ${chunk}` : chunk
                      )
                    }
                    disabled={formBusy}
                    replaceWithMessage={armenianBrowserSttMessage}
                    labels={voiceLabels}
                  />
                </div>
            <textarea
                  id="decision-input"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder={t.decisionPh}
              rows={4}
                  className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-base leading-relaxed text-[rgb(var(--ink))] placeholder:text-[rgb(var(--ink-soft))]/65 outline-none transition focus:border-[rgb(var(--accent))]/45 focus:ring-2 focus:ring-[rgb(var(--accent))]/15"
            />
              </div>

            <label className="mt-5 block text-sm font-medium text-[rgb(var(--ink))]">
              {t.context}
            </label>
              <div className="mb-1.5 flex flex-wrap items-start justify-end gap-2">
                <VoiceWhisperButton
                  locale={locale}
                  onAppend={(chunk) =>
                    setContext((c) =>
                      c.trim() ? `${c.trimEnd()} ${chunk}` : chunk
                    )
                  }
                  disabled={formBusy}
                  available={whisperAvailable}
                  labels={whisperLabels}
                />
                <VoiceDictateButton
                  locale={locale}
                  onAppend={(chunk) =>
                    setContext((c) => (c.trim() ? `${c.trimEnd()} ${chunk}` : chunk))
                  }
                  disabled={formBusy}
                  replaceWithMessage={armenianBrowserSttMessage}
                  labels={voiceLabels}
                />
              </div>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={t.contextPh}
              rows={3}
                className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-base outline-none transition focus:border-[rgb(var(--accent))]/45"
              />
              <BriefSignatureStrip
                source={`${decision}\n${context}`}
                eyebrow={novelty.signatureEyebrow}
                moodPrefix={novelty.signatureMoodPrefix}
                moodNames={novelty.moodNames}
            />

            <label className="mt-5 block text-sm font-medium text-[rgb(var(--ink))]">
              {t.constraints}
            </label>
              <div className="mb-1.5 flex flex-wrap items-start justify-end gap-2">
                <VoiceWhisperButton
                  locale={locale}
                  onAppend={(chunk) =>
                    setConstraints((c) =>
                      c.trim() ? `${c.trimEnd()} ${chunk}` : chunk
                    )
                  }
                  disabled={formBusy}
                  available={whisperAvailable}
                  labels={whisperLabels}
                />
                <VoiceDictateButton
                  locale={locale}
                  onAppend={(chunk) =>
                    setConstraints((c) =>
                      c.trim() ? `${c.trimEnd()} ${chunk}` : chunk
                    )
                  }
                  disabled={formBusy}
                  replaceWithMessage={armenianBrowserSttMessage}
                  labels={voiceLabels}
                />
              </div>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder={t.constraintsPh}
              rows={2}
                className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-base outline-none transition focus:border-[rgb(var(--accent))]/45"
              />

              <div className="mt-5">
                <label
                  className="block text-sm font-medium text-[rgb(var(--ink))]"
                  htmlFor="stakes-slider"
                >
                  {t.stakesLabel}
                </label>
                <p className="mt-1 text-xs leading-relaxed text-[rgb(var(--ink-soft))]/90 [text-wrap:pretty]">
                  {t.stakesHelper}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 sm:max-w-md">
                  <input
                    id="stakes-slider"
                    type="range"
                    min={1}
                    max={10}
                    value={stakesLevel}
                    onChange={(e) =>
                      setStakesLevel(Number(e.target.value) || 5)
                    }
                    disabled={formBusy}
                    className="h-2 w-full min-w-[12rem] flex-1 accent-[rgb(var(--accent-2))] disabled:opacity-50"
                  />
                  <span
                    className="min-w-[3ch] text-center font-display text-lg font-bold tabular-nums text-gradient"
                    aria-live="polite"
                  >
                    {stakesLevel}
                  </span>
                </div>
              </div>

            {error && (
              <p className="mt-4 text-sm text-rose-300" role="alert">
                {error}
              </p>
            )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <TiltPlane
                  className="inline-flex w-full sm:w-auto"
                  innerClassName="rounded-2xl"
                  maxTilt={7}
                  floatZ={6}
                >
              <button
                type="submit"
                    disabled={!canSubmit || formBusy}
                    className="touch-manipulation min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[rgb(var(--accent)/0.32)] ring-1 ring-white/15 transition md:enabled:hover:brightness-110 md:enabled:hover:shadow-[0_20px_50px_-18px_rgb(var(--accent)/0.5)] md:motion-safe:enabled:hover:scale-[1.02] motion-safe:enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[14rem]"
              >
                {loading ? t.analyzing : t.analyze}
              </button>
                </TiltPlane>
                {result ? (
                  <span className="inline-flex w-full justify-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-center text-sm text-[rgb(var(--ink-soft))] sm:inline-flex sm:w-auto sm:justify-start sm:py-1.5 sm:text-xs">
                  {result.mode === "live" && t.badgeLive}
                  {result.mode === "demo" && t.badgeDemo}
                  {result.mode === "fallback" && t.badgeFallback}
                </span>
                ) : null}
            </div>
              {loading ? (
                <div
                  className="relative mt-5 overflow-hidden rounded-2xl border border-[rgb(var(--accent-2))]/35 bg-gradient-to-b from-[rgb(var(--accent))]/15 via-black/35 to-black/55 p-4 shadow-[0_22px_56px_-30px_rgb(var(--accent)/0.55)] backdrop-blur-md"
                  role="status"
                  aria-live="polite"
                >
                  <div
                    className="pointer-events-none absolute -start-16 top-1/2 size-40 -translate-y-1/2 rounded-full bg-[rgb(var(--accent-magenta))]/20 blur-3xl animate-shimmer-slow"
                    aria-hidden
                  />
                  <p className="relative min-h-[1.45em] text-sm font-semibold leading-snug text-[rgb(var(--ink))] drop-shadow-[0_0_28px_rgb(var(--accent)/0.35)] [text-wrap:pretty] motion-safe:transition-opacity motion-safe:duration-300">
                    {t.analyzingPhaseLines[
                      analyzingLineIdx % t.analyzingPhaseLines.length
                    ] ?? t.analyzingProgressLine}
                  </p>
                  <div
                    className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-black/40 shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06]"
                    aria-hidden
                  >
                    <div className="absolute inset-y-0 start-0 w-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                    <div
                      className="home-analyzing-bar-inner absolute start-0 top-0 h-full w-[42%] rounded-full bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] shadow-[0_0_24px_rgb(var(--accent)/0.55)]"
                    />
                  </div>
                </div>
              ) : null}
            {(result?.hint || result?.warning) && (
                <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-[rgb(var(--ink-soft))]">
                {result.warning ?? result.hint}
              </p>
            )}
          </form>
          </div>
        </section>
        </RevealOnScroll>

        {/* Inline ad — between the analyzer form and the results panel. Renders
            only when NEXT_PUBLIC_ADSENSE_SLOT_INLINE is set. */}
        <AdSenseBanner
          placement="inline"
          className={`my-4${a ? " order-3" : ""}`}
        />

        {a && (
          <section
            id="section-results"
            className="home-section-wash home-section-wash--results order-1 scroll-mt-28 mt-8 space-y-6 rounded-[1.85rem] border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.07] to-transparent px-3 pt-8 sm:px-4"
            aria-labelledby="results-main-heading"
          >
            <div
              id="results-main-heading"
              tabIndex={-1}
              className="results-glow-breathe animate-fade-up rounded-2xl border border-emerald-400/35 bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 px-4 py-4 sm:px-5"
            >
              <h2 className="font-display text-xl font-extrabold tracking-tight text-emerald-50/95 [text-wrap:balance] sm:text-2xl">
              <span
                  className="home-check-nod me-2 inline-block text-2xl"
                aria-hidden
              >
                  ✓
              </span>
                {t.resultsYouAreHere}
                </h2>
            </div>
            {resultCheerLine ? (
              <p className="mx-auto max-w-2xl text-center text-xs font-medium italic leading-relaxed text-emerald-200/85 [text-wrap:pretty]">
                {resultCheerLine}
              </p>
            ) : null}

            {/* Answer first — summary + score at the top of results */}
            <section className="glass animate-fade-up rounded-3xl p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-[rgb(var(--ink))]">
                {t.sectionSummary}
              </h2>
              <div className="mt-3">
                <AnalysisBody
                  value={typeof a.summary === "string" ? a.summary : ""}
                  emptyLabel={t.analysisEmptyDetail}
                />
              </div>
              <p className="mt-3 text-sm text-[rgb(var(--ink-soft))] [text-wrap:pretty]">
                {t.stakesResultPrefix} —{" "}
                <span className="font-semibold text-[rgb(var(--ink))]">
                  {stakesLevel}/10
                </span>
              </p>
            </section>

            <section className="glass animate-fade-up rounded-3xl p-6 sm:p-7">
              <h2 className="text-lg font-semibold">{t.sectionScore}</h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-[auto,1fr] sm:items-start">
                <ScoreCircle score={a.score} sublabel={t.scoreSublabel} />
                <AnalysisBody
                  value={a.scoreRationale}
                  emptyLabel={t.analysisEmptyDetail}
                />
              </div>
            </section>

            {/* High-visibility affiliate — early in results for conversion */}
            <div className="mx-auto max-w-xl px-2">
              <AmazonAssociatesCta variant="compact" locale={locale} />
            </div>

            {(a.professionalGuidance ?? "").trim() ? (
              <section className="glass animate-fade-up rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.07] to-transparent p-6 sm:p-7">
                <h2 className="text-lg font-semibold text-amber-50/95">
                  {t.sectionProfessional}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty] whitespace-pre-wrap">
                  {a.professionalGuidance}
                </p>
              </section>
            ) : null}

            <section
              className="glass animate-fade-up rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.06] to-transparent p-6 sm:p-7"
              aria-labelledby="needs-help-heading"
            >
              <h2
                id="needs-help-heading"
                className="text-lg font-semibold text-cyan-50/95"
              >
                {pa.needsHelpTitle}
                </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty]">
                {pa.needsHelpLead}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {DIRECTORY_ROLE_OPTIONS.map((role) => {
                  const suggested = a.suggestedDirectoryRole === role;
                  const selected = expertNeedsPick === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setExpertNeedsPick(role)}
                      className={`inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-2xl border px-3 py-2 text-left text-sm font-medium transition ${
                        selected
                          ? "border-cyan-400/55 bg-cyan-500/20 text-cyan-50 ring-2 ring-cyan-400/40"
                          : "border-white/[0.12] bg-white/[0.04] text-[rgb(var(--ink))] hover:border-cyan-400/35 hover:bg-white/[0.07]"
                      }`}
                    >
                      <span>{roleLabel(locale, role)}</span>
                      {suggested ? (
                        <span className="rounded-md bg-cyan-500/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-100/90">
                          {pa.needsHelpSuggestedBadge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setExpertNeedsPick("UNSURE")}
                  className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                    expertNeedsPick === "UNSURE"
                      ? "border-cyan-400/55 bg-cyan-500/20 text-cyan-50 ring-2 ring-cyan-400/40"
                      : "border-white/[0.12] bg-white/[0.04] text-[rgb(var(--ink-soft))] hover:border-cyan-400/35 hover:bg-white/[0.07]"
                  }`}
                >
                  {pa.needsHelpUnsure}
                </button>
              </div>
              {expertNeedsPick !== null ? (
                <div className="mt-5">
                  <Link
                    href={buildExpertsNeedsHref(expertNeedsPick, decision)}
                    className="inline-flex rounded-2xl bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgb(var(--accent)/0.28)] transition hover:brightness-110"
                  >
                    {expertNeedsPick === "UNSURE"
                      ? pa.needsHelpOpenExperts
                      : pa.needsHelpOpenForRole.replace(
                          "{role}",
                          roleLabel(locale, expertNeedsPick),
                        )}
                  </Link>
            </div>
              ) : null}
          </section>

            {matchedExperts.length > 0 ? (
            <section className="glass animate-fade-up rounded-3xl p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-[rgb(var(--ink))]">
                  {t.sectionDirectoryExperts}
              </h2>
                <ul className="mt-4 space-y-4">
                  {matchedExperts.map((e) => (
                    <li
                      key={e.id}
                      className="flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[rgb(var(--ink))]">
                          {e.name}
                        </p>
                        <p className="text-xs font-medium text-[rgb(var(--accent-2))]">
                          {roleLabel(locale, e.role as ExpertRoleKey)} · {e.country}
                          {e.city ? ` · ${e.city}` : ""}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-[rgb(var(--ink-soft))]">
                          {e.bio}
                        </p>
                        <p className="mt-1 text-xs text-[rgb(var(--ink-soft))]/85">
                          {e.languages}
                        </p>
                      </div>
                      <Link
                        href={`/experts?role=${encodeURIComponent(e.role)}&highlight=${encodeURIComponent(e.id)}`}
                        className="shrink-0 self-start rounded-xl bg-gradient-to-r from-[rgb(var(--accent))]/30 to-[rgb(var(--accent-2))]/20 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 sm:self-center"
                      >
                        {t.expertOpenInDirectory} →
                      </Link>
                    </li>
                  ))}
                </ul>
            </section>
            ) : null}

            {matchedExperts.length === 0 &&
            (a.suggestedDirectoryRole ?? "UNSPECIFIED") !==
              "UNSPECIFIED" ? (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[rgb(var(--ink-soft))] [text-wrap:pretty]">
                {t.expertNoDirectoryMatch}{" "}
                <Link
                  href={`/experts?role=${encodeURIComponent(
                    a.suggestedDirectoryRole ?? "",
                  )}`}
                  className="font-semibold text-[rgb(var(--accent-2))] underline-offset-2 hover:underline"
                >
                  {exNav.navExperts} →
                </Link>
              </p>
            ) : null}

            <ExpertsRecruitBanner
              locale={locale}
              variant="compact"
              className="animate-fade-up"
            />

            <section className="glass animate-fade-up rounded-3xl p-4 sm:p-7">
              <h2 className="text-lg font-semibold">{t.sectionDimensions}</h2>
              {(() => {
                const dimensionCards = [
                  {
                    key: "finances",
                    label: t.dimFinances,
                    emoji: "💼",
                    bg: getVisualStoryImage("overview", 0).src,
                  },
                  {
                    key: "psychology",
                    label: t.dimPsychology,
                    emoji: "🧠",
                    bg: getVisualStoryImage("trust", 1).src,
                  },
                  {
                    key: "risks",
                    label: t.dimRisks,
                    emoji: "🛡️",
                    bg: getVisualStoryImage("how", 2).src,
                  },
                  {
                    key: "opportunities",
                    label: t.dimOpportunities,
                    emoji: "✨",
                    bg: getVisualStoryImage("overview", 2).src,
                  },
                ] as const;

                const currentMobile =
                  dimensionCards[mobileLensIdx] ?? dimensionCards[0];

                return (
                  <>
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:hidden">
                      {dimensionCards.map((item, idx) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setMobileLensIdx(idx)}
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            idx === mobileLensIdx
                              ? "border-[rgb(var(--accent-2))]/55 bg-[rgb(var(--accent-2))]/18 text-[rgb(var(--ink))]"
                              : "border-white/[0.14] bg-white/[0.03] text-[rgb(var(--ink-soft))]"
                          }`}
                          aria-pressed={idx === mobileLensIdx}
                        >
                          <span className="me-1" aria-hidden>
                            {item.emoji}
                          </span>
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 sm:hidden">
                      <article className="relative overflow-hidden rounded-2xl border border-white/10">
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-45"
                          style={{ backgroundImage: `url(${currentMobile.bg})` }}
                          aria-hidden
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-[rgb(10_16_34/0.55)] via-[rgb(10_16_34/0.75)] to-[rgb(10_16_34/0.92)]"
                          aria-hidden
                        />
                        <div className="relative p-4">
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/90">
                            {currentMobile.label}
                          </h3>
                          <AnalysisBody
                            value={a.dimensions[currentMobile.key]}
                            emptyLabel={t.analysisEmptyDetail}
                            className="mt-2 text-[15px] leading-relaxed text-white/95"
                          />
                        </div>
                      </article>
                    </div>

                    <div className="mt-5 hidden gap-4 sm:grid sm:grid-cols-2">
                      {dimensionCards.map((item) => (
                        <article
                          key={item.key}
                          className="group relative overflow-hidden rounded-2xl border border-white/[0.09] shadow-[0_20px_54px_-36px_rgb(0_0_0/0.65)]"
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 transition duration-500 group-hover:scale-[1.03]"
                            style={{ backgroundImage: `url(${item.bg})` }}
                            aria-hidden
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-b from-[rgb(8_14_30/0.52)] via-[rgb(8_14_30/0.74)] to-[rgb(8_14_30/0.94)]"
                            aria-hidden
                          />
                          <div className="relative p-4 sm:p-5">
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/90">
                              <span className="me-1.5" aria-hidden>
                                {item.emoji}
                              </span>
                              {item.label}
                    </h3>
                            <AnalysisBody
                              value={a.dimensions[item.key]}
                              emptyLabel={t.analysisEmptyDetail}
                              className="mt-2 text-[15px] leading-relaxed text-white/95"
                            />
                  </div>
                        </article>
                ))}
              </div>
                  </>
                );
              })()}
            </section>

            <section className="glass animate-fade-up rounded-3xl p-6 sm:p-7">
              <h2 className="text-lg font-semibold">{t.sectionScenarios}</h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
                  <h3 className="text-xs font-semibold text-emerald-300/95">
                    {t.scenBest}
                  </h3>
                  <AnalysisBody
                    value={a.scenarios.bestCase}
                    emptyLabel={t.analysisEmptyDetail}
                    className="mt-2"
                  />
                </div>
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] p-4">
                  <h3 className="text-xs font-semibold text-rose-300/95">
                    {t.scenWorst}
                  </h3>
                  <AnalysisBody
                    value={a.scenarios.worstCase}
                    emptyLabel={t.analysisEmptyDetail}
                    className="mt-2"
                  />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="text-xs font-semibold text-[rgb(var(--ink))]">
                    {t.scenLikely}
                  </h3>
                  <AnalysisBody
                    value={a.scenarios.mostLikely}
                    emptyLabel={t.analysisEmptyDetail}
                    className="mt-2"
                  />
                </div>
              </div>
            </section>

            <section className="glass animate-fade-up rounded-3xl p-6 sm:p-7">
              <h2 className="text-lg font-semibold">{t.sectionTimeline}</h2>
              <ol className="mt-5 space-y-5">
                <li className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
                  <div
                    className="flex size-[5.75rem] shrink-0 flex-col items-center justify-center rounded-full border border-white/[0.12] bg-gradient-to-br from-[rgb(var(--accent))]/22 via-[rgb(var(--accent-2))]/14 to-[rgb(var(--accent-magenta))]/12 px-2 text-center shadow-[0_14px_36px_-22px_rgb(var(--accent)/0.55)] ring-1 ring-white/[0.06]"
                    aria-hidden
                  >
                    <span className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-[rgb(var(--ink-soft))]/90">
                    {t.timeM6}
                  </span>
                  </div>
                  <AnalysisBody
                    value={a.timeline.months6}
                    emptyLabel={t.analysisEmptyDetail}
                    className="min-w-0 w-full flex-1 text-center sm:text-start"
                  />
                </li>
                <li className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
                  <div
                    className="flex h-[6.25rem] w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-[1.75rem] border border-white/[0.12] bg-gradient-to-b from-[rgb(var(--accent))]/22 via-[rgb(var(--accent-2))]/14 to-[rgb(var(--accent-magenta))]/12 px-2 text-center shadow-[0_14px_36px_-22px_rgb(var(--accent)/0.55)] ring-1 ring-white/[0.06]"
                    aria-hidden
                  >
                    <span className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-[rgb(var(--ink-soft))]/90">
                    {t.timeY2}
                  </span>
                  </div>
                  <AnalysisBody
                    value={a.timeline.years2}
                    emptyLabel={t.analysisEmptyDetail}
                    className="min-w-0 w-full flex-1 text-center sm:text-start"
                  />
                </li>
                <li className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
                  <div
                    className="flex h-[6.25rem] w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-[1.75rem] border border-white/[0.12] bg-gradient-to-b from-[rgb(var(--accent))]/22 via-[rgb(var(--accent-2))]/14 to-[rgb(var(--accent-magenta))]/12 px-2 text-center shadow-[0_14px_36px_-22px_rgb(var(--accent)/0.55)] ring-1 ring-white/[0.06]"
                    aria-hidden
                  >
                    <span className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-[rgb(var(--ink-soft))]/90">
                    {t.timeY5}
                  </span>
                  </div>
                  <AnalysisBody
                    value={a.timeline.years5}
                    emptyLabel={t.analysisEmptyDetail}
                    className="min-w-0 w-full flex-1 text-center sm:text-start"
                  />
                </li>
              </ol>
            </section>

            <section className="glass animate-fade-up rounded-3xl p-6 sm:p-7">
              <h2 className="text-lg font-semibold">{t.sectionTwin}</h2>
              <div className="mt-3">
                <AnalysisBody
                  value={a.digitalTwinNote}
                  emptyLabel={t.analysisEmptyDetail}
                />
              </div>
            </section>

            <TiltPlane
              className="animate-fade-up block w-full"
              innerClassName="rounded-2xl"
              maxTilt={5}
              floatZ={8}
            >
              <div className="flex flex-col gap-4 rounded-2xl border border-[rgb(var(--accent-2))]/35 bg-gradient-to-br from-[rgb(var(--accent))]/14 via-white/[0.04] to-transparent px-4 py-4 shadow-[0_16px_48px_-28px_rgb(var(--accent)/0.45)] sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <p className="max-w-2xl text-sm leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty]">
                    {pa.runAnotherHint}
                  </p>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-0 sm:flex-row sm:items-center sm:gap-2">
                    <ReadAloudReportButton
                      text={readAloudText}
                      locale={locale}
                      labels={{
                        readAloud: t.readAloud,
                        stop: t.readAloudStop,
                      }}
                    />
                    <button
                      type="button"
                      onClick={scrollToAnalyzer}
                      className="shrink-0 rounded-2xl bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgb(var(--accent)/0.28)] transition hover:brightness-110"
                    >
                      {pa.runAnotherCta}
                    </button>
                  </div>
                </div>
                <div className="border-t border-white/[0.08] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--accent-dim))]">
                    {pa.runAnotherTrustTitle}
                  </p>
                  <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[rgb(var(--ink-soft))]/90 [text-wrap:pretty]">
                    {pa.runAnotherTrustBody}
                  </p>
                </div>
              </div>
            </TiltPlane>

            <div className="mx-auto max-w-xl px-2">
              <div className="overflow-hidden rounded-[1.35rem] border border-emerald-400/30 bg-gradient-to-b from-emerald-500/[0.14] via-black/40 to-black/55 p-[1px] shadow-[0_28px_70px_-40px_rgb(52_211_153/0.45)] backdrop-blur-md">
                <div className="rounded-[1.3rem] bg-black/35 px-3 py-4 sm:px-5 sm:py-5">
                  <AmazonAssociatesCta variant="compact" locale={locale} />
                  <div
                    className="relative my-5 flex items-center gap-3 sm:my-6"
                    aria-hidden
                  >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
                    <span className="home-emerald-dot-pulse flex size-2 shrink-0 rounded-full bg-emerald-400/70 shadow-[0_0_14px_rgb(52_211_153/0.65)] ring-4 ring-emerald-400/15" />
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-emerald-400/35 to-transparent" />
                  </div>
                  <div
                    className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5"
                    role="group"
                    aria-label={t.resultFeedbackPrompt}
                  >
                    <span className="text-center text-[13px] font-semibold tracking-wide text-emerald-100/90">
                      {t.resultFeedbackPrompt}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setResultHelpful("up");
                          try {
                            window.localStorage.setItem(
                              "lde-feedback-last",
                              "up",
                            );
                          } catch {
                            /* ignore */
                          }
                        }}
                        className={`inline-flex size-12 items-center justify-center rounded-2xl border text-xl shadow-lg transition motion-safe:active:scale-95 ${
                          resultHelpful === "up"
                            ? "border-emerald-400/70 bg-gradient-to-b from-emerald-500/35 to-emerald-600/20 text-emerald-50 ring-2 ring-emerald-400/45"
                            : "border-white/18 bg-white/[0.07] text-emerald-100/95 hover:border-emerald-400/40 hover:bg-emerald-500/15"
                        }`}
                        aria-pressed={resultHelpful === "up"}
                      >
                        <span aria-hidden>👍</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResultHelpful("down");
                          try {
                            window.localStorage.setItem(
                              "lde-feedback-last",
                              "down",
                            );
                          } catch {
                            /* ignore */
                          }
                        }}
                        className={`inline-flex size-12 items-center justify-center rounded-2xl border text-xl shadow-lg transition motion-safe:active:scale-95 ${
                          resultHelpful === "down"
                            ? "border-rose-400/55 bg-gradient-to-b from-rose-500/30 to-rose-700/20 text-rose-50 ring-2 ring-rose-400/35"
                            : "border-white/18 bg-white/[0.07] text-rose-100/90 hover:border-rose-400/35 hover:bg-rose-500/15"
                        }`}
                        aria-pressed={resultHelpful === "down"}
                      >
                        <span aria-hidden>👎</span>
                      </button>
                    </div>
                  </div>
                  {resultHelpful ? (
                    <p className="mt-4 text-center text-[12px] font-medium leading-relaxed text-emerald-200/95">
                      {t.resultFeedbackThanks}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {result ? (
              <AnalysisResultTools
                analysis={a}
                decision={decision}
                context={context}
                constraints={constraints}
                stakesLevel={stakesLevel}
                mode={result.mode}
                pa={pa}
                expertsSearchHref={expertsSearchHref}
                onRefineRun={scrollToAnalyzer}
                onLoadBrief={loadBriefFromHistory}
              />
            ) : null}

            <section className="glass animate-fade-up rounded-3xl border border-dashed border-[rgb(var(--accent))]/35 bg-gradient-to-br from-[rgb(var(--accent))]/[0.07] to-transparent p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-[rgb(var(--ink))]">
                {sx.premiumTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--ink-soft))]">
                {sx.premiumHint}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/pricing"
                  className="rounded-2xl border border-[rgb(var(--accent))]/35 bg-[rgb(var(--accent))]/10 px-5 py-2.5 text-sm font-semibold text-[rgb(var(--ink))] transition hover:border-[rgb(var(--accent))]/60"
                  title={sx.premiumHint}
                >
                  {sx.premiumCta}
                </Link>
              </div>
            </section>

            <footer className="border-t border-white/10 pt-8 text-center text-xs leading-relaxed text-[rgb(var(--ink-soft))]">
              {t.footerPremium}
            </footer>
          </section>
        )}
        </div>

        {/* Footer ad — between the premium CTA / results block and the privacy
            section. Renders only when NEXT_PUBLIC_ADSENSE_SLOT_FOOTER is set. */}
        <AdSenseBanner placement="footer" className="my-4" />

        <RevealOnScroll>
        <section
          id="section-privacy"
          className="home-section-wash home-section-wash--privacy scroll-mt-36 rounded-[1.85rem] px-3 pt-10 pb-1 sm:px-4 sm:pt-12"
          aria-labelledby="security-heading"
        >
          <div className="glass card-glow rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15 text-[1.35rem] shadow-inner shadow-emerald-500/10"
                aria-hidden
              >
                🔒
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id="security-heading"
                  className="text-base font-semibold tracking-tight text-emerald-50/95"
                >
                  {t.securityTitle}
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[rgb(var(--ink))]/95 [text-wrap:pretty]">
                  {t.securityIntro}
                </p>
                <ul className="mt-4 list-disc space-y-2.5 ps-5 text-sm leading-relaxed text-[rgb(var(--ink-soft))] marker:text-emerald-400/90 [text-wrap:pretty]">
                  {t.securityPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <p className="mt-5 text-sm">
                  <Link
                    href="/privacy"
                    className="font-medium text-emerald-200/95 underline-offset-2 hover:underline"
                  >
                    Privacy Policy →
                  </Link>
                </p>
            </div>
          </div>
        </div>
        </section>
        </RevealOnScroll>

        {!focusLayout ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
            <div className="pointer-events-auto mx-auto max-w-6xl border-t border-white/10 bg-[rgb(var(--surface))]/92 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
              <Link
                href="/analyze"
                onClick={onAnalyzeCtaClick}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-magenta))] text-base font-bold text-white shadow-lg shadow-[rgb(var(--accent)/0.25)] transition hover:brightness-110"
              >
                {t.heroCtaPrimary}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
