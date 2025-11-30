
import { getDictionary } from '@/lib/dictionaries';
import { SurveillancePage } from '@/components/surveillance/surveillance-page';

import { Locale } from "@/i18n-config";

export default async function Surveillance({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <SurveillancePage dictionary={dictionary} />;
}
