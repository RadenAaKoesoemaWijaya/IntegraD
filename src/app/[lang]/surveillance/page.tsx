
import { getDictionary } from '@/lib/dictionaries';
import { SurveillancePage } from '@/components/surveillance/surveillance-page';

export default async function Surveillance({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);

  return <SurveillancePage dictionary={dictionary} />;
}
