'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CoffeeDetailView from '@/components/CoffeeDetailView';
import { getCoffeeById } from '@greenacres/db';
import type { CoffeeProduct } from '@greenacres/types';
import { ArrowLeft, Loader2, Coffee } from 'lucide-react';
import { Button } from '@greenacres/ui';

export default function PublicCoffeeDetailPage() {
    const params = useParams();
    const coffeeId = params.id as string;

    const [coffee, setCoffee] = useState<CoffeeProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCoffee() {
            try {
                setIsLoading(true);
                setError(null);
                const result = await getCoffeeById(coffeeId);
                if (result) {
                    setCoffee(result);
                } else {
                    setError('Coffee not found');
                }
            } catch (err) {
                console.error('Failed to fetch coffee:', err);
                setError('Failed to load coffee details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
        if (coffeeId) {
            fetchCoffee();
        }
    }, [coffeeId]);

    // Content logic
    const renderContent = () => {
        // Loading state
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
                        <p className="text-cream/60">Loading coffee details...</p>
                    </div>
                </div>
            );
        }

        // Error state
        if (error || !coffee) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-8">
                    <div className="text-center max-w-md mx-auto">
                        <div className="glass-card rounded-2xl p-12">
                            <Coffee className="w-16 h-16 text-cream/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif text-cream mb-2">Coffee Not Found</h3>
                            <p className="text-cream/50 mb-8">{error || 'The requested coffee could not be found.'}</p>
                            <Button asChild className="btn-premium">
                                <Link href="/#coffee">View Collection</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        // Success state
        return (
            <div className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-deep relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                <CoffeeDetailView
                    coffee={coffee}
                    mode="public"
                />
            </div>
        );
    };

    return (
        <div className="bg-forest-deep min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 mt-20">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
}
