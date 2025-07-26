'use server';

/**
 * @fileOverview Identifies significant health trends and patterns in aggregated health data.
 *
 * - detectHealthTrends - A function to detect health trends.
 * - DetectHealthTrendsInput - The input type for the detectHealthTrends function.
 * - DetectHealthTrendsOutput - The return type for the detectHealthTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectHealthTrendsInputSchema = z.object({
  aggregatedData: z
    .string()
    .describe('Aggregated health data in JSON format, including region, time frame, and demographics.'),
});
export type DetectHealthTrendsInput = z.infer<typeof DetectHealthTrendsInputSchema>;

const DetectHealthTrendsOutputSchema = z.object({
  trends: z
    .string()
    .describe('A summary of identified health trends and patterns.'),
  recommendations: z
    .string()
    .describe('Recommendations for resource prioritization based on the identified trends.'),
});

export type DetectHealthTrendsOutput = z.infer<typeof DetectHealthTrendsOutputSchema>;

export async function detectHealthTrends(input: DetectHealthTrendsInput): Promise<DetectHealthTrendsOutput> {
  return detectHealthTrendsFlow(input);
}

const detectHealthTrendsPrompt = ai.definePrompt({
  name: 'detectHealthTrendsPrompt',
  input: {schema: DetectHealthTrendsInputSchema},
  output: {schema: DetectHealthTrendsOutputSchema},
  prompt: `You are an expert health analyst tasked with identifying significant health trends and patterns from aggregated data.

  Analyze the following aggregated health data, considering region, time frame, and demographics, to identify emerging health issues.
  Based on these trends, provide recommendations for resource prioritization.

  Aggregated Health Data:
  {{aggregatedData}}

  Focus on identifying key trends and patterns that indicate potential health crises or areas needing immediate attention.
  Provide actionable recommendations that can help prioritize resources effectively to address these issues.
  `, // removed Handlebars {{format}} helper due to invalid usage
});

const detectHealthTrendsFlow = ai.defineFlow(
  {
    name: 'detectHealthTrendsFlow',
    inputSchema: DetectHealthTrendsInputSchema,
    outputSchema: DetectHealthTrendsOutputSchema,
  },
  async input => {
    const {output} = await detectHealthTrendsPrompt(input);
    return output!;
  }
);

