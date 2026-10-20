"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";

export function Analyzing() {
  const t = useTranslations("quiz");
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-center">
      <div className="relative size-28">
        {[0, 1, 2].map((i) => (
          <m.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-accent"
            animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.66, ease: "easeOut" }}
          />
        ))}
        <m.span
          className="absolute inset-6 rounded-full bg-gradient-to-br from-accent to-accent-2"
          animate={{ rotate: 360, scale: [1, 1.08, 1] }}
          transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
        />
      </div>
      <h2 className="mt-10 text-xl font-semibold">{t("analyzing")}</h2>
      <p className="mt-2 text-sm text-muted">{t("analyzingHint")}</p>
    </m.div>
  );
}
