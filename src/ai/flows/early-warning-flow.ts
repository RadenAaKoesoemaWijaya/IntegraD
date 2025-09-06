
import { flow } from 'genkit';
import { z } from 'zod';

// Define the input schema for the early warning flow
const IoTDataSchema = z.object({
  deviceId: z.string(),
  timestamp: z.string(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  mosquitoCount: z.number().optional(),
});

// Define the output schema for the early warning flow
const EarlyWarningSchema = z.object({
  alertId: z.string(),
  disease: z.string(),
  riskLevel: z.enum(['Rendah', 'Sedang', 'Tinggi']),
  recommendations: z.array(z.string()),
});

export const earlyWarningFlow = flow(
  {
    name: 'earlyWarningFlow',
    inputSchema: z.array(IoTDataSchema),
    outputSchema: EarlyWarningSchema,
  },
  async (iotData) => {
    // In a real-world scenario, you would have a more complex logic to analyze the data.
    // This could involve machine learning models, statistical analysis, and more.

    // For this example, we'll use a simple rule-based approach.
    const highRiskData = iotData.filter(
      (data) =>
        (data.temperature && data.temperature > 30) ||
        (data.humidity && data.humidity > 80) ||
        (data.mosquitoCount && data.mosquitoCount > 100)
    );

    if (highRiskData.length > 0) {
      return {
        alertId: `alert-${Date.now()}`,
        disease: 'Demam Berdarah',
        riskLevel: 'Tinggi',
        recommendations: [
          'Lakukan fogging di area yang terkena.',
          'Tingkatkan surveilans di fasilitas kesehatan terdekat.',
          'Sediakan konseling bagi warga tentang cara mencegah demam berdarah.',
        ],
      };
    }

    return {
      alertId: `alert-${Date.now()}`,
      disease: 'Tidak ada',
      riskLevel: 'Rendah',
      recommendations: ['Tidak ada tindakan yang diperlukan saat ini.'],
    };
  }
);
