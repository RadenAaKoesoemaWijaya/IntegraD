
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { runAdvancedAnalysis } from '@/lib/api'; // This function will be created later

export function AdvancedAnalysis({ dictionary, lang, healthData }) {
  const [loading, setLoading] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState(null);
  const [exposure, setExposure] = React.useState('');
  const [outcome, setOutcome] = React.useState('');
  const { toast } = useToast();
  const t = dictionary.advancedAnalysis;

  const handleAnalysis = async () => {
    if (!exposure || !outcome) {
      toast({ variant: 'destructive', title: t.errorTitle, description: t.errorInput });
      return;
    }

    try {
      setLoading(true);
      const result = await runAdvancedAnalysis({ dataset: healthData, exposure, outcome });
      setAnalysisResult(result);
    } catch (error) {
      toast({ variant: 'destructive', title: t.errorTitle, description: t.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exposure">{t.exposureVariable}</Label>
            <Select value={exposure} onValueChange={setExposure}>
              <SelectTrigger id="exposure">
                <SelectValue placeholder={t.selectExposure} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(healthData[0] || {}).map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="outcome">{t.outcomeVariable}</Label>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger id="outcome">
                <SelectValue placeholder={t.selectOutcome} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(healthData[0] || {}).map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? t.loading : t.calculate}
        </Button>

        {analysisResult && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">{t.analysisResults}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t.riskRatio}</Label>
                <p>{analysisResult.riskRatio?.toFixed(2) ?? t.notAvailable}</p>
              </div>
              <div>
                <Label>{t.oddsRatio}</Label>
                <p>{analysisResult.oddsRatio?.toFixed(2) ?? t.notAvailable}</p>
              </div>
            </div>
            <div>
              <Label>{t.summary}</Label>
              <p>{analysisResult.summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
