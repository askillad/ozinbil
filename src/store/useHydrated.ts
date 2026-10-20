"use client";

import { useSyncExternalStore } from "react";
import { useQuiz } from "./quiz";

/** True once the persisted quiz state has been read from localStorage. */
export function useHydrated() {
  return useSyncExternalStore(
    (cb) => useQuiz.persist.onFinishHydration(cb),
    () => useQuiz.persist.hasHydrated(),
    () => false,
  );
}
