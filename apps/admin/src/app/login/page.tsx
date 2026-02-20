"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@greenacres/auth";
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@greenacres/ui";
import { Loader2, AlertCircle } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".login-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
      ).fromTo(
        ".form-element",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn(email, password);

    if (result.success) {
      const user = result.data!;

      if (user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to sign in");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-forest-deep px-4 py-12 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <Card className="login-card w-full max-w-md relative glass-card border-none mx-2 sm:mx-0">
        <CardHeader className="text-center space-y-4 p-6 sm:p-8">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 relative mb-4">
            <Image
              src="/logo_golden.svg"
              alt="Green Acres Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-serif text-cream">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2 font-light text-sm sm:text-base">
              Secure access for authorized personnel only
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="form-element flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="form-element space-y-2">
              <Label htmlFor="email" className="text-cream-muted">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@greenacres.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:ring-1 focus:ring-gold/30"
              />
            </div>

            <div className="form-element space-y-2">
              <Label htmlFor="password" className="text-cream-muted">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:ring-1 focus:ring-gold/30"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 pt-2">
            <Button
              type="submit"
              className="form-element w-full btn-premium bg-gold hover:bg-gold-light text-forest-deep font-bold py-6 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>

            <p className="form-element text-xs text-muted-foreground text-center">
              Protected by Green Acres Security Protocol v2.4
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
