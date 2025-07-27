import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { getDictionary } from '@/lib/dictionaries';

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang as any);
  return <DashboardPage dictionary={dictionary} lang={lang} />;
}
