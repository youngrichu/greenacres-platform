import dotenv from 'dotenv';
import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import type { CoffeeProduct } from '@greenacres/types';

// Load environment variables for Project ID
dotenv.config({ path: path.resolve(__dirname, '../../../../apps/web/.env.local') });

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
    console.error("Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local");
    process.exit(1);
}

// Initialize Firebase Admin
if (getApps().length === 0) {
    try {
        const serviceAccountPath = path.resolve(__dirname, '../../service-account.json');
        // Check if file exists (simple try/catch require)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const serviceAccount = require(serviceAccountPath);

        console.log("Found service-account.json, using for authentication...");
        initializeApp({
            credential: cert(serviceAccount),
            projectId,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    } catch {
        console.log("No service-account.json found, falling back to Application Default Credentials...");
        initializeApp({
            projectId,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    }
}

const db = getFirestore();
const COLLECTIONS = { COFFEES: 'coffees' };

const newCoffees: Partial<CoffeeProduct>[] = [
    // Washed Coffees
    {
        name: "Sidamo Nensebo Refisa",
        region: "Sidama",
        station: "Nensebo Refisa (West Arsi)",
        grade: "G1",
        cropYear: "2023/24",
        scaScore: "88",
        tastingNotes: ["Floral", "Citrus", "Honey"],
        preparation: "washed",
        certification: "Organic",
        imageUrl: "/assets/coffees/coffee-sack.png",
        images: [
            "/assets/coffees/coffee-sack.png",
            "/assets/coffees/green-coffee-beans.png",
            "/assets/coffees/roasted-beans.png"
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"], // placeholder video
        isActive: true,
        displayOrder: 10,
        pricing: {
            addis_ababa: {
                location: "addis_ababa",
                pricePerLb: 3.85,
                availability: "in_stock",
                availabilityPeriod: "Spot",
                terms: "FOB Djibouti",
                paymentTerms: "LC/CAD",
                updatedAt: new Date()
            },
            trieste: {
                location: "trieste",
                pricePerLb: 4.45,
                availability: "in_stock",
                availabilityPeriod: "Spot",
                terms: "EXW",
                paymentTerms: "LC/CAD",
                updatedAt: new Date()
            },
            genoa: {
                location: "genoa",
                pricePerLb: 4.45,
                availability: "in_stock", // low_stock not supported
                availabilityPeriod: "Spot",
                terms: "EXW",
                paymentTerms: "LC/CAD",
                updatedAt: new Date()
            }
        }
    },
    {
        name: "Guji Guduba Wet Mill",
        region: "Guji",
        station: "Guduba Station (Hambella)",
        grade: "G1",
        cropYear: "2023/24",
        scaScore: "87.5",
        tastingNotes: ["Jasmine", "Lemon", "Bergamot"],
        preparation: "washed",
        certification: "Organic",
        imageUrl: "/assets/coffees/coffee-sack.png",
        isActive: true,
        displayOrder: 11,
        pricing: {
            addis_ababa: { location: "addis_ababa", pricePerLb: 3.95, availability: "in_stock", availabilityPeriod: "Spot", terms: "FOB Djibouti", paymentTerms: "LC/CAD", updatedAt: new Date() },
            trieste: { location: "trieste", pricePerLb: 4.55, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() },
            genoa: { location: "genoa", pricePerLb: 4.55, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() }
        }
    },
    {
        name: "Guji Gotae Sodu",
        region: "Guji",
        station: "Gotae Sodu Kebele, Hambella",
        grade: "G1",
        cropYear: "2023/24",
        scaScore: "88.5",
        tastingNotes: ["Peach", "Black Tea", "Floral"],
        preparation: "washed",
        certification: "Fair Trade",
        imageUrl: "/assets/coffees/coffee-sack.png",
        isActive: true,
        displayOrder: 12,
        pricing: {
            addis_ababa: { location: "addis_ababa", pricePerLb: 4.10, availability: "in_stock", availabilityPeriod: "Spot", terms: "FOB Djibouti", paymentTerms: "LC/CAD", updatedAt: new Date() },
            trieste: { location: "trieste", pricePerLb: 4.70, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() },
            genoa: { location: "genoa", pricePerLb: 4.70, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() }
        }
    },
    {
        name: "Guji Haro Sorsa (Sisay Station)",
        region: "Guji",
        station: "Sisay Station (Haro Sorsa)",
        grade: "G1",
        cropYear: "2023/24",
        scaScore: "89",
        tastingNotes: ["Apricot", "Jasmine", "Sugar Cane"],
        preparation: "washed",
        certification: "Organic",
        imageUrl: "/assets/coffees/coffee-sack.png",
        isActive: true,
        displayOrder: 13,
        pricing: {
            addis_ababa: { location: "addis_ababa", pricePerLb: 4.25, availability: "in_stock", availabilityPeriod: "Spot", terms: "FOB Djibouti", paymentTerms: "LC/CAD", updatedAt: new Date() },
            trieste: { location: "trieste", pricePerLb: 4.85, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() },
            genoa: { location: "genoa", pricePerLb: 4.85, availability: "out_of_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() }
        }
    },
    // Natural Coffees
    {
        name: "Yirgacheffe Banko Gotiti",
        region: "Yirgacheffe",
        station: "Banko Gotiti Station (Gedeb)",
        grade: "G1",
        cropYear: "2023/24",
        scaScore: "88.5",
        tastingNotes: ["Blueberry", "Strawberry", "Milk Chocolate"],
        preparation: "natural",
        certification: "Organic",
        imageUrl: "/assets/coffees/coffee-sack.png",
        isActive: true,
        displayOrder: 14,
        pricing: {
            addis_ababa: { location: "addis_ababa", pricePerLb: 4.15, availability: "in_stock", availabilityPeriod: "Spot", terms: "FOB Djibouti", paymentTerms: "LC/CAD", updatedAt: new Date() },
            trieste: { location: "trieste", pricePerLb: 4.75, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() },
            genoa: { location: "genoa", pricePerLb: 4.75, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() }
        }
    },
    {
        name: "Yirgacheffe Wurae (Halo Berti)",
        region: "Yirgacheffe",
        station: "Wurae Station (Halo Berti)",
        grade: "G1",
        cropYear: "2023/24",
        scaScore: "88",
        tastingNotes: ["Tropical Fruit", "Winey", "Dried Fig"],
        preparation: "natural",
        certification: "Fair Trade",
        imageUrl: "/assets/coffees/coffee-sack.png",
        isActive: true,
        displayOrder: 15,
        pricing: {
            addis_ababa: { location: "addis_ababa", pricePerLb: 4.05, availability: "in_stock", availabilityPeriod: "Spot", terms: "FOB Djibouti", paymentTerms: "LC/CAD", updatedAt: new Date() },
            trieste: { location: "trieste", pricePerLb: 4.65, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() },
            genoa: { location: "genoa", pricePerLb: 4.65, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() }
        }
    },
    {
        name: "Jimma Agaro Genji Challa",
        region: "Jimma",
        station: "Agaro Drying Station",
        grade: "G1",
        cropYear: "2023/24",
        scaScore: "87",
        tastingNotes: ["Stone Fruit", "Spices", "Honey"],
        preparation: "natural",
        certification: "Organic",
        imageUrl: "/assets/coffees/coffee-sack.png",
        isActive: true,
        displayOrder: 16,
        pricing: {
            addis_ababa: { location: "addis_ababa", pricePerLb: 3.75, availability: "in_stock", availabilityPeriod: "Spot", terms: "FOB Djibouti", paymentTerms: "LC/CAD", updatedAt: new Date() },
            trieste: { location: "trieste", pricePerLb: 4.35, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() },
            genoa: { location: "genoa", pricePerLb: 4.35, availability: "in_stock", availabilityPeriod: "Spot", terms: "EXW", paymentTerms: "LC/CAD", updatedAt: new Date() }
        }
    }
];

export async function seedNewCoffees() {
    console.log(`Starting to seed ${newCoffees.length} new coffees...`);

    for (const coffee of newCoffees) {
        try {
            const coffeeData = {
                ...coffee,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            const docRef = await db.collection(COLLECTIONS.COFFEES).add(coffeeData);
            console.log(`✅ Created: ${coffee.name} (ID: ${docRef.id})`);
        } catch (error: unknown) {
            console.error(`❌ Failed to create ${coffee.name}:`, error);
        }
    }

    console.log("Seeding complete!");
}

// Allow running directly
if (require.main === module) {
    seedNewCoffees()
        .then(() => process.exit(0))
        .catch((e: unknown) => {
            console.error(e);
            process.exit(1);
        });
}
