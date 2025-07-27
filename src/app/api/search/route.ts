import { NextResponse } from 'next/server';
import { z } from 'zod';

const mockDatasets = [
    { id: 'seksi-p2p', name: 'Seksi Pencegahan dan Penanggulangan Penyakit', data: [
        { id: 'rec-001', nik: '3171234567890001', name: 'Budi Santoso', address: 'Jl. Merdeka No. 1, Jakarta' },
        { id: 'rec-002', nik: '3171234567890002', name: 'Citra Lestari', address: 'Jl. Pahlawan No. 10, Jakarta' },
    ]},
    { id: 'seksi-sdk', name: 'Seksi Sumber Daya Kesehatan', data: [
        { id: 'rec-003', nik: '3273123456789001', name: 'Agus Wijaya', address: 'Jl. Asia Afrika No. 5, Bandung' },
    ]},
    { id: 'seksi-kesmas', name: 'Seksi Kesehatan Masyarakat', data: [
        { id: 'rec-004', nik: '3171234567890001', name: 'Budi Santoso', address: 'Jl. Merdeka No. 1, Jakarta (Pusat)' },
    ]},
];

type SearchResult = {
    datasetName: string;
    record: { id: string; nik: string; name: string; address: string };
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
        mockDatasets.forEach(dataset => {
            if (datasetIds.includes(dataset.id)) {
                const foundRecord = dataset.data.find(record => record.nik === nik);
                if (foundRecord) {
                    foundResults.push({ datasetName: dataset.name, record: foundRecord });
                }
            }
        });

        return NextResponse.json(foundResults);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
