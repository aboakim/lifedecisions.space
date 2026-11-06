import Link from "next/link";
import { isRtlLocale, type AppLocale } from "@/lib/i18n/locale";
import { getUi } from "@/lib/i18n/ui";
import { getPricingCopy } from "@/lib/i18n/pricing-page";
import { DEFAULT_LOCALE } from "@/lib/locale-default";
import {
  HERO_LCP_IMAGE_URL,
  HERO_LCP_IMAGE_JPEG_URL,
  HERO_VIDEO_URL,
} from "@/lib/home/hero-slide-images";
import HomeHeroVideoDeferred from "@/components/home/HomeHeroVideoDeferred";
import AnalyzeCtaLink from "@/components/ads/AnalyzeCtaLink";

type Props = { locale?: AppLocale };

/**
 * First viewport: brand, one headline, one line, CTAs, and a real visual —
 * no glass card, ribbons, chip rows, or fake dashboard mock.
 */
export default function HomeHeroStatic({ locale: localeProp }: Props = {}) {
  const locale = localeProp ?? DEFAULT_LOCALE;
  const t = getUi(locale);
  const pr = getPricingCopy(locale);
  const slide = t.heroSlides[0]!;
  const rtl = isRtlLocale(locale);

  return (
    <div
      className="relative z-10"
      dir={rtl ? "rtl" : undefined}
      style={
        rtl
          ? { fontFamily: "var(--font-ar), var(--font-noto), sans-serif" }
          : undefined
      }
    >
      <section
        id="section-hero"
        className="home-hero-panel relative overflow-hidden"
        aria-labelledby="home-hero-heading"
      >
        <div className="absolute inset-0">
          <picture className="absolute inset-0 block h-full w-full">
            <source srcSet={HERO_LCP_IMAGE_URL} type="image/webp" />
            <img
              src={HERO_LCP_IMAGE_JPEG_URL}
              alt=""
              aria-hidden
              decoding="sync"
              fetchPriority="high"
              width={1600}
              height={1000}
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </picture>
          <HomeHeroVideoDeferred
            src={HERO_VIDEO_URL}
            poster={HERO_LCP_IMAGE_JPEG_URL}
            ariaLabel={slide.alt}
          />
          <div
            className="absolute inset-0 z-[2] bg-gradient-to-r from-[rgb(var(--surface)/0.94)] via-[rgb(var(--surface)/0.78)] to-[rgb(var(--surface)/0.35)] max-md:from-[rgb(var(--surface)/0.92)] max-md:via-[rgb(var(--surface)/0.82)] max-md:to-[rgb(var(--surface)/0.55)]"
            aria-hidden
          />
        </div>

        <div className="relative z-[1] mx-auto flex min-h-[min(78vh,40rem)] max-w-6xl flex-col justify-end px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20 lg:justify-center lg:pb-16">
          <div className="home-hero-copy max-w-xl">
            <p className="font-display text-sm font-semibold tracking-tight text-[rgb(var(--ink))] sm:text-base">
              {t.brand}
            </p>

            <h1
              id="home-hero-heading"
              className="font-display mt-3 text-[clamp(2.15rem,1.2rem+3.6vw,3.9rem)] font-extrabold leading-[1.05] tracking-tight text-[rgb(var(--ink))] [text-wrap:balance]"
            >
              {t.heroLine1}{" "}
              <span className="text-[rgb(var(--accent))]">{t.heroAccent}</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-[rgb(var(--ink-soft))] [text-wrap:pretty] sm:text-lg">
              {t.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <AnalyzeCtaLink
                href="/analyze"
                className="home-hero-cta inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[rgb(var(--accent))] px-8 py-3.5 text-base font-bold text-white shadow-[0_14px_36px_-16px_rgb(var(--accent)/0.55)] transition hover:brightness-110 motion-safe:active:scale-[0.98] sm:w-auto sm:min-h-[56px] sm:text-lg"
              >
                {t.heroCtaPrimary}
                <span aria-hidden>→</span>
              </AnalyzeCtaLink>
              <Link
                href="/experts"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-[rgb(var(--ink)/0.14)] bg-[rgb(var(--surface-2)/0.72)] px-6 py-3 text-sm font-semibold text-[rgb(var(--ink))] backdrop-blur-sm transition hover:bg-[rgb(var(--surface-2))] sm:w-auto sm:text-base"
              >
                {t.heroCtaSecondary}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-2 py-2 text-sm font-semibold text-[rgb(var(--accent-2))] underline-offset-4 hover:underline"
              >
                {pr.navPricing} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
