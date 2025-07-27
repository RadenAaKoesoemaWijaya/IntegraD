import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['Admin', 'Data Manager', 'Viewer']),
    status: z.enum(['Active', 'Inactive']),
});

export type User = z.infer<typeof userSchema>;
