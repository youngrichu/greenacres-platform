'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useIsAdmin } from '@greenacres/auth';
import {
    LayoutDashboard,
    DollarSign,
    Package,
    Users,
    FileText,
    LogOut,
    Coffee,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

const adminNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', description: 'Dashboard overview' },
    { href: '/dashboard/prices', icon: DollarSign, label: 'Prices', description: 'Manage pricing' },
    { href: '/dashboard/products', icon: Package, label: 'Products', description: 'Coffee catalog' },
    { href: '/dashboard/users', icon: Users, label: 'Users', description: 'User management' },
    { href: '/dashboard/inquiries', icon: FileText, label: 'Inquiries', description: 'Customer inquiries' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, signOut } = useAuth();
    const isAdmin = useIsAdmin();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (!loading && user && user.role !== 'admin') {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    // Loading state with premium animation
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    {/* Animated coffee bean loader */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-gold-dark opacity-20 animate-pulse" />
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center">
                            <Coffee className="w-8 h-8 text-gold animate-pulse" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
                    </div>
                    <p className="text-cream/60 text-sm font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Not authenticated or not admin
    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen flex">
            {/* Mobile menu overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                sidebar fixed lg:static inset-y-0 left-0 z-50
                w-72 flex flex-col
                transform transition-transform duration-300 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo section */}
                <div className="p-6 border-b border-gold/10">
                    <Link href="/dashboard" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                                <Coffee className="w-6 h-6 text-forest-deep" />
                            </div>
                            <div className="absolute -inset-1 rounded-xl bg-gold/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <span className="text-cream font-serif text-lg font-semibold block tracking-wide">
                                Green Acres
                            </span>
                            <span className="text-gold text-xs font-medium tracking-wider uppercase">
                                Admin Portal
                            </span>
                        </div>
                    </Link>

                    {/* Close button for mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute top-6 right-4 p-2 text-cream/60 hover:text-cream transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="mb-4">
                        <span className="px-4 text-xs font-semibold text-gold/60 uppercase tracking-wider">
                            Navigation
                        </span>
                    </div>
                    <ul className="space-y-1">
                        {adminNavItems.map((item, index) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));

                            return (
                                <li
                                    key={item.href}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`sidebar-link group ${isActive ? 'active' : ''}`}
                                    >
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                                            ${isActive
                                                ? 'bg-gold/20 text-gold'
                                                : 'bg-forest/30 text-cream/60 group-hover:bg-gold/10 group-hover:text-gold'}
                                        `}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="block font-medium">{item.label}</span>
                                            <span className="block text-xs text-cream/40 truncate">
                                                {item.description}
                                            </span>
                                        </div>
                                        <ChevronRight className={`
                                            w-4 h-4 transition-all duration-300
                                            ${isActive
                                                ? 'opacity-100 text-gold'
                                                : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}
                                        `} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Decorative divider */}
                <div className="mx-6 divider-gold" />

                {/* User section */}
                <div className="p-4">
                    <div className="glass-card rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                                <span className="text-gold font-semibold text-sm">
                                    {user.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="px-2 py-0.5 badge-gold text-[10px] rounded-full font-semibold uppercase tracking-wide">
                                        Admin
                                    </span>
                                </div>
                                <p className="text-cream text-sm font-medium truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-cream/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <header className="lg:hidden header-premium sticky top-0 z-30 px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-cream/60 hover:text-cream hover:bg-gold/10 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-gold" />
                        <span className="text-cream font-serif font-semibold">Green Acres</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto w-full">
                    <div className="min-h-full w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
