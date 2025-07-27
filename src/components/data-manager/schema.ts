import { z } from 'zod';

export const healthDataSchema = z.object({
  id: z.string().uuid(),
  region: z.string().min(1, { message: 'Region is required.' }),
  month: z.enum(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']),
  cases: z.number().int().positive(),
  vaccinations: z.number().int().positive(),
  patients: z.number().int().positive(),
});

export type HealthData = z.infer<typeof healthDataSchema>;

export const programManagerSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type ProgramManager = z.infer<typeof programManagerSchema>;
