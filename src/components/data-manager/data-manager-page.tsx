'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { HealthData, ProgramManager } from './schema';
import { useToast } from '@/hooks/use-toast';
import { getHealthData, addHealthData, updateHealthData, deleteHealthData } from '@/lib/api';
import { Header } from '../common/header';

type DataManagerPageProps = {
    dictionary: any;
    lang: string;
};

export function DataManagerPage({ dictionary, lang }: DataManagerPageProps) {
  const [data, setData] = React.useState<HealthData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedManager, setSelectedManager] = React.useState<string>('seksi-p2p');
  const [file, setFile] = React.useState<File | null>(null);
  const { toast } = useToast();
  const { dataManagement: t, healthSections } = dictionary;

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
          description: t.errorFetch,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast, t]);

  const programManagers: ProgramManager[] = [
    { id: 'seksi-p2p', name: healthSections.p2p },
    { id: 'seksi-sdk', name: healthSections.sdk },
    { id: 'seksi-kesmas', name: healthSections.kesmas },
    { id: 'seksi-yankes', name: healthSections.yankes },
  ];

  const handleFileUpload = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: t.uploadFailed,
        description: t.selectFile,
      });
      return;
    }
    const sectionName = programManagers.find(p => p.id === selectedManager)?.name || '';
    toast({
        title: t.uploadSuccess,
        description: t.uploadSuccessDesc.replace('{fileName}', file.name).replace('{sectionName}', sectionName),
      });
  };

  const handleAddRow = async (newRow: Omit<HealthData, 'id'>) => {
    try {
      const addedRow = await addHealthData(newRow);
      setData(prev => [...prev, addedRow]);
      toast({ title: 'Success', description: t.addSuccess });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: t.addError });
    }
  };

  const handleUpdateRow = async (updatedRow: HealthData) => {
    try {
      const returnedRow = await updateHealthData(updatedRow);
      setData(prev => prev.map(row => (row.id === returnedRow.id ? returnedRow : row)));
      toast({ title: 'Success', description: t.updateSuccess });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: t.updateError });
    }
  };

  const handleRemoveRow = async (id: string) => {
    try {
      await deleteHealthData(id);
      setData(prev => prev.filter(row => row.id !== id));
      toast({ title: 'Success', description: t.deleteSuccess });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: t.deleteError });
    }
  };
  
  const tableMeta = {
    addRow: handleAddRow,
    updateRow: handleUpdateRow,
    removeRow: handleRemoveRow,
    dictionary: dictionary,
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
       <Header dictionary={dictionary} lang={lang} />
      <main className="flex-1 p-4 sm:p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground/90">{t.title}</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>{t.uploadTitle}</CardTitle>
              <CardDescription>{t.uploadDesc}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="program-manager">{t.healthSection}</Label>
                <Select value={selectedManager} onValueChange={setSelectedManager}>
                  <SelectTrigger id="program-manager">
                    <SelectValue placeholder={t.selectSection} />
                  </SelectTrigger>
                  <SelectContent>
                    {programManagers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>{manager.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-file">{t.dataFile}</Label>
                <Input id="data-file" type="file" accept=".csv,.json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex items-end">
                <Button onClick={handleFileUpload} className="w-full md:w-auto">
                  <Upload className="mr-2" /> {t.uploadButton}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.datasetTitle}</CardTitle>
              <CardDescription>{t.datasetDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} meta={tableMeta} loading={loading} dictionary={dictionary} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
