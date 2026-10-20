"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * LazyMotion loads only the DOM animation features (~15 kb instead of ~34 kb).
 * Use `m.div` instead of `motion.div` everywhere.
 * reducedMotion="user" respects the OS "reduce motion" setting.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 32 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
