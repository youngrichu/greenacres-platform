'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Button,
    Badge,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@greenacres/ui';
import {
    Search,
    Grid3X3,
    List,
    Filter,
    X,
    MapPin,
    Star,
    ChevronRight,
    Package
} from 'lucide-react';
import type {
    CoffeeProduct,
    CatalogFilters,
    SortOption,
    ViewMode,
    Location,
    Availability
} from '@greenacres/types';
import {
    CoffeeRegions,
    CoffeeGrades,
    LocationLabels,
    FlavorCategories
} from '@greenacres/types';
import { getCoffees } from '@greenacres/db';


const availabilityColors: Record<Availability, string> = {
    in_stock: 'bg-green-500/20 text-green-400 border-green-500/30',
    pre_shipment: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    out_of_stock: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

const availabilityLabels: Record<Availability, string> = {
    in_stock: 'In Stock',
    pre_shipment: 'Pre-Shipment',
    out_of_stock: 'Out of Stock',
};

function CoffeeCard({ coffee }: { coffee: CoffeeProduct }) {
    const lowestPrice = Math.min(
        ...Object.values(coffee.pricing)
            .filter(p => p.availability !== 'out_of_stock')
            .map(p => p.pricePerLb)
    );

    return (
        <Link
            href={`/portal/catalog/${coffee.id}`}
            className="block glass-card rounded-xl overflow-hidden hover:border-gold/40 transition-all group"
        >
            {/* Header */}
            <div className="p-4 border-b border-gold/10">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {coffee.isTopLot && (
                            <Badge className="badge-gold text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                TOP LOT
                            </Badge>
                        )}
                        <Badge variant="outline" className="text-xs border-gold/30 text-cream/60">
                            {coffee.grade}
                        </Badge>
                    </div>
                    <span className="text-xs text-cream/40 font-mono">{coffee.referenceCode}</span>
                </div>

                <h3 className="text-lg font-semibold text-cream group-hover:text-gold transition-colors">
                    {coffee.region} {coffee.grade} {coffee.preparation === 'washed' ? 'Washed' : 'Natural'}
                </h3>
                <p className="text-cream/50 text-sm">
                    {coffee.station} Station • {coffee.cropYear}
                </p>
            </div>

            {/* Tasting Notes */}
            <div className="px-4 py-3 border-b border-gold/10">
                <div className="flex flex-wrap gap-1.5">
                    {coffee.tastingNotes.slice(0, 4).map((note, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded-full"
                        >
                            {note}
                        </span>
                    ))}
                    {coffee.tastingNotes.length > 4 && (
                        <span className="px-2 py-0.5 text-cream/40 text-xs">
                            +{coffee.tastingNotes.length - 4} more
                        </span>
                    )}
                </div>
            </div>

            {/* Pricing by Location */}
            <div className="p-4 space-y-2">
                {Object.entries(coffee.pricing).map(([loc, pricing]) => (
                    <div
                        key={loc}
                        className="flex items-center justify-between py-1"
                    >
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-gold/60" />
                            <span className="text-sm text-cream/60">
                                {loc === 'addis_ababa' ? '🇪🇹 Addis' : '🇮🇹 ' + (loc === 'trieste' ? 'Trieste' : 'Genoa')}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {pricing.availability && (
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${availabilityColors[pricing.availability] || 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'}`}
                                >
                                    {pricing.availability === 'pre_shipment'
                                        ? (pricing.availabilityPeriod || 'Pre-Shipment')
                                        : (availabilityLabels[pricing.availability] || pricing.availability)}
                                </Badge>
                            )}
                            {pricing.availability !== 'out_of_stock' && (
                                <span className="text-cream font-semibold">${pricing.pricePerLb?.toFixed(2) || '—'}/lb</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-4">
                <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                    <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-cream/40" />
                        <span className="text-cream/50">{coffee.bagSize}</span>
                    </div>
                    <span className="text-gold text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function CatalogPage() {
    const [coffees, setCoffees] = useState<CoffeeProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('position');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Partial<CatalogFilters>>({});

    // Fetch coffees from Firestore
    useEffect(() => {
        async function fetchCoffees() {
            try {
                setIsLoading(true);
                setError(null);
                // Only fetch active coffees for the buyer portal
                const fetchedCoffees = await getCoffees(true);
                setCoffees(fetchedCoffees);
            } catch (err) {
                console.error('Failed to fetch coffees:', err);
                setError('Failed to load coffee catalog. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchCoffees();
    }, []);

    // Filter coffees based on search and filters
    const filteredCoffees = coffees.filter(coffee => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matches =
                coffee.name.toLowerCase().includes(query) ||
                coffee.region.toLowerCase().includes(query) ||
                coffee.station.toLowerCase().includes(query) ||
                coffee.referenceCode.toLowerCase().includes(query) ||
                coffee.tastingNotes.some(note => note.toLowerCase().includes(query));
            if (!matches) return false;
        }

        if (filters.regions?.length) {
            if (!filters.regions.some(r => coffee.region.toLowerCase().includes(r.toLowerCase()))) {
                return false;
            }
        }

        if (filters.grades?.length) {
            if (!filters.grades.includes(coffee.grade as any)) {
                return false;
            }
        }

        if (filters.preparations?.length) {
            if (!filters.preparations.includes(coffee.preparation)) {
                return false;
            }
        }

        return true;
    });

    // Sort coffees
    const sortedCoffees = [...filteredCoffees].sort((a, b) => {
        switch (sortBy) {
            case 'name_asc':
                return a.name.localeCompare(b.name);
            case 'name_desc':
                return b.name.localeCompare(a.name);
            case 'price_asc':
                return a.pricing.addis_ababa.pricePerLb - b.pricing.addis_ababa.pricePerLb;
            case 'price_desc':
                return b.pricing.addis_ababa.pricePerLb - a.pricing.addis_ababa.pricePerLb;
            case 'grade':
                return a.grade.localeCompare(b.grade);
            case 'sca_score':
                return parseInt(b.scaScore) - parseInt(a.scaScore);
            default:
                return a.displayOrder - b.displayOrder;
        }
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-cream/60">Loading catalog...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Package className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-cream mb-2">Error Loading Catalog</h3>
                    <p className="text-cream/50 mb-4">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="btn-premium"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            {/* Mobile Filter Backdrop */}
            {showFilters && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setShowFilters(false)}
                />
            )}

            {/* Sidebar Filters */}
            <aside className={`
                w-72 portal-sidebar p-6 
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-10
                transform transition-transform duration-300 ease-in-out
                ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-cream">Filters</h2>
                    <button
                        onClick={() => setFilters({})}
                        className="text-sm text-cream/50 hover:text-gold"
                    >
                        Clear all
                    </button>
                </div>

                {/* Region Filter */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-cream/80 mb-3">Region</h3>
                    <div className="space-y-2">
                        {CoffeeRegions.map(region => (
                            <label key={region} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.regions?.includes(region) || false}
                                    onChange={(e) => {
                                        const newRegions = e.target.checked
                                            ? [...(filters.regions || []), region]
                                            : filters.regions?.filter(r => r !== region) || [];
                                        setFilters({ ...filters, regions: newRegions });
                                    }}
                                    className="w-4 h-4 rounded border-gold/30 bg-forest-deep text-gold focus:ring-gold/20"
                                />
                                <span className="text-sm text-cream/60">{region}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Grade Filter */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-cream/80 mb-3">Grade</h3>
                    <div className="space-y-2">
                        {CoffeeGrades.map(grade => (
                            <label key={grade} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.grades?.includes(grade) || false}
                                    onChange={(e) => {
                                        const newGrades = e.target.checked
                                            ? [...(filters.grades || []), grade]
                                            : filters.grades?.filter(g => g !== grade) || [];
                                        setFilters({ ...filters, grades: newGrades as any });
                                    }}
                                    className="w-4 h-4 rounded border-gold/30 bg-forest-deep text-gold focus:ring-gold/20"
                                />
                                <span className="text-sm text-cream/60">{grade}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Processing Filter */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-cream/80 mb-3">Processing</h3>
                    <div className="space-y-2">
                        {['washed', 'natural'].map(prep => (
                            <label key={prep} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.preparations?.includes(prep as any) || false}
                                    onChange={(e) => {
                                        const newPreps = e.target.checked
                                            ? [...(filters.preparations || []), prep as any]
                                            : filters.preparations?.filter(p => p !== prep) || [];
                                        setFilters({ ...filters, preparations: newPreps });
                                    }}
                                    className="w-4 h-4 rounded border-gold/30 bg-forest-deep text-gold focus:ring-gold/20"
                                />
                                <span className="text-sm text-cream/60 capitalize">{prep}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Mobile close button */}
                <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden w-full mt-6 py-2 btn-premium rounded-lg"
                >
                    Apply Filters
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
                {/* Header */}
                <div className="mb-6 lg:mb-8 animate-fade-in-up">
                    <h1 className="text-2xl sm:text-3xl font-serif text-cream mb-2">Coffee Catalog</h1>
                    <p className="text-cream/50 text-sm sm:text-base">
                        Browse our selection of premium Ethiopian coffees with live pricing
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input
                            placeholder="Search coffees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 input-premium"
                        />
                    </div>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                        <SelectTrigger className="w-44 glass border-gold/30 text-cream">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-gold/30">
                            <SelectItem value="position" className="text-cream focus:bg-gold/10">Position</SelectItem>
                            <SelectItem value="name_asc" className="text-cream focus:bg-gold/10">Name A-Z</SelectItem>
                            <SelectItem value="name_desc" className="text-cream focus:bg-gold/10">Name Z-A</SelectItem>
                            <SelectItem value="price_asc" className="text-cream focus:bg-gold/10">Price Low-High</SelectItem>
                            <SelectItem value="price_desc" className="text-cream focus:bg-gold/10">Price High-Low</SelectItem>
                            <SelectItem value="grade" className="text-cream focus:bg-gold/10">Grade</SelectItem>
                            <SelectItem value="sca_score" className="text-cream focus:bg-gold/10">SCA Score</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* View Toggle */}
                    <div className="flex items-center border border-gold/30 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-gold text-forest-deep' : 'glass text-cream/60'}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-gold text-forest-deep' : 'glass text-cream/60'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden p-2.5 glass border border-gold/30 rounded-lg text-cream/60 hover:text-gold hover:border-gold transition-all"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Results count */}
                <p className="text-sm text-cream/40 mb-4">
                    Showing {sortedCoffees.length} coffee{sortedCoffees.length !== 1 ? 's' : ''}
                </p>

                {/* Coffee Grid/List */}
                {sortedCoffees.length > 0 ? (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                        {sortedCoffees.map(coffee => (
                            <CoffeeCard key={coffee.id} coffee={coffee} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-cream/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-cream mb-2">No coffees found</h3>
                        <p className="text-cream/50 mb-4">Try adjusting your filters or search query</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilters({});
                                setSearchQuery('');
                            }}
                            className="btn-ghost"
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
