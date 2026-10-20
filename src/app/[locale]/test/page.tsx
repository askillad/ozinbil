import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Quiz } from "@/components/quiz/Quiz";

export default function TestPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(use(params).locale);
  return <Quiz />;
}
