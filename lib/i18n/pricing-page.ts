import type { AppLocale } from "./locale";

export type PricingCopy = {
  pageTitle: string;
  pageSubtitle: string;
  navPricing: string;
  freeTitle: string;
  freePrice: string;
  freeDesc: string;
  freeBullets: [string, string, string];
  premiumTitle: string;
  premiumPrice: string;
  premiumDesc: string;
  premiumBullets: [string, string, string];
  ctaUpgrade: string;
  ctaFree: string;
  badgePlaceholder: string;
  toastNotReady: string;
  deployHint: string;
  checkoutSuccess: string;
  checkoutCanceled: string;
  /** Large line beside the price — share / free month hook */
  premiumShareHeadline: string;
  /** Below the price row — how many people to refer */
  premiumReferralDetail: string;
  /** Next to Subscribe; toggles social share panel */
  ctaShare: string;
  premiumShareIntro: string;
  /** Short line prepended when sharing (tweet, WhatsApp, email body) */
  premiumShareBlurb: string;
  copySiteLink: string;
  siteLinkCopied: string;
  shareNative: string;
  shareFacebook: string;
  shareX: string;
  shareLinkedIn: string;
  shareWhatsApp: string;
  shareTelegram: string;
  shareReddit: string;
  shareInstagram: string;
  shareThreads: string;
  shareViber: string;
  shareEmail: string;
  shareSms: string;
  shareEmailSubject: string;
  /** Package modal intro */
  packageModalTitle: string;
  packageModalLead: string;
  /** Share-to-unlock gate */
  shareUnlockFreeTitle: string;
  shareUnlockFreeLead: string;
  shareUnlockFreeNeeded: string;
  shareUnlockPremiumTitle: string;
  shareUnlockPremiumLead: string;
  shareUnlockPremiumNeeded: string;
  shareUnlockProgress: string;
  shareUnlockRefresh: string;
  shareUnlockDone: string;
  shareUnlockClose: string;
  shareUnlockError: string;
};

const hy: PricingCopy = {
  pageTitle: "Վճարային պլաններ",
  pageSubtitle:
    "Ընտրեք ձեզ համար հարմար փաթեթը՝ անվճար Free-ից մինչև Premium։ Վճարումները մշակվում են Stripe-ի միջոցով՝ քարտի տվյալները երբեք չեն անցնում մեր սերվերներով։",
  navPricing: "Գներ",
  freeTitle: "Free",
  freePrice: "0",
  freeDesc: "Սկսելու համար",
  freeBullets: [
    "Անսահմանափակ անվճար վերլուծություն այս սարքում",
    "Մասնագետների ցանցում դիտում",
    "Գաղտնիության հիմնական շերտ",
  ],
  premiumTitle: "Premium",
  premiumPrice: "$4.99",
  premiumDesc: "ամսական",
  premiumBullets: [
    "Անսահմանափակ կամ ավելի շատ AI վերլուծություններ",
    "Խորը հաշվետվություններ (հետագա)",
    "Առաջնահերթ աջակցություն (հետագա)",
  ],
  ctaUpgrade: "Միանալ Premium",
  ctaFree: "Սկսել անվճար",
  badgePlaceholder: "Ապահով վճարում",
  toastNotReady:
    "Վճարումները հիմա հասանելի չեն։ Խնդրում ենք փորձել մի փոքր ուշ։",
  deployHint: "Վճարումները մշակվում են Stripe-ի միջոցով — քարտի տվյալները երբեք չեն անցնում մեր սերվերներով։",
  checkoutSuccess:
    "Շնորհակալություն։ Բաժանորդագրությունը հաստատվում է Stripe-ի միջոցով — էլ. փոստով կստանաք հաստատում։",
  checkoutCanceled: "Վճարումը չեղարկվեց։ Կարող եք կրկին փորձել ցանկացած ժամանակ։",
  premiumShareHeadline: "Կիսվեք — 1 ամիս Premium անվճար",
  premiumReferralDetail:
    "Premium բացելու համար գնեք բաժանորդագրությունը, կամ ձեր հղումով կայք այցելեն նվազագույն 20 հոգի։",
  ctaShare: "Կիսվել",
  premiumShareIntro:
    "Կիսվեք հղումով՝ WhatsApp, Viber, Telegram, Facebook, Instagram, Threads, X, LinkedIn, Reddit, էլ. փոստ, SMS։",
  premiumShareBlurb:
    "Կայացրո՛ւ լավ կյանքի որոշումներ րոպեների մեջ։ Համեմատի՛ր տարբերակները, տե՛ս արդյունքները, հստա՛ր որոշի՛ր. կառուցված վերլուծություն, ոչ պատահական chat։",
  copySiteLink: "Պատճենել կայքի հղումը",
  siteLinkCopied: "Հղումը պատճենվեց։",
  shareNative: "Կիսվել…",
  shareFacebook: "Facebook",
  shareX: "X",
  shareLinkedIn: "LinkedIn",
  shareWhatsApp: "WhatsApp",
  shareTelegram: "Telegram",
  shareReddit: "Reddit",
  shareInstagram: "Ինստագրամ",
  shareThreads: "Threads",
  shareViber: "Viber",
  shareEmail: "Էլ. փոստ",
  shareSms: "SMS",
  shareEmailSubject:
    "Կյանքի որոշումների AI — կայացրո՛ր լավ որոշումներ րոպեների մեջ",
  packageModalTitle: "Ընտրեք փաթեթը վերլուծությունից առաջ",
  packageModalLead:
    "Անվճար փաթեթը բաց է այս սարքում առանց կիսման։ Premium՝ գնեք կամ կիսվեք 20 հոգու հետ։",
  shareUnlockFreeTitle: "Կիսվեք 5 հոգու հետ՝ անվճար վերլուծության համար",
  shareUnlockFreeLead:
    "Ուղարկեք ձեր անձնական հղումը ընկերներին։ Երբ 5 տարբեր մարդ բացեն այն, անվճար վերլուծությունը կբացվի։",
  shareUnlockFreeNeeded: "Պետք է 5 եզակի այցելու ձեր հղումով։",
  shareUnlockPremiumTitle: "Կիսվեք 20 հոգու հետ՝ Premium բացելու համար",
  shareUnlockPremiumLead:
    "Ուղարկեք ձեր հղումը։ Երբ 20 տարբեր մարդ բացեն այն, Premium-ը կբացվի առանց վճարման։ Կամ գնեք փաթեթը։",
  shareUnlockPremiumNeeded: "Պետք է 20 եզակի այցելու ձեր հղումով։",
  shareUnlockProgress: "Այցելուներ՝ {count} / {needed}",
  shareUnlockRefresh: "Ստուգել առաջընթացը",
  shareUnlockDone: "Բացված է։ Կարող եք շարունակել վերլուծությունը։",
  shareUnlockClose: "Փակել",
  shareUnlockError: "Չհաջողվեց կապ հաստատել։ Փորձեք մի փոքր ուշ։",
};

const en: PricingCopy = {
  pageTitle: "Pricing",
  pageSubtitle:
    "Pick the plan that fits. Payments are processed by Stripe — card details never touch our servers, and you can cancel anytime from your receipt email.",
  navPricing: "Pricing",
  freeTitle: "Free",
  freePrice: "0",
  freeDesc: "Get started",
  freeBullets: [
    "Free analysis on this device — no sharing required",
    "Browse the expert network",
    "Core privacy messaging",
  ],
  premiumTitle: "Premium",
  premiumPrice: "$4.99",
  premiumDesc: "per month",
  premiumBullets: [
    "More / unlimited AI analyses",
    "Deeper reports (future)",
    "Priority support (future)",
  ],
  ctaUpgrade: "Subscribe with Stripe",
  ctaFree: "Continue free",
  badgePlaceholder: "Secure checkout",
  toastNotReady:
    "Payments are not available right now. Please try again later.",
  deployHint: "Payments are processed by Stripe — card details never touch our servers.",
  checkoutSuccess:
    "Thank you. Your subscription is confirmed via Stripe — check your email for the receipt.",
  checkoutCanceled: "Checkout was canceled. You can try again anytime.",
  premiumShareHeadline: "Share — 1 month of Premium free",
  premiumReferralDetail:
    "Unlock Premium by subscribing, or when at least 20 people visit through your link.",
  ctaShare: "Share",
  premiumShareIntro:
    "Share your link via WhatsApp, Viber, Telegram, Facebook, Instagram, Threads, X, LinkedIn, Reddit, email, or SMS.",
  premiumShareBlurb:
    "Stop overthinking. Decide in seconds. Get instant clarity on any decision using AI-powered scenarios—not random chat.",
  copySiteLink: "Copy site link",
  siteLinkCopied: "Link copied.",
  shareNative: "Share…",
  shareFacebook: "Facebook",
  shareX: "X",
  shareLinkedIn: "LinkedIn",
  shareWhatsApp: "WhatsApp",
  shareTelegram: "Telegram",
  shareReddit: "Reddit",
  shareInstagram: "Instagram",
  shareThreads: "Threads",
  shareViber: "Viber",
  shareEmail: "Email",
  shareSms: "SMS",
  shareEmailSubject:
    "Life Decision Engine — Stop overthinking. Decide in seconds.",
  packageModalTitle: "Choose a package before analysis",
  packageModalLead:
    "Free is open on this device with no sharing. Premium: subscribe or share with 20.",
  shareUnlockFreeTitle: "Share with 5 people to unlock free analysis",
  shareUnlockFreeLead:
    "Send your personal link to friends. When 5 different people open it, free analysis unlocks.",
  shareUnlockFreeNeeded: "Need 5 unique visitors through your link.",
  shareUnlockPremiumTitle: "Share with 20 people to unlock Premium",
  shareUnlockPremiumLead:
    "Send your link. When 20 different people open it, Premium unlocks without paying — or subscribe instead.",
  shareUnlockPremiumNeeded: "Need 20 unique visitors through your link.",
  shareUnlockProgress: "Visitors: {count} / {needed}",
  shareUnlockRefresh: "Check progress",
  shareUnlockDone: "Unlocked. You can continue to analysis.",
  shareUnlockClose: "Close",
  shareUnlockError: "Could not reach the server. Try again shortly.",
};

const navPricingByLocale: Partial<Record<AppLocale, string>> = {
  ru: "Цены",
  de: "Preise",
  fr: "Tarifs",
  es: "Precios",
  ar: "الأسعار",
  it: "Prezzi",
};

export function getPricingCopy(locale: AppLocale): PricingCopy {
  if (locale === "hy") return hy;
  if (locale === "en" || locale === "en-US") return en;
  const nav = navPricingByLocale[locale];
  if (nav) return { ...en, navPricing: nav };
  return en;
}
