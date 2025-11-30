import { z } from 'zod';

// Schema for individual KPI indicator
export const kpiIndicatorSchema = z.object({
    name: z.string(),
    target: z.number(),
    unit: z.string(),
    dataSource: z.string().optional(), // Field name from health-data to track
});

export type KpiIndicator = z.infer<typeof kpiIndicatorSchema>;

// Schema for KPI configuration
export const programKpiSchema = z.object({
    id: z.string(),
    programId: z.string(),
    programName: z.string(),
    year: z.number(),
    goal: z.string(),
    indicators: z.array(kpiIndicatorSchema),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type ProgramKpi = z.infer<typeof programKpiSchema>;

// Schema for KPI tracking
export const kpiTrackingSchema = z.object({
    id: z.string(),
    programKpiId: z.string(),
    indicatorName: z.string(),
    actualValue: z.number(),
    achievement: z.number(), // percentage
    period: z.string(), // e.g., "2024-Q1", "2024-01"
    calculatedAt: z.date().optional(),
});

export type KpiTracking = z.infer<typeof kpiTrackingSchema>;

// Form schema for creating/editing KPI configuration
export const kpiConfigFormSchema = z.object({
    programId: z.string().min(1, 'Program ID is required'),
    programName: z.string().min(1, 'Program name is required'),
    year: z.number().min(2020).max(2100),
    goal: z.string().min(10, 'Goal must be at least 10 characters'),
    indicators: z.array(kpiIndicatorSchema).min(1, 'At least one indicator is required'),
});

export type KpiConfigForm = z.infer<typeof kpiConfigFormSchema>;
