import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import type { ProgramKpi, KpiTracking } from '@/components/monitoring/kpi-schema';

// KPI Configuration CRUD operations
export async function createKpiConfig(kpiConfig: Omit<ProgramKpi, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'program-kpis'), {
        ...kpiConfig,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function getKpiConfigs(year?: number): Promise<ProgramKpi[]> {
    let q = collection(db, 'program-kpis');

    if (year) {
        q = query(collection(db, 'program-kpis'), where('year', '==', year)) as any;
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
    })) as ProgramKpi[];
}

export async function getKpiConfigByProgramId(programId: string, year: number): Promise<ProgramKpi | null> {
    const q = query(
        collection(db, 'program-kpis'),
        where('programId', '==', programId),
        where('year', '==', year)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
    } as ProgramKpi;
}

export async function updateKpiConfig(id: string, updates: Partial<ProgramKpi>): Promise<void> {
    const docRef = doc(db, 'program-kpis', id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteKpiConfig(id: string): Promise<void> {
    await deleteDoc(doc(db, 'program-kpis', id));
}

// KPI Tracking operations
export async function saveKpiTracking(tracking: Omit<KpiTracking, 'id' | 'calculatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'kpi-tracking'), {
        ...tracking,
        calculatedAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function getKpiTracking(programKpiId: string, period?: string): Promise<KpiTracking[]> {
    let q = query(collection(db, 'kpi-tracking'), where('programKpiId', '==', programKpiId));

    if (period) {
        q = query(q, where('period', '==', period));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        calculatedAt: doc.data().calculatedAt?.toDate(),
    })) as KpiTracking[];
}
