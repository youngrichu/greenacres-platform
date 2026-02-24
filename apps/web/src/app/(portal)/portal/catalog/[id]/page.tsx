"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@greenacres/auth";
import { useCart } from "@/contexts/cart-context";
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
} from "@greenacres/ui";
import {
  ArrowLeft,
  MapPin,
  Star,
  Package,
  Calendar,
  Award,
  Coffee,
  Send,
  Loader2,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Plus,
} from "lucide-react";
import type {
  CoffeeProduct,
  Location,
  Availability,
  InquiryItem,
} from "@greenacres/types";
import { getCoffeeById, createInquiry } from "@greenacres/db";
import { LocationLabels } from "@greenacres/types";

const availabilityColors: Record<Availability, string> = {
  in_stock: "badge-success",
  pre_shipment: "badge-warning",
  out_of_stock: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
};

const availabilityLabels: Record<Availability, string> = {
  in_stock: "In Stock",
  pre_shipment: "Pre-Shipment",
  out_of_stock: "Out of Stock",
};

import CoffeeDetailView from "@/components/CoffeeDetailView";

export default function CoffeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const coffeeId = params.id as string;

  const [coffee, setCoffee] = useState<CoffeeProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inquiry form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchCoffee() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getCoffeeById(coffeeId);
        if (result) {
          setCoffee(result);
        } else {
          setError("Coffee not found");
        }
      } catch (err) {
        console.error("Failed to fetch coffee:", err);
        setError("Failed to load coffee details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    if (coffeeId) {
      fetchCoffee();
    }
  }, [coffeeId]);

  const handleAddToCart = (inquiryItem: InquiryItem) => {
    addToCart(inquiryItem);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleSubmitInquiry = async (e: React.FormEvent, data: any) => {
    if (!coffee || !user) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const inquiryItem: InquiryItem = {
        coffeeId: coffee.id,
        coffeeName: `${coffee.region} ${coffee.grade} ${coffee.preparation === "washed" ? "Washed" : "Natural"}`,
        quantity: parseInt(data.quantity) || 1,
        preferredLocation: data.selectedLocation,
        bagSize: data.bagSize || "60kg",
        bagType: data.bagType || "jute",
      };

      const submissionData = {
        coffeeItems: [inquiryItem],
        targetShipmentDate: data.targetDate
          ? new Date(data.targetDate)
          : undefined,
        message: data.message || undefined,
      };

      // 1. Create Inquiry in Firestore (Client Side - Authenticated)
      const createResult = await createInquiry(user, submissionData);

      if (!createResult.success || !createResult.data) {
        throw new Error(
          createResult.error || "Failed to create inquiry record",
        );
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to submit inquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-cream/60">Loading coffee details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !coffee) {
    return (
      <div className="p-8">
        <Link
          href="/portal/catalog"
          className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
        <div className="text-center py-12">
          <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
            <Coffee className="w-12 h-12 text-cream/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-cream mb-2">
              Coffee Not Found
            </h3>
            <p className="text-cream/50 mb-4">
              {error || "The requested coffee could not be found."}
            </p>
            <Button asChild className="btn-premium">
              <Link href="/portal/catalog">Browse Catalog</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <CoffeeDetailView
        coffee={coffee}
        mode="portal"
        user={user}
        onAddToCart={handleAddToCart}
        onSubmitInquiry={handleSubmitInquiry}
        isSubmitting={isSubmitting}
        submitSuccess={submitSuccess}
        submitError={submitError}
        addedToCart={addedToCart}
      />
    </div>
  );
}
