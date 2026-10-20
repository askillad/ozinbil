import * as z from "zod/v4";

/**
 * Contract between the AI and the UI. The same schema is used:
 *  1) as the JSON Schema for Claude's structured output (guaranteed valid JSON),
 *  2) as TypeScript types for the report components.
 * Numeric ranges are described in text (not min/max) and clamped in code,
 * because structured outputs don't enforce numeric bounds.
 */

const scored = z.object({
  name: z.string(),
  score: z.number().describe("0–100"),
});

export const careerReportSchema = z.object({
  archetype: z.string().describe("Short catchy name of the person's profile, 2–4 words"),
  summary: z.string().describe("3–4 sentences, addressing the user as 'you'"),
  traits: z.array(scored).describe("Exactly 6 inclination dimensions with scores 0–100"),
  matches: z
    .array(
      z.object({
        title: z.string(),
        matchScore: z.number().describe("Integer 0–100"),
        why: z.string().describe("1–2 sentences tying it to concrete answers"),
        demand: z.enum(["high", "medium", "low"]),
        salaryRange: z.string().describe("Typical salary range in the user's region, e.g. '400 000 – 900 000 ₸'"),
      }),
    )
    .describe("4–5 careers sorted by matchScore descending"),
  strengths: z.array(z.object({ title: z.string(), description: z.string() })).describe("3–4 items"),
  growthAreas: z
    .array(z.object({ title: z.string(), description: z.string(), tip: z.string() }))
    .describe("2–3 items, constructive tone"),
  skills: z.object({
    hard: z.array(z.object({ name: z.string(), current: z.number(), target: z.number() })).describe("4–6 hard skills for the top career, levels 0–100"),
    soft: z.array(z.object({ name: z.string(), current: z.number(), target: z.number() })).describe("3–5 soft skills, levels 0–100"),
  }),
  categoryAdvice: z.object({
    title: z.string(),
    items: z.array(z.string()),
  }).describe("School: exam (ENT/UNT) subject combos and universities. Student: internships and specialization. Adult: transferable skills and switch strategy"),
  mediaTwins: z
    .array(
      z.object({
        name: z.string().describe("Character or person, e.g. 'Тони Старк', 'L (Death Note)', 'Стив Джобс'"),
        source: z.string().describe("Where they come from, e.g. 'Аниме: Death Note' or 'История / Предпринимательство'"),
        source_type: z
          .enum(["movie", "series", "anime", "manga", "game", "book", "history", "modern"])
          .describe("Used for the icon. 'history' = historical figure, 'modern' = living or recent public figure"),
        similarity_reason: z.string().describe("2–3 sentences: why the user resembles them — thinking style, strengths, problem-solving approach"),
        key_trait: z.string().describe("The main shared trait, 2–3 words, e.g. 'Стратегический аналитик'"),
      }),
    )
    .describe("1–2 media twins; the first one is the closest match"),
  roadmap: z
    .array(
      z.object({
        title: z.string(),
        duration: z.string(),
        actions: z.array(z.string()).describe("2–4 concrete actions"),
        resources: z.array(z.string()).describe("1–3 real courses, books, platforms or programs"),
      }),
    )
    .describe("4–6 sequential stages for the top career, from first step to first job"),
});

export type CareerReport = z.infer<typeof careerReportSchema>;

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Post-process: enforce numeric bounds and ordering the model was asked for. */
export function normalizeReport(r: CareerReport): CareerReport {
  return {
    ...r,
    traits: r.traits.map((t) => ({ ...t, score: clamp(t.score) })),
    mediaTwins: r.mediaTwins.slice(0, 2),
    matches: r.matches
      .map((m) => ({ ...m, matchScore: clamp(m.matchScore) }))
      .sort((a, b) => b.matchScore - a.matchScore),
    skills: {
      hard: r.skills.hard.map((s) => ({ ...s, current: clamp(s.current), target: clamp(s.target) })),
      soft: r.skills.soft.map((s) => ({ ...s, current: clamp(s.current), target: clamp(s.target) })),
    },
  };
}
