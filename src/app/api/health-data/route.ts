import { NextResponse } from 'next/server';
import { z } from 'zod';
import { healthDataSchema, HealthData } from '@/components/data-manager/schema';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'health-data'));
    const data: HealthData[] = [];
    querySnapshot.forEach((doc) => {
      // @ts-ignore - Firestore data might not perfectly match schema yet, but we cast it
      data.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching health data:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

const addHealthDataSchema = healthDataSchema.omit({ id: true });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = addHealthDataSchema.parse(json);

    const docRef = await addDoc(collection(db, 'health-data'), data);
    const newRecord: HealthData = { ...data, id: docRef.id };

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error adding health data:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    const data = healthDataSchema.parse(json);

    const docRef = doc(db, 'health-data', data.id);
    // Exclude ID from the update data as it's the key
    const { id, ...updateData } = data;
    await updateDoc(docRef, updateData);

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating health data:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const deleteHealthDataSchema = z.object({ id: z.string() });

export async function DELETE(request: Request) {
  try {
    const json = await request.json();
    const { id } = deleteHealthDataSchema.parse(json);

    await deleteDoc(doc(db, 'health-data', id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error deleting health data:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
