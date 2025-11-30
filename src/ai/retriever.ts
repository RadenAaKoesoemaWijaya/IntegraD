import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';

export interface RetrievedContext {
    healthData: any[];
    // Add other data types as needed
}

export async function retrieveContext(queryText: string): Promise<RetrievedContext> {
    // In a full RAG system, we would generate embeddings for the queryText
    // and search a vector database.
    // For this iteration, we will fetch recent health data to provide context.
    // We can also add basic keyword filtering if needed, but Firestore is limited for that.

    try {
        const healthDataRef = collection(db, 'health-data');
        // Fetch last 20 records as context
        const q = query(healthDataRef, limit(20));
        const querySnapshot = await getDocs(q);

        const healthData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            healthData
        };
    } catch (error) {
        console.error("Error retrieving context:", error);
        return { healthData: [] };
    }
}
