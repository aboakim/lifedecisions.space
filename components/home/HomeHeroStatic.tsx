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
 * First viewport: brand, one headline, one line, CTAs over a full-bleed visual.
 * Copy sits above the wash with solid ink colors for contrast.
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
              className="h-full w-full object-cover object-[70%_center]"
            />
          </picture>
          <HomeHeroVideoDeferred
            src={HERO_VIDEO_URL}
            poster={HERO_LCP_IMAGE_JPEG_URL}
            ariaLabel={slide.alt}
          />
          {/* Soft right-side photo; solid left so copy stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--surface))] from-[42%] via-[rgb(var(--surface)/0.92)] via-[58%] to-[rgb(var(--surface)/0.28)] max-md:from-[rgb(var(--surface))] max-md:from-[55%] max-md:via-[rgb(var(--surface)/0.94)] max-md:to-[rgb(var(--surface)/0.45)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(72vh,36rem)] max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
          <div className="home-hero-copy max-w-xl">
            <p className="font-display text-sm font-semibold tracking-tight text-[rgb(28_30_36)] sm:text-base">
              {t.brand}
            </p>

            <h1
              id="home-hero-heading"
              className="font-display mt-3 text-[clamp(2.15rem,1.2rem+3.6vw,3.9rem)] font-extrabold leading-[1.05] tracking-tight text-[rgb(28_30_36)] [text-wrap:balance]"
            >
              {t.heroLine1}{" "}
              <span className="text-[rgb(42_74_120)]">{t.heroAccent}</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-[rgb(70_74_86)] [text-wrap:pretty] sm:text-lg">
              {t.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <AnalyzeCtaLink
                href="/analyze"
                className="home-hero-cta inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[rgb(42_74_120)] px-8 py-3.5 text-base font-bold text-white shadow-[0_14px_36px_-16px_rgb(42_74_120/0.45)] transition hover:bg-[rgb(34_60_100)] motion-safe:active:scale-[0.98] sm:w-auto sm:min-h-[56px] sm:text-lg"
              >
                {t.heroCtaPrimary}
                <span aria-hidden>→</span>
              </AnalyzeCtaLink>
              <Link
                href="/experts"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-[rgb(28_30_36/0.16)] bg-white px-6 py-3 text-sm font-semibold text-[rgb(28_30_36)] shadow-sm transition hover:bg-[rgb(246_245_241)] sm:w-auto sm:text-base"
              >
                {t.heroCtaSecondary}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-2 py-2 text-sm font-semibold text-[rgb(140_92_40)] underline-offset-4 hover:underline"
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
