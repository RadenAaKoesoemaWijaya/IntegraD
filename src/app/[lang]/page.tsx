import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from "@/i18n-config";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <DashboardPage dictionary={dictionary} lang={lang} />;
}
