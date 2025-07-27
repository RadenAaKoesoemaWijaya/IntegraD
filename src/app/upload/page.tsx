import { DataManagerPage } from "@/components/data-manager/data-manager-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function UploadPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang || 'id');
    return <DataManagerPage dictionary={dictionary} lang={lang || 'id'} />;
}
