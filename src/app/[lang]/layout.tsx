import * as React from 'react';
import { i18n, Locale } from '@/i18n-config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  // Await params if needed, or just ensure type compatibility
  const { lang } = await params;
  return (
    <>
      {children}
    </>
  );
}
