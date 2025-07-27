import { NextResponse } from 'next/server';
import { User } from '@/components/admin/schema';

const users: User[] = [
    { id: 'usr_001', name: 'Budi Santoso', email: 'budi.santoso@example.com', role: 'Admin', status: 'Active' },
    { id: 'usr_002', name: 'Citra Lestari', email: 'citra.lestari@example.com', role: 'Data Manager', status: 'Active' },
    { id: 'usr_003', name: 'Agus Wijaya', email: 'agus.wijaya@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 'usr_004', name: 'Dewi Anggraini', email: 'dewi.anggraini@example.com', role: 'Data Manager', status: 'Active' },
];

export async function GET() {
  return NextResponse.json(users);
}
