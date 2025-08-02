
'use client';

import * as React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Stethoscope, Syringe, TrendingUp, Filter, FileDown, Search, Loader2, AlertTriangle } from 'lucide-react';
import { TrendDetector } from './trend-detector';
import Link from 'next/link';
import { getHealthData } from '@/lib/api';
import { HealthData } from '../data-manager/schema';
import { Header } from '../common/header';
import { DataMerger } from './data-merger';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const chartConfig = {
  cases: { label: 'New Cases', color: 'hsl(var(--chart-1))' },
  vaccinations: { label: 'Vaccinations', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const aggregatedDataForAI = {
    region: 'All',
    timeFrame: '2024-01-01 to 2024-06-30',
    demographics: { age_groups: ['0-18', '19-60', '60+'] },
    data: [
      { disease: 'Dengue Fever', cases: 15400, trend: 'increasing' },
      { disease: 'COVID-19', cases: 11200, trend: 'decreasing' },
      { disease: 'Tuberculosis', cases: 9100, trend: 'stable' },
      { disease: 'Common Cold', cases: 45000, trend: 'stable' },
    ],
  };

type DashboardPageProps = {
    dictionary: any;
    lang: string;
};

export function DashboardPage({ dictionary, lang }: DashboardPageProps) {
  const [allHealthData, setAllHealthData] = React.useState<HealthData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [region, setRegion] = React.useState('Jakarta Pusat');
  const [isClient, setIsClient] = React.useState(false);
  const { dashboard: t, regions } = dictionary;
  
  const barChartConfig = {
    cases: { label: t.totalCases, color: 'hsl(var(--chart-1))' },
    vaccinations: { label: t.totalVaccinations, color: 'hsl(var(--chart-2))' },
  } satisfies ChartConfig;

  const lineChartConfig = {
    patients: { label: t.activePatients, color: 'hsl(var(--chart-1))' }
  } satisfies ChartConfig;

  React.useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getHealthData();
            setAllHealthData(data);
        } catch (error) {
            setError("Gagal memuat data dasbor. Silakan coba lagi nanti.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    return allHealthData.filter((d) => d.region === region);
  }, [region, allHealthData]);

  const kpiData = React.useMemo(() => {
    const data = filteredData;
    if (data.length === 0) {
      return { totalCases: 0, totalVaccinations: 0, totalPatients: 0, caseTrend: 0 };
    }
    const totalCases = data.reduce((acc, item) => acc + item.cases, 0);
    const totalVaccinations = data.reduce((acc, item) => acc + item.vaccinations, 0);
    const totalPatients = data[data.length - 1]?.patients || 0;
    const caseTrend = data.length > 1 ? ((data[data.length - 1]?.cases - data[0]?.cases) / data[0]?.cases) * 100 : 0;
    return { totalCases, totalVaccinations, totalPatients, caseTrend };
  }, [filteredData]);

  const handlePrint = () => {
    window.print();
  };
  
  const uniqueRegions = React.useMemo(() => {
    return [...new Set(allHealthData.map(d => d.region))];
  }, [allHealthData]);


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header dictionary={dictionary} lang={lang} />
      <main className="flex-1 p-4 sm:p-6">
      {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
            <Alert variant="destructive" className="max-w-4xl mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Terjadi Kesalahan</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : (
        <div className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground/90">
                  {t.healthOverview}: <span className="text-primary">{region}</span>
              </h2>
              <Button asChild>
                  <Link href={`/${lang}/search`}>
                      <Search className="mr-2 h-4 w-4" />
                      {t.searchNIK}
                  </Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalCases}</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isClient ? kpiData.totalCases.toLocaleString() : '...'}</div>
                  <p className="text-xs text-muted-foreground">
                    {isClient && kpiData.caseTrend !== 0 ? `${kpiData.caseTrend.toFixed(2)}% ${t.caseChange}` : t.basedOnCaseVolume}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalVaccinations}</CardTitle>
                  <Syringe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isClient ? kpiData.totalVaccinations.toLocaleString() : '...'}</div>
                  <p className="text-xs text-muted-foreground">{t.ytd}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.activePatients}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isClient ? kpiData.totalPatients.toLocaleString() : '...'}</div>
                  <p className="text-xs text-muted-foreground">{t.currentEstimate}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.dataTrend}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.caseTrend > 0 ? t.increasing : (kpiData.caseTrend < 0 ? t.decreasing : t.stable)}</div>
                  <p className="text-xs text-muted-foreground">{t.basedOnCaseVolume}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <DataMerger dictionary={dictionary} />

          <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground/90">{t.monthlyTrends}</h2>
                <div className="flex items-center gap-2 no-print">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={region} onValueChange={setRegion} disabled={loading}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t.selectRegion} />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </div>
                    <TrendDetector aggregatedData={JSON.stringify(aggregatedDataForAI, null, 2)} dictionary={dictionary.trendDetector} buttonText={dictionary.dashboard.detectTrends} />
                    <Button variant="outline" onClick={handlePrint}>
                        <FileDown className="mr-2 h-4 w-4" />
                        {t.exportReport}
                    </Button>
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t.caseVaccinationAnalysis}</CardTitle>
                  <CardDescription>{t.caseVsVaccination} {region}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                        <BarChart data={filteredData} accessibilityLayer>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="cases" fill="var(--color-cases)" radius={4} name={barChartConfig.cases.label} />
                          <Bar dataKey="vaccinations" fill="var(--color-vaccinations)" radius={4} name={barChartConfig.vaccinations.label} />
                        </BarChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t.patientGrowth}</CardTitle>
                  <CardDescription>{t.patientGrowthDesc} {region}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
                        <LineChart data={filteredData} accessibilityLayer margin={{ left: 12, right: 12 }}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                          <YAxis tickFormatter={(value) => (value / 1000) + 'k'} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="patients" stroke="var(--color-patients)" strokeWidth={2} dot={false} name={lineChartConfig.patients.label} />
                        </LineChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      )}
      </main>
    </div>
  );
}

