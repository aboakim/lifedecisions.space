import type { AppLocale } from "./locale";

export type SolveBlockCopy = {
  label: string;
  problem: string;
  fix: string;
};

export type SolveSectionCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  blocks: [SolveBlockCopy, SolveBlockCopy, SolveBlockCopy];
};

const en: SolveSectionCopy = {
  eyebrow: "Reality, not theory",
  title: "What this engine is for",
  intro: "Three situations. Each card: the problem, then what you get.",
  blocks: [
    {
      label: "1 · The loop",
      problem: "Rumination at 2 a.m.—same list, no clear fork.",
      fix: "The analyzer names best / likely / worst paths with lenses and a score so the trade-offs sit still on the page.",
    },
    {
      label: "2 · Alone in the call",
      problem: "You need structure, and sometimes a real professional.",
      fix: "Multilingual interface plus a directory: psychology, law, money—so “who do I even ask?” has a next step.",
    },
    {
      label: "3 · Fading context",
      problem: "By Tuesday you have forgotten what felt obvious on Sunday.",
      fix: "A written report, timelines, and a short brief you can re-open—clarity you can return to, not a lost chat thread.",
    },
  ],
};

const hy: SolveSectionCopy = {
  eyebrow: "Իրականում, ոչ միայն մտքում",
  title: "Ինչի համար է այս «շարժիչը»",
  intro: "Երեք իրավիճակ։ Նախ խնդիրը, հետո՝ ինչ ես ստանում։",
  blocks: [
    {
      label: "1 · Պտտվող մտքեր",
      problem: "Գիշերային նույն ցուցակը, առանց հստակ ճանապարհորդի։",
      fix: "Վերլուծիչը տալիս է լավագույն/հավանական/վատ ուղի, չորս հարթակ և միավոր, որ համեմատությունները հանգիստ նստեն էջի վրա։",
    },
    {
      label: "2 · Մենակ որոշում",
      problem: "Պետք է կարգ, երբեմն էլ մասնագետ։",
      fix: "Բազմալեզու միջերես և ցանց․ հոգեբանություն, իրավունք, ֆինանս․ «ում դիմել»-ին կոնկրետ հաջորդ քայլ։",
    },
    {
      label: "3 · Մոռացվող հստակություն",
      problem: "Կիրակի ակնհայտը երեքշաբթի արդեն չէ։",
      fix: "Գրավոր հաշվետվություն, ժամանակացույց և 60 վայրկյան բրիֆ․ հստակություն, որ կարելի է կրկին բացել, ոչ թե կորած chat։",
    },
  ],
};

const ru: SolveSectionCopy = {
  eyebrow: "Практика, не абстракция",
  title: "Какой задачей это решает",
  intro:
    "Три типичных ситуации. В каждой сначала боль, затем — какой опыт вы получаете здесь.",
  blocks: [
    {
      label: "1 · Круги в голове",
      problem: "Ночью одни и те же мысли, а развилка не поймать.",
      fix: "Анализ строит лучший / вероятный / худший пути, четыре оси и оценка — варианты остаются на экране рядом.",
    },
    {
      label: "2 · Спросить не у кого",
      problem: "Нужен порядок, а иногда и живой специалист.",
      fix: "Многоязычный интерфейс и каталог: психология, право, финансы — и есть, к чему дальше пойти.",
    },
    {
      label: "3 · Смысл ускользает",
      problem: "Ко вторнику уже не помните, что казалось ясным в выходной.",
      fix: "Письменный отчёт, сроки и краткое досье, к которому можно вернуться — не утонувшая в ленте переписка.",
    },
  ],
};

const de: SolveSectionCopy = {
  eyebrow: "Jenseits des Grübelns",
  title: "Wofür diese Engine da ist",
  intro:
    "Drei Stellen, an denen Menschen landen. Zuerst das Problem, dann die Art der Hilfe in diesem Arbeitsraum.",
  blocks: [
    {
      label: "1 · Die Schleife",
      problem: "Dieselben Gedanken, kein echter Richtungswechsel.",
      fix: "Der Analyzer bündelt beste / wahrscheinliche / schlechteste Pfade mit Linsen und Score — alles sichtbar auf einer Seite.",
    },
    {
      label: "2 · Allein mit der Frage",
      problem: "Struktur fehlt, manchmal auch ein echter Pro.",
      fix: "Mehrsprachige Oberfläche und ein Verzeichnis: Psychologie, Recht, Finanzen — ein nächster Schritt, nicht nur Suche im Leeren.",
    },
    {
      label: "3 · Klarheit zerfällt",
      problem: "Was am Wochenende klar wirkte, zerfällt bis Dienstag.",
      fix: "Schriftlicher Report, Zeitleisten, kurze Briefing-Felder — Wiederentdeckbarkeit statt verlorener Chat-Fäden.",
    },
  ],
};

const fr: SolveSectionCopy = {
  eyebrow: "Moins de brouillard",
  title: "À quoi sert l’outil",
  intro:
    "Trois situations fréquentes. D’abord la difficulté, puis le type d’aide ici.",
  blocks: [
    {
      label: "1 · La boucle",
      problem: "Même liste qui tourne, pas de vraie bifurcation visible.",
      fix: "L’analyseur explicite meilleur / probable / pire, lentilles, score : les arbitrages restent visibles sur la page.",
    },
    {
      label: "2 · Sans interlocuteur",
      problem: "Il faut du cadre, parfois un vrai pro.",
      fix: "Interface multilingue + annuaire (psy, droit, finance) : une suite concrète après « vers qui se tourner ? ».",
    },
    {
      label: "3 · L’oubli du week-end",
      problem: "Mardi, ce qui semblait clair dimanche s’est estompé.",
      fix: "Rapport écrit, échéances, brief retraçable — de la clarté à rouvrir, pas un fil de messages perdu.",
    },
  ],
};

const es: SolveSectionCopy = {
  eyebrow: "Menos ruido interior",
  title: "Para qué está este motor",
  intro:
    "Tres escenarios reales. Primero el bloqueo, luego el tipo de ayuda aquí.",
  blocks: [
    {
      label: "1 · El bucle",
      problem: "Misma vuelta mental, poca horquilla clara.",
      fix: "El analizador nombra mejor / probable / peor, lentes y puntuación: lo importante queda fijo en la pantalla.",
    },
    {
      label: "2 · Solo con la duda",
      problem: "Hace falta orden; a veces, alguien de verdad.",
      fix: "Interfaz multilingüe y directorio: psicología, legal, finanzas; un paso tras « ¿a quién pregunto? ».",
    },
    {
      label: "3 · Se diluye en la semana",
      problem: "Lo obvio el domingo se vuelve borroso el martes.",
      fix: "Informe escrito, plazos, brief — claridad a la que volver, no un chat enterrado.",
    },
  ],
};

const it: SolveSectionCopy = {
  eyebrow: "Meno vortice, più luce",
  title: "A cosa serve questo motore",
  intro:
    "Tre casi concreti. Prima il nodo, poi il genere d’aiuto in questo spazio di lavoro.",
  blocks: [
    {
      label: "1 · Il giro",
      problem: "Stessi pensieri, nessuna biforcazione ferma.",
      fix: "L’analizzatore mostra percorso buono / probabile / peggiore, lenti, punteggio — le scelte stanno ferme sulla pagina.",
    },
    {
      label: "2 · Soli con la scelta",
      problem: "Serve struttura; a volte un professionista vero.",
      fix: "Interfaccia multilingue e repertorio: psicologia, diritto, finanza — un passo dopo “chi chiedo”.",
    },
    {
      label: "3 · Memoria che sfuma",
      problem: "Martedì non ricordi la chiarezza di domenica.",
      fix: "Report scritto, timeline, promemoria apribili — non un filo di chat smarrito.",
    },
  ],
};

const ar: SolveSectionCopy = {
  eyebrow: "نزيل الضباب قليلاً",
  title: "ما الذي تفعله الأداة",
  intro:
    "ثلاثة مواقف شائعة. نبدأ بالألم ثم بما يليه من مساعدة داخل المساحة نفسها.",
  blocks: [
    {
      label: "1 · حلقة التفكير",
      problem: "نفس المشقة، دون مفترق واضح.",
      fix: "يقدّم المُحلّل الأفضل / الأرجح / الأسوأ، مع محاور وتقييم، كي تبقى المقارنات أمامك.",
    },
    {
      label: "2 · وحيدًا في القرار",
      problem: "تحتاج ترتيبًا، وأحيانًا مختصًا حقًا.",
      fix: "واجهة بعدة لغات ودليل خبراء: نفس، قانون، مال—خطوة بعد سؤال «لمن ألجأ؟».",
    },
    {
      label: "3 · زوال الصفاء",
      problem: "ما بدا بيّنًا في الأسبوع يندثر قبل منتصفه.",
      fix: "تقرير مكتوب، وخطوط زمنية، ونصوص تُرجع إليها—ليس سرد دردشة مفقود.",
    },
  ],
};

const byLocale: Partial<Record<AppLocale, SolveSectionCopy>> = {
  en,
  "en-US": en,
  hy,
  ru,
  de,
  fr,
  es,
  it,
  ar,
};

export function getSolveSectionCopy(locale: AppLocale): SolveSectionCopy {
  return byLocale[locale] ?? en;
}
