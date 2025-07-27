import { AdminPage } from "@/components/admin/admin-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params }: { params: { lang?: Locale } }) {
    const lang = params.lang || 'id';
    const dictionary = await getDictionary(lang);
    return <AdminPage dictionary={dictionary} lang={lang} />;
}
