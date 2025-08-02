
'use server';

/**
 * @fileOverview Generates a health data report based on specified criteria.
 *
 * - generateReport - A function to generate the report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthDataSchema = z.object({
    id: z.string(),
    region: z.string(),
    month: z.string(),
    cases: z.number(),
    vaccinations: z.number(),
    patients: z.number(),
});

const GenerateReportInputSchema = z.object({
  reportType: z.string().describe('The type of report to generate (e.g., "monthly_summary", "vaccination_report").'),
  data: z.string().describe('The health data in JSON format to be analyzed for the report.'),
  dateRange: z.string().describe('The date range for the report.'),
  region: z.string().describe('The region for the report (or "all").'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  summary: z.string().describe('An AI-generated summary and analysis of the provided data based on the report type.'),
  detailedData: z.array(HealthDataSchema).describe('The detailed data used for the report, returned in a structured format.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: { schema: GenerateReportInputSchema },
  output: { schema: z.object({ summary: z.string() }) },
  prompt: `
    You are a public health data analyst. Your task is to generate a report based on the provided data and criteria.
    
    Report Type: {{{reportType}}}
    Region: {{{region}}}
    Date Range: {{{dateRange}}}
    
    Data:
    {{{data}}}
    
    Please provide a concise summary and analysis of the data, tailored to the requested report type.
    - For a "monthly_summary", focus on overall trends, highs, and lows within the period.
    - For a "vaccination_report", focus on vaccination coverage, and its correlation with case numbers.
    - For a "regional_comparison", compare the performance of different regions if data is for 'all' regions.
    
    Generate a professional, insightful summary.
  `,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    // AI generates the summary
    const { output } = await generateReportPrompt(input);

    // We parse the raw data and return it alongside the summary
    const detailedData = JSON.parse(input.data);

    return {
      summary: output!.summary,
      detailedData: detailedData,
    };
  }
);
