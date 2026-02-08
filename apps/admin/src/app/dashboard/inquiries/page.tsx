'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Button,
    Badge,
    Input,
    Textarea,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@greenacres/ui';
import {
    Search,
    Eye,
    FileText,
    Clock,
    CheckCircle,
    Package,
    Calendar,
    Building,
    Mail,
    MessageSquare,
    Loader2,
    AlertTriangle,
    RefreshCw,
    Coffee,
    User,
    ShoppingBag
} from 'lucide-react';
import type { Inquiry, InquiryStatus } from '@greenacres/types';
import { getInquiries, updateInquiryStatus, addInquiryNotes } from '@greenacres/db';

const statusConfig: Record<InquiryStatus, { label: string; badgeClass: string; icon: typeof Clock }> = {
    new: { label: 'New', badgeClass: 'badge-info', icon: FileText },
    reviewed: { label: 'Under Review', badgeClass: 'badge-warning', icon: Eye },
    completed: { label: 'Completed', badgeClass: 'badge-success', icon: CheckCircle },
    cancelled: { label: 'Cancelled', badgeClass: 'badge-error', icon: AlertTriangle },
};

const filterTabs: { value: InquiryStatus | 'all'; label: string; icon?: typeof Clock }[] = [
    { value: 'all', label: 'All Inquiries' },
    { value: 'new', label: 'New', icon: FileText },
    { value: 'reviewed', label: 'Under Review', icon: Eye },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: AlertTriangle },
];

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [newStatus, setNewStatus] = useState<InquiryStatus>('new');
    const [isSaving, setIsSaving] = useState(false);

    // Fetch inquiries from Firestore
    useEffect(() => {
        fetchInquiries();
    }, []);

    async function fetchInquiries() {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedInquiries = await getInquiries();
            setInquiries(fetchedInquiries);
        } catch (err) {
            console.error('Failed to fetch inquiries:', err);
            setError('Failed to load inquiries. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const filteredInquiries = inquiries.filter(inq => {
        if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                inq.companyName.toLowerCase().includes(query) ||
                inq.userEmail.toLowerCase().includes(query) ||
                inq.coffeeItems.some(item => item.coffeeName.toLowerCase().includes(query))
            );
        }
        return true;
    });

    const openDetailDialog = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setAdminNotes(inquiry.adminNotes || '');
        setNewStatus(inquiry.status);
        setIsDetailDialogOpen(true);
    };

    const handleSave = async () => {
        if (!selectedInquiry) return;
        setIsSaving(true);
        setError(null);

        try {
            // Update status if changed
            if (newStatus !== selectedInquiry.status) {
                const statusResult = await updateInquiryStatus(selectedInquiry.id, newStatus);
                if (!statusResult.success) {
                    setError(statusResult.error || 'Failed to update status');
                    setIsSaving(false);
                    return;
                }
            }

            // Update notes if changed
            if (adminNotes !== (selectedInquiry.adminNotes || '')) {
                const notesResult = await addInquiryNotes(selectedInquiry.id, adminNotes);
                if (!notesResult.success) {
                    setError(notesResult.error || 'Failed to update notes');
                    setIsSaving(false);
                    return;
                }
            }

            // Update local state
            setInquiries(inquiries.map(inq =>
                inq.id === selectedInquiry.id
                    ? { ...inq, status: newStatus, adminNotes, updatedAt: new Date() }
                    : inq
            ));

            setIsDetailDialogOpen(false);
        } catch (err) {
            console.error('Failed to save inquiry:', err);
            setError('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const statusCounts = {
        all: inquiries.length,
        new: inquiries.filter(i => i.status === 'new').length,
        reviewed: inquiries.filter(i => i.status === 'reviewed').length,
        completed: inquiries.filter(i => i.status === 'completed').length,
        cancelled: inquiries.filter(i => i.status === 'cancelled').length,
    };

    const getTotalBags = (inquiry: Inquiry) => {
        return inquiry.coffeeItems.reduce((sum, item) => sum + item.quantity, 0);
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
                    <p className="text-cream/60">Loading inquiries...</p>
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
                    <span className="text-gold text-sm font-medium uppercase tracking-wider">Inquiry Management</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-cream font-serif mb-2">
                            Customer Inquiries
                        </h1>
                        <p className="text-cream/60">
                            Review and respond to customer coffee inquiries
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={fetchInquiries} variant="outline" className="btn-ghost">
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

            {/* Status Tabs */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-wrap gap-2">
                    {filterTabs.map((tab) => {
                        const isActive = statusFilter === tab.value;
                        const count = statusCounts[tab.value];
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                                    ${isActive
                                        ? 'bg-gold/20 text-gold border border-gold/30'
                                        : 'bg-forest/30 text-cream/60 border border-transparent hover:text-cream hover:bg-forest/50'
                                    }
                                `}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                <span>{tab.label}</span>
                                <span className={`
                                    px-2 py-0.5 rounded-full text-xs font-semibold
                                    ${isActive ? 'bg-gold/30 text-gold' : 'bg-cream/10 text-cream/40'}
                                `}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                    <Input
                        placeholder="Search by company, email, or product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-premium pl-12 w-full"
                    />
                </div>
            </div>

            {/* Inquiries Grid */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {inquiries.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="py-16">
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-semibold text-cream mb-2">No inquiries yet</h3>
                                <p className="text-cream/60">Customer inquiries will appear here</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : filteredInquiries.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="py-16">
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Search className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-semibold text-cream mb-2">No matching inquiries</h3>
                                <p className="text-cream/60">Try adjusting your search or filter criteria</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredInquiries.map((inquiry, index) => {
                            const config = statusConfig[inquiry.status];
                            const StatusIcon = config.icon;

                            return (
                                <Card
                                    key={inquiry.id}
                                    className="glass-card hover:border-gold/30 transition-all duration-300 cursor-pointer group animate-fade-in-up"
                                    style={{ animationDelay: `${200 + index * 50}ms` }}
                                    onClick={() => openDetailDialog(inquiry)}
                                >
                                    <CardContent className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                                    <Building className="w-6 h-6 text-gold" />
                                                </div>
                                                <div>
                                                    <h3 className="text-cream font-semibold group-hover:text-gold transition-colors">
                                                        {inquiry.companyName}
                                                    </h3>
                                                    <p className="text-cream/50 text-sm">{inquiry.userEmail}</p>
                                                </div>
                                            </div>
                                            <Badge className={config.badgeClass}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {config.label}
                                            </Badge>
                                        </div>

                                        {/* Coffee Items */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 text-sm text-cream/60 mb-2">
                                                <Coffee className="w-4 h-4" />
                                                <span>Requested Products ({inquiry.coffeeItems.length})</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {inquiry.coffeeItems.slice(0, 3).map((item, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 rounded-lg bg-forest/40 text-cream/80 text-sm"
                                                    >
                                                        {item.coffeeName} × {item.quantity}
                                                    </span>
                                                ))}
                                                {inquiry.coffeeItems.length > 3 && (
                                                    <span className="px-3 py-1 rounded-lg bg-gold/20 text-gold text-sm">
                                                        +{inquiry.coffeeItems.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="flex items-center gap-1 text-cream/50">
                                                    <ShoppingBag className="w-4 h-4" />
                                                    {getTotalBags(inquiry)} bags
                                                </span>
                                                <span className="flex items-center gap-1 text-cream/50">
                                                    <Calendar className="w-4 h-4" />
                                                    {inquiry.createdAt
                                                        ? new Date(inquiry.createdAt).toLocaleDateString()
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gold/60 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye className="w-3 h-3" />
                                                View details
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="dialog-content max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedInquiry && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-cream font-serif text-xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-gold" />
                                    </div>
                                    Inquiry Details
                                </DialogTitle>
                                <DialogDescription className="text-cream/60">
                                    Review and update this inquiry
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-6 space-y-6">
                                {/* Customer Info */}
                                <div className="glass p-4 rounded-xl space-y-4">
                                    <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Customer Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <Building className="w-5 h-5 text-gold/60" />
                                            <div>
                                                <p className="text-cream/50 text-xs">Company</p>
                                                <p className="text-cream font-medium">{selectedInquiry.companyName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gold/60" />
                                            <div>
                                                <p className="text-cream/50 text-xs">Email</p>
                                                <p className="text-cream font-medium">{selectedInquiry.userEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="glass p-4 rounded-xl space-y-4">
                                    <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Requested Products</h4>
                                    <div className="space-y-3">
                                        {selectedInquiry.coffeeItems.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-3 rounded-lg bg-forest/30"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                                                        <Coffee className="w-5 h-5 text-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-cream font-medium">{item.coffeeName}</p>
                                                        <p className="text-cream/50 text-sm">{item.preferredLocation}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-cream font-semibold">{item.quantity} bags</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipment Info */}
                                <div className="glass p-4 rounded-xl space-y-4">
                                    <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Shipment Preferences</h4>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gold/60" />
                                        <div>
                                            <p className="text-cream/50 text-xs">Target Shipment Date</p>
                                            <p className="text-cream font-medium">
                                                {selectedInquiry.targetShipmentDate
                                                    ? new Date(selectedInquiry.targetShipmentDate).toLocaleDateString()
                                                    : 'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Notes */}
                                <div className="glass p-4 rounded-xl space-y-4">
                                    <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Status & Notes</h4>

                                    <div className="space-y-2">
                                        <label className="text-cream/70 text-sm">Update Status</label>
                                        <Select value={newStatus} onValueChange={(v) => setNewStatus(v as InquiryStatus)}>
                                            <SelectTrigger className="input-premium">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-forest-dark border-gold/20">
                                                {Object.entries(statusConfig).map(([value, { label }]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                        className="text-cream focus:bg-gold/20 focus:text-gold"
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-cream/70 text-sm flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Admin Notes
                                        </label>
                                        <Textarea
                                            placeholder="Add internal notes about this inquiry..."
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            className="input-premium min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                {/* Customer Message */}
                                {selectedInquiry.message && (
                                    <div className="glass p-4 rounded-xl space-y-2">
                                        <h4 className="text-gold text-sm font-semibold uppercase tracking-wider">Customer Message</h4>
                                        <p className="text-cream/80 text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDetailDialogOpen(false)}
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
                                        'Save Changes'
                                    )}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
