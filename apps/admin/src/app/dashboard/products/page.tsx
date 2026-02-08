'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Button,
    Badge,
    Input,
    Label,
    Textarea,
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
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@greenacres/ui';
import {
    Search,
    Plus,
    Edit,
    Eye,
    EyeOff,
    Package,
    Star,
    GripVertical,
    Loader2,
    AlertTriangle,
    Trash2,
    Coffee,
    MapPin,
    Award,
    RefreshCw,
    Filter
} from 'lucide-react';
import type { CoffeeProduct, Location, Availability } from '@greenacres/types';
import { getCoffees, createCoffee, updateCoffee, toggleCoffeeActive, deleteCoffee } from '@greenacres/db';
import { ImageUpload } from '@/components/ImageUpload';

const regions = ['Yirgacheffe', 'Sidamo', 'Guji', 'Limu', 'Jimma', 'Harar', 'Kaffa', 'Wellega'];
const grades = ['G1', 'G2', 'G3', 'G4', 'G5'];
const preparations = ['washed', 'natural'] as const;
const certifications = ['Organic', 'Rainforest Alliance', 'UTZ', 'Fair Trade', 'Conventional'];

interface CoffeeForm {
    name: string;
    station: string;
    region: string;
    grade: string;
    preparation: 'washed' | 'natural';
    cropYear: string;
    certification: string;
    scaScore: string;
    tastingNotes: string;
    bagSize: string;
    referenceCode: string;
    isTopLot: boolean;
    imageUrl: string;
    images: string;
    videos: string;
}

const defaultForm: CoffeeForm = {
    name: '',
    station: '',
    region: 'Yirgacheffe',
    grade: 'G1',
    preparation: 'washed',
    cropYear: '2024/25',
    certification: 'Conventional',
    scaScore: '85',
    tastingNotes: '',
    bagSize: '60 KG GrainPro',
    referenceCode: '',
    isTopLot: false,
    imageUrl: '',
    images: '',
    videos: '',
};

const defaultPricing = {
    addis_ababa: { location: 'addis_ababa' as Location, pricePerLb: 4.50, availability: 'in_stock' as Availability, availabilityPeriod: 'Immediate', terms: 'FOB Djibouti', paymentTerms: 'LC/CAD', updatedAt: new Date() },
    trieste: { location: 'trieste' as Location, pricePerLb: 5.20, availability: 'pre_shipment' as Availability, availabilityPeriod: '', terms: 'EXW', paymentTerms: 'LC/CAD', updatedAt: new Date() },
    genoa: { location: 'genoa' as Location, pricePerLb: 5.30, availability: 'pre_shipment' as Availability, availabilityPeriod: '', terms: 'EXW', paymentTerms: 'LC/CAD', updatedAt: new Date() },
};

export default function ProductsPage() {
    const [coffees, setCoffees] = useState<CoffeeProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showHidden, setShowHidden] = useState(true);

    // Add/Edit Coffee Modal
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState<CoffeeForm>(defaultForm);
    const [editingCoffeeId, setEditingCoffeeId] = useState<string | null>(null);

    // Delete Coffee Modal
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingCoffee, setDeletingCoffee] = useState<CoffeeProduct | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch coffees from Firestore
    useEffect(() => {
        fetchCoffees();
    }, []);

    async function fetchCoffees() {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedCoffees = await getCoffees(false); // include inactive
            setCoffees(fetchedCoffees);
        } catch (err) {
            console.error('Failed to fetch coffees:', err);
            setError('Failed to load coffee products. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const filteredCoffees = coffees.filter(coffee => {
        if (!showHidden && !coffee.isActive) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                (coffee.name || '').toLowerCase().includes(query) ||
                (coffee.region || '').toLowerCase().includes(query) ||
                (coffee.referenceCode || '').toLowerCase().includes(query)
            );
        }
        return true;
    });

    const handleToggleActive = async (coffeeId: string, currentActive: boolean) => {
        try {
            const result = await toggleCoffeeActive(coffeeId, !currentActive);
            if (result.success && result.data) {
                setCoffees(coffees.map(c => c.id === coffeeId ? result.data! : c));
            } else {
                setError(result.error || 'Failed to toggle visibility');
            }
        } catch (err) {
            console.error('Failed to toggle visibility:', err);
            setError('Failed to toggle visibility. Please try again.');
        }
    };

    const handleToggleTopLot = async (coffeeId: string, currentTopLot: boolean) => {
        try {
            const result = await updateCoffee(coffeeId, { isTopLot: !currentTopLot });
            if (result.success && result.data) {
                setCoffees(coffees.map(c => c.id === coffeeId ? result.data! : c));
            } else {
                setError(result.error || 'Failed to update featured status');
            }
        } catch (err) {
            console.error('Failed to toggle top lot:', err);
            setError('Failed to update featured status. Please try again.');
        }
    };

    const openDeleteConfirm = (coffee: CoffeeProduct) => {
        setDeletingCoffee(coffee);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingCoffee) return;

        try {
            setIsDeleting(true);
            const result = await deleteCoffee(deletingCoffee.id);
            if (result.success) {
                setCoffees(coffees.filter(c => c.id !== deletingCoffee.id));
                setIsDeleteOpen(false);
                setDeletingCoffee(null);
            } else {
                setError(result.error || 'Failed to delete coffee');
            }
        } catch (err) {
            console.error('Failed to delete coffee:', err);
            setError('Failed to delete coffee. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const openAddForm = () => {
        setForm(defaultForm);
        setEditingCoffeeId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (coffee: CoffeeProduct) => {
        setForm({
            name: coffee.name,
            station: coffee.station,
            region: coffee.region,
            grade: coffee.grade,
            preparation: coffee.preparation,
            cropYear: coffee.cropYear,
            certification: coffee.certification || 'Conventional',
            scaScore: coffee.scaScore || '',
            tastingNotes: coffee.tastingNotes.join(', '),
            bagSize: coffee.bagSize,
            referenceCode: coffee.referenceCode,
            isTopLot: coffee.isTopLot,
            imageUrl: coffee.imageUrl || '',
            images: (coffee.images || []).join(', '),
            videos: (coffee.videos || []).join(', '),
        });
        setEditingCoffeeId(coffee.id);
        setIsFormOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.station || !form.referenceCode) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const coffeeData = {
                name: form.name,
                station: form.station,
                region: form.region,
                grade: form.grade,
                preparation: form.preparation,
                cropYear: form.cropYear,
                certification: form.certification,
                scaScore: form.scaScore,
                tastingNotes: form.tastingNotes.split(',').map(n => n.trim()).filter(n => n),
                bagSize: form.bagSize,
                referenceCode: form.referenceCode,
                isTopLot: form.isTopLot,
                imageUrl: form.imageUrl,
                images: form.images.split(',').map(s => s.trim()).filter(s => s),
                videos: form.videos.split(',').map(s => s.trim()).filter(s => s),
            };

            if (editingCoffeeId) {
                // Update existing coffee
                const result = await updateCoffee(editingCoffeeId, coffeeData);
                if (result.success && result.data) {
                    setCoffees(coffees.map(c => c.id === editingCoffeeId ? result.data! : c));
                    setIsFormOpen(false);
                    setForm(defaultForm);
                    setEditingCoffeeId(null);
                } else {
                    setError(result.error || 'Failed to update coffee');
                }
            } else {
                // Create new coffee
                const result = await createCoffee({
                    ...coffeeData,
                    isActive: true,
                    displayOrder: coffees.length + 1,
                    pricing: defaultPricing,
                });
                if (result.success && result.data) {
                    setCoffees([...coffees, result.data]);
                    setIsFormOpen(false);
                    setForm(defaultForm);
                } else {
                    setError(result.error || 'Failed to create coffee');
                }
            }
        } catch (err) {
            console.error('Failed to save coffee:', err);
            setError('Failed to save coffee. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const activeCount = coffees.filter(c => c.isActive).length;
    const topLotCount = coffees.filter(c => c.isTopLot).length;

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
                    <p className="text-cream/60">Loading coffee products...</p>
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
                    <span className="text-gold text-sm font-medium uppercase tracking-wider">Product Management</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-cream font-serif mb-2">
                            Coffee Products
                        </h1>
                        <p className="text-cream/60">
                            Manage coffee offerings, visibility, and featured products
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={fetchCoffees} variant="outline" className="btn-ghost">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button onClick={openAddForm} className="btn-premium">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Coffee
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

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <Card className="glass-card">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="stat-icon">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-cream font-serif">{coffees.length}</p>
                            <p className="text-cream/50 text-sm">Total Products</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-success/30 to-success/10 flex items-center justify-center text-success">
                            <Eye className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-cream font-serif">{activeCount}</p>
                            <p className="text-cream/50 text-sm">Active (Visible)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning/30 to-warning/10 flex items-center justify-center text-warning">
                            <Star className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-cream font-serif">{topLotCount}</p>
                            <p className="text-cream/50 text-sm">Featured (Top Lots)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                    <Input
                        placeholder="Search by name, region, or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-premium pl-12"
                    />
                </div>

                <label className="flex items-center gap-3 cursor-pointer glass px-4 py-2.5 rounded-xl">
                    <input
                        type="checkbox"
                        checked={showHidden}
                        onChange={(e) => setShowHidden(e.target.checked)}
                        className="w-4 h-4 rounded border-gold/30 bg-forest/30 text-gold focus:ring-gold/30"
                    />
                    <span className="text-sm text-cream/70">Show hidden products</span>
                </label>
            </div>

            {/* Products */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {coffees.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="py-16">
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Coffee className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-semibold text-cream mb-2">No coffee products yet</h3>
                                <p className="text-cream/60 mb-6">Add your first coffee product to get started.</p>
                                <Button onClick={openAddForm} className="btn-premium">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Coffee
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : filteredCoffees.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="py-16">
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Search className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-semibold text-cream mb-2">No matching products</h3>
                                <p className="text-cream/60">Try adjusting your search or filter criteria</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="table-premium">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8"></TableHead>
                                        <TableHead className="min-w-[180px]">Product</TableHead>
                                        <TableHead className="min-w-[120px]">Region</TableHead>
                                        <TableHead className="min-w-[80px]">Grade</TableHead>
                                        <TableHead className="min-w-[100px]">SCA Score</TableHead>
                                        <TableHead className="min-w-[110px]">Status</TableHead>
                                        <TableHead className="min-w-[80px]">Featured</TableHead>
                                        <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCoffees.map((coffee, index) => (
                                        <TableRow
                                            key={coffee.id}
                                            className={`group ${!coffee.isActive ? 'opacity-50' : ''}`}
                                            style={{ animationDelay: `${200 + index * 30}ms` }}
                                        >
                                            <TableCell>
                                                <GripVertical className="w-4 h-4 text-cream/30 cursor-move group-hover:text-cream/60 transition-colors" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-start gap-3 py-1">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0">
                                                        <Coffee className="w-5 h-5 text-gold" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-cream font-medium group-hover:text-gold transition-colors truncate">
                                                            {coffee.name}
                                                        </p>
                                                        <p className="text-cream/50 text-sm">{coffee.referenceCode}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-cream/70">
                                                    <MapPin className="w-4 h-4 text-gold/60" />
                                                    {coffee.region}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="badge-gold">{coffee.grade}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-cream/70">
                                                    <Award className="w-4 h-4 text-gold/60" />
                                                    {coffee.scaScore}+
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handleToggleActive(coffee.id, coffee.isActive)}
                                                    className={`
                                                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                                                        ${coffee.isActive
                                                            ? 'badge-success'
                                                            : 'bg-cream/10 text-cream/50 border border-cream/20 hover:bg-cream/20'
                                                        }
                                                    `}
                                                >
                                                    {coffee.isActive ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Visible
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Hidden
                                                        </>
                                                    )}
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handleToggleTopLot(coffee.id, coffee.isTopLot)}
                                                    className={`
                                                        p-2 rounded-lg transition-all duration-300
                                                        ${coffee.isTopLot
                                                            ? 'text-warning bg-warning/20 hover:bg-warning/30'
                                                            : 'text-cream/40 hover:text-warning hover:bg-warning/10'
                                                        }
                                                    `}
                                                >
                                                    <Star className="w-5 h-5" fill={coffee.isTopLot ? 'currentColor' : 'none'} />
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => openEditForm(coffee)}
                                                        className="text-cream/50 hover:text-gold hover:bg-gold/10"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => openDeleteConfirm(coffee)}
                                                        className="text-cream/50 hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>

            {/* Add/Edit Coffee Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="dialog-content max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-cream font-serif text-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                <Coffee className="w-5 h-5 text-gold" />
                            </div>
                            {editingCoffeeId ? 'Edit Coffee' : 'Add New Coffee'}
                        </DialogTitle>
                        <DialogDescription className="text-cream/60">
                            {editingCoffeeId ? 'Update the coffee product details' : 'Fill in the details for the new coffee product'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        {/* Basic Info */}
                        <div className="glass p-4 rounded-xl space-y-4">
                            <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Name *</Label>
                                    <Input
                                        placeholder="e.g., Yirgacheffe G1 Washed"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Reference Code *</Label>
                                    <Input
                                        placeholder="e.g., ETH-YRG-001"
                                        value={form.referenceCode}
                                        onChange={(e) => setForm({ ...form, referenceCode: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Station *</Label>
                                    <Input
                                        placeholder="e.g., Chelchele"
                                        value={form.station}
                                        onChange={(e) => setForm({ ...form, station: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Region</Label>
                                    <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                                        <SelectTrigger className="input-premium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forest-dark border-gold/20">
                                            {regions.map(r => (
                                                <SelectItem key={r} value={r} className="text-cream focus:bg-gold/20 focus:text-gold">{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="glass p-4 rounded-xl space-y-4">
                            <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Product Details</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Grade</Label>
                                    <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                                        <SelectTrigger className="input-premium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forest-dark border-gold/20">
                                            {grades.map(g => (
                                                <SelectItem key={g} value={g} className="text-cream focus:bg-gold/20 focus:text-gold">{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Preparation</Label>
                                    <Select value={form.preparation} onValueChange={(v) => setForm({ ...form, preparation: v as typeof form.preparation })}>
                                        <SelectTrigger className="input-premium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forest-dark border-gold/20">
                                            {preparations.map(p => (
                                                <SelectItem key={p} value={p} className="text-cream focus:bg-gold/20 focus:text-gold capitalize">{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Crop Year</Label>
                                    <Input
                                        placeholder="2024/25"
                                        value={form.cropYear}
                                        onChange={(e) => setForm({ ...form, cropYear: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Certification</Label>
                                    <Select value={form.certification} onValueChange={(v) => setForm({ ...form, certification: v })}>
                                        <SelectTrigger className="input-premium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forest-dark border-gold/20">
                                            {certifications.map(c => (
                                                <SelectItem key={c} value={c} className="text-cream focus:bg-gold/20 focus:text-gold">{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-cream/70">SCA Score</Label>
                                    <Input
                                        placeholder="85"
                                        value={form.scaScore}
                                        onChange={(e) => setForm({ ...form, scaScore: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-cream/70">Bag Size</Label>
                                    <Input
                                        placeholder="60 KG GrainPro"
                                        value={form.bagSize}
                                        onChange={(e) => setForm({ ...form, bagSize: e.target.value })}
                                        className="input-premium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-cream/70">Tasting Notes (comma-separated)</Label>
                                <Textarea
                                    placeholder="e.g., Jasmine, Bergamot, Lemon, Honey"
                                    value={form.tastingNotes}
                                    onChange={(e) => setForm({ ...form, tastingNotes: e.target.value })}
                                    className="input-premium min-h-[80px]"
                                />
                            </div>
                        </div>

                        {/* Media */}
                        <div className="glass p-4 rounded-xl space-y-4">
                            <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Media Gallery</h4>

                            <div className="space-y-2">
                                <Label className="text-cream/70">Main Product Image</Label>
                                <ImageUpload
                                    value={form.imageUrl}
                                    onChange={(val) => setForm({ ...form, imageUrl: val as string })}
                                    folder="products/main"
                                    label="Upload Main Image"
                                />
                                {form.imageUrl && (
                                    <p className="text-xs text-cream/30 break-all">{form.imageUrl}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-cream/70">Gallery Images</Label>
                                <ImageUpload
                                    value={form.images.split(',').map(s => s.trim()).filter(s => s)}
                                    onChange={(val) => setForm({ ...form, images: (val as string[]).join(', ') })}
                                    multiple
                                    folder="products/gallery"
                                    label="Upload Gallery Images"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-cream/70">Videos (Upload or Paste Links)</Label>
                                <p className="text-xs text-cream/40 mb-2">Upload simple videos or paste YouTube URLs below</p>
                                <ImageUpload
                                    value={[]}
                                    onChange={(val) => {
                                        const newVideos = Array.isArray(val) ? val : [val];
                                        const currentVideos = form.videos.split(',').map(s => s.trim()).filter(s => s);
                                        setForm({ ...form, videos: [...currentVideos, ...newVideos].join(', ') });
                                    }}
                                    multiple
                                    type="video"
                                    folder="products/videos"
                                    label="Upload Videos"
                                />
                                <Textarea
                                    placeholder="https://youtube.com/..."
                                    value={form.videos}
                                    onChange={(e) => setForm({ ...form, videos: e.target.value })}
                                    className="input-premium min-h-[60px]"
                                />
                            </div>
                        </div>

                        {/* Featured toggle */}
                        <label className="flex items-center gap-4 cursor-pointer glass p-4 rounded-xl group hover:border-gold/30 transition-colors">
                            <input
                                type="checkbox"
                                checked={form.isTopLot}
                                onChange={(e) => setForm({ ...form, isTopLot: e.target.checked })}
                                className="w-5 h-5 rounded border-gold/30 bg-forest/30 text-gold focus:ring-gold/30"
                            />
                            <div className="flex-1">
                                <span className="text-cream font-medium flex items-center gap-2">
                                    <Star className="w-4 h-4 text-gold" />
                                    Feature as Top Lot
                                </span>
                                <p className="text-cream/50 text-sm">Display this coffee prominently in the catalog</p>
                            </div>
                        </label>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsFormOpen(false)}
                            disabled={isSaving}
                            className="btn-ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="btn-premium"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                editingCoffeeId ? 'Update Coffee' : 'Add Coffee'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="dialog-content max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-cream font-serif text-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                            </div>
                            Delete Coffee Product
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-cream/80">
                            Are you sure you want to delete <span className="font-semibold text-cream">{deletingCoffee?.name}</span>?
                        </p>
                        <p className="text-cream/50 text-sm mt-2">
                            This action cannot be undone. The product will be permanently removed from the catalog.
                        </p>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            className="btn-ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            variant="destructive"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
