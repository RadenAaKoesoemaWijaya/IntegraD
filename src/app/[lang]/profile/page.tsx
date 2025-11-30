import { ProfilePage } from "@/components/profile/profile-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <ProfilePage dictionary={dictionary} lang={lang} />;
}
