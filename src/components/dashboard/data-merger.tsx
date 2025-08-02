
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { searchNik } from '@/lib/api';
import { mergeData, MergeDataInput, MergeDataOutput } from '@/ai/flows/merge-data-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Database, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Progress } from '../ui/progress';

type DataMergerProps = {
  dictionary: any;
};

type SearchResult = {
  datasetName: string;
  record: { id: string; nik: string; name: string; address: string; dob?: string; phone?: string, lastVisit?: string };
};

export function DataMerger({ dictionary }: DataMergerProps) {
  const { toast } = useToast();
  const t = dictionary.dataMerger || {};
  const healthSections = dictionary.healthSections || {};

  const [nik, setNik] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [isMerging, setIsMerging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [mergeResult, setMergeResult] = React.useState<MergeDataOutput | null>(null);
  
  const mockDatasetInfo = React.useMemo(() => [
    { id: 'seksi-p2p', name: healthSections?.p2p || 'Disease Prevention Section' },
    { id: 'seksi-sdk', name: healthSections?.sdk || 'Health Resources Section' },
    { id: 'seksi-kesmas', name: healthSections?.kesmas || 'Public Health Section' },
  ], [healthSections]);

  // Select all datasets by default
  const [selectedDatasets, setSelectedDatasets] = React.useState<string[]>(mockDatasetInfo.map(d => d.id));


  const handleSearch = async () => {
    if (!nik) {
      toast({ variant: 'destructive', title: 'Error', description: t.errorNikRequired });
      return;
    }
    setIsSearching(true);
    setIsMerging(false);
    setError(null);
    setSearchResults([]);
    setMergeResult(null);

    try {
      const foundResults = await searchNik(nik, selectedDatasets);
      setSearchResults(foundResults);
      if (foundResults.length > 1) {
        handleMerge(foundResults);
      } else if (foundResults.length === 1) {
         setMergeResult({
            mergedRecord: foundResults[0].record,
            mergeExplanation: t.singleRecord,
            confidenceScore: 1,
        });
      } else {
        toast({ title: t.noResults, description: t.noResultsDesc });
      }
    } catch (e: any) {
      setError(e.message || t.searchFailed);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMerge = async (resultsToMerge: SearchResult[]) => {
    setIsMerging(true);
    setError(null);
    try {
        const mergeInput: MergeDataInput = {
            nik,
            datasets: resultsToMerge.map(r => ({
                datasetName: r.datasetName,
                record: {
                    id: r.record.id,
                    nik: r.record.nik,
                    name: r.record.name,
                    address: r.record.address,
                    dob: r.record.dob,
                    phone: r.record.phone,
                    lastVisit: r.record.lastVisit,
                }
            })),
        };
        const result = await mergeData(mergeInput);
        setMergeResult(result);
    } catch (e: any) {
        setError(e.message || t.mergeFailed);
        setMergeResult(null);
    } finally {
        setIsMerging(false);
    }
  }

  const handleDatasetSelection = (datasetId: string) => {
    setSelectedDatasets(prev => 
        prev.includes(datasetId) 
            ? prev.filter(id => id !== datasetId) 
            : [...prev, datasetId]
    );
  };

  const handleConfirmMerge = () => {
    toast({
        title: t.mergeConfirmedTitle,
        description: t.mergeConfirmedDesc?.replace('{nik}', nik),
    });
    // Reset state after confirmation
    setNik('');
    setSearchResults([]);
    setMergeResult(null);
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="grid w-full sm:w-1/3 gap-1.5">
            <Label htmlFor="nik-merger">{t.nikLabel}</Label>
            <Input id="nik-merger" value={nik} onChange={e => setNik(e.target.value)} placeholder={t.nikPlaceholder} />
          </div>
          <div className="grid gap-1.5">
            <Label>{t.selectDataset}</Label>
            <div className="flex items-center space-x-4">
                {mockDatasetInfo.map(dataset => (
                    <div key={dataset.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={`merger-${dataset.id}`} 
                            checked={selectedDatasets.includes(dataset.id)}
                            onCheckedChange={() => handleDatasetSelection(dataset.id)}
                        />
                        <Label htmlFor={`merger-${dataset.id}`} className="font-normal">{dataset.name}</Label>
                    </div>
                ))}
            </div>
          </div>
          <Button onClick={handleSearch} disabled={isSearching || isMerging} className="w-full sm:w-auto">
            {isSearching || isMerging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            {isSearching ? t.searching : (isMerging ? t.merging : t.searchAndMerge)}
          </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t.errorTitle}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {(isSearching || isMerging) && (
            <div className="text-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">{isSearching ? t.loadingSearch : t.loadingMerge}</p>
            </div>
        )}

        {mergeResult && (
            <div>
                <Separator className="my-4" />
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Source Records */}
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="font-semibold">{t.sourceRecords} ({searchResults.length})</h3>
                        {searchResults.map((result, index) => (
                            <Card key={index} className="bg-muted/50">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base">{result.datasetName}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 text-xs space-y-2">
                                   <p><strong>{t.name}:</strong> {result.record.name}</p>
                                   <p><strong>{t.address}:</strong> {result.record.address}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Merged Record */}
                    <div className="md:col-span-2 space-y-4">
                         <h3 className="font-semibold">{t.mergedRecord}</h3>
                         <Card>
                            <CardHeader className="p-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-base">{t.masterData}</CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center gap-2">
                                                <Label className="text-sm">{t.confidence}</Label>
                                                <Progress value={mergeResult.confidenceScore * 100} className="w-24 h-2" />
                                                <span className="text-sm font-bold">{Math.round(mergeResult.confidenceScore * 100)}%</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t.confidenceTooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div><Label>{t.name}</Label><p>{mergeResult.mergedRecord.name}</p></div>
                                <div><Label>NIK</Label><p>{mergeResult.mergedRecord.nik}</p></div>
                                <div className="col-span-2"><Label>{t.address}</Label><p>{mergeResult.mergedRecord.address}</p></div>
                                <div><Label>{t.dob}</Label><p>{mergeResult.mergedRecord.dob || '-'}</p></div>
                                <div><Label>{t.phone}</Label><p>{mergeResult.mergedRecord.phone || '-'}</p></div>
                            </CardContent>
                            <CardFooter className="p-4 bg-muted/30">
                                <Alert className="border-l-4 border-primary bg-transparent p-3 shadow-none">
                                    <AlertTitle className="font-semibold flex items-center gap-2 text-sm"><HelpCircle className="h-4 w-4"/>{t.mergeLogic}</AlertTitle>
                                    <AlertDescription className="text-xs">{mergeResult.mergeExplanation}</AlertDescription>
                                </Alert>
                            </CardFooter>
                         </Card>
                         <div className="flex justify-end">
                             <Button onClick={handleConfirmMerge}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {t.confirmMerge}
                             </Button>
                         </div>
                    </div>
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
