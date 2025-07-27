'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Settings, Search, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { Logo } from '../dashboard/icons';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { searchNik } from '@/lib/api';

const mockDatasetInfo = [
    { id: 'seksi-p2p', name: 'Seksi Pencegahan dan Penanggulangan Penyakit' },
    { id: 'seksi-sdk', name: 'Seksi Sumber Daya Kesehatan' },
    { id: 'seksi-kesmas', name: 'Seksi Kesehatan Masyarakat' },
];

export type SearchResult = {
    datasetName: string;
    record: { id: string; nik: string; name: string; address: string };
};

export function SearchPage() {
    const { toast } = useToast();
    const [nik, setNik] = React.useState('');
    const [selectedDatasets, setSelectedDatasets] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [searchAttempted, setSearchAttempted] = React.useState(false);

    const handleSearch = async () => {
        if (!nik) {
            toast({ variant: 'destructive', title: 'Error', description: 'Nomor Induk Kependudukan (NIK) harus diisi.' });
            return;
        }
        if (selectedDatasets.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Pilih minimal satu dataset untuk dicari.' });
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
                toast({ title: 'Tidak Ditemukan', description: 'Tidak ada data yang cocok dengan NIK yang diberikan.' });
            }
        } catch (e: any) {
            setError(e.message || 'Terjadi kesalahan tak terduga.');
            toast({ variant: 'destructive', title: 'Pencarian Gagal', description: error });
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
            <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
                <div className="flex items-center gap-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-semibold text-foreground">SehatData</h1>
                </div>
                <nav className="ml-4 hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
                    <Link href="/upload" className="hover:text-foreground transition-colors">Data Management</Link>
                    <Link href="/search" className="text-primary font-semibold">NIK Search</Link>
                    <Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link>
                    <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
                </nav>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/profile">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Profile</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin">
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Admin Settings</span>
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground/90">Pencarian NIK</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Cari Data Pasien berdasarkan NIK</CardTitle>
                            <CardDescription>Masukkan NIK dan pilih dataset yang ingin Anda periksa.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nik">Nomor Induk Kependudukan (NIK)</Label>
                                <Input id="nik" value={nik} onChange={e => setNik(e.target.value)} placeholder="Masukkan 16 digit NIK" />
                            </div>
                            <div className="space-y-2">
                                <Label>Pilih Dataset</Label>
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
                                {isLoading ? 'Mencari...' : 'Cari Data'}
                            </Button>
                        </CardContent>
                    </Card>

                    {isLoading && (
                        <div className="flex items-center justify-center rounded-md border border-dashed p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">Mencari data, mohon tunggu...</p>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Pencarian Gagal</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {searchAttempted && !isLoading && results.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Hasil Pencarian untuk NIK: {nik}</CardTitle>
                                <CardDescription>Ditemukan {results.length} hasil yang cocok.</CardDescription>
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
                                                <p className="text-muted-foreground">Nama</p>
                                                <p className="font-medium">{result.record.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">NIK</p>
                                                <p className="font-medium">{result.record.nik}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground">Alamat</p>
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
                                <CardTitle>Hasil Pencarian untuk NIK: {nik}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Data tidak ditemukan.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
