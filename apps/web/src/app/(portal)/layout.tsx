"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, useIsApproved } from "@greenacres/auth";
import { CartProvider, useCart } from "@/contexts/cart-context";
import { CartSheet } from "@/components/cart-sheet";
import { PortalTour, PortalRestartTourButton } from "@/components/portal-tour";
import {
  LayoutDashboard,
  Package,
  FileText,
  User,
  LogOut,
  Coffee,
  Clock,
  XCircle,
  Sparkles,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { Button, Badge } from "@greenacres/ui";

const portalNavItems = [
  { href: "/portal", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/portal/catalog", icon: Package, label: "Coffee Catalog" },
  { href: "/portal/inquiries", icon: FileText, label: "My Inquiries" },
  { href: "/portal/profile", icon: User, label: "Profile" },
];

function CartSidebarButton() {
  const { setIsOpen, itemCount } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      data-tour="portal-inquiry-list"
      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-cream/80 hover:text-gold hover:bg-gold/5 transition-all group mt-2 border border-dashed border-gold/20 hover:border-gold/40"
    >
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-5 h-5" />
        <span className="font-medium">Inquiry List</span>
      </div>
      {itemCount > 0 && (
        <Badge className="badge-gold w-6 h-6 p-0 flex items-center justify-center">
          {itemCount}
        </Badge>
      )}
    </button>
  );
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const isApproved = useIsApproved();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-forest-deep flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cream/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Pending approval
  if (user.status === "pending") {
    return (
      <div className="min-h-screen bg-forest-deep flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center glass-card p-8 rounded-2xl">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-2xl font-serif text-cream mb-4">
            Account Pending Approval
          </h1>
          <p className="text-cream/60 mb-6">
            Thank you for registering! Your account is currently under review.
            We typically approve accounts within 24-48 hours.
          </p>
          <p className="text-cream/40 text-sm mb-8">
            You'll receive an email at{" "}
            <span className="text-gold">{user.email}</span> once your account is
            approved.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/")}
              className="btn-premium w-full"
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="btn-ghost w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Rejected
  if (user.status === "rejected") {
    return (
      <div className="min-h-screen bg-forest-deep flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center glass-card p-8 rounded-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-serif text-cream mb-4">
            Registration Declined
          </h1>
          <p className="text-cream/60 mb-6">
            Unfortunately, we were unable to approve your registration at this
            time. Please contact us for more information.
          </p>
          <a
            href="mailto:ethiocof@greenacrescoffee.com"
            className="text-gold hover:underline block mb-8"
          >
            ethiocof@greenacrescoffee.com
          </a>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/")}
              className="btn-premium w-full"
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="btn-ghost w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Approved - show portal
  return (
    <CartProvider>
      <div className="min-h-screen bg-forest-deep flex overflow-hidden">
        {/* Mobile menu overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
                    portal-sidebar w-72 flex flex-col fixed lg:static inset-y-0 left-0 z-50
                    transform transition-transform duration-300 ease-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
        >
          {/* Logo */}
          <div className="p-6 border-b border-gold/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-105">
                <Image
                  src="/logo_golden.svg"
                  alt="Green Acres Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-cream font-semibold block group-hover:text-gold transition-colors">
                  Green Acres
                </span>
                <span className="text-gold/60 text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Buyer Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-cream/40 hover:text-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1" data-tour="portal-sidebar-nav">
              {portalNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/portal" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`sidebar-link ${isActive ? "active" : ""}`}
                      {...(item.href === "/portal/profile"
                        ? { "data-tour": "portal-profile-link" }
                        : {})}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 px-1">
              <p className="text-xs text-cream/30 uppercase font-medium mb-2 px-3">
                Actions
              </p>
              <CartSidebarButton />
            </div>

            <div className="mt-4 px-1">
              <PortalRestartTourButton />
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gold/10">
            <div className="glass rounded-xl p-4 mb-3">
              <p className="text-cream text-sm font-medium truncate">
                {user.companyName}
              </p>
              <p className="text-cream/40 text-xs truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-cream/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          {/* Mobile Header */}
          <header className="lg:hidden header-premium flex items-center gap-4 px-4 py-3 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-cream/60 hover:text-cream hover:bg-gold/10 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo_golden.svg"
                  alt="Green Acres Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-cream font-serif font-semibold">
                Green Acres
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-auto" data-lenis-prevent="true">
            {children}
          </main>
        </div>

        {/* Cart Sheet */}
        <CartSheet />

        {/* Guided Tour */}
        <PortalTour />
      </div>
    </CartProvider>
  );
}
