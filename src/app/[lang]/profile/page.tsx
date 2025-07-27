import { ProfilePage } from "@/components/profile/profile-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);
    return <ProfilePage dictionary={dictionary} lang={lang} />;
}
