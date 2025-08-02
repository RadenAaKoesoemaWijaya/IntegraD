
'use server';

/**
 * @fileOverview A data merging and deduplication AI agent.
 *
 * - mergeData - A function that handles the data merging process for a given NIK.
 * - MergeDataInput - The input type for the mergeData function.
 * - MergeDataOutput - The return type for the mergeData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecordSchema = z.object({
  id: z.string().describe('The unique ID of the record.'),
  nik: z.string().describe('The National Identity Number.'),
  name: z.string().describe('The name of the person.'),
  address: z.string().describe('The address of the person.'),
  dob: z.string().optional().describe('Date of birth.'),
  phone: z.string().optional().describe('Phone number.'),
  lastVisit: z.string().optional().describe('Last visit date.'),
});

const DatasetSchema = z.object({
  datasetName: z.string().describe('The name of the dataset where the record was found.'),
  record: RecordSchema,
});

const MergeDataInputSchema = z.object({
  nik: z.string().describe('The NIK to search for across datasets.'),
  datasets: z.array(DatasetSchema).describe('An array of datasets containing records that match the NIK.'),
});
export type MergeDataInput = z.infer<typeof MergeDataInputSchema>;

const MergeDataOutputSchema = z.object({
  mergedRecord: RecordSchema.describe('The final, merged record with the most complete and accurate information.'),
  mergeExplanation: z
    .string()
    .describe('A detailed explanation of how the merge was performed, which fields were chosen from which sources, and why.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A confidence score between 0 and 1 indicating the likelihood that all records belong to the same person.'),
});
export type MergeDataOutput = z.infer<typeof MergeDataOutputSchema>;

export async function mergeData(input: MergeDataInput): Promise<MergeDataOutput> {
  return mergeDataFlow(input);
}

const mergeDataPrompt = ai.definePrompt({
  name: 'mergeDataPrompt',
  input: { schema: MergeDataInputSchema },
  output: { schema: MergeDataOutputSchema },
  prompt: `
    You are an expert data integration and deduplication system for public health data.
    Your task is to merge multiple records for the same individual (identified by NIK) into a single, comprehensive, and accurate master record.

    You have been given the following records for NIK: {{{nik}}}

    {{#each datasets}}
    Dataset: {{{this.datasetName}}}
    Record ID: {{{this.record.id}}}
    - Name: {{{this.record.name}}}
    - Address: {{{this.record.address}}}
    - Date of Birth: {{{this.record.dob}}}
    - Phone: {{{this.record.phone}}}
    - Last Visit: {{{this.record.lastVisit}}}
    ---
    {{/each}}

    Please perform the following steps:
    1.  **Analyze and Compare:** Carefully compare the information from all source records. Identify inconsistencies, variations (e.g., typos, different formatting), and missing data.
    2.  **Select the Best Information:** For each field (name, address, dob, phone), choose the most accurate and complete value. Prefer more recent or more complete data. For example, a full address is better than a partial one. A full name is better than a nickname.
    3.  **Construct the Merged Record:** Create a single 'mergedRecord' using the best information selected. The NIK should be the same. The ID can be a new UUID or the one from the most reliable source.
    4.  **Provide a Merge Explanation:** In the 'mergeExplanation' field, clearly explain your reasoning for each choice. For example, "Chose the address from 'Seksi P2P' because it was more detailed than the one in 'Seksi Kesmas'." or "Selected the phone number from the most recent record."
    5.  **Calculate Confidence Score:** Based on the similarity of names, addresses, and other fields, provide a 'confidenceScore' from 0 to 1. A score of 1 means you are certain all records belong to the same person. A lower score indicates potential data mismatch.
  `,
});

const mergeDataFlow = ai.defineFlow(
  {
    name: 'mergeDataFlow',
    inputSchema: MergeDataInputSchema,
    outputSchema: MergeDataOutputSchema,
  },
  async (input) => {
    if (input.datasets.length === 0) {
        throw new Error('No datasets provided to merge.');
    }
    if (input.datasets.length === 1) {
        return {
            mergedRecord: input.datasets[0].record,
            mergeExplanation: 'Only one record was found, so no merge was necessary.',
            confidenceScore: 1.0,
        }
    }
    const { output } = await mergeDataPrompt(input);
    return output!;
  }
);
