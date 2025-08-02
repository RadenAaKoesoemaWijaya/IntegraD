
import { MonitoringPage } from "@/components/monitoring/monitoring-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params }: { params: { lang?: Locale } }) {
    const lang = params?.lang || 'id';
    const dictionary = await getDictionary(lang);
    return <MonitoringPage dictionary={dictionary} lang={lang} />;
}
