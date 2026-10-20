"use client";

import { useLocale, useTranslations } from "next-intl";
import { m } from "framer-motion";
import type { Locale } from "@/i18n/routing";
import type { AnswerValue, CardsQuestion, Question, TextQuestion } from "@/lib/questions";

interface Props<Q extends Question = Question> {
  question: Q;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  /** Called when the answer is "complete" and we can auto-advance (scale). */
  onCommit?: () => void;
}

export function QuestionView(props: Props) {
  const { question } = props;
  if (question.type === "scale") return <ScaleView {...props} />;
  if (question.type === "cards") return <CardsView {...(props as Props<CardsQuestion>)} />;
  return <TextView {...(props as Props<TextQuestion>)} />;
}

// ── Likert scale 1–5 ───────────────────────────────────────────────────
function ScaleView({ value, onChange, onCommit }: Props) {
  const t = useTranslations("quiz");
  const sizes = ["size-12", "size-11", "size-10", "size-11", "size-12"];
  return (
    <div>
      <div className="flex items-center justify-between gap-2 sm:justify-center sm:gap-5">
        {[1, 2, 3, 4, 5].map((n, i) => {
          const active = value === n;
          return (
            <m.button
              key={n}
              onClick={() => {
                onChange(n);
                onCommit?.();
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: active ? 1.15 : 1 }}
              aria-label={`${n} / 5`}
              aria-pressed={active}
              className={`${sizes[i]} grid place-items-center rounded-full border-2 text-sm font-bold transition-colors ${
                active ? "border-accent bg-accent text-white" : "border-border bg-surface text-muted hover:border-accent/60"
              }`}
            >
              {n}
            </m.button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between text-xs text-muted sm:mx-auto sm:max-w-sm">
        <span>{t("scaleMin")}</span>
        <span>{t("scaleMax")}</span>
      </div>
    </div>
  );
}

// ── Card selection (multi-select up to maxSelect) ──────────────────────
function CardsView({ question, value, onChange }: Props<CardsQuestion>) {
  const t = useTranslations("quiz");
  const locale = useLocale() as Locale;
  const selected = Array.isArray(value) ? value : [];
  const full = selected.length >= question.maxSelect;

  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else if (question.maxSelect === 1) onChange([id]);
    else if (!full) onChange([...selected, id]);
  };

  return (
    <div>
      {question.maxSelect > 1 && (
        <p className="mb-3 text-center text-xs text-muted">
          {t("chooseUpTo", { max: question.maxSelect })} · {selected.length}/{question.maxSelect}
        </p>
      )}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {question.options.map((o, i) => {
          const active = selected.includes(o.id);
          const disabled = !active && full && question.maxSelect > 1;
          return (
            <m.button
              key={o.id}
              onClick={() => toggle(o.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: disabled ? 0.45 : 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.96 }}
              aria-pressed={active}
              className={`relative flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition-colors ${
                active ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-accent/50"
              }`}
            >
              <span className="text-xl">{o.icon}</span>
              <span className="leading-tight">{o.label[locale]}</span>
              {active && (
                <m.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-accent text-[10px] text-white"
                >
                  ✓
                </m.span>
              )}
            </m.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Free text ──────────────────────────────────────────────────────────
function TextView({ value, onChange }: Props<TextQuestion>) {
  const t = useTranslations("quiz");
  const text = typeof value === "string" ? value : "";
  return (
    <div>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => onChange(e.target.value)}
        maxLength={2000}
        rows={5}
        placeholder={t("textPlaceholder")}
        className="w-full resize-none rounded-2xl border border-border bg-surface p-4 text-base outline-none transition-shadow placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/15"
      />
      <div className="mt-1 text-right text-xs text-muted">{text.length}/2000</div>
    </div>
  );
}
