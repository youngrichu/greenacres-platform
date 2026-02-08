'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Button,
    Badge,
    Input,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@greenacres/ui';
import {
    Search,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Building,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Loader2,
    AlertTriangle,
    Users,
    Filter,
    Eye,
    ShieldCheck,
    ShieldX,
    RefreshCw,
    Briefcase,
    UserCheck,
    Tag
} from 'lucide-react';
import { getUsers, updateUserStatus, updateUserRole } from '@greenacres/db';
import type { User as UserType, UserStatus, UserRole } from '@greenacres/types';

type FilterStatus = 'all' | UserStatus;

const statusConfig = {
    pending: {
        icon: Clock,
        label: 'Pending',
        color: 'warning',
        badgeClass: 'badge-warning',
    },
    approved: {
        icon: CheckCircle,
        label: 'Approved',
        color: 'success',
        badgeClass: 'badge-success',
    },
    rejected: {
        icon: XCircle,
        label: 'Rejected',
        color: 'error',
        badgeClass: 'badge-error',
    },
};

const filterTabs: { value: FilterStatus; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    { value: 'all', label: 'All Users' },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'approved', label: 'Approved', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', icon: XCircle },
];

export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            setError(null);
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusUpdate(userId: string, newStatus: UserStatus) {
        try {
            setIsUpdating(true);
            await updateUserStatus(userId, newStatus);
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId ? { ...user, status: newStatus } : user
                )
            );
            setIsDialogOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Failed to update user status:', err);
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleRoleUpdate(userId: string, newRole: UserRole) {
        try {
            setIsUpdating(true);
            await updateUserRole(userId, newRole);
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            // Update selected user if currently open
            if (selectedUser?.id === userId) {
                setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
            }
        } catch (err) {
            console.error('Failed to update user role:', err);
        } finally {
            setIsUpdating(false);
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: users.length,
        pending: users.filter(u => u.status === 'pending').length,
        approved: users.filter(u => u.status === 'approved').length,
        rejected: users.filter(u => u.status === 'rejected').length,
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-gold animate-spin" />
                        </div>
                    </div>
                    <p className="text-cream/60">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="glass-card max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>
                        <h3 className="text-xl font-semibold text-cream mb-2">Error Loading Users</h3>
                        <p className="text-cream/60 mb-4">{error}</p>
                        <Button onClick={loadUsers} className="btn-premium">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-8">
            {/* Header */}
            <header className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-gold text-sm font-medium uppercase tracking-wider">User Management</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-cream font-serif mb-2">
                            Users
                        </h1>
                        <p className="text-cream/60">
                            Manage buyer accounts and approval requests
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={loadUsers} variant="outline" className="btn-ghost">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </header>

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
                        type="text"
                        placeholder="Search by email, company, or contact name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-premium pl-12 w-full"
                    />
                </div>
            </div>

            {/* Users Grid */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {filteredUsers.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="py-16">
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-cream mb-2">No Users Found</h3>
                                <p className="text-cream/60">
                                    {searchQuery || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'No users have registered yet'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredUsers.map((user, index) => {
                            const config = statusConfig[user.status];
                            const StatusIcon = config.icon;

                            return (
                                <Card
                                    key={user.id}
                                    className="glass-card hover:border-gold/30 transition-all duration-300 cursor-pointer group animate-fade-in-up"
                                    style={{ animationDelay: `${200 + index * 50}ms` }}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <CardContent className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                                    <User className="w-6 h-6 text-gold" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-cream font-semibold truncate group-hover:text-gold transition-colors">
                                                        {user.companyName || 'No Company'}
                                                    </h3>
                                                    <p className="text-cream/50 text-sm truncate">
                                                        {user.contactPerson || 'No Contact'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className={config.badgeClass}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {config.label}
                                            </Badge>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-cream/60">
                                                <Mail className="w-4 h-4" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-cream/60">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{user.phone}</span>
                                                </div>
                                            )}
                                            {user.country && (
                                                <div className="flex items-center gap-2 text-cream/60">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{user.country}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions peek */}
                                        <div className="mt-4 pt-4 border-t border-gold/10 flex items-center justify-between">
                                            <span className="text-xs text-cream/40 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                    : 'N/A'}
                                            </span>
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

            {/* User Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="dialog-content max-w-lg">
                    {selectedUser && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-cream font-serif text-xl">
                                    User Details
                                </DialogTitle>
                                <DialogDescription className="text-cream/60">
                                    Review and manage this user's account
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-6 space-y-6">
                                {/* User Info */}
                                <div className="glass p-4 rounded-xl space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                                            <Building className="w-8 h-8 text-gold" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-cream font-semibold text-lg">
                                                {selectedUser.companyName || 'No Company'}
                                            </h4>
                                            <p className="text-cream/60">
                                                {selectedUser.contactPerson || 'No Contact'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {selectedUser.role === 'admin' ? (
                                                <Badge className="badge-warning self-start">Admin</Badge>
                                            ) : (
                                                <Badge className="badge-info self-start">Buyer</Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Role Management */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-forest/20 border border-gold/10">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-gold" />
                                            <span className="text-sm text-cream/80">Account Role</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant={selectedUser.role === 'buyer' ? 'secondary' : 'ghost'}
                                                className={selectedUser.role === 'buyer' ? 'bg-gold/20 text-gold hover:bg-gold/30' : 'text-cream/40'}
                                                onClick={() => handleRoleUpdate(selectedUser.id, 'buyer')}
                                                disabled={isUpdating || selectedUser.role === 'buyer'}
                                            >
                                                Buyer
                                            </Button>
                                            <div className="h-4 w-px bg-white/10" />
                                            <Button
                                                size="sm"
                                                variant={selectedUser.role === 'admin' ? 'secondary' : 'ghost'}
                                                className={selectedUser.role === 'admin' ? 'bg-gold/20 text-gold hover:bg-gold/30' : 'text-cream/40'}
                                                onClick={() => handleRoleUpdate(selectedUser.id, 'admin')}
                                                disabled={isUpdating || selectedUser.role === 'admin'}
                                            >
                                                Admin
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="divider-gold" />

                                    <div className="grid grid-cols-1 gap-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-gold" />
                                            <span className="text-cream">{selectedUser.email}</span>
                                        </div>
                                        {selectedUser.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-gold" />
                                                <span className="text-cream">{selectedUser.phone}</span>
                                            </div>
                                        )}
                                        {selectedUser.country && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-gold" />
                                                <span className="text-cream">{selectedUser.country}</span>
                                            </div>
                                        )}
                                        {selectedUser.companyType && (
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="w-4 h-4 text-gold" />
                                                <span className="text-cream capitalize">{selectedUser.companyType}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Registration & Approval Info */}
                                <div className="glass p-4 rounded-xl space-y-3">
                                    <h5 className="text-cream/80 font-medium text-sm flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gold" />
                                        Timeline
                                    </h5>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-cream/60">Registered</span>
                                            <span className="text-cream">
                                                {selectedUser.createdAt
                                                    ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        {selectedUser.approvedAt && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-cream/60">Approved</span>
                                                <span className="text-cream">
                                                    {new Date(selectedUser.approvedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        {selectedUser.approvedBy && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-cream/60">Approved by</span>
                                                <span className="text-cream text-xs truncate max-w-[180px]">
                                                    {selectedUser.approvedBy}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Current Status */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-forest/30">
                                    <span className="text-cream/60">Current Status</span>
                                    <Badge className={statusConfig[selectedUser.status].badgeClass}>
                                        {React.createElement(statusConfig[selectedUser.status].icon, { className: 'w-3 h-3 mr-1' })}
                                        {statusConfig[selectedUser.status].label}
                                    </Badge>
                                </div>
                            </div>

                            <DialogFooter className="flex gap-3">
                                {selectedUser.status !== 'approved' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(selectedUser.id, 'approved')}
                                        disabled={isUpdating}
                                        className="flex-1 bg-success hover:bg-success/80 text-forest-deep"
                                    >
                                        {isUpdating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-4 h-4 mr-2" />
                                                Approve
                                            </>
                                        )}
                                    </Button>
                                )}
                                {selectedUser.status !== 'rejected' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(selectedUser.id, 'rejected')}
                                        disabled={isUpdating}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        {isUpdating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldX className="w-4 h-4 mr-2" />
                                                Reject
                                            </>
                                        )}
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
