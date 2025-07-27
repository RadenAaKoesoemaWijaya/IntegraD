import { NextResponse } from 'next/server';
import { z } from 'zod';
import { healthDataSchema, HealthData } from '@/components/data-manager/schema';

// In-memory "database"
let healthDataStore: HealthData[] = [
    { id: 'd27b8e5c-7d3d-4c3e-9b2f-9a1b2c3d4e5f', region: 'Jakarta Pusat', month: 'Jan', cases: 1200, vaccinations: 800, patients: 22000 },
    { id: 'd27b8e5c-7d3d-4c3e-9b2f-9a1b2c3d4e6g', region: 'Jakarta Pusat', month: 'Feb', cases: 1500, vaccinations: 950, patients: 23500 },
    { id: 'd27b8e5c-7d3d-4c3e-9b2f-9a1b2c3d4e7h', region: 'Jakarta Barat', month: 'Mar', cases: 850, vaccinations: 750, patients: 16500 },
    { id: 'd27b8e5c-7d3d-4c3e-9b2f-9a1b2c3d4e8i', region: 'Jakarta Selatan', month: 'Apr', cases: 1300, vaccinations: 1000, patients: 21000 },
];

export async function GET() {
  return NextResponse.json(healthDataStore);
}

const addHealthDataSchema = healthDataSchema.omit({ id: true });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = addHealthDataSchema.parse(json);
    const newRecord: HealthData = { ...data, id: crypto.randomUUID() };
    healthDataStore.push(newRecord);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
      const json = await request.json();
      const data = healthDataSchema.parse(json);
      const index = healthDataStore.findIndex(d => d.id === data.id);
      if (index === -1) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }
      healthDataStore[index] = data;
      return NextResponse.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

const deleteHealthDataSchema = z.object({ id: z.string() });

export async function DELETE(request: Request) {
    try {
        const json = await request.json();
        const { id } = deleteHealthDataSchema.parse(json);
        const initialLength = healthDataStore.length;
        healthDataStore = healthDataStore.filter(d => d.id !== id);
        if (healthDataStore.length === initialLength) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
