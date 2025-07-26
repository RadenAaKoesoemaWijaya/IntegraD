'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileDown, PlusCircle, User, Settings } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { HealthData, initialHealthData, ProgramManager } from './schema';
import Link from 'next/link';
import { Logo } from '../dashboard/icons';
import { useToast } from '@/hooks/use-toast';

export function DataManagerPage() {
  const [data, setData] = React.useState<HealthData[]>(initialHealthData);
  const [selectedManager, setSelectedManager] = React.useState<string>('dinkes-jakarta');
  const [file, setFile] = React.useState<File | null>(null);
  const { toast } = useToast();

  const programManagers: ProgramManager[] = [
    { id: 'dinkes-jakarta', name: 'Dinas Kesehatan Jakarta' },
    { id: 'dinkes-bandung', name: 'Dinas Kesehatan Bandung' },
    { id: 'kemenkes-ri', name: 'Kementerian Kesehatan RI' },
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
        description: `File ${file.name} has been uploaded for ${selectedManager}.`,
      });
    // In a real app, you would parse the CSV/JSON and update the state
    // For now, we'll just show a success message.
  };

  const handleExport = () => {
    // Mock data export
    const csvContent = "data:text/csv;charset=utf-8," 
        + "id,region,month,cases,vaccinations,patients\n"
        + data.map(e => `${e.id},${e.region},${e.month},${e.cases},${e.vaccinations},${e.patients}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "health_data.csv");
    document.body.appendChild(link);
    link.click();
    toast({
        title: "Export Successful",
        description: "Data has been exported to CSV.",
      });
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
            <Link href="/search" className="hover:text-foreground transition-colors">NIK Search</Link>
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
              <CardDescription>Upload file CSV atau JSON untuk penanggung jawab program yang dipilih.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="program-manager">Penanggung Jawab Program</Label>
                <Select value={selectedManager} onValueChange={setSelectedManager}>
                  <SelectTrigger id="program-manager">
                    <SelectValue placeholder="Pilih Penanggung Jawab" />
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
              <DataTable columns={columns} data={data} setData={setData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
