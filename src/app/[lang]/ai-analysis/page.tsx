import { AskHealthData } from '@/components/ai/AskHealthData';
import { Header } from '@/components/common/header';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from "@/i18n-config";

export default async function AIAnalysisPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header dictionary={dictionary} lang={lang} />
            <main className="flex-1 p-4 sm:p-6">
                <h1 className="text-2xl font-bold mb-6">AI Health Data Analysis</h1>
                <p className="text-muted-foreground mb-8">
                    Ask questions about your health data and get comprehensive answers powered by AI.
                </p>
                <AskHealthData />
            </main>
        </div>
    );
}
