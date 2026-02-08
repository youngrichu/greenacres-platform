'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@greenacres/ui';
import {
    Search,
    DollarSign,
    Edit,
    Save,
    MapPin,
    Package,
    Loader2,
    AlertTriangle,
    RefreshCw,
    Coffee,
    Star,
    Globe,
    Settings,
    Plus,
    Trash,
    GripVertical,
} from 'lucide-react';
import type { CoffeeProduct, Location, Availability, LocationConfig } from '@greenacres/types';
import { getCoffees, updateCoffeePricing, getPricingLocations, savePricingLocations } from '@greenacres/db';

const availabilityOptions: { value: Availability; label: string }[] = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'pre_shipment', label: 'Pre-Shipment' },
    { value: 'out_of_stock', label: 'Out of Stock' },
];

const availabilityConfig: Record<Availability, { badgeClass: string; label: string }> = {
    in_stock: { badgeClass: 'badge-success', label: 'In Stock' },
    pre_shipment: { badgeClass: 'badge-warning', label: 'Pre-Shipment' },
    out_of_stock: { badgeClass: 'bg-cream/10 text-cream/50 border border-cream/20', label: 'Out of Stock' },
};



interface EditingPricing {
    coffeeId: string;
    location: Location;
    pricePerLb: string;
    availability: Availability;
    availabilityPeriod: string;
}

export default function PricesPage() {
    const [coffees, setCoffees] = useState<CoffeeProduct[]>([]);
    const [locations, setLocations] = useState<LocationConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [editingPricing, setEditingPricing] = useState<EditingPricing | null>(null);
    const [editingLocations, setEditingLocations] = useState<LocationConfig[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedCoffee, setSelectedCoffee] = useState<CoffeeProduct | null>(null);

    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setIsLoading(true);
            setError(null);
            const [fetchedCoffees, fetchedLocations] = await Promise.all([
                getCoffees(false),
                getPricingLocations()
            ]);
            setCoffees(fetchedCoffees);
            setLocations(fetchedLocations);
            setEditingLocations(fetchedLocations); // Initialize editing state
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    // Keep fetchCoffees for refresh button but optimize to just refetch coffees
    async function fetchCoffees() {
        try {
            setIsLoading(true);
            const fetchedCoffees = await getCoffees(false);
            setCoffees(fetchedCoffees);
        } catch (err) {
            console.error('Failed to fetch coffees:', err);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredCoffees = coffees.filter(coffee => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                coffee.name.toLowerCase().includes(query) ||
                coffee.region.toLowerCase().includes(query) ||
                coffee.referenceCode.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const openEditDialog = (coffee: CoffeeProduct, location: Location) => {
        setSelectedCoffee(coffee);
        const pricing = coffee.pricing[location];
        setEditingPricing({
            coffeeId: coffee.id,
            location,
            pricePerLb: pricing.pricePerLb.toString(),
            availability: pricing.availability,
            availabilityPeriod: pricing.availabilityPeriod,
        });
        setIsEditDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editingPricing || !selectedCoffee) return;

        setIsSaving(true);
        setError(null);

        try {
            const pricingUpdate = {
                pricePerLb: parseFloat(editingPricing.pricePerLb) || 0,
                availability: editingPricing.availability,
                availabilityPeriod: editingPricing.availabilityPeriod,
            };

            const result = await updateCoffeePricing(
                editingPricing.coffeeId,
                editingPricing.location,
                pricingUpdate
            );

            if (result.success && result.data) {
                setCoffees(coffees.map(coffee =>
                    coffee.id === editingPricing.coffeeId ? result.data! : coffee
                ));
                setIsEditDialogOpen(false);
                setEditingPricing(null);
                setSelectedCoffee(null);
            } else {
                setError(result.error || 'Failed to update pricing');
            }
        } catch (err) {
            console.error('Failed to update pricing:', err);
            setError('Failed to update pricing. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveLocations = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const result = await savePricingLocations(editingLocations);
            if (result.success) {
                setLocations(editingLocations);
                setIsSettingsDialogOpen(false);
            } else {
                setError(result.error || 'Failed to save settings');
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
            setError('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const addLocation = () => {
        setEditingLocations([
            ...editingLocations,
            {
                id: `loc_${Date.now()}`,
                name: 'New Location',
                flag: '🌍',
                terms: 'EXW',
                displayOrder: editingLocations.length + 1
            }
        ]);
    };

    const removeLocation = (index: number) => {
        const newLocations = [...editingLocations];
        newLocations.splice(index, 1);
        setEditingLocations(newLocations);
    };

    const updateLocation = (index: number, field: keyof LocationConfig, value: any) => {
        const newLocations = [...editingLocations];
        newLocations[index] = { ...newLocations[index], [field]: value };
        setEditingLocations(newLocations);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-gold animate-spin" />
                        </div>
                    </div>
                    <p className="text-cream/60">Loading pricing data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-8">
            {/* Header */}
            <header className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-gold text-sm font-medium uppercase tracking-wider">Price Management</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-cream font-serif mb-2">
                            Pricing & Availability
                        </h1>
                        <p className="text-cream/60">
                            Update pricing and availability for all coffee offerings
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => {
                                setEditingLocations(locations);
                                setIsSettingsDialogOpen(true);
                            }}
                            variant="outline"
                            className="btn-ghost"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        <Button onClick={fetchCoffees} variant="outline" className="btn-ghost">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </header>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 glass rounded-xl border border-destructive/30 flex items-center gap-3 animate-fade-in">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <p className="text-destructive flex-1">{error}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setError(null)}
                        className="text-destructive hover:text-destructive/80"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {coffees.length === 0 && !isLoading && (
                <Card className="glass-card">
                    <CardContent className="py-16">
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Package className="w-10 h-10" />
                            </div>
                            <h3 className="text-lg font-semibold text-cream mb-2">No coffee products yet</h3>
                            <p className="text-cream/60">Add coffee products in the Products section to manage their pricing here.</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            {coffees.length > 0 && (
                <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                        <Input
                            placeholder="Search by name, region, or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-premium pl-12 w-full"
                        />
                    </div>
                </div>
            )}

            {/* Price Cards */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                {filteredCoffees.map((coffee, index) => (
                    <Card
                        key={coffee.id}
                        className="glass-card overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: `${150 + index * 50}ms` }}
                    >
                        <CardHeader className="border-b border-gold/10 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                        <Coffee className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <CardTitle className="text-cream font-serif">{coffee.name}</CardTitle>
                                            <Badge className="badge-gold text-xs">{coffee.grade}</Badge>
                                            {coffee.isTopLot && (
                                                <Badge className="badge-warning text-xs">
                                                    <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                                    TOP LOT
                                                </Badge>
                                            )}
                                            {!coffee.isActive && (
                                                <Badge className="bg-cream/10 text-cream/50 border border-cream/20 text-xs">HIDDEN</Badge>
                                            )}
                                        </div>
                                        <p className="text-cream/50 text-sm">
                                            {coffee.station} Station • {coffee.referenceCode}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-cream/50">
                                    <Package className="w-4 h-4" />
                                    {coffee.bagSize}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                {locations.map(location => {
                                    // Handle missing pricing for new locations
                                    const pricing = coffee.pricing?.[location.id] || {
                                        pricePerLb: 0,
                                        availability: 'out_of_stock',
                                        availabilityPeriod: '',
                                        terms: location.terms,
                                        updatedAt: new Date(),
                                    };
                                    const availConfig = availabilityConfig[pricing.availability || 'out_of_stock'];

                                    return (
                                        <div
                                            key={location.id}
                                            className="glass p-4 rounded-xl border border-gold/10 hover:border-gold/30 transition-all duration-300 group"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{location.flag}</span>
                                                    <span className="text-cream font-medium">{location.name}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => openEditDialog(coffee, location.id)}
                                                    className="h-8 w-8 p-0 text-cream/40 hover:text-gold hover:bg-gold/10 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-cream/50 text-sm">Price</span>
                                                    <span className="text-cream font-semibold font-serif text-lg">
                                                        {pricing.availability !== 'out_of_stock'
                                                            ? <span className="text-gold">${(pricing.pricePerLb || 0).toFixed(2)}<span className="text-cream/50 text-sm font-normal">/lb</span></span>
                                                            : <span className="text-cream/40">—</span>
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-cream/50 text-sm">Status</span>
                                                    <Badge className={`text-xs ${availConfig.badgeClass}`}>
                                                        {pricing.availability === 'pre_shipment' && pricing.availabilityPeriod
                                                            ? pricing.availabilityPeriod
                                                            : availConfig.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-cream/50 text-sm">Terms</span>
                                                    <span className="text-cream/70 text-sm">{pricing.terms || location.terms}</span>
                                                </div>
                                            </div>

                                            <div className="divider-gold mt-4 pt-3">
                                                <p className="text-xs text-cream/40">
                                                    Updated {pricing.updatedAt ? new Date(pricing.updatedAt).toLocaleDateString() : 'Never'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="dialog-content max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-cream font-serif text-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-gold" />
                            </div>
                            Edit Pricing
                        </DialogTitle>
                        <DialogDescription className="text-cream/60">
                            Update price and availability for this location
                        </DialogDescription>
                    </DialogHeader>

                    {editingPricing && selectedCoffee && (
                        <div className="py-6 space-y-6">
                            {/* Coffee Info */}

                            <div className="glass p-4 rounded-xl">
                                <p className="text-cream font-medium">{selectedCoffee.name}</p>
                                <p className="text-cream/50 text-sm flex items-center gap-2 mt-1">
                                    {(() => {
                                        const loc = locations.find(l => l.id === editingPricing.location);
                                        return loc ? (
                                            <>
                                                <span className="text-lg">{loc.flag}</span>
                                                {loc.name}
                                                <span className="text-cream/30">•</span>
                                                {loc.terms}
                                            </>
                                        ) : null;
                                    })()}
                                </p>
                            </div>

                            {/* Price Input */}
                            <div className="space-y-2">
                                <Label className="text-cream/70">Price per lb (USD)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingPricing.pricePerLb}
                                        onChange={(e) => setEditingPricing({
                                            ...editingPricing,
                                            pricePerLb: e.target.value,
                                        })}
                                        className="input-premium pl-12 text-lg font-semibold"
                                    />
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="space-y-2">
                                <Label className="text-cream/70">Availability</Label>
                                <Select
                                    value={editingPricing.availability}
                                    onValueChange={(v) => setEditingPricing({
                                        ...editingPricing,
                                        availability: v as Availability,
                                    })}
                                >
                                    <SelectTrigger className="input-premium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-forest-dark border-gold/20">
                                        {availabilityOptions.map(opt => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                                className="text-cream focus:bg-gold/20 focus:text-gold"
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Availability Period for Pre-Shipment */}
                            {editingPricing.availability === 'pre_shipment' && (
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Availability Period</Label>
                                    <Input
                                        placeholder="e.g., Mar 2025"
                                        value={editingPricing.availabilityPeriod}
                                        onChange={(e) => setEditingPricing({
                                            ...editingPricing,
                                            availabilityPeriod: e.target.value,
                                        })}
                                        className="input-premium"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isSaving}
                            className="btn-ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-premium"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                <DialogContent className="dialog-content max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-cream font-serif text-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-gold" />
                            </div>
                            Pricing Settings
                        </DialogTitle>
                        <DialogDescription className="text-cream/60">
                            Configure available pricing locations and terms.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h3 className="text-gold text-sm font-semibold uppercase tracking-wider">Locations</h3>
                            <Button size="sm" onClick={addLocation} className="btn-premium py-1 h-8 text-xs">
                                <Plus className="w-3 h-3 mr-1" /> Add Location
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {editingLocations.map((loc, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 glass rounded-xl border border-gold/10">
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <Label className="text-xs text-cream/50 mb-1">ID (Internal)</Label>
                                            <Input
                                                value={loc.id}
                                                onChange={(e) => updateLocation(index, 'id', e.target.value)}
                                                className="input-premium h-8 text-sm"
                                                placeholder="e.g. addis_ababa"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-cream/50 mb-1">Name</Label>
                                            <Input
                                                value={loc.name}
                                                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                className="input-premium h-8 text-sm"
                                                placeholder="e.g. Addis Ababa"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-cream/50 mb-1">Flag/Emoji</Label>
                                            <Input
                                                value={loc.flag}
                                                onChange={(e) => updateLocation(index, 'flag', e.target.value)}
                                                className="input-premium h-8 text-sm"
                                                placeholder="e.g. 🇪🇹"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-cream/50 mb-1">Default Terms</Label>
                                            <Input
                                                value={loc.terms}
                                                onChange={(e) => updateLocation(index, 'terms', e.target.value)}
                                                className="input-premium h-8 text-sm"
                                                placeholder="e.g. FOB"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-6">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => removeLocation(index)}
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsSettingsDialogOpen(false)}
                            disabled={isSaving}
                            className="btn-ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveLocations}
                            disabled={isSaving}
                            className="btn-premium"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save Settings'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
