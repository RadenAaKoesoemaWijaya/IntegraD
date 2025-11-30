
import { MonitoringPage } from "@/components/monitoring/monitoring-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <MonitoringPage dictionary={dictionary} lang={lang} />;
}
