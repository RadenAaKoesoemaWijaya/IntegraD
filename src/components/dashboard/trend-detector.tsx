'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bot, FileText, Lightbulb, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { detectHealthTrends, DetectHealthTrendsOutput } from '@/ai/flows/detect-health-trends';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';

type TrendDetectorProps = {
  aggregatedData: string;
  dictionary: any;
  buttonText: string;
};

export function TrendDetector({ aggregatedData, dictionary: t, buttonText }: TrendDetectorProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<DetectHealthTrendsOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await detectHealthTrends({ aggregatedData });
      setResult(output);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              {t.dataToAnalyze}
            </h4>
            <pre className="mt-2 h-[150px] w-full overflow-auto rounded-md bg-secondary/50 p-3 text-xs text-secondary-foreground">
              <code>{aggregatedData}</code>
            </pre>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center rounded-md border border-dashed p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">{t.loading}</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t.failed}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div className="space-y-4">
               <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">{t.complete}</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                    {t.completeDesc}
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center text-primary">
                  <Bot className="mr-2 h-4 w-4" />
                  {t.identifiedTrends}
                </h4>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.trends}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium flex items-center text-primary">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {t.recommendations}
                </h4>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.recommendations}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {t.close}
          </Button>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.analyzing}
              </>
            ) : (
              t.reanalyze
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
