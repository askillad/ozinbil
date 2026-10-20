import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MotionProvider } from "@/components/MotionProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import "../globals.css";

// cyrillic-ext covers Kazakh letters (ә, ғ, қ, ң, ө, ұ, ү, һ, і)
const inter = Inter({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--font-inter", display: "swap" });

// Pre-render every page for all 3 languages at build time → instant loads
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-glow min-h-dvh">
        <NextIntlClientProvider>
          <MotionProvider>
            <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
                <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white">◆</span>
                Pathwise
              </Link>
              <LanguageSwitcher />
            </header>
            <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">{children}</main>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
