'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@greenacres/ui';
import { createCoffee } from '@greenacres/db';
import { Loader2, CheckCircle, XCircle, Coffee } from 'lucide-react';
import type { CoffeeProduct } from '@greenacres/types';

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
        } as any
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
        } as any
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
        } as any
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
        } as any
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
        } as any
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
        } as any
    }
];

export default function SeedPage() {
    const [seeding, setSeeding] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const runSeed = async () => {
        setSeeding(true);
        setLogs([]);
        addLog("Starting seed process...");

        try {
            let successCount = 0;
            for (const coffee of newCoffees) {
                try {
                    addLog(`Creating ${coffee.name}...`);
                    // @ts-ignore
                    const result = await createCoffee(coffee);

                    if (result.success) {
                        addLog(`✅ Successfully created ${coffee.name}`);
                        successCount++;
                    } else {
                        addLog(`❌ Failed to create ${coffee.name}: ${result.error}`);
                    }
                } catch (err: any) {
                    addLog(`❌ Error creating ${coffee.name}: ${err.message}`);
                }
            }
            addLog(`Seeding complete! Successfully created ${successCount} of ${newCoffees.length} coffees.`);
        } catch (error: any) {
            addLog(`❌ Fatal error: ${error.message}`);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold">
                            <Coffee className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-cream text-2xl">Seed Coffee Data</CardTitle>
                            <CardDescription className="text-cream/60">
                                Populate the database with 7 new coffee offerings (Sidamo, Guji, Yirgacheffe, Jimma).
                                This requires you to be logged in as an Admin.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button
                        onClick={runSeed}
                        disabled={seeding}
                        className="w-full bg-gold hover:bg-gold-light text-forest font-bold py-6 text-lg"
                    >
                        {seeding ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Seeding Database...
                            </>
                        ) : (
                            'Run Seed Script'
                        )}
                    </Button>

                    {logs.length > 0 && (
                        <div className="bg-forest-dark/50 p-4 rounded-lg font-mono text-sm border border-gold/10 max-h-96 overflow-y-auto">
                            {logs.map((log, index) => (
                                <div key={index} className={`mb-1 ${log.includes('❌') ? 'text-destructive' : log.includes('✅') ? 'text-success' : 'text-cream/70'}`}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
