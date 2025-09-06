import { HealthData } from "@/components/data-manager/schema";
import { User } from "@/components/admin/schema";
import { SearchResult } from "@/components/search/search-page";

const API_BASE_URL = '/api';

export async function getHealthData(): Promise<HealthData[]> {
    const response = await fetch(`${API_BASE_URL}/health-data`);
    if (!response.ok) {
        throw new Error('Failed to fetch health data');
    }
    return response.json();
}

export async function addHealthData(data: Omit<HealthData, 'id'>): Promise<HealthData> {
    const response = await fetch(`${API_BASE_URL}/health-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to add health data');
    }
    return response.json();
}

export async function updateHealthData(data: HealthData): Promise<HealthData> {
    const response = await fetch(`${API_BASE_URL}/health-data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update health data');
    }
    return response.json();
}

export async function deleteHealthData(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/health-data`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete health data');
    }
}

export async function getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}

export async function searchNik(nik: string, datasetIds: string[]): Promise<SearchResult[]> {
    const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik, datasetIds }),
    });
    if (!response.ok) {
        throw new Error('Failed to search NIK');
    }
    return response.json();
}

export async function runAdvancedAnalysis(data: {
  dataset: any[];
  exposure: string;
  outcome: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/advanced-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to run advanced analysis');
  }
  return response.json();
}
