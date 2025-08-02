
'use client';

import * as React from 'react';
import { Header } from '../common/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { BarChart, Bot, BrainCircuit, CheckCircle, Lightbulb, Loader2, Target, TrendingUp, AlertTriangle, ListChecks } from 'lucide-react';
import { evaluateProgram, EvaluateProgramInput, EvaluateProgramOutput } from '@/ai/flows/evaluate-program-flow';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';

type MonitoringPageProps = {
    dictionary: any;
    lang: string;
};

// Mock data for work programs
const workPrograms = (t: any) => ({
  stunting: {
    id: 'stunting',
    name: t.programs.stunting,
    goal: 'Menurunkan prevalensi stunting pada balita hingga di bawah 14% pada tahun 2024.',
    kpis: [
      { name: 'Cakupan Ibu Hamil Mendapat Tablet Tambah Darah (TTD)', target: 90, actual: 85, unit: '%' },
      { name: 'Cakupan Kunjungan Balita ke Posyandu', target: 85, actual: 78, unit: '%' },
      { name: 'Keluarga dengan Akses Sanitasi Layak', target: 80, actual: 82, unit: '%' },
    ],
  },
  immunization: {
    id: 'immunization',
    name: t.programs.immunization,
    goal: 'Mencapai cakupan Imunisasi Dasar Lengkap (IDL) sebesar 95% pada anak usia 12-23 bulan.',
    kpis: [
      { name: 'Cakupan Imunisasi BCG', target: 98, actual: 96, unit: '%' },
      { name: 'Cakupan Imunisasi DPT-HB-Hib 3', target: 95, actual: 92, unit: '%' },
      { name: 'Cakupan Imunisasi Campak-Rubella', target: 95, actual: 90, unit: '%' },
    ],
  },
  sanitation: {
    id: 'sanitation',
    name: t.programs.sanitation,
    goal: 'Mewujudkan 100% akses sanitasi layak dan aman bagi seluruh masyarakat.',
    kpis: [
      { name: 'Desa/Kelurahan Stop Buang Air Besar Sembarangan (SBS)', target: 90, actual: 88, unit: '%' },
      { name: 'Rumah Tangga dengan Pengelolaan Air Limbah Domestik', target: 75, actual: 68, unit: '%' },
      { name: 'Fasilitas Umum dengan Sanitasi Terkelola', target: 95, actual: 96, unit: '%' },
    ],
  },
});

export function MonitoringPage({ dictionary, lang }: MonitoringPageProps) {
  const { monitoring: t } = dictionary;
  const programs = workPrograms(t);
  const [selectedProgramId, setSelectedProgramId] = React.useState<string>('stunting');
  const [isLoading, setIsLoading] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<EvaluateProgramOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const selectedProgram = programs[selectedProgramId as keyof typeof programs];

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const input: EvaluateProgramInput = {
        programName: selectedProgram.name,
        programGoal: selectedProgram.goal,
        kpis: selectedProgram.kpis,
    };

    try {
        const result = await evaluateProgram(input);
        setAnalysisResult(result);
    } catch (e: any) {
        setError(e.message || t.error);
    } finally {
        setIsLoading(false);
    }
  };

  const getStatusChip = (achievement: number) => {
    if (achievement >= 100) return <Badge variant="default" className="bg-green-500">{t.kpi.status}: Tercapai</Badge>;
    if (achievement >= 90) return <Badge variant="secondary" className="bg-yellow-500 text-white">{t.kpi.status}: Hampir Tercapai</Badge>;
    return <Badge variant="destructive">{t.kpi.status}: Belum Tercapai</Badge>;
  };
  
  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">Tinggi</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Menengah</Badge>;
      case 'Low':
        return <Badge variant="default" className="bg-gray-500">Rendah</Badge>;
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header dictionary={dictionary} lang={lang} />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="text-2xl font-semibold text-foreground/90">{t.title}</h2>

          <Card>
            <CardHeader>
              <CardTitle>{t.selectProgram}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="grid gap-2 w-full sm:w-auto flex-grow">
                <label htmlFor="program-select" className="text-sm font-medium">{t.program}</label>
                <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                  <SelectTrigger id="program-select">
                    <SelectValue placeholder="Pilih program" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(programs).map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAnalyze} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                {isLoading ? t.analyzing : t.analyzeButton}
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-primary" />{t.kpiTitle}</CardTitle>
                <CardDescription>{t.kpiDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedProgram.kpis.map(kpi => {
                    const achievement = Math.round((kpi.actual / kpi.target) * 100);
                    return (
                        <div key={kpi.name}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium">{kpi.name}</p>
                                <span className="text-sm font-semibold">{achievement}%</span>
                            </div>
                            <Progress value={achievement} aria-label={`${kpi.name} achievement`} />
                            <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                                <span>{t.kpi.actual}: {kpi.actual}{kpi.unit}</span>
                                {getStatusChip(achievement)}
                                <span>{t.kpi.target}: {kpi.target}{kpi.unit}</span>
                            </div>
                        </div>
                    );
                })}
              </CardContent>
            </Card>

            {(isLoading || error || analysisResult) && (
              <div className="space-y-6 lg:col-span-2">
              {isLoading && (
                <Card>
                    <CardContent className="p-8 flex flex-col items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">{t.loading}</p>
                    </CardContent>
                </Card>
              )}
              {error && (
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {analysisResult && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center"><Bot className="mr-2 h-5 w-5 text-primary" />{t.evaluationTitle}</CardTitle>
                        <CardDescription>{t.evaluationDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm flex items-center mb-2"><TrendingUp className="mr-2 h-4 w-4"/>{t.evaluation.overallAssessment}</h4>
                                <p className="text-sm text-muted-foreground">{analysisResult.overallAssessment}</p>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold text-sm flex items-center mb-2"><ListChecks className="mr-2 h-4 w-4"/>{t.evaluation.keyFindings}</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    {analysisResult.keyFindings.map((finding, i) => <li key={i}>{finding}</li>)}
                                </ul>
                            </div>
                             <Separator />
                            <div>
                                <h4 className="font-semibold text-sm flex items-center mb-2"><AlertTriangle className="mr-2 h-4 w-4"/>{t.evaluation.riskAnalysis}</h4>
                                <p className="text-sm text-muted-foreground">{analysisResult.riskAnalysis}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary" />{t.recommendationsTitle}</CardTitle>
                        <CardDescription>{t.recommendationsDesc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        {analysisResult.recommendations.map((rec, i) => (
                            <div key={i} className="p-3 rounded-lg border bg-background/50">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-sm pr-4">{rec.recommendation}</p>
                                    {getPriorityBadge(rec.priority)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{rec.justification}</p>
                            </div>
                        ))}
                        </CardContent>
                    </Card>
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
