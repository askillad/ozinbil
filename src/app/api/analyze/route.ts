import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import * as z from "zod/v4";
import { locales } from "@/i18n/routing";
import { categories } from "@/lib/questions";
import { generateCareerReport, RefusalError } from "@/lib/ai/client";
import { mockReport } from "@/lib/ai/mock";
import { saveResult } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 120; // seconds — AI analysis with reasoning can take a while

const requestSchema = z.object({
  locale: z.enum(locales),
  category: z.enum(categories),
  answers: z.record(
    z.string().max(64),
    z.union([z.number().int().min(1).max(5), z.array(z.string().max(64)).max(10), z.string().max(2000)]),
  ),
});

export async function POST(req: Request) {
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", details: z.treeifyError(parsed.error) }, { status: 400 });
  }
  const { locale, category, answers } = parsed.data;

  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise((r) => setTimeout(r, 1500)); // let the loading animation play
    return NextResponse.json({ report: mockReport, demo: true });
  }

  try {
    const report = await generateCareerReport(locale, category, answers);
    const id = await saveResult({ locale, category, answers, report });
    return NextResponse.json({ report, id });
  } catch (err) {
    if (err instanceof RefusalError) {
      return NextResponse.json({ error: "refused" }, { status: 422 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error", err.status, err.message);
      return NextResponse.json({ error: "ai_unavailable" }, { status: 502 });
    }
    console.error(err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
