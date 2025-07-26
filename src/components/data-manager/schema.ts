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


export const initialHealthData: HealthData[] = [
    { id: crypto.randomUUID(), region: 'Jakarta', month: 'Jan', cases: 1200, vaccinations: 800, patients: 22000 },
    { id: crypto.randomUUID(), region: 'Jakarta', month: 'Feb', cases: 1500, vaccinations: 950, patients: 23500 },
    { id: crypto.randomUUID(), region: 'Bandung', month: 'Mar', cases: 850, vaccinations: 750, patients: 16500 },
    { id: crypto.randomUUID(), region: 'Surabaya', month: 'Apr', cases: 1300, vaccinations: 1000, patients: 21000 },
];
