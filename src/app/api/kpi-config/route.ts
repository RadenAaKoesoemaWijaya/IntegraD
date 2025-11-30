import { NextResponse } from 'next/server';
import { getKpiConfigs, createKpiConfig, updateKpiConfig, deleteKpiConfig } from '@/lib/kpi-api';
import { programKpiSchema } from '@/components/monitoring/kpi-schema';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year');

        const configs = await getKpiConfigs(year ? parseInt(year) : undefined);
        return NextResponse.json(configs, { status: 200 });
    } catch (error: any) {
        console.error('Get KPI configs error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch KPI configurations' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = programKpiSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(body);

        const id = await createKpiConfig(validated);
        return NextResponse.json({ id, message: 'KPI configuration created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Create KPI config error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create KPI configuration' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await updateKpiConfig(id, updates);
        return NextResponse.json({ message: 'KPI configuration updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Update KPI config error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update KPI configuration' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await deleteKpiConfig(id);
        return NextResponse.json({ message: 'KPI configuration deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Delete KPI config error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete KPI configuration' }, { status: 500 });
    }
}
