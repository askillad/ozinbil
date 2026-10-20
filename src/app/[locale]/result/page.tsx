import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Report } from "@/components/report/Report";

export default function ResultPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(use(params).locale);
  return <Report />;
}
