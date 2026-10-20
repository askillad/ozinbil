"use client";

import { useTranslations } from "next-intl";
import { m, type Variants } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { useQuiz } from "@/store/quiz";
import { useHydrated } from "@/store/useHydrated";
import type { CareerReport } from "@/lib/ai/schema";

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** Section that fades in when scrolled into view (once). */
function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <m.section variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-12">
      {title && <h2 className="mb-5 text-xl font-bold tracking-tight">{title}</h2>}
      {children}
    </m.section>
  );
}

function Bar({ value, ghost, delay = 0 }: { value: number; ghost?: number; delay?: number }) {
  return (
    <div className="relative h-2 overflow-hidden rounded-full bg-surface-2">
      {ghost !== undefined && (
        <div className="absolute inset-y-0 left-0 rounded-full bg-accent/20" style={{ width: `${ghost}%` }} />
      )}
      <m.div
        className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: value / 100 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-surface-2" />
        <m.circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
          stroke="url(#ring)" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - score / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="ring" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold">{score}%</span>
    </div>
  );
}

const DEMAND_STYLE = { high: "bg-good/15 text-good", medium: "bg-warn/15 text-warn", low: "bg-surface-2 text-muted" };

export function Report() {
  const t = useTranslations("result");
  const hydrated = useHydrated();
  const router = useRouter();
  const { report, demo, category, reset, start } = useQuiz();

  if (!hydrated) return <div className="h-96" />;
  if (!report) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted">{t("empty")}</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">{t("toTest")}</Link>
      </div>
    );
  }

  const retake = () => {
    const c = category;
    reset();
    if (c) start(c);
    router.push(c ? "/test" : "/");
  };

  return <ReportBody report={report} demo={demo} onRetake={retake} />;
}

function ReportBody({ report, demo, onRetake }: { report: CareerReport; demo: boolean; onRetake: () => void }) {
  const t = useTranslations("result");
  const top = report.matches[0];

  return (
    <div className="mx-auto max-w-3xl pt-6">
      {demo && <div className="mb-6 rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm">{t("demo")}</div>}

      {/* Hero */}
      <m.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted">{t("title")}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl"><span className="text-gradient">{report.archetype}</span></h1>
        <p className="mt-4 leading-relaxed text-muted">{report.summary}</p>
        <div className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {report.traits.map((tr, i) => (
            <div key={tr.name}>
              <div className="mb-1 flex justify-between text-sm"><span>{tr.name}</span><span className="text-muted">{tr.score}</span></div>
              <Bar value={tr.score} delay={i * 0.05} />
            </div>
          ))}
        </div>
      </m.div>

      {/* Match scores */}
      <Section title={t("matches")}>
        <div className="grid gap-3">
          {report.matches.map((mt, i) => (
            <m.div
              key={mt.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`flex gap-4 rounded-2xl border bg-surface p-4 ${i === 0 ? "border-accent" : "border-border"}`}
            >
              <ScoreRing score={mt.matchScore} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{mt.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${DEMAND_STYLE[mt.demand]}`}>{mt.demand}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{mt.why}</p>
                <p className="mt-1 text-xs font-medium">{mt.salaryRange}</p>
              </div>
            </m.div>
          ))}
        </div>
      </Section>

      {/* Strengths & growth */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 font-bold">💪 {t("strengths")}</h2>
            <ul className="space-y-3">
              {report.strengths.map((s) => (
                <li key={s.title}><p className="font-medium">{s.title}</p><p className="text-sm text-muted">{s.description}</p></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 font-bold">🌱 {t("growth")}</h2>
            <ul className="space-y-3">
              {report.growthAreas.map((g) => (
                <li key={g.title}>
                  <p className="font-medium">{g.title}</p>
                  <p className="text-sm text-muted">{g.description}</p>
                  <p className="mt-1 text-sm text-accent">→ {g.tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Skills: current vs target */}
      <Section title={`${t("skills")} · ${top?.title ?? ""}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["hard", "soft"] as const).map((kind) => (
            <div key={kind} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">{t(kind)}</h3>
              <div className="space-y-3">
                {report.skills[kind].map((s, i) => (
                  <div key={s.name}>
                    <div className="mb-1 flex justify-between text-sm"><span>{s.name}</span><span className="text-muted">{s.current} → {s.target}</span></div>
                    <Bar value={s.current} ghost={s.target} delay={i * 0.05} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Category-specific advice (UNT subjects / internships / switching) */}
      <Section title={report.categoryAdvice.title}>
        <ul className="grid gap-2">
          {report.categoryAdvice.items.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl border border-border bg-surface p-3 text-sm"><span className="text-accent">◆</span>{item}</li>
          ))}
        </ul>
      </Section>

      {/* Roadmap timeline */}
      <Section title={t("roadmap")}>
        <ol className="relative ml-3 border-l-2 border-border">
          {report.roadmap.map((step, i) => (
            <m.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.05 }}
              className="relative mb-6 pl-8 last:mb-0"
            >
              <span className="absolute -left-[15px] top-0 grid size-7 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-xs font-bold text-white">{i + 1}</span>
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{step.title}</h3>
                  <span className="text-xs font-medium text-muted">{t("duration")}: {step.duration}</span>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                  {step.actions.map((a) => <li key={a}>{a}</li>)}
                </ul>
                {step.resources.length > 0 && (
                  <p className="mt-3 text-xs text-muted">📚 {t("resources")}: {step.resources.join(" · ")}</p>
                )}
              </div>
            </m.li>
          ))}
        </ol>
      </Section>

      <div className="mt-12 text-center">
        <button onClick={onRetake} className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:border-accent">
          ↻ {t("retake")}
        </button>
      </div>
    </div>
  );
}
