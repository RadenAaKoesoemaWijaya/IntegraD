import { SearchPage } from "@/components/search/search-page";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
    const dictionary = await getDictionary(lang as any);
    return <SearchPage dictionary={dictionary} />;
}
