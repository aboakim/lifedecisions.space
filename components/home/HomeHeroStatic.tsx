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
 * Video stays on the right; copy sits on an opaque light panel so every letter
 * stays readable against the busy blue footage.
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
        className="home-hero-panel relative overflow-hidden bg-[rgb(var(--surface))]"
        aria-labelledby="home-hero-heading"
      >
        <div className="absolute inset-0 z-0" aria-hidden>
          <picture className="absolute inset-0 block h-full w-full">
            <source srcSet={HERO_LCP_IMAGE_URL} type="image/webp" />
            <img
              src={HERO_LCP_IMAGE_JPEG_URL}
              alt=""
              decoding="sync"
              fetchPriority="high"
              width={1600}
              height={1000}
              sizes="100vw"
              className="h-full w-full object-cover object-[72%_center]"
            />
          </picture>
          <HomeHeroVideoDeferred
            src={HERO_VIDEO_URL}
            poster={HERO_LCP_IMAGE_JPEG_URL}
            ariaLabel={slide.alt}
          />
          {/* Opaque left reading plane — video only peeks on the right */}
          <div
            className="absolute inset-y-0 start-0 w-[min(100%,38rem)] bg-[rgb(var(--surface))] max-md:w-[72%] lg:w-[min(100%,42rem)]"
          />
          <div
            className="absolute inset-y-0 start-0 w-[min(100%,48rem)] bg-gradient-to-r from-[rgb(var(--surface))] from-55% via-[rgb(var(--surface)/0.92)] via-75% to-transparent max-md:w-full max-md:from-70% max-md:via-[rgb(var(--surface)/0.88)] lg:w-[min(100%,54rem)]"
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(72vh,36rem)] max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
          <div className="home-hero-copy max-w-xl rounded-2xl bg-[rgb(var(--surface)/0.96)] p-1 max-md:bg-[rgb(var(--surface))] sm:p-0">
            <p className="font-display text-sm font-semibold tracking-tight text-[#1c1e24] sm:text-base">
              {t.brand}
            </p>

            <h1
              id="home-hero-heading"
              className="font-display mt-3 text-[clamp(2.15rem,1.2rem+3.6vw,3.9rem)] font-extrabold leading-[1.05] tracking-tight text-[#1c1e24] [text-wrap:balance]"
            >
              {t.heroLine1}{" "}
              <span className="text-[#1c1e24]">{t.heroAccent}</span>
            </h1>

            <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-[#3d414d] [text-wrap:pretty] sm:text-lg">
              {t.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <AnalyzeCtaLink
                href="/analyze"
                className="home-hero-cta inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#2a4a78] px-8 py-3.5 text-base font-bold text-white shadow-[0_14px_36px_-16px_rgb(42_74_120/0.45)] transition hover:bg-[#223c64] motion-safe:active:scale-[0.98] sm:w-auto sm:min-h-[56px] sm:text-lg"
              >
                {t.heroCtaPrimary}
                <span aria-hidden>→</span>
              </AnalyzeCtaLink>
              <Link
                href="/experts"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-[#1c1e24]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1c1e24] shadow-sm transition hover:bg-[#f6f5f1] sm:w-auto sm:text-base"
              >
                {t.heroCtaSecondary}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-2 py-2 text-sm font-semibold text-[#1c1e24] underline decoration-[#1c1e24]/35 underline-offset-4 hover:decoration-[#1c1e24]"
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
