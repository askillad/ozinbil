import type { Locale } from "@/i18n/routing";

/**
 * Question bank. In the MVP it lives in code; the shape mirrors the DB tables
 * (Question + QuestionTranslation + QuestionOption), so moving it to
 * PostgreSQL later is a mechanical change.
 */

export type Category = "school" | "student" | "adult";
export const categories: Category[] = ["school", "student", "adult"];

export type L10n = Record<Locale, string>;

/** Dimensions the answers feed into — the AI receives them as hints. */
export type Dimension =
  | "analytical" | "creative" | "social" | "technical" | "entrepreneurial"
  | "organizational" | "research" | "practical" | "values" | "context";

interface Base {
  id: string;
  dimension: Dimension;
  title: L10n;
  hint?: L10n;
  /** If omitted, the question is shown to every category. */
  categories?: Category[];
}

export interface ScaleQuestion extends Base { type: "scale"; }
export interface CardsQuestion extends Base {
  type: "cards";
  maxSelect: number;
  options: { id: string; icon: string; label: L10n }[];
}
export interface TextQuestion extends Base { type: "text"; optional?: boolean; }

export type Question = ScaleQuestion | CardsQuestion | TextQuestion;

/** 1–5 for scale, option ids for cards, free text for text. */
export type AnswerValue = number | string[] | string;
export type Answers = Record<string, AnswerValue>;

const q = <T extends Question>(x: T) => x;

export const questionBank: Question[] = [
  // ── Context: different for each category ────────────────────────────
  q({
    id: "school_subjects", type: "cards", dimension: "context", maxSelect: 3,
    categories: ["school"],
    title: {
      ru: "Какие предметы даются вам легче всего?",
      kk: "Қай пәндер сізге оңай беріледі?",
      en: "Which school subjects come easiest to you?",
    },
    options: [
      { id: "math", icon: "📐", label: { ru: "Математика", kk: "Математика", en: "Math" } },
      { id: "physics", icon: "⚛️", label: { ru: "Физика", kk: "Физика", en: "Physics" } },
      { id: "chem_bio", icon: "🧬", label: { ru: "Химия / Биология", kk: "Химия / Биология", en: "Chemistry / Biology" } },
      { id: "informatics", icon: "💻", label: { ru: "Информатика", kk: "Информатика", en: "Computer science" } },
      { id: "languages", icon: "🗣️", label: { ru: "Языки и литература", kk: "Тілдер мен әдебиет", en: "Languages & literature" } },
      { id: "history_geo", icon: "🌍", label: { ru: "История / География", kk: "Тарих / География", en: "History / Geography" } },
      { id: "arts", icon: "🎨", label: { ru: "Искусство / Музыка", kk: "Өнер / Музыка", en: "Art / Music" } },
      { id: "sport", icon: "⚽", label: { ru: "Физкультура", kk: "Дене шынықтыру", en: "Physical education" } },
    ],
  }),
  q({
    id: "student_major", type: "text", dimension: "context",
    categories: ["student"],
    title: {
      ru: "На какой специальности и каком курсе вы учитесь? Нравится ли она вам?",
      kk: "Қай мамандықта, нешінші курста оқисыз? Ол сізге ұнай ма?",
      en: "What is your major and year? Do you enjoy it?",
    },
  }),
  q({
    id: "adult_experience", type: "text", dimension: "context",
    categories: ["adult"],
    title: {
      ru: "Опишите ваш опыт: кем и сколько лет вы работали?",
      kk: "Тәжірибеңізді сипаттаңыз: кім болып, неше жыл жұмыс істедіңіз?",
      en: "Describe your experience: what have you worked as, and for how long?",
    },
  }),
  q({
    id: "adult_reason", type: "cards", dimension: "values", maxSelect: 2,
    categories: ["adult"],
    title: {
      ru: "Почему вы хотите сменить профессию?",
      kk: "Неліктен кәсібіңізді ауыстырғыңыз келеді?",
      en: "Why do you want to change careers?",
    },
    options: [
      { id: "money", icon: "💰", label: { ru: "Доход", kk: "Табыс", en: "Income" } },
      { id: "meaning", icon: "✨", label: { ru: "Смысл", kk: "Мән-мағына", en: "Meaning" } },
      { id: "burnout", icon: "🔥", label: { ru: "Выгорание", kk: "Күйіп кету", en: "Burnout" } },
      { id: "growth", icon: "📈", label: { ru: "Нет роста", kk: "Өсу жоқ", en: "No growth" } },
      { id: "remote", icon: "🏠", label: { ru: "Свобода / удалёнка", kk: "Еркіндік / қашықтан", en: "Freedom / remote" } },
      { id: "market", icon: "🤖", label: { ru: "Профессия устаревает", kk: "Кәсіп ескіруде", en: "My field is shrinking" } },
    ],
  }),

  // ── Inclinations (Likert 1–5) ───────────────────────────────────────
  q({
    id: "analytical_1", type: "scale", dimension: "analytical",
    title: {
      ru: "Мне нравится разбираться в сложных задачах и находить закономерности",
      kk: "Маған күрделі есептерді талдап, заңдылықтарды табу ұнайды",
      en: "I enjoy untangling complex problems and spotting patterns",
    },
  }),
  q({
    id: "creative_1", type: "scale", dimension: "creative",
    title: {
      ru: "Я часто придумываю новые идеи и необычные решения",
      kk: "Мен жиі жаңа идеялар мен ерекше шешімдер ойлап табамын",
      en: "I often come up with new ideas and unusual solutions",
    },
  }),
  q({
    id: "social_1", type: "scale", dimension: "social",
    title: {
      ru: "Я заряжаюсь энергией, когда помогаю людям или объясняю им что-то",
      kk: "Адамдарға көмектескенде немесе бір нәрсені түсіндіргенде қуат аламын",
      en: "Helping people or explaining things to them energizes me",
    },
  }),
  q({
    id: "technical_1", type: "scale", dimension: "technical",
    title: {
      ru: "Мне интересно, как устроены технологии, приборы и программы",
      kk: "Технологиялар, құрылғылар мен бағдарламалардың қалай жұмыс істейтіні маған қызық",
      en: "I'm curious how technology, devices and software work",
    },
  }),
  q({
    id: "entrepreneurial_1", type: "scale", dimension: "entrepreneurial",
    title: {
      ru: "Я люблю брать ответственность, убеждать и вести за собой",
      kk: "Жауапкершілікті алу, сендіру және басқаларды бастау маған ұнайды",
      en: "I like taking charge, persuading others and leading",
    },
  }),
  q({
    id: "organizational_1", type: "scale", dimension: "organizational",
    title: {
      ru: "Мне комфортно, когда всё структурировано: планы, таблицы, процессы",
      kk: "Бәрі құрылымдалған кезде маған ыңғайлы: жоспарлар, кестелер, процестер",
      en: "I feel comfortable when things are structured: plans, tables, processes",
    },
  }),
  q({
    id: "research_1", type: "scale", dimension: "research",
    title: {
      ru: "Я могу часами изучать одну тему, пока не пойму её до конца",
      kk: "Бір тақырыпты толық түсінгенше сағаттап зерттей аламын",
      en: "I can study one topic for hours until I fully understand it",
    },
  }),
  q({
    id: "practical_1", type: "scale", dimension: "practical",
    title: {
      ru: "Мне важно видеть осязаемый результат своей работы — руками",
      kk: "Жұмысымның нақты, қолмен жасалған нәтижесін көру маған маңызды",
      en: "I need to see a tangible, hands-on result of my work",
    },
  }),

  // ── Activities & values (cards) ─────────────────────────────────────
  q({
    id: "activities", type: "cards", dimension: "practical", maxSelect: 3,
    title: {
      ru: "Чем бы вы занимались весь день с удовольствием?",
      kk: "Күні бойы немен айналысқыңыз келер еді?",
      en: "What could you happily do all day?",
    },
    options: [
      { id: "code", icon: "⌨️", label: { ru: "Писать код", kk: "Код жазу", en: "Writing code" } },
      { id: "design", icon: "🎨", label: { ru: "Создавать дизайн", kk: "Дизайн жасау", en: "Designing" } },
      { id: "data", icon: "📊", label: { ru: "Анализировать данные", kk: "Деректерді талдау", en: "Analyzing data" } },
      { id: "people", icon: "🤝", label: { ru: "Общаться с людьми", kk: "Адамдармен сөйлесу", en: "Talking to people" } },
      { id: "write", icon: "✍️", label: { ru: "Писать тексты", kk: "Мәтін жазу", en: "Writing" } },
      { id: "build", icon: "🔧", label: { ru: "Мастерить и чинить", kk: "Жасау және жөндеу", en: "Building & fixing" } },
      { id: "teach", icon: "🎓", label: { ru: "Учить других", kk: "Басқаларды оқыту", en: "Teaching" } },
      { id: "heal", icon: "🩺", label: { ru: "Заботиться о здоровье", kk: "Денсаулыққа қамқорлық", en: "Caring for health" } },
      { id: "sell", icon: "🚀", label: { ru: "Продавать и запускать", kk: "Сату және іске қосу", en: "Selling & launching" } },
    ],
  }),
  q({
    id: "values", type: "cards", dimension: "values", maxSelect: 2,
    title: {
      ru: "Что для вас важнее всего в работе?",
      kk: "Жұмыста сіз үшін ең маңыздысы не?",
      en: "What matters most to you at work?",
    },
    options: [
      { id: "income", icon: "💎", label: { ru: "Высокий доход", kk: "Жоғары табыс", en: "High income" } },
      { id: "impact", icon: "🌱", label: { ru: "Польза обществу", kk: "Қоғамға пайда", en: "Social impact" } },
      { id: "stability", icon: "🛡️", label: { ru: "Стабильность", kk: "Тұрақтылық", en: "Stability" } },
      { id: "freedom", icon: "🕊️", label: { ru: "Свобода и гибкость", kk: "Еркіндік пен икемділік", en: "Freedom & flexibility" } },
      { id: "prestige", icon: "🏆", label: { ru: "Признание", kk: "Мойындау", en: "Recognition" } },
      { id: "creativity", icon: "💡", label: { ru: "Творчество", kk: "Шығармашылық", en: "Creativity" } },
    ],
  }),

  // ── Open question ───────────────────────────────────────────────────
  q({
    id: "dream", type: "text", dimension: "values", optional: true,
    title: {
      ru: "Опишите ваш идеальный рабочий день через 5 лет",
      kk: "5 жылдан кейінгі мінсіз жұмыс күніңізді сипаттаңыз",
      en: "Describe your ideal workday five years from now",
    },
    hint: {
      ru: "Где вы, с кем, что делаете? Чем подробнее — тем точнее анализ.",
      kk: "Қайдасыз, кіммен, не істейсіз? Неғұрлым толық болса, талдау соғұрлым дәл.",
      en: "Where are you, with whom, doing what? More detail means a sharper analysis.",
    },
  }),
];

export function getQuestions(category: Category): Question[] {
  return questionBank.filter((x) => !x.categories || x.categories.includes(category));
}

export function isAnswered(question: Question, value: AnswerValue | undefined): boolean {
  if (question.type === "text") return question.optional || (typeof value === "string" && value.trim().length >= 3);
  if (question.type === "cards") return Array.isArray(value) && value.length > 0;
  return typeof value === "number";
}
