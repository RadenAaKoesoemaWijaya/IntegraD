import { DataManagerPage } from "@/components/data-manager/data-manager-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <DataManagerPage dictionary={dictionary} lang={lang} />;
}
