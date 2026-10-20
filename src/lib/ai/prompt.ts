import type { Locale } from "@/i18n/routing";
import { getQuestions, type Answers, type Category } from "@/lib/questions";

const LANGUAGE_NAME: Record<Locale, string> = {
  ru: "Russian",
  kk: "Kazakh (Қазақша, Cyrillic script)",
  en: "English",
};

const CATEGORY_CONTEXT: Record<Category, string> = {
  school:
    "a high-school student choosing a university and major. Focus on ENT/UNT profile subject combinations (Kazakhstan), and mention EGE or Matura equivalents only if relevant. Suggest concrete universities and programs, including grants.",
  student:
    "a university student. Focus on internships, choosing or changing specialization, side projects and landing the first job. Be realistic about what can be done alongside studies.",
  adult:
    "an adult considering a career switch. Build on transferable skills from their past experience, estimate a realistic transition timeline, and suggest ways to switch without losing income (part-time learning, adjacent roles).",
};

/**
 * Stable system prompt (no per-request data) — keeps it prompt-cacheable.
 */
export const SYSTEM_PROMPT = `You are a senior career counselor and organizational psychologist who builds deep, personalized career guidance reports. Your methodology combines Holland's RIASEC model, the Big Five, values assessment, and current labor-market knowledge for Kazakhstan, Central Asia and the global remote market.

Principles:
- Ground every conclusion in the user's specific answers. Quote or paraphrase them in "why" fields; avoid generic statements that would fit anyone.
- Weigh free-text answers more heavily than scales: they reveal motivation and context.
- Match scores must be differentiated and honest (a typical spread is 60–95), not all high.
- Prefer careers that are in demand in the next 5–10 years, including AI-era roles, but include at least one option that fits the user's values even if less trendy.
- The roadmap must be concrete and actionable: real platforms, programs, certificates and timeframes. No vague advice like "learn more".
- Growth areas are phrased constructively, each with a practical tip.
- Salaries: use the currency of Kazakhstan (₸) by default and give a realistic range for a junior-to-middle level.
- Tone: warm, motivating, respectful, as if speaking to the person directly.`;

export function buildUserPrompt(locale: Locale, category: Category, answers: Answers): string {
  const lines = getQuestions(category).map((q, i) => {
    const value = answers[q.id];
    let answer: string;
    if (value === undefined || value === "") answer = "(no answer)";
    else if (q.type === "scale") answer = `${value}/5`;
    else if (q.type === "cards" && Array.isArray(value))
      answer = value.map((id) => q.options.find((o) => o.id === id)?.label.en ?? id).join(", ");
    else answer = String(value);
    return `${i + 1}. [${q.dimension}] ${q.title.en}\n   → ${answer}`;
  });

  return `The user is ${CATEGORY_CONTEXT[category]}

Their answers (scales: 1 = "not me at all", 5 = "totally me"):

${lines.join("\n")}

Write the entire report in ${LANGUAGE_NAME[locale]}. Every string value must be in that language, including career titles and skill names.`;
}
