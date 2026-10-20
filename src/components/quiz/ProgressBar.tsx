"use client";

import { m } from "framer-motion";

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-medium text-muted">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
        {/* scaleX instead of width: animates on the GPU, never triggers layout */}
        <m.div
          className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
          initial={false}
          animate={{ scaleX: value }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
