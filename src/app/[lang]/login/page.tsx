
import { LoginPage } from "@/components/login/login-page";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/i18n-config";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    return <LoginPage dictionary={dictionary} lang={lang} />;
}
