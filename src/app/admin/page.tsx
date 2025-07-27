import { AdminPage } from "@/components/admin/admin-page";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
    const dictionary = await getDictionary(lang as any);
    return <AdminPage dictionary={dictionary} lang={lang} />;
}
