import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { careerReportSchema, normalizeReport, type CareerReport } from "./schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import type { Locale } from "@/i18n/routing";
import type { Answers, Category } from "@/lib/questions";

// Reads ANTHROPIC_API_KEY from the environment. Server-only — never import in client components.
const anthropic = new Anthropic();

export const MODEL = "claude-opus-5-5";

export class RefusalError extends Error {}

export async function generateCareerReport(
  locale: Locale,
  category: Category,
  answers: Answers,
): Promise<CareerReport> {
  const response = await anthropic.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(locale, category, answers) }],
    thinking: { type: "adaptive" },
    output_config: {
      // "medium" balances depth and latency (~20–40 s). Raise to "high" for even deeper reports.
      effort: "medium",
      format: betaZodOutputFormat(careerReportSchema),
    },
    // If a safety classifier declines (rare false positives), the API retries on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  if (response.stop_reason === "refusal") throw new RefusalError("Model declined the request");
  if (!response.parsed_output) throw new Error(`Unparseable output (stop_reason: ${response.stop_reason})`);

  return normalizeReport(response.parsed_output);
}
