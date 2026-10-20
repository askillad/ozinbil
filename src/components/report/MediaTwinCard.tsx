"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, type Variants } from "framer-motion";
import type { CareerReport } from "@/lib/ai/schema";

type Twin = CareerReport["mediaTwins"][number];

const SOURCE_ICON: Record<Twin["source_type"], string> = {
  movie: "🎬",
  series: "📺",
  anime: "🌸",
  manga: "📖",
  game: "🎮",
  book: "📚",
  history: "🏛️",
  modern: "🌟",
};

const container: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94, rotateX: 12 },
  show: {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { type: "spring", stiffness: 140, damping: 18, staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/**
 * Always dark, regardless of the site theme, so a screenshot looks the same
 * for everyone and stands out in social feeds.
 */
export function MediaTwinCard({ twins, archetype }: { twins: Twin[]; archetype: string }) {
  const t = useTranslations("result.twin");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const [main, second] = twins;
  if (!main) return null;

  const share = async () => {
    const text = t("shareText", { name: main.name, trait: main.key_trait });
    const url = `${window.location.origin}/${locale}`;
    try {
      if (navigator.share) return await navigator.share({ title: "Pathwise", text, url });
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user closed the share sheet — nothing to do
    }
  };

  return (
    <m.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      style={{ transformPerspective: 900 }}
      className="mt-6 rounded-3xl bg-gradient-to-br from-[#8b6dff] via-[#22d3ee] to-[#ff4fd8] p-[1.5px] shadow-2xl shadow-accent/30"
    >
      <div className="relative overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-[#0d0b1a] p-6 text-white sm:p-8">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-[#8b6dff]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-[#ff4fd8]/20 blur-3xl" />
        {/* Shimmer sweep — transform only, runs on the GPU */}
        <m.div
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-150%" }}
          animate={{ x: "400%" }}
          transition={{ duration: 1.6, delay: 0.6, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
        />

        <div className="relative">
          <m.div variants={item} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8b6dff] to-[#ff4fd8] px-3 py-1 text-xs font-bold uppercase tracking-wider">
              ✦ {t("badge")}
            </span>
            <m.button
              onClick={share}
              whileTap={{ scale: 0.92 }}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur transition-colors hover:bg-white/15"
            >
              {copied ? `✓ ${t("copied")}` : `↗ ${t("share")}`}
            </m.button>
          </m.div>

          <div className="mt-6 flex items-start gap-4 sm:gap-5">
            <m.div
              variants={{
                hidden: { scale: 0, rotate: -25 },
                show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 14 } },
              }}
              className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/10 text-4xl ring-1 ring-white/15 sm:size-20 sm:text-5xl"
            >
              {SOURCE_ICON[main.source_type]}
            </m.div>
            <m.div variants={item} className="min-w-0">
              <h2 className="bg-gradient-to-r from-white via-[#c9bbff] to-[#7ee8fa] bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl">
                {main.name}
              </h2>
              <p className="mt-1 text-sm text-white/60">{main.source}</p>
            </m.div>
          </div>

          <m.div variants={item} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-3 py-2 text-sm">
            <span>⚡</span>
            <span className="text-white/60">{t("trait")}:</span>
            <span className="font-semibold text-[#7ee8fa]">{main.key_trait}</span>
          </m.div>

          <m.p variants={item} className="mt-4 leading-relaxed text-white/85">
            {main.similarity_reason}
          </m.p>

          {second && (
            <m.div variants={item} className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{t("also")}</p>
              <div className="mt-2 flex items-start gap-3">
                <span className="text-2xl">{SOURCE_ICON[second.source_type]}</span>
                <div className="min-w-0">
                  <p className="font-bold">
                    {second.name} <span className="font-normal text-white/50">· {second.source}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-[#ff9be9]">{second.key_trait}</p>
                  <p className="mt-1 text-sm text-white/70">{second.similarity_reason}</p>
                </div>
              </div>
            </m.div>
          )}

          {/* Footer doubles as a watermark on screenshots */}
          <m.div variants={item} className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/50">
            <span>{archetype}</span>
            <span className="flex items-center gap-1.5 font-semibold text-white/70">
              <span className="grid size-4 place-items-center rounded bg-gradient-to-br from-[#8b6dff] to-[#22d3ee] text-[8px] text-white">◆</span>
              pathwise
            </span>
          </m.div>
        </div>
      </div>
    </m.div>
  );
}
