import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
    addDoc,
} from 'firebase/firestore';
import { getDb, COLLECTIONS } from '../firebase';
import type {
    CoffeeProduct,
    CoffeePricing,
    Location,
    Preparation,
    Availability,
    ApiResponse,
    CatalogFilters,
    SortOption,
    CoffeeGrade,
} from '@greenacres/types';

// Convert Firestore document to CoffeeProduct type
function docToCoffee(id: string, data: DocumentData): CoffeeProduct {
    const pricing: Record<Location, CoffeePricing> = {
        addis_ababa: {
            location: 'addis_ababa',
            pricePerLb: data.pricing?.addis_ababa?.pricePerLb || 0,
            availability: data.pricing?.addis_ababa?.availability || 'out_of_stock',
            availabilityPeriod: data.pricing?.addis_ababa?.availabilityPeriod || '',
            terms: data.pricing?.addis_ababa?.terms || 'FOB Djibouti',
            paymentTerms: data.pricing?.addis_ababa?.paymentTerms || 'LC/CAD',
            updatedAt: data.pricing?.addis_ababa?.updatedAt?.toDate() || new Date(),
        },
        trieste: {
            location: 'trieste',
            pricePerLb: data.pricing?.trieste?.pricePerLb || 0,
            availability: data.pricing?.trieste?.availability || 'out_of_stock',
            availabilityPeriod: data.pricing?.trieste?.availabilityPeriod || '',
            terms: data.pricing?.trieste?.terms || 'EXW',
            paymentTerms: data.pricing?.trieste?.paymentTerms || 'LC/CAD',
            updatedAt: data.pricing?.trieste?.updatedAt?.toDate() || new Date(),
        },
        genoa: {
            location: 'genoa',
            pricePerLb: data.pricing?.genoa?.pricePerLb || 0,
            availability: data.pricing?.genoa?.availability || 'out_of_stock',
            availabilityPeriod: data.pricing?.genoa?.availabilityPeriod || '',
            terms: data.pricing?.genoa?.terms || 'EXW',
            paymentTerms: data.pricing?.genoa?.paymentTerms || 'LC/CAD',
            updatedAt: data.pricing?.genoa?.updatedAt?.toDate() || new Date(),
        },
    };

    return {
        id,
        name: data.name,
        station: data.station,
        region: data.region,
        grade: data.grade,
        preparation: data.preparation,
        cropYear: data.cropYear,
        certification: data.certification,
        scaScore: data.scaScore,
        tastingNotes: data.tastingNotes || [],
        bagSize: data.bagSize || '60 KG GrainPro',
        referenceCode: data.referenceCode,
        isTopLot: data.isTopLot || false,
        imageUrl: data.imageUrl,
        images: data.images || [],
        videos: data.videos || [],
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder || 0,
        pricing,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
}

// Get all active coffees
export async function getCoffees(activeOnly = true): Promise<CoffeeProduct[]> {
    const db = getDb();
    const coffeesRef = collection(db, COLLECTIONS.COFFEES);

    let q;
    if (activeOnly) {
        q = query(
            coffeesRef,
            where('isActive', '==', true),
            orderBy('displayOrder', 'asc')
        );
    } else {
        q = query(coffeesRef, orderBy('displayOrder', 'asc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => docToCoffee(doc.id, doc.data()));
}

// Get coffee by ID
export async function getCoffeeById(coffeeId: string): Promise<CoffeeProduct | null> {
    const db = getDb();
    const coffeeRef = doc(db, COLLECTIONS.COFFEES, coffeeId);
    const snapshot = await getDoc(coffeeRef);

    if (!snapshot.exists()) return null;
    return docToCoffee(snapshot.id, snapshot.data());
}

// Filter coffees
export async function filterCoffees(
    filters: Partial<CatalogFilters>,
    sortBy: SortOption = 'position'
): Promise<CoffeeProduct[]> {
    // Get all active coffees first
    const allCoffees = await getCoffees(true);

    // Apply filters in memory (Firestore has limitations on complex queries)
    let filtered = allCoffees;

    if (filters.regions?.length) {
        filtered = filtered.filter((c) =>
            filters.regions!.some((r) => c.region.toLowerCase().includes(r.toLowerCase()))
        );
    }

    if (filters.grades?.length) {
        filtered = filtered.filter((c) => filters.grades!.includes(c.grade as CoffeeGrade));
    }

    if (filters.preparations?.length) {
        filtered = filtered.filter((c) => filters.preparations!.includes(c.preparation));
    }

    if (filters.certifications?.length) {
        filtered = filtered.filter((c) =>
            filters.certifications!.some((cert) =>
                c.certification.toLowerCase().includes(cert.toLowerCase())
            )
        );
    }

    if (filters.flavors?.length) {
        filtered = filtered.filter((c) =>
            c.tastingNotes.some((note) =>
                filters.flavors!.some((flavor) =>
                    note.toLowerCase().includes(flavor.toLowerCase())
                )
            )
        );
    }

    if (filters.availability?.length) {
        filtered = filtered.filter((c) =>
            Object.values(c.pricing).some((p) =>
                filters.availability!.includes(p.availability)
            )
        );
    }

    if (filters.locations?.length) {
        filtered = filtered.filter((c) =>
            filters.locations!.some(
                (loc) => c.pricing[loc]?.availability !== 'out_of_stock'
            )
        );
    }

    // Apply sorting
    switch (sortBy) {
        case 'name_asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price_asc':
            filtered.sort(
                (a, b) => a.pricing.addis_ababa.pricePerLb - b.pricing.addis_ababa.pricePerLb
            );
            break;
        case 'price_desc':
            filtered.sort(
                (a, b) => b.pricing.addis_ababa.pricePerLb - a.pricing.addis_ababa.pricePerLb
            );
            break;
        case 'grade':
            filtered.sort((a, b) => a.grade.localeCompare(b.grade));
            break;
        case 'sca_score':
            filtered.sort((a, b) => {
                const scoreA = parseInt(a.scaScore) || 0;
                const scoreB = parseInt(b.scaScore) || 0;
                return scoreB - scoreA;
            });
            break;
        case 'position':
        default:
            filtered.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return filtered;
}

// Create new coffee product
export async function createCoffee(
    data: Omit<CoffeeProduct, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<CoffeeProduct>> {
    try {
        const db = getDb();
        const coffeesRef = collection(db, COLLECTIONS.COFFEES);

        const coffeeData = {
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(coffeesRef, coffeeData);

        return {
            success: true,
            data: {
                id: docRef.id,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create coffee',
        };
    }
}

// Update coffee product
export async function updateCoffee(
    coffeeId: string,
    data: Partial<CoffeeProduct>
): Promise<ApiResponse<CoffeeProduct>> {
    try {
        const db = getDb();
        const coffeeRef = doc(db, COLLECTIONS.COFFEES, coffeeId);

        const { id, createdAt, ...updateData } = data;

        await updateDoc(coffeeRef, {
            ...updateData,
            updatedAt: Timestamp.now(),
        });

        const updatedCoffee = await getCoffeeById(coffeeId);
        if (!updatedCoffee) {
            return { success: false, error: 'Coffee not found after update' };
        }

        return { success: true, data: updatedCoffee };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update coffee',
        };
    }
}

// Update pricing for a specific location
export async function updateCoffeePricing(
    coffeeId: string,
    location: Location,
    pricing: Partial<CoffeePricing>,
    updatedBy?: string
): Promise<ApiResponse<CoffeeProduct>> {
    try {
        const db = getDb();
        const coffeeRef = doc(db, COLLECTIONS.COFFEES, coffeeId);

        const updateData: Record<string, unknown> = {
            [`pricing.${location}`]: {
                ...pricing,
                location,
                updatedAt: Timestamp.now(),
                updatedBy,
            },
            updatedAt: Timestamp.now(),
        };

        await updateDoc(coffeeRef, updateData);

        const updatedCoffee = await getCoffeeById(coffeeId);
        if (!updatedCoffee) {
            return { success: false, error: 'Coffee not found after update' };
        }

        return { success: true, data: updatedCoffee };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update pricing',
        };
    }
}

// Toggle coffee active status
export async function toggleCoffeeActive(
    coffeeId: string,
    isActive: boolean
): Promise<ApiResponse<CoffeeProduct>> {
    return updateCoffee(coffeeId, { isActive });
}

// Update display order
export async function updateCoffeeOrder(
    coffeeId: string,
    displayOrder: number
): Promise<ApiResponse<CoffeeProduct>> {
    return updateCoffee(coffeeId, { displayOrder });
}

// Get coffee count
export async function getCoffeeCount(): Promise<{ total: number; active: number }> {
    const allCoffees = await getCoffees(false);
    return {
        total: allCoffees.length,
        active: allCoffees.filter((c) => c.isActive).length,
    };
}

// Delete coffee product
export async function deleteCoffee(
    coffeeId: string
): Promise<ApiResponse<{ id: string }>> {
    try {
        const db = getDb();
        const coffeeRef = doc(db, COLLECTIONS.COFFEES, coffeeId);

        // Verify coffee exists before deleting
        const snapshot = await getDoc(coffeeRef);
        if (!snapshot.exists()) {
            return { success: false, error: 'Coffee not found' };
        }

        await deleteDoc(coffeeRef);

        return { success: true, data: { id: coffeeId } };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete coffee',
        };
    }
}
