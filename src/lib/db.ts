import { PrismaClient, type Prisma } from "@prisma/client";
import type { Locale } from "@/i18n/routing";
import type { Answers, Category } from "@/lib/questions";
import type { CareerReport } from "@/lib/ai/schema";
import { MODEL } from "@/lib/ai/client";

// Single instance across hot reloads in dev
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Persists an attempt + report. The MVP works without a database:
 * if DATABASE_URL is not set, nothing is saved and null is returned.
 * Answers are stored by question slug inside the Result JSON for now;
 * once questions are seeded into the DB, write Answer rows instead.
 */
export async function saveResult(input: {
  locale: Locale;
  category: Category;
  answers: Answers;
  report: CareerReport;
}): Promise<string | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const attempt = await prisma.attempt.create({
      data: {
        locale: input.locale,
        category: input.category,
        status: "completed",
        completedAt: new Date(),
        result: {
          create: {
            model: MODEL,
            archetype: input.report.archetype,
            report: { ...input.report, answers: input.answers } as unknown as Prisma.InputJsonValue,
            matches: {
              create: input.report.matches.map((m, rank) => ({ title: m.title, matchScore: m.matchScore, rank })),
            },
          },
        },
      },
      include: { result: true },
    });
    return attempt.result?.id ?? null;
  } catch (e) {
    console.error("Failed to save result", e);
    return null; // never fail the user's report because of the DB
  }
}
