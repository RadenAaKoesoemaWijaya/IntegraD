
import { ReportingPage } from "@/components/reporting/reporting-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);
    return <ReportingPage dictionary={dictionary} lang={lang} />;
}
