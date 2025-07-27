'use client';

import * as React from 'react';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Stethoscope, Syringe, TrendingUp, Filter, FileDown, Bot, User, Settings, Search, Loader2 } from 'lucide-react';
import { Logo } from './icons';
import { TrendDetector } from './trend-detector';
import Link from 'next/link';
import { getHealthData } from '@/lib/api';
import { HealthData } from '../data-manager/schema';

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

export function DashboardPage() {
  const [allHealthData, setAllHealthData] = React.useState<HealthData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [region, setRegion] = React.useState('Jakarta Pusat');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getHealthData();
            setAllHealthData(data);
        } catch (error) {
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
      <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">SehatData</h1>
        </div>
        <nav className="ml-4 hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/" className="text-primary font-semibold">Dashboard</Link>
            <Link href="/upload" className="hover:text-foreground transition-colors">Data Management</Link>
            <Link href="/search" className="hover:text-foreground transition-colors">NIK Search</Link>
            <Link href="/profile" className="hover:text-foreground transition-colors">Profile</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2 no-print">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={region} onValueChange={setRegion} disabled={loading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {uniqueRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <TrendDetector aggregatedData={JSON.stringify(aggregatedDataForAI, null, 2)} />
          <Button variant="outline" onClick={handlePrint}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Report
          </Button>
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
      {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
        <>
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground/90">
                  Health Overview: <span className="text-primary">{region}</span>
              </h2>
              <Button asChild>
                  <Link href="/search">
                      <Search className="mr-2 h-4 w-4" />
                      Pencarian NIK
                  </Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cases (YTD)</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isClient ? kpiData.totalCases.toLocaleString() : '...'}</div>
                  <p className="text-xs text-muted-foreground">
                    {isClient && kpiData.caseTrend !== 0 ? `${kpiData.caseTrend.toFixed(2)}% change` : 'No change data'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vaccinations</CardTitle>
                  <Syringe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isClient ? kpiData.totalVaccinations.toLocaleString() : '...'}</div>
                  <p className="text-xs text-muted-foreground">Year-to-date</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isClient ? kpiData.totalPatients.toLocaleString() : '...'}</div>
                  <p className="text-xs text-muted-foreground">Current estimate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Trend</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpiData.caseTrend > 0 ? 'Increasing' : (kpiData.caseTrend < 0 ? 'Decreasing' : 'Stable')}</div>
                  <p className="text-xs text-muted-foreground">Based on case volume</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-xl font-semibold text-foreground/90 mb-4">Monthly Trends</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Case and Vaccination Analysis</CardTitle>
                  <CardDescription>Monthly new cases vs. vaccinations for {region}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={filteredData} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="cases" fill="var(--color-cases)" radius={4} />
                      <Bar dataKey="vaccinations" fill="var(--color-vaccinations)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Patient Growth</CardTitle>
                  <CardDescription>Total registered patients over time in {region}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ patients: { label: 'Patients', color: 'hsl(var(--chart-1))' } }} className="h-[300px] w-full">
                    <LineChart data={filteredData} accessibilityLayer margin={{ left: 12, right: 12 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis tickFormatter={(value) => (value / 1000) + 'k'} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="patients" stroke="var(--color-patients)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      )}
      </main>
    </div>
  );
}
