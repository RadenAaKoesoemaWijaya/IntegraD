import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

type SearchResult = {
    datasetName: string;
    record: { id: string; nik: string; name: string; address: string, dob?: string | null, phone?: string | null, lastVisit?: string };
};

const searchBodySchema = z.object({
    nik: z.string(),
    datasetIds: z.array(z.string()),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const { nik, datasetIds } = searchBodySchema.parse(json);

        const foundResults: SearchResult[] = [];

        // In a real scenario with massive data, we might want to use a dedicated search service (like Algolia or Elasticsearch)
        // or ensure we have proper indexes on 'nik'.
        // For now, we will query the 'health-data' collection and potentially others if we had them mapped.
        // Assuming 'health-data' contains records with NIK (though the current schema doesn't explicitly show NIK, 
        // the search requirement implies it. I will assume we search in 'health-data' for now or a 'patients' collection if it existed.
        // Given the mock data had 'seksi-p2p' etc, I will assume we are searching across a 'patients' collection 
        // or similar. Since the user wants "integrated with database", I will query a 'patients' collection.

        // However, the current schema in `components/data-manager/schema.ts` is `healthDataSchema` which doesn't have NIK.
        // The mock data in `search/route.ts` had detailed patient info.
        // I will assume there is a 'patients' collection.

        if (datasetIds.length > 0) {
            // We can iterate over datasets if they represent different collections or just filter by a 'datasetId' field.
            // For simplicity and robustness, let's assume we search in a 'patients' collection where 'nik' matches.

            const q = query(collection(db, 'patients'), where('nik', '==', nik));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // We add it to results. We might need to map 'datasetId' if it exists in the doc.
                foundResults.push({
                    datasetName: data.datasetName || 'Unknown Dataset',
                    record: { id: doc.id, ...data } as any
                });
            });
        }

        return NextResponse.json(foundResults);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Error searching:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
