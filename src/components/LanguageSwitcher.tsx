"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { m } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { ru: "RU", kk: "ҚАЗ", en: "EN" };

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    // Client-side navigation — state (quiz progress) is preserved, no full reload
    startTransition(() => router.replace(pathname, { locale: next, scroll: false }));
  };

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={`relative flex rounded-full border border-border bg-surface p-1 text-xs font-semibold transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      {locales.map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={l === locale}
          onClick={() => change(l)}
          className="relative z-10 rounded-full px-3 py-1.5 transition-colors"
          style={{ color: l === locale ? "white" : "var(--muted)" }}
        >
          {l === locale && (
            <m.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-accent" />
          )}
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
