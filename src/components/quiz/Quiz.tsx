"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, m, type Variants } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getQuestions, isAnswered } from "@/lib/questions";
import type { CareerReport } from "@/lib/ai/schema";
import { useQuiz } from "@/store/quiz";
import { useHydrated } from "@/store/useHydrated";
import { ProgressBar } from "./ProgressBar";
import { QuestionView } from "./QuestionViews";
import { Analyzing } from "./Analyzing";

// Direction-aware slide: forward → comes from the right, back → from the left
const slide: Variants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0, filter: "blur(4px)" }),
};

export function Quiz() {
  const t = useTranslations("quiz");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const hydrated = useHydrated();
  const { category, answers, index, direction, answer, go, setReport } = useQuiz();
  const [status, setStatus] = useState<"idle" | "analyzing" | "error">("idle");
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const questions = useMemo(() => (category ? getQuestions(category) : []), [category]);
  const safeIndex = Math.min(index, Math.max(0, questions.length - 1));
  const question = questions[safeIndex];
  const isLast = safeIndex === questions.length - 1;
  const canNext = question ? isAnswered(question, answers[question.id]) : false;

  useEffect(() => {
    if (hydrated && !category) router.replace("/");
  }, [hydrated, category, router]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const submit = useCallback(async () => {
    setStatus("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, category, answers }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { report: CareerReport; demo?: boolean };
      setReport(data.report, Boolean(data.demo));
      router.push("/result");
    } catch {
      setStatus("error");
    }
  }, [locale, category, answers, setReport, router]);

  const next = useCallback(() => {
    clearTimeout(advanceTimer.current);
    if (!canNext) return;
    if (isLast) void submit();
    else go(1);
  }, [canNext, isLast, submit, go]);

  const back = useCallback(() => {
    clearTimeout(advanceTimer.current);
    if (safeIndex > 0) go(-1);
  }, [safeIndex, go]);

  // Keyboard: Enter → next, ← → back, 1–5 → scale answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!question || status !== "idle") return;
      const inTextarea = (e.target as HTMLElement).tagName === "TEXTAREA";
      if (e.key === "Enter" && (!inTextarea || e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" && !inTextarea) back();
      else if (question.type === "scale" && /^[1-5]$/.test(e.key)) answer(question.id, Number(e.key));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, status, next, back, answer]);

  if (!hydrated || !question) return <div className="h-96" />;
  if (status === "analyzing") return <Analyzing />;

  return (
    <div className="mx-auto max-w-2xl pt-6 sm:pt-12">
      <ProgressBar
        value={(safeIndex + (canNext ? 1 : 0)) / questions.length}
        label={t("progress", { current: safeIndex + 1, total: questions.length })}
      />

      <div className="relative mt-10 min-h-[22rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <m.div
            key={question.id}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <h2 className="text-center text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              {question.title[locale]}
            </h2>
            {question.hint && <p className="mt-3 text-center text-sm text-muted">{question.hint[locale]}</p>}
            <div className="mt-8">
              <QuestionView
                question={question}
                value={answers[question.id]}
                onChange={(v) => answer(question.id, v)}
                onCommit={() => {
                  // Scale answers auto-advance after a short beat so the user sees their choice
                  if (isLast) return;
                  clearTimeout(advanceTimer.current);
                  advanceTimer.current = setTimeout(() => go(1), 280);
                }}
              />
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {status === "error" && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-xl border border-warn/40 bg-warn/10 p-3 text-center text-sm">
          {t("error")}
        </m.div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={back}
          disabled={safeIndex === 0}
          className="rounded-full px-5 py-3 text-sm font-medium text-muted transition-colors hover:text-text disabled:invisible"
        >
          ← {t("back")}
        </button>
        <m.button
          onClick={next}
          disabled={!canNext}
          whileTap={{ scale: 0.96 }}
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-opacity disabled:opacity-40 disabled:shadow-none"
        >
          {status === "error" ? t("retry") : isLast ? t("finish") : t("next")} →
        </m.button>
      </div>
    </div>
  );
}
