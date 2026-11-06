import type { AppLocale } from "./locale";

export type ExpertsRecruitCopy = {
  eyebrow: string;
  title: string;
  body: string;
  ctaRegister: string;
  ctaShare: string;
  shareCopied: string;
  shareBlurb: string;
};

const hy: ExpertsRecruitCopy = {
  eyebrow: "Մասնագետների համար",
  title: "Նոր ավարտա՞ծ ես, թե՞ արդեն փորձառու — այստեղ քեզ կգտնեն",
  body: "Գրանցվիր՝ հոգեբան, իրավաբան, ֆինանսիստ կամ կոուչ։ Մարդիկ կգտնեն քեզ և կկապվեն։",
  ctaRegister: "Գրանցվել որպես էքսպերտ",
  ctaShare: "Կիսվել ընկերներիդ հետ",
  shareCopied: "Հղումը պատճենվեց — ուղարկիր ընկերներիդ։",
  shareBlurb:
    "Գրանցվիր որպես էքսպերտ Life Decision Engine-ում — մարդիկ քեզ կգտնեն և կկապվեն։",
};

const en: ExpertsRecruitCopy = {
  eyebrow: "For professionals",
  title: "New graduate or seasoned expert — this is where people find you",
  body: "Register as a psychologist, lawyer, planner, or coach. People find you and get in touch.",
  ctaRegister: "Register as an expert",
  ctaShare: "Share with friends",
  shareCopied: "Link copied — send it to your friends.",
  shareBlurb:
    "Join as an expert on Life Decision Engine — people can find you and get in touch.",
};

const ru: ExpertsRecruitCopy = {
  eyebrow: "Для специалистов",
  title: "Только закончили или уже с опытом — здесь вас найдут",
  body: "Площадка, где люди ищут психологов, юристов, финансистов и коучей. Зарегистрируйтесь, чтобы с вами связывались, и поделитесь с друзьями — так о вас узнает больше людей.",
  ctaRegister: "Зарегистрироваться как эксперт",
  ctaShare: "Поделиться с друзьями",
  shareCopied: "Ссылка скопирована — отправьте друзьям.",
  shareBlurb:
    "Зарегистрируйтесь как эксперт на Life Decision Engine — вас смогут найти и написать.",
};

const table: Partial<Record<AppLocale, ExpertsRecruitCopy>> = {
  ru,
  de: {
    ...en,
    eyebrow: "Für Fachleute",
    title: "Frisch abgeschlossen oder erfahren — hier finden Sie Klienten",
    body: "Menschen suchen hier Psychologen, Anwälte, Berater und Coaches. Registrieren Sie sich, damit man Sie kontaktieren kann, und teilen Sie den Link mit Freunden.",
    ctaRegister: "Als Expert:in registrieren",
    ctaShare: "Mit Freunden teilen",
    shareCopied: "Link kopiert — an Freunde senden.",
  },
  fr: {
    ...en,
    eyebrow: "Pour les pros",
    title: "Jeune diplômé ou expert confirmé — on vous trouve ici",
    body: "Les gens cherchent psychologues, avocats, coachs. Inscrivez-vous pour être contacté, puis partagez avec vos amis.",
    ctaRegister: "S’inscrire comme expert",
    ctaShare: "Partager avec des amis",
    shareCopied: "Lien copié — envoyez-le à vos amis.",
  },
  es: {
    ...en,
    eyebrow: "Para profesionales",
    title: "Recién graduado o con experiencia — aquí te encuentran",
    body: "La gente busca psicólogos, abogados y coaches. Regístrate para que te contacten y comparte con amigos.",
    ctaRegister: "Registrarse como experto",
    ctaShare: "Compartir con amigos",
    shareCopied: "Enlace copiado — envíalo a tus amigos.",
  },
  it: {
    ...en,
    eyebrow: "Per professionisti",
    title: "Neolaureato o esperto — qui ti trovano i clienti",
    body: "Le persone cercano psicologi, avvocati e coach. Registrati per essere contattato e condividi con gli amici.",
    ctaRegister: "Registrati come esperto",
    ctaShare: "Condividi con gli amici",
    shareCopied: "Link copiato — invialo agli amici.",
  },
  ar: {
    ...en,
    eyebrow: "للمحترفين",
    title: "خريج جديد أو خبير متمرس — هنا يجدك الناس",
    body: "منصة يبحث فيها الناس عن أخصائيين. سجّل ليتواصلوا معك وشارك الرابط مع أصدقائك.",
    ctaRegister: "سجّل كخبير",
    ctaShare: "شارك مع الأصدقاء",
    shareCopied: "تم نسخ الرابط — أرسله لأصدقائك.",
  },
};

export function getExpertsRecruitCopy(locale: AppLocale): ExpertsRecruitCopy {
  if (locale === "hy") return hy;
  if (locale === "en" || locale === "en-US") return en;
  return table[locale] ?? en;
}
