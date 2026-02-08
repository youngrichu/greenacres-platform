'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@greenacres/ui';
import {
    ArrowLeft,
    MapPin,
    Star,
    Package,
    Award,
    Coffee,
    Send,
    Loader2,
    CheckCircle,
    Sparkles,
    Plus,
    Play,
    Lock,
    Maximize2,
    X,
} from 'lucide-react';
import type { CoffeeProduct, Location, Availability, InquiryItem } from '@greenacres/types';
import { LocationLabels } from '@greenacres/types';

const availabilityColors: Record<Availability, string> = {
    in_stock: 'badge-success',
    pre_shipment: 'badge-warning',
    out_of_stock: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

const availabilityLabels: Record<Availability, string> = {
    in_stock: 'In Stock',
    pre_shipment: 'Pre-Shipment',
    out_of_stock: 'Out of Stock',
};

interface CoffeeDetailViewProps {
    coffee: CoffeeProduct;
    mode: 'public' | 'portal';
    // Portal-specific props
    onAddToCart?: (item: InquiryItem) => void;
    onSubmitInquiry?: (e: React.FormEvent, data: any) => Promise<void>;
    isSubmitting?: boolean;
    submitSuccess?: boolean;
    submitError?: string | null;
    addedToCart?: boolean;
    user?: any;
}

export default function CoffeeDetailView({
    coffee,
    mode,
    onAddToCart,
    onSubmitInquiry,
    isSubmitting = false,
    submitSuccess = false,
    submitError = null,
    addedToCart = false,
    user,
}: CoffeeDetailViewProps) {
    const [selectedLocation, setSelectedLocation] = useState<Location>('addis_ababa');
    const [quantity, setQuantity] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [message, setMessage] = useState('');
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Combine images and videos into a single media array for the gallery
    // Prioritize imageUrl, then unique images from the gallery
    const mediaItems = [
        ...(coffee.imageUrl ? [coffee.imageUrl] : []),
        ...(coffee.images || [])
    ].filter((img, index, self) => img && self.indexOf(img) === index);

    if (mediaItems.length === 0) {
        mediaItems.push('/images/coffee-bean-3d.jpg');
    }

    // Add video placeholders if videos exist (in a real app, we'd parse the URL to get thumbnails)
    const videoItems = coffee.videos || [];

    const allMedia = [
        ...mediaItems.map(src => ({ type: 'image' as const, src })),
        ...videoItems.map(src => ({ type: 'video' as const, src }))
    ];

    const handleAddToCart = () => {
        if (!onAddToCart || !quantity) return;

        onAddToCart({
            coffeeId: coffee.id,
            coffeeName: `${coffee.region} ${coffee.grade} ${coffee.preparation === 'washed' ? 'Washed' : 'Natural'}`,
            quantity: parseInt(quantity) || 1,
            preferredLocation: selectedLocation,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSubmitInquiry) return;

        await onSubmitInquiry(e, {
            quantity,
            selectedLocation,
            targetDate,
            message
        });

        if (!submitError) {
            setQuantity('');
            setMessage('');
            setTargetDate('');
        }
    };

    const selectedPricing = coffee.pricing[selectedLocation];

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Back Button */}
            <div className="mb-8">
                <Link
                    href={mode === 'portal' ? "/portal/catalog" : "/#coffee"}
                    className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {mode === 'portal' ? 'Back to Catalog' : 'Back to Collection'}
                </Link>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                {/* LEFT COLUMN: Media Gallery (Span 7) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Main Media Viewer */}
                    <div className="relative aspect-video rounded-3xl overflow-hidden glass-card border-gold/10 group">
                        {allMedia[activeMediaIndex].type === 'image' ? (
                            <Image
                                src={allMedia[activeMediaIndex].src}
                                alt={coffee.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full bg-black/50 flex items-center justify-center">
                                {/* Placeholder for video player logic */}
                                <div className="text-center">
                                    <Play className="w-16 h-16 text-gold opacity-80 mb-4 mx-auto" />
                                    <p className="text-cream/80">Video Player Placeholder</p>
                                    <a
                                        href={allMedia[activeMediaIndex].src}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gold hover:underline text-sm"
                                    >
                                        Watch on YouTube
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Lightbox Trigger */}
                        {allMedia[activeMediaIndex].type === 'image' && (
                            <button
                                onClick={() => setIsLightboxOpen(true)}
                                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-gold/80 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Maximize2 className="w-5 h-5" />
                            </button>
                        )}

                        {/* Media Type Indicator */}

                    </div>

                    {/* Thumbnails Strip */}
                    {allMedia.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {allMedia.map((media, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveMediaIndex(idx)}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeMediaIndex === idx
                                        ? 'border-gold shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {media.type === 'image' ? (
                                        <Image
                                            src={media.src}
                                            alt={`Thumbnail ${idx}`}
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                                            <Play className="w-8 h-8 text-gold" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Story / Description Placeholder (can be expanded later) */}
                    <div className="glass-card rounded-2xl p-8">
                        <h3 className="text-xl font-serif text-cream mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gold" />
                            Origin Story
                        </h3>
                        <p className="text-cream/70 leading-relaxed text-lg">
                            This exceptional {coffee.grade} {coffee.preparation} coffee hails from the {coffee.region} region.
                            Grown at high altitudes and meticulously processed at the {coffee.station},
                            it represents the pinnacle of Ethiopian specialty coffee.
                            {coffee.isTopLot && " Selected as a Top Lot for its outstanding cup profile and clarity."}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Info & Actions (Span 5) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Header Info */}
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-3">
                            {coffee.isTopLot && (
                                <Badge className="badge-gold">
                                    <Star className="w-3 h-3 mr-1" />
                                    TOP LOT
                                </Badge>
                            )}
                            <Badge variant="outline" className="border-gold/30 text-cream/60">
                                {coffee.grade}
                            </Badge>
                            <span className="text-cream/40 font-mono text-sm">{coffee.referenceCode}</span>
                        </div>
                        <h1 className="text-4xl font-serif text-cream mb-2 leading-tight">
                            {coffee.region} {coffee.preparation === 'washed' ? 'Washed' : 'Natural'}
                        </h1>
                        <p className="text-xl text-cream/60">
                            {coffee.station} • {coffee.cropYear}
                        </p>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card rounded-xl p-4 border-l-2 border-l-gold/50">
                            <p className="text-xs text-cream/40 mb-1 uppercase tracking-wider">SCA Score</p>
                            <p className="text-2xl font-bold text-cream">{coffee.scaScore}</p>
                        </div>
                        <div className="glass-card rounded-xl p-4 border-l-2 border-l-forest/50">
                            <p className="text-xs text-cream/40 mb-1 uppercase tracking-wider">Processing</p>
                            <p className="text-xl font-semibold text-cream capitalize">{coffee.preparation}</p>
                        </div>
                        <div className="glass-card rounded-xl p-4">
                            <p className="text-xs text-cream/40 mb-1 uppercase tracking-wider">Bag Size</p>
                            <p className="text-lg font-medium text-cream">{coffee.bagSize}</p>
                        </div>
                        <div className="glass-card rounded-xl p-4">
                            <p className="text-xs text-cream/40 mb-1 uppercase tracking-wider">Cert</p>
                            <p className="text-lg font-medium text-cream">{coffee.certification}</p>
                        </div>
                    </div>

                    {/* Tasting Notes */}
                    <div className="glass-card rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <h3 className="text-sm font-semibold text-cream/80 mb-4 uppercase tracking-widest">Tasting Profile</h3>
                        <div className="flex flex-wrap gap-2">
                            {coffee.tastingNotes.map((note, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-gradient-to-br from-gold/10 to-transparent text-gold border border-gold/20 rounded-lg text-sm font-medium"
                                >
                                    {note}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Pricing / Portal Logic */}
                    {mode === 'portal' ? (
                        <div className="bg-gradient-to-b from-forest-light/30 to-forest-deep/50 rounded-2xl border border-gold/20 p-6 backdrop-blur-md shadow-xl">
                            {/* Pricing Selector */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-cream mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gold" />
                                    Pricing & Availability
                                </h3>

                                <div className="space-y-3 mb-6">
                                    {Object.entries(coffee.pricing).map(([loc, pricing]) => (
                                        <div
                                            key={loc}
                                            className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${selectedLocation === loc
                                                ? 'bg-gold/20 border border-gold/50'
                                                : 'bg-black/20 hover:bg-black/30 border border-transparent'
                                                }`}
                                            onClick={() => setSelectedLocation(loc as Location)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${selectedLocation === loc ? 'bg-gold shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-cream/20'}`} />
                                                <span className="text-cream font-medium text-sm">
                                                    {loc === 'addis_ababa' ? '🇪🇹' : '🇮🇹'} {LocationLabels[loc as Location]}
                                                </span>
                                            </div>
                                            {pricing.availability !== 'out_of_stock' && (
                                                <span className="text-gold font-bold">
                                                    ${pricing.pricePerLb?.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {selectedPricing?.availability !== 'out_of_stock' && (
                                    <div className="p-4 bg-black/20 rounded-xl mb-6 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">Current Price</p>
                                            <p className="text-3xl font-bold text-gold">${selectedPricing?.pricePerLb?.toFixed(2)}<span className="text-lg text-gold/60 font-normal">/lb</span></p>
                                        </div>
                                        <Badge className={availabilityColors[selectedPricing?.availability] || 'badge-neutral'}>
                                            {availabilityLabels[selectedPricing?.availability]}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Inquiry Form */}
                            {submitSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h4 className="text-xl font-medium text-cream mb-2">Inquiry Submitted!</h4>
                                    <p className="text-cream/50 mb-6">We'll follow up shortly.</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()} // Simple reset for now
                                        className="btn-ghost w-full"
                                    >
                                        Start New Inquiry
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-cream/60">Quantity (Bags)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="10"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                className="input-premium bg-black/20"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-cream/60">Target Date</Label>
                                            <Input
                                                type="date"
                                                value={targetDate}
                                                onChange={(e) => setTargetDate(e.target.value)}
                                                className="input-premium bg-black/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-cream/60">Message (Optional)</Label>
                                        <Textarea
                                            placeholder="Specific requirements..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="input-premium bg-black/20 min-h-[80px]"
                                        />
                                    </div>

                                    {submitError && (
                                        <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{submitError}</p>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={!quantity || selectedPricing?.availability === 'out_of_stock' || addedToCart}
                                            className="flex-1 btn-ghost"
                                        >
                                            {addedToCart ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !quantity || selectedPricing?.availability === 'out_of_stock'}
                                            className="flex-[3] btn-premium"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit Inquiry
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        /* PUBLIC MODE: Login CTA */
                        <div className="bg-forest-light/10 rounded-2xl border border-gold/10 p-8 text-center backdrop-blur-sm">
                            <Lock className="w-10 h-10 text-gold/50 mx-auto mb-4" />
                            <h3 className="text-xl font-serif text-cream mb-2">Log in to View Pricing</h3>
                            <p className="text-cream/60 mb-6 max-w-sm mx-auto">
                                Exclusive wholesale pricing, live availability, and direct ordering are available to approved partners.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button asChild variant="outline" className="btn-ghost">
                                    <Link href="/register">Request Access</Link>
                                </Button>
                                <Button asChild className="btn-premium">
                                    <Link href="/login">Portal Login</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="relative w-full max-w-6xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                        {allMedia[activeMediaIndex].type === 'image' && (
                            <Image
                                src={allMedia[activeMediaIndex].src}
                                alt={coffee.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 1200px"
                                className="object-contain"
                                unoptimized
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
