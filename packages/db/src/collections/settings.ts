import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { getDb } from '../firebase';
import { LocationConfig, DefaultLocations } from '@greenacres/types';
import type { ApiResponse } from '@greenacres/types';

const SETTINGS_COLLECTION = 'settings';
const LOCATIONS_DOC = 'pricing_locations';

export async function getPricingLocations(): Promise<LocationConfig[]> {
    try {
        const db = getDb();
        const docRef = doc(db, SETTINGS_COLLECTION, LOCATIONS_DOC);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return (data.items as LocationConfig[]).sort((a, b) => a.displayOrder - b.displayOrder);
        }

        // Return defaults if not configured
        return DefaultLocations;
    } catch (error: unknown) {
        console.error('Error fetching pricing locations:', error);
        return DefaultLocations;
    }
}

export async function savePricingLocations(locations: LocationConfig[]): Promise<ApiResponse<null>> {
    try {
        const db = getDb();
        const docRef = doc(db, SETTINGS_COLLECTION, LOCATIONS_DOC);
        await setDoc(docRef, {
            items: locations,
            updatedAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error: unknown) {
        console.error('Error saving pricing locations:', error);
        return { success: false, error: 'Failed to save pricing locations' };
    }
}
