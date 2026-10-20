"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { categories, getQuestions, type Category } from "@/lib/questions";
import { useQuiz } from "@/store/quiz";

const ICONS: Record<Category, string> = { school: "🎒", student: "🎓", adult: "💼" };

export function CategoryPicker() {
  const t = useTranslations("home");
  const router = useRouter();
  const start = useQuiz((s) => s.start);
  const [selected, setSelected] = useState<Category>("school");

  const begin = () => {
    start(selected);
    router.push("/test");
  };

  return (
    <div className="mx-auto mt-14 max-w-3xl">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted">{t("chooseCategory")}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {categories.map((c, i) => {
          const active = c === selected;
          return (
            <m.button
              key={c}
              onClick={() => setSelected(c)}
              onMouseEnter={() => router.prefetch("/test")}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={active}
              className={`relative rounded-2xl border p-5 text-left transition-colors ${
                active ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-accent/50"
              }`}
            >
              <div className="text-3xl">{ICONS[c]}</div>
              <div className="mt-3 font-semibold">{t(`categories.${c}.title`)}</div>
              <div className="mt-1 text-sm text-muted">{t(`categories.${c}.desc`)}</div>
              {active && (
                <m.span layoutId="cat-check" className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-accent text-xs text-white">
                  ✓
                </m.span>
              )}
            </m.button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <m.button
          onClick={begin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent/25"
        >
          {t("start")} →
        </m.button>
        <span className="text-sm text-muted">{t("duration", { count: getQuestions(selected).length })}</span>
      </div>
    </div>
  );
}
