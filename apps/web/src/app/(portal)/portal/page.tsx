"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@greenacres/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
} from "@greenacres/ui";
import {
  Package,
  FileText,
  ArrowRight,
  Coffee,
  Star,
  TrendingUp,
  MapPin,
  Loader2,
} from "lucide-react";
import { getCoffees, getInquiriesByUser } from "@greenacres/db";
import type { CoffeeProduct, Inquiry } from "@greenacres/types";

export default function PortalDashboard() {
  const { user } = useAuth();
  const [featuredCoffees, setFeaturedCoffees] = useState<CoffeeProduct[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coffees, inquiries] = await Promise.all([
          getCoffees(),
          user?.id ? getInquiriesByUser(user.id) : Promise.resolve([]),
        ]);
        // Get top 3 coffees
        setFeaturedCoffees(coffees.slice(0, 3));
        // Get recent inquiries
        setRecentInquiries(inquiries.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div
        className="mb-6 lg:mb-8 animate-fade-in-up"
        data-tour="portal-welcome"
      >
        <h1 className="text-2xl sm:text-3xl font-serif text-cream mb-2">
          Welcome back,{" "}
          <span className="text-gold">
            {user?.contactPerson?.split(" ")[0] || "there"}
          </span>
        </h1>
        <p className="text-cream/50">
          {user?.companyName} • Access live pricing and submit inquiries
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card
          className="glass-card rounded-xl overflow-hidden group animate-fade-in-up"
          data-tour="portal-catalog-action"
          style={{ animationDelay: "100ms" }}
        >
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/10 transition-colors" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-cream mb-2">
                Browse Catalog
              </h3>
              <p className="text-cream/50 text-sm mb-4">
                Explore our premium Ethiopian coffees with live pricing
              </p>
              <Button asChild className="btn-premium">
                <Link
                  href="/portal/catalog"
                  className="inline-flex items-center gap-2"
                >
                  View Coffees
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className="glass-card rounded-xl overflow-hidden animate-fade-in-up"
          data-tour="portal-inquiries-action"
          style={{ animationDelay: "200ms" }}
        >
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-semibold text-cream mb-2">
              My Inquiries
            </h3>
            <p className="text-cream/50 text-sm mb-4">
              Track your submitted inquiries and their status
            </p>
            <Button asChild className="btn-ghost">
              <Link
                href="/portal/inquiries"
                className="inline-flex items-center gap-2"
              >
                View Inquiries
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card
          className="glass-card rounded-xl overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
              <Coffee className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-semibold text-cream mb-2">
              Need Help?
            </h3>
            <p className="text-cream/50 text-sm mb-4">
              Contact our team for assistance with your orders
            </p>
            <Button asChild className="btn-ghost">
              <a
                href="mailto:ethiocof@greenacrescoffee.com"
                className="inline-flex items-center gap-2"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Featured Section */}
      <div
        className="mb-8 animate-fade-in-up"
        data-tour="portal-featured"
        style={{ animationDelay: "400ms" }}
      >
        <h2 className="text-xl font-serif text-cream mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-gold" />
          Featured Offerings
        </h2>
        <Card className="glass-card rounded-xl">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-gold animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featuredCoffees.length > 0 ? (
                    featuredCoffees.map((coffee, index) => (
                      <Link
                        key={coffee.id}
                        href={`/portal/catalog/${coffee.id}`}
                        className="glass rounded-xl p-4 hover:border-gold/30 transition-all cursor-pointer group block"
                      >
                        {index === 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="badge-gold text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              TOP LOT
                            </Badge>
                          </div>
                        )}
                        <h4 className="text-cream font-medium group-hover:text-gold transition-colors">
                          {coffee.name}
                        </h4>
                        <p className="text-cream/40 text-sm">
                          {coffee.region} • {coffee.grade}
                        </p>
                        <p className="text-gold font-semibold mt-2">
                          $
                          {coffee.pricing?.addis_ababa?.pricePerLb?.toFixed(
                            2,
                          ) || "Contact"}
                          /lb FOB
                        </p>
                      </Link>
                    ))
                  ) : (
                    <>
                      <div className="glass rounded-xl p-4">
                        <Badge className="badge-gold text-xs mb-2">
                          TOP LOT
                        </Badge>
                        <h4 className="text-cream font-medium">
                          Yirgacheffe G1 Washed
                        </h4>
                        <p className="text-cream/40 text-sm">
                          Chelchele Station • 2024/25
                        </p>
                        <p className="text-gold font-semibold mt-2">
                          $4.50/lb FOB
                        </p>
                      </div>
                      <div className="glass rounded-xl p-4">
                        <Badge className="badge-gold text-xs mb-2">
                          TOP LOT
                        </Badge>
                        <h4 className="text-cream font-medium">
                          Guji G1 Natural
                        </h4>
                        <p className="text-cream/40 text-sm">
                          Shakiso Station • 2024/25
                        </p>
                        <p className="text-gold font-semibold mt-2">
                          $4.80/lb FOB
                        </p>
                      </div>
                      <div className="glass rounded-xl p-4">
                        <h4 className="text-cream font-medium">
                          Sidamo G2 Washed
                        </h4>
                        <p className="text-cream/40 text-sm">
                          Bensa Station • 2024/25
                        </p>
                        <p className="text-gold font-semibold mt-2">
                          $3.80/lb FOB
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <Button asChild className="btn-premium">
                    <Link
                      href="/portal/catalog"
                      className="inline-flex items-center gap-2"
                    >
                      View Full Catalog
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div
        className="grid gap-6 md:grid-cols-2 animate-fade-in-up"
        style={{ animationDelay: "500ms" }}
      >
        <Card className="glass-card rounded-xl">
          <CardHeader>
            <CardTitle className="text-cream flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              Delivery Locations
            </CardTitle>
            <CardDescription className="text-cream/50">
              We maintain stock at strategic locations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-cream">🇪🇹 Addis Ababa</span>
              <Badge className="badge-gold">FOB Djibouti</Badge>
            </div>
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-cream">🇮🇹 Port Trieste</span>
              <Badge className="badge-info">EXW Italy</Badge>
            </div>
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-cream">🇮🇹 Port Genoa</span>
              <Badge className="badge-info">EXW Italy</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-xl">
          <CardHeader>
            <CardTitle className="text-cream">Payment Terms</CardTitle>
            <CardDescription className="text-cream/50">
              Accepted payment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-cream">Letter of Credit (LC)</span>
              <Badge className="badge-success">Preferred</Badge>
            </div>
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-cream">Cash Against Documents (CAD)</span>
              <Badge className="badge-info">Available</Badge>
            </div>
            <p className="text-cream/40 text-xs pt-2">
              Payment terms are negotiable based on relationship and volume.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
