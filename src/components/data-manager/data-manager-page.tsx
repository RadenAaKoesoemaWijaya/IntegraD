'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, User, Settings } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { HealthData, ProgramManager } from './schema';
import Link from 'next/link';
import { Logo } from '../dashboard/icons';
import { useToast } from '@/hooks/use-toast';
import { getHealthData, addHealthData, updateHealthData, deleteHealthData } from '@/lib/api';

export function DataManagerPage() {
  const [data, setData] = React.useState<HealthData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedManager, setSelectedManager] = React.useState<string>('seksi-p2p');
  const [file, setFile] = React.useState<File | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getHealthData();
        setData(result);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const programManagers: ProgramManager[] = [
    { id: 'seksi-p2p', name: 'Seksi Pencegahan dan Penanggulangan Penyakit' },
    { id: 'seksi-sdk', name: 'Seksi Sumber Daya Kesehatan' },
    { id: 'seksi-kesmas', name: 'Seksi Kesehatan Masyarakat' },
    { id: 'seksi-yankes', name: 'Seksi Pelayanan Kesehatan' },
  ];

  const handleFileUpload = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please select a file to upload.",
      });
      return;
    }
    // Mock file processing
    toast({
        title: "Upload Successful",
        description: `File ${file.name} has been uploaded for ${programManagers.find(p => p.id === selectedManager)?.name}. Data will be processed and reflected shortly.`,
      });
    // In a real app, you would parse the CSV/JSON, call the API, and then refresh the data.
  };

  const handleAddRow = async (newRow: Omit<HealthData, 'id'>) => {
    try {
      const addedRow = await addHealthData(newRow);
      setData(prev => [...prev, addedRow]);
      toast({ title: 'Success', description: 'Record added successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add record.' });
    }
  };

  const handleUpdateRow = async (updatedRow: HealthData) => {
    try {
      const returnedRow = await updateHealthData(updatedRow);
      setData(prev => prev.map(row => (row.id === returnedRow.id ? returnedRow : row)));
      toast({ title: 'Success', description: 'Record updated successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update record.' });
    }
  };

  const handleRemoveRow = async (id: string) => {
    try {
      await deleteHealthData(id);
      setData(prev => prev.filter(row => row.id !== id));
      toast({ title: 'Success', description: 'Record deleted successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete record.' });
    }
  };
  
  const tableMeta = {
    addRow: handleAddRow,
    updateRow: handleUpdateRow,
    removeRow: handleRemoveRow,
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
            <Link href="/upload" className="text-primary font-semibold">Data Management</Link>
            <Link href="/search" className="hover:text-foreground transition-colors">Pencarian Data</Link>
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
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground/90">Manajemen Data Kesehatan</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Upload Dataset Baru</CardTitle>
              <CardDescription>Upload file CSV atau JSON untuk seksi dinas kesehatan yang dipilih.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="program-manager">Seksi Dinas Kesehatan</Label>
                <Select value={selectedManager} onValueChange={setSelectedManager}>
                  <SelectTrigger id="program-manager">
                    <SelectValue placeholder="Pilih Seksi" />
                  </SelectTrigger>
                  <SelectContent>
                    {programManagers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>{manager.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-file">File Data (.csv, .json)</Label>
                <Input id="data-file" type="file" accept=".csv,.json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex items-end">
                <Button onClick={handleFileUpload} className="w-full md:w-auto">
                  <Upload className="mr-2" /> Upload Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dataset Kesehatan</CardTitle>
              <CardDescription>Lihat, tambah, edit, atau hapus data dalam dataset.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} meta={tableMeta} loading={loading} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
