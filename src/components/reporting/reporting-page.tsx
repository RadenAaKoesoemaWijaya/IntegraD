
'use client';

import * as React from 'react';
import { Header } from '../common/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { CalendarIcon, Download, FileText, Loader2, AlertTriangle, LineChart } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { getHealthData } from '@/lib/api';
import { HealthData } from '../data-manager/schema';
import { generateReport, GenerateReportOutput } from '@/ai/flows/generate-report-flow';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Label } from '../ui/label';

type ReportingPageProps = {
    dictionary: any;
    lang: string;
};

export function ReportingPage({ dictionary, lang }: ReportingPageProps) {
    const { reporting: t, reportTemplates, regions: regionTranslations, months: monthTranslations } = dictionary;
    const [template, setTemplate] = React.useState<string>('monthly_summary');
    const [date, setDate] = React.useState<DateRange | undefined>({ from: new Date(2024, 0, 1), to: addDays(new Date(2024, 0, 1), 30) });
    const [region, setRegion] = React.useState<string>('all');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [report, setReport] = React.useState<GenerateReportOutput | null>(null);
    const [allHealthData, setAllHealthData] = React.useState<HealthData[]>([]);
    
    React.useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getHealthData();
          setAllHealthData(data);
        } catch (error) {
          console.error("Failed to fetch health data:", error);
          setError(t.error);
        }
      };
      fetchData();
    }, [t.error]);

    const uniqueRegions = React.useMemo(() => {
        return [...new Set(allHealthData.map(d => d.region))];
    }, [allHealthData]);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            // Filter data based on selections
            const filteredData = allHealthData.filter(d => {
                const isRegionMatch = region === 'all' || d.region === region;
                // This date filtering is basic, would need a more robust solution for real data
                return isRegionMatch; 
            });

            if(filteredData.length === 0) {
                setReport({ summary: t.noData, detailedData: [] });
                return;
            }

            const result = await generateReport({
                reportType: template,
                data: JSON.stringify(filteredData),
                dateRange: `From ${date?.from ? format(date.from, 'PPP') : ''} to ${date?.to ? format(date.to, 'PPP') : ''}`,
                region: region,
            });
            setReport(result);
        } catch (e: any) {
            setError(e.message || t.error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };


    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Header dictionary={dictionary} lang={lang} />
            <main className="flex-1 p-4 sm:p-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    <div className="text-center no-print">
                        <h1 className="text-3xl font-bold">{t.title}</h1>
                        <p className="text-muted-foreground">{t.description}</p>
                    </div>

                    <Card className="no-print">
                        <CardHeader>
                            <CardTitle>Report Configuration</CardTitle>
                            <CardDescription>Select the parameters for your report.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="template">{t.selectTemplate}</Label>
                                <Select value={template} onValueChange={setTemplate}>
                                    <SelectTrigger id="template">
                                        <SelectValue placeholder={t.selectTemplatePlaceholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly_summary">{reportTemplates.monthly_summary}</SelectItem>
                                        <SelectItem value="vaccination_report">{reportTemplates.vaccination_report}</SelectItem>
                                        <SelectItem value="regional_comparison">{reportTemplates.regional_comparison}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="date-range">{t.dateRange}</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date-range"
                                            variant={"outline"}
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(date.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>{t.pickDate}</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="region">{t.region}</Label>
                                <Select value={region} onValueChange={setRegion}>
                                    <SelectTrigger id="region">
                                        <SelectValue placeholder={t.selectRegion} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t.allRegions}</SelectItem>
                                        {uniqueRegions.map(r => <SelectItem key={r} value={r}>{regionTranslations[r.toLowerCase().replace(' jakarta', '')] || r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                    {isLoading ? t.generating : t.generateReport}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {error && (
                        <Alert variant="destructive" className="no-print">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {report && (
                        <Card id="report-content">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{t.reportTitle}: {reportTemplates[template]}</CardTitle>
                                    <CardDescription>{t.generatedOn} {format(new Date(), 'PPP')}</CardDescription>
                                </div>
                                <Button onClick={handlePrint} className="no-print">
                                    <Download className="mr-2 h-4 w-4" />
                                    {t.downloadPdf}
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg flex items-center text-primary"><LineChart className="mr-2 h-5 w-5"/>{t.summary}</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{report.summary}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                     <h3 className="font-semibold text-lg">{t.dataDetails}</h3>
                                     <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Region</TableHead>
                                                    <TableHead>Month</TableHead>
                                                    <TableHead className="text-right">Cases</TableHead>
                                                    <TableHead className="text-right">Vaccinations</TableHead>
                                                    <TableHead className="text-right">Patients</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {report.detailedData.length > 0 ? report.detailedData.map(d => (
                                                     <TableRow key={d.id}>
                                                        <TableCell>{d.region}</TableCell>
                                                        <TableCell>{monthTranslations[d.month]}</TableCell>
                                                        <TableCell className="text-right">{d.cases.toLocaleString()}</TableCell>
                                                        <TableCell className="text-right">{d.vaccinations.toLocaleString()}</TableCell>
                                                        <TableCell className="text-right">{d.patients.toLocaleString()}</TableCell>
                                                     </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center">{t.noData}</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </main>
        </div>
    );
}
