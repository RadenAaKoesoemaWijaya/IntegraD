
'use server';

/**
 * @fileOverview Evaluates the performance of a health program and provides recommendations.
 *
 * - evaluateProgram - A function to run the program evaluation.
 * - EvaluateProgramInput - The input type for the evaluateProgram function.
 * - EvaluateProgramOutput - The return type for the evaluateProgram function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const KpiSchema = z.object({
  name: z.string().describe('Name of the Key Performance Indicator.'),
  target: z.number().describe('The target value for the KPI.'),
  actual: z.number().describe('The actual value achieved for the KPI.'),
  unit: z.string().describe('The unit of measurement for the KPI (e.g., %, cases, people).'),
});

const EvaluateProgramInputSchema = z.object({
  programName: z.string().describe('The name of the health program being evaluated.'),
  programGoal: z.string().describe('The main goal or objective of the program.'),
  kpis: z.array(KpiSchema).describe('A list of Key Performance Indicators (KPIs) for the program.'),
  additionalContext: z.string().optional().describe('Any additional context or qualitative data about the program.'),
});
export type EvaluateProgramInput = z.infer<typeof EvaluateProgramInputSchema>;

const EvaluateProgramOutputSchema = z.object({
  overallAssessment: z.string().describe("A high-level summary of the program's performance, including whether it's on track, needs improvement, or is at risk."),
  keyFindings: z.array(z.string()).describe('A list of the most significant findings from the analysis, including strengths and weaknesses.'),
  riskAnalysis: z.string().describe('An analysis of potential risks that could impact the program\'s success.'),
  recommendations: z.array(z.object({
    recommendation: z.string().describe('A specific, actionable recommendation.'),
    priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level of the recommendation.'),
    justification: z.string().describe('The reasoning behind the recommendation.'),
  })).describe('A list of strategic recommendations to improve program performance.'),
});
export type EvaluateProgramOutput = z.infer<typeof EvaluateProgramOutputSchema>;

export async function evaluateProgram(input: EvaluateProgramInput): Promise<EvaluateProgramOutput> {
  return evaluateProgramFlow(input);
}

const evaluateProgramPrompt = ai.definePrompt({
  name: 'evaluateProgramPrompt',
  input: { schema: EvaluateProgramInputSchema },
  output: { schema: EvaluateProgramOutputSchema },
  prompt: `
    You are an expert public health program evaluator. Your task is to analyze the performance of a health program based on the provided data.
    Act as an expert system and recommendation system.

    Program for Evaluation:
    - Name: {{{programName}}}
    - Goal: {{{programGoal}}}
    {{#if additionalContext}}
    - Additional Context: {{{additionalContext}}}
    {{/if}}

    Key Performance Indicators (KPIs):
    | Indicator | Target | Actual | Unit |
    |---|---|---|---|
    {{#each kpis}}
    | {{{name}}} | {{{target}}} | {{{actual}}} | {{{unit}}} |
    {{/each}}

    Please perform the following analysis:
    1.  **Overall Assessment:** Provide a concise, high-level summary of the program's performance. State clearly if the program is "On Track", "Needs Improvement", or "At Risk".
    2.  **Key Findings:** Analyze the KPI data to identify significant strengths and weaknesses. Calculate the achievement percentage for each KPI (actual/target * 100). Highlight areas of high achievement and areas that are lagging.
    3.  **Risk Analysis:** Identify potential internal or external risks that could hinder the program's future success based on the current data and context.
    4.  **Strategic Recommendations:** Based on your analysis, provide a list of specific, actionable recommendations. For each recommendation, assign a priority (High, Medium, Low) and provide a clear justification.
  `,
});

const evaluateProgramFlow = ai.defineFlow(
  {
    name: 'evaluateProgramFlow',
    inputSchema: EvaluateProgramInputSchema,
    outputSchema: EvaluateProgramOutputSchema,
  },
  async (input) => {
    const { output } = await evaluateProgramPrompt(input);
    return output!;
  }
);
