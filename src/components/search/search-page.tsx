'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { searchNik } from '@/lib/api';
import { Header } from '../common/header';

export type SearchResult = {
    datasetName: string;
    record: { id: string; nik: string; name: string; address: string };
};

type SearchPageProps = {
    dictionary: any;
};

export function SearchPage({ dictionary }: SearchPageProps) {
    const { toast } = useToast();
    const [nik, setNik] = React.useState('');
    const [selectedDatasets, setSelectedDatasets] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [searchAttempted, setSearchAttempted] = React.useState(false);
    const { search: t, healthSections } = dictionary;

    const mockDatasetInfo = [
        { id: 'seksi-p2p', name: healthSections.p2p },
        { id: 'seksi-sdk', name: healthSections.sdk },
        { id: 'seksi-kesmas', name: healthSections.kesmas },
    ];
    
    const handleSearch = async () => {
        if (!nik) {
            toast({ variant: 'destructive', title: 'Error', description: t.errorNikRequired });
            return;
        }
        if (selectedDatasets.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: t.errorDatasetRequired });
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults([]);
        setSearchAttempted(true);

        try {
            const foundResults = await searchNik(nik, selectedDatasets);
            setResults(foundResults);
            if (foundResults.length === 0) {
                toast({ title: t.noResults, description: `Tidak ada data yang cocok dengan NIK yang diberikan.` });
            }
        } catch (e: any) {
            setError(e.message || t.searchFailedDesc);
            toast({ variant: 'destructive', title: t.searchFailed, description: error || t.searchFailedDesc });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDatasetSelection = (datasetId: string) => {
        setSelectedDatasets(prev => 
            prev.includes(datasetId) 
                ? prev.filter(id => id !== datasetId) 
                : [...prev, datasetId]
        );
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header dictionary={dictionary} lang={dictionary.lang} />
            <main className="flex-1 p-4 sm:p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground/90">{t.title}</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.cardTitle}</CardTitle>
                            <CardDescription>{t.cardDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">{t.nikLabel}</Label>
                                <Input id="nik" value={nik} onChange={e => setNik(e.target.value)} placeholder={t.nikPlaceholder} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.selectDataset}</Label>
                                <div className="space-y-2 rounded-md border p-4">
                                    {mockDatasetInfo.map(dataset => (
                                        <div key={dataset.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={dataset.id} 
                                                checked={selectedDatasets.includes(dataset.id)}
                                                onCheckedChange={() => handleDatasetSelection(dataset.id)}
                                            />
                                            <Label htmlFor={dataset.id} className="font-normal">{dataset.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                {isLoading ? t.searching : t.searchButton}
                            </Button>
                        </CardContent>
                    </Card>

                    {isLoading && (
                        <div className="flex items-center justify-center rounded-md border border-dashed p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">{t.loading}</p>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t.searchFailed}</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {searchAttempted && !isLoading && results.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.resultsTitle.replace('{nik}', nik)}</CardTitle>
                                <CardDescription>{t.resultsFound.replace('{count}', results.length.toString())}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {results.map(result => (
                                    <div key={result.record.id} className="rounded-lg border p-4">
                                        <h3 className="font-semibold text-primary flex items-center">
                                            <FileText className="mr-2 h-4 w-4" />
                                            {result.datasetName}
                                        </h3>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">{t.name}</p>
                                                <p className="font-medium">{result.record.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">NIK</p>
                                                <p className="font-medium">{result.record.nik}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground">{t.address}</p>
                                                <p className="font-medium">{result.record.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {searchAttempted && !isLoading && results.length === 0 && (
                         <Card>
                            <CardHeader>
                                <CardTitle>{t.resultsTitle.replace('{nik}', nik)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{t.noResults}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
