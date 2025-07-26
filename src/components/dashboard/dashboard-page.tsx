'use client';

import * as React from 'react';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Stethoscope, Syringe, TrendingUp, Filter, FileDown, Bot } from 'lucide-react';
import { Logo } from './icons';
import { TrendDetector } from './trend-detector';

const allHealthData = [
  { region: 'Jakarta', month: 'Jan', cases: 1200, vaccinations: 800, patients: 22000 },
  { region: 'Jakarta', month: 'Feb', cases: 1500, vaccinations: 950, patients: 23500 },
  { region: 'Jakarta', month: 'Mar', cases: 1300, vaccinations: 1100, patients: 24000 },
  { region: 'Jakarta', month: 'Apr', cases: 1700, vaccinations: 1250, patients: 25500 },
  { region: 'Jakarta', month: 'May', cases: 1600, vaccinations: 1400, patients: 26000 },
  { region: 'Jakarta', month: 'Jun', cases: 1900, vaccinations: 1550, patients: 27500 },
  { region: 'Bandung', month: 'Jan', cases: 800, vaccinations: 600, patients: 15000 },
  { region: 'Bandung', month: 'Feb', cases: 950, vaccinations: 700, patients: 16000 },
  { region: 'Bandung', month: 'Mar', cases: 850, vaccinations: 750, patients: 16500 },
  { region: 'Bandung', month: 'Apr', cases: 1100, vaccinations: 850, patients: 17500 },
  { region: 'Bandung', month: 'May', cases: 1000, vaccinations: 950, patients: 18000 },
  { region: 'Bandung', month: 'Jun', cases: 1200, vaccinations: 1100, patients: 19000 },
  { region: 'Surabaya', month: 'Jan', cases: 1000, vaccinations: 700, patients: 18000 },
  { region: 'Surabaya', month: 'Feb', cases: 1100, vaccinations: 800, patients: 19000 },
  { region: 'Surabaya', month: 'Mar', cases: 950, vaccinations: 900, patients: 19500 },
  { region: 'Surabaya', month: 'Apr', cases: 1300, vaccinations: 1000, patients: 21000 },
  { region: 'Surabaya', month: 'May', cases: 1250, vaccinations: 1150, patients: 22000 },
  { region: 'Surabaya', month: 'Jun', cases: 1400, vaccinations: 1300, patients: 23000 },
];

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
  const [region, setRegion] = React.useState('Jakarta');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredData = React.useMemo(() => {
    return allHealthData.filter((d) => d.region === region);
  }, [region]);

  const kpiData = React.useMemo(() => {
    const data = filteredData;
    const totalCases = data.reduce((acc, item) => acc + item.cases, 0);
    const totalVaccinations = data.reduce((acc, item) => acc + item.vaccinations, 0);
    const totalPatients = data[data.length - 1]?.patients || 0;
    const caseTrend = ((data[data.length - 1]?.cases - data[0]?.cases) / data[0]?.cases) * 100;
    return { totalCases, totalVaccinations, totalPatients, caseTrend };
  }, [filteredData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">SehatData</h1>
        </div>
        <div className="ml-auto flex items-center gap-2 no-print">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jakarta">Jakarta</SelectItem>
                <SelectItem value="Bandung">Bandung</SelectItem>
                <SelectItem value="Surabaya">Surabaya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TrendDetector aggregatedData={JSON.stringify(aggregatedDataForAI, null, 2)} />
          <Button variant="outline" onClick={handlePrint}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <section>
          <h2 className="text-xl font-semibold text-foreground/90 mb-4">
            Health Overview: <span className="text-primary">{region}</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases (Last 6 Mo.)</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isClient ? kpiData.totalCases.toLocaleString() : kpiData.totalCases}</div>
                <p className="text-xs text-muted-foreground">
                  {isClient ? kpiData.caseTrend.toFixed(2) : kpiData.caseTrend.toFixed(0)}% change
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vaccinations</CardTitle>
                <Syringe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isClient ? kpiData.totalVaccinations.toLocaleString() : kpiData.totalVaccinations}</div>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isClient ? kpiData.totalPatients.toLocaleString() : kpiData.totalPatients}</div>
                <p className="text-xs text-muted-foreground">Current estimate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Trend</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData.caseTrend > 0 ? 'Increasing' : 'Decreasing'}</div>
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
      </main>
    </div>
  );
}
