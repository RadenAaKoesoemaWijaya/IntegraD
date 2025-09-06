
import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { calculateRiskRatio, calculateOddsRatio } from '../utils/statistics';

export const AdvancedAnalysisSchema = z.object({
  dataset: z.array(z.record(z.any())),
  exposure: z.string(),
  outcome: z.string(),
});

export const advancedAnalysisFlow = defineFlow(
  {
    name: 'advancedAnalysisFlow',
    inputSchema: AdvancedAnalysisSchema,
    outputSchema: z.object({
      riskRatio: z.number().optional(),
      oddsRatio: z.number().optional(),
      summary: z.string(),
    }),
  },
  async (input) => {
    const { dataset, exposure, outcome } = input;

    // Perform calculations
    const riskRatio = calculateRiskRatio(dataset, exposure, outcome);
    const oddsRatio = calculateOddsRatio(dataset, exposure, outcome);

    // Generate a summary
    const summary = `Analysis of the dataset with exposure '${exposure}' and outcome '${outcome}' shows a risk ratio of ${riskRatio?.toFixed(2)} and an odds ratio of ${oddsRatio?.toFixed(2)}.`;

    return {
      riskRatio,
      oddsRatio,
      summary,
    };
  }
);
