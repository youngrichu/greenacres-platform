'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@greenacres/auth';
import { getInquiriesByUser } from '@greenacres/db';
import type { Inquiry, InquiryStatus } from '@greenacres/types';
import { BagSizeLabels, BagTypeLabels } from '@greenacres/types';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@greenacres/ui';
import {
    FileText,
    Package,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
    Loader2,
    ChevronRight,
    AlertCircle
} from 'lucide-react';

const statusConfig: Record<InquiryStatus, { label: string; badgeClass: string; icon: typeof Clock }> = {
    new: { label: 'New', badgeClass: 'badge-info', icon: Clock },
    reviewed: { label: 'Under Review', badgeClass: 'badge-warning', icon: MessageSquare },
    completed: { label: 'Completed', badgeClass: 'badge-success', icon: CheckCircle },
    cancelled: { label: 'Cancelled', badgeClass: 'badge-error', icon: XCircle },
};

function InquiryCard({ inquiry, onSelect }: { inquiry: Inquiry; onSelect: (inquiry: Inquiry) => void }) {
    const config = statusConfig[inquiry.status];
    const StatusIcon = config.icon;

    return (
        <button
            onClick={() => onSelect(inquiry)}
            className="w-full glass-card rounded-xl p-5 text-left hover:border-gold/40 transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                        <h3 className="text-cream font-medium group-hover:text-gold transition-colors">
                            Inquiry #{inquiry.id.slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-cream/40 text-sm">
                            {inquiry.coffeeItems?.length || 0} items
                        </p>
                    </div>
                </div>
                <Badge className={config.badgeClass}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                </Badge>
            </div>

            {/* Coffee items summary */}
            <div className="space-y-2 mb-4">
                {inquiry.coffeeItems?.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center justify-between glass rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gold/60" />
                            <span className="text-cream/80 text-sm">{item.coffeeName}</span>
                        </div>
                        <span className="text-gold text-sm font-medium">{item.quantity}</span>
                    </div>
                ))}
                {inquiry.coffeeItems && inquiry.coffeeItems.length > 2 && (
                    <p className="text-cream/40 text-xs text-center">
                        +{inquiry.coffeeItems.length - 2} more items
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                <div className="flex items-center gap-2 text-cream/40 text-sm">
                    <Calendar className="w-4 h-4" />
                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <span className="text-gold text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                </span>
            </div>
        </button>
    );
}

export default function InquiriesPage() {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all');

    useEffect(() => {
        async function fetchInquiries() {
            if (!user?.id) return;

            try {
                setLoading(true);
                const data = await getInquiriesByUser(user.id);
                setInquiries(data);
            } catch (error) {
                console.error('Error fetching inquiries:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchInquiries();
    }, [user?.id]);

    const filteredInquiries = filterStatus === 'all'
        ? inquiries
        : inquiries.filter(i => i.status === filterStatus);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                    <p className="text-cream/60">Loading your inquiries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 lg:mb-8 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-serif text-cream mb-2">My Inquiries</h1>
                <p className="text-cream/50">Track and manage your submitted coffee inquiries</p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${filterStatus === 'all'
                        ? 'bg-gold text-forest-deep'
                        : 'glass text-cream/60 hover:text-cream'
                        }`}
                >
                    All ({inquiries.length})
                </button>
                {(['new', 'reviewed', 'completed'] as const).map(status => {
                    const config = statusConfig[status];
                    const count = inquiries.filter(i => i.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${filterStatus === status
                                ? 'bg-gold text-forest-deep'
                                : 'glass text-cream/60 hover:text-cream'
                                }`}
                        >
                            {config.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Inquiries list */}
            {filteredInquiries.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    {filteredInquiries.map(inquiry => (
                        <InquiryCard
                            key={inquiry.id}
                            inquiry={inquiry}
                            onSelect={setSelectedInquiry}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                        <AlertCircle className="w-16 h-16 text-cream/20 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-cream mb-2">No Inquiries Yet</h3>
                        <p className="text-cream/50 mb-6">
                            You haven't submitted any inquiries yet. Browse our catalog to find premium Ethiopian coffees.
                        </p>
                        <Button asChild className="btn-premium">
                            <a href="/portal/catalog">Browse Catalog</a>
                        </Button>
                    </div>
                </div>
            )}

            {/* Inquiry detail modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="glass-card rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-fade-in-up sm:animate-none">
                        <div className="p-6 border-b border-gold/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-serif text-cream mb-1">
                                        Inquiry #{selectedInquiry.id.slice(-6).toUpperCase()}
                                    </h2>
                                    <p className="text-cream/40">
                                        Submitted {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge className={statusConfig[selectedInquiry.status].badgeClass}>
                                    {statusConfig[selectedInquiry.status].label}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Coffee Items */}
                            <div>
                                <h3 className="text-cream font-medium mb-3">Requested Items</h3>
                                <div className="space-y-2">
                                    {selectedInquiry.coffeeItems?.map((item, index) => (
                                        <div key={index} className="glass rounded-lg p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-cream font-medium">{item.coffeeName}</p>
                                                <p className="text-cream/40 text-sm">
                                                    {item.preferredLocation && `📍 ${item.preferredLocation}`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gold font-semibold">{item.quantity}</p>
                                                <p className="text-cream/40 text-xs">
                                                    {BagSizeLabels[item.bagSize] || item.bagSize || '—'} · {BagTypeLabels[item.bagType] || item.bagType || '—'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedInquiry.message && (
                                <div>
                                    <h3 className="text-cream font-medium mb-3">Additional Notes</h3>
                                    <div className="glass rounded-lg p-4">
                                        <p className="text-cream/80 text-sm">{selectedInquiry.message}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gold/10">
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="btn-ghost w-full"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
