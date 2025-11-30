
'use client';

import * as React from 'react';
import { Header } from '../common/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Bot, BrainCircuit, Loader2, Target, TrendingUp, AlertTriangle, ListChecks, Settings, Plus } from 'lucide-react';
import { evaluateProgram, EvaluateProgramInput, EvaluateProgramOutput } from '@/ai/flows/evaluate-program-flow';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import type { ProgramKpi } from './kpi-schema';

type MonitoringPageProps = {
  dictionary: any;
  lang: string;
};

export function MonitoringPage({ dictionary, lang }: MonitoringPageProps) {
  const { monitoring: t } = dictionary;
  const currentYear = new Date().getFullYear();

  const [kpiConfigs, setKpiConfigs] = React.useState<ProgramKpi[]>([]);
  const [selectedProgramId, setSelectedProgramId] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingConfigs, setIsLoadingConfigs] = React.useState(true);
  const [analysisResult, setAnalysisResult] = React.useState<EvaluateProgramOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const selectedProgram = kpiConfigs.find(config => config.programId === selectedProgramId);

  // Load KPI configurations
  React.useEffect(() => {
    async function loadKpiConfigs() {
      try {
        const response = await fetch(`/api/kpi-config?year=${currentYear}`);
        if (!response.ok) throw new Error('Failed to load KPI configurations');
        const data = await response.json();
        setKpiConfigs(data);
        if (data.length > 0 && !selectedProgramId) {
          setSelectedProgramId(data[0].programId);
        }
      } catch (e: any) {
        console.error('Error loading KPI configs:', e);
        setError(e.message);
      } finally {
        setIsLoadingConfigs(false);
      }
    }
    loadKpiConfigs();
  }, [currentYear]);

  const handleAnalyze = async () => {
    if (!selectedProgram) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const input: EvaluateProgramInput = {
      programName: selectedProgram.programName,
      programGoal: selectedProgram.goal,
      kpis: selectedProgram.indicators.map(ind => ({
        name: ind.name,
        target: ind.target,
        actual: ind.target * 0.9, // TODO: Calculate from real data
        unit: ind.unit,
      })),
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
    if (achievement >= 100) return <Badge variant="default" className="bg-green-500">{t.kpi.status}: {t.kpi.achieved}</Badge>;
    if (achievement >= 90) return <Badge variant="secondary" className="bg-yellow-500 text-white">{t.kpi.status}: {t.kpi.nearlyAchieved}</Badge>;
    return <Badge variant="destructive">{t.kpi.status}: {t.kpi.notAchieved}</Badge>;
  };

  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">{t.priority.high}</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">{t.priority.medium}</Badge>;
      case 'Low':
        return <Badge variant="default" className="bg-gray-500">{t.priority.low}</Badge>;
    }
  };

  if (isLoadingConfigs) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header dictionary={dictionary} lang={lang} />
        <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header dictionary={dictionary} lang={lang} />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground/90">{t.title}</h2>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              {t.manageKpi}
            </Button>
          </div>

          {kpiConfigs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t.noConfigTitle}</h3>
                <p className="text-muted-foreground mb-4">
                  {t.noConfigDesc.replace('{year}', currentYear.toString())}
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t.addKpiConfig}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{t.selectProgram}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <div className="grid gap-2 w-full sm:w-auto flex-grow">
                    <label htmlFor="program-select" className="text-sm font-medium">{t.program}</label>
                    <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                      <SelectTrigger id="program-select">
                        <SelectValue placeholder={t.selectProgramPlaceholder || t.selectProgram} />
                      </SelectTrigger>
                      <SelectContent>
                        {kpiConfigs.map(config => (
                          <SelectItem key={config.programId} value={config.programId}>
                            {config.programName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAnalyze} disabled={isLoading || !selectedProgram} className="w-full sm:w-auto">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                    {isLoading ? t.analyzing : t.analyzeButton}
                  </Button>
                </CardContent>
              </Card>

              {selectedProgram && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-primary" />{t.kpiTitle}</CardTitle>
                      <CardDescription>{t.kpiDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedProgram.indicators.map(indicator => {
                        const actual = indicator.target * 0.9; // TODO: Calculate from real data
                        const achievement = Math.round((actual / indicator.target) * 100);
                        return (
                          <div key={indicator.name}>
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-medium">{indicator.name}</p>
                              <span className="text-sm font-semibold">{achievement}%</span>
                            </div>
                            <Progress value={achievement} aria-label={`${indicator.name} achievement`} />
                            <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                              <span>{t.kpi.actual}: {actual.toFixed(1)}{indicator.unit}</span>
                              {getStatusChip(achievement)}
                              <span>{t.kpi.target}: {indicator.target}{indicator.unit}</span>
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
                                <h4 className="font-semibold text-sm flex items-center mb-2"><TrendingUp className="mr-2 h-4 w-4" />{t.evaluation.overallAssessment}</h4>
                                <p className="text-sm text-muted-foreground">{analysisResult.overallAssessment}</p>
                              </div>
                              <Separator />
                              <div>
                                <h4 className="font-semibold text-sm flex items-center mb-2"><ListChecks className="mr-2 h-4 w-4" />{t.evaluation.keyFindings}</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                  {analysisResult.keyFindings.map((finding, i) => <li key={i}>{finding}</li>)}
                                </ul>
                              </div>
                              <Separator />
                              <div>
                                <h4 className="font-semibold text-sm flex items-center mb-2"><AlertTriangle className="mr-2 h-4 w-4" />{t.evaluation.riskAnalysis}</h4>
                                <p className="text-sm text-muted-foreground">{analysisResult.riskAnalysis}</p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-primary" />{t.recommendationsTitle}</CardTitle>
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
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
