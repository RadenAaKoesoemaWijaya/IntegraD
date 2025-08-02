import { DataManagerPage } from "@/components/data-manager/data-manager-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function UploadPage({ params }: { params: { lang?: Locale } }) {
    const lang = params?.lang || 'id';
    const dictionary = await getDictionary(lang);
    return <DataManagerPage dictionary={dictionary} lang={lang} />;
}
