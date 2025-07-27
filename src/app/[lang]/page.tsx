import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from "@/i18n-config";

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  return <DashboardPage dictionary={dictionary} lang={lang} />;
}
