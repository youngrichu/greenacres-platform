'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@greenacres/auth';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@greenacres/ui';
import { Loader2, Coffee, AlertCircle } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CoffeeBranchImage, CoffeeBeansScatteredImage } from '@/components/CoffeeDecorationsImage';

export default function LoginPage() {
    const router = useRouter();
    const { signIn, loading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.login-card',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 }
        )
            .fromTo('.form-element',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                '-=0.4'
            )
            .fromTo('.bg-decoration',
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.inOut' },
                '-=1'
            );
    }, { scope: containerRef });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = await signIn(email, password);

        if (result.success) {
            const user = result.data!;

            if (user.status === 'pending') {
                setError('Your account is pending approval. We will notify you once approved.');
                setIsSubmitting(false);
                return;
            }

            if (user.status === 'rejected') {
                setError('Your registration has been declined. Please contact us for more information.');
                setIsSubmitting(false);
                return;
            }

            if (user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/portal');
            }
        } else {
            setError(result.error || 'Failed to sign in');
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-forest-deep px-4 py-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl opacity-50" />

                {/* Botanical Illustrations - Static & Subtle */}
                <div className="absolute bottom-0 left-0 z-0 pointer-events-none select-none opacity-[0.15] grayscale">
                    <CoffeeBranchImage
                        className="w-[500px] h-[500px] translate-y-1/4 -translate-x-1/4 rotate-12 filter invert"
                    />
                </div>
            </div>

            <Card className="login-card w-full max-w-md relative glass-card border-none mx-2 sm:mx-0">
                <CardHeader className="text-center space-y-4 p-6 sm:p-8">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-forest-light rounded-full flex items-center justify-center shadow-glow mb-2">
                        <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-cream" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl sm:text-3xl font-serif text-cream">Welcome Back</CardTitle>
                        <CardDescription className="text-muted-foreground mt-2 font-light text-sm sm:text-base">
                            Sign in to access live pricing and stock availability
                        </CardDescription>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5">
                        {error && (
                            <div className="form-element flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-element space-y-2">
                            <Label htmlFor="email" className="text-cream-muted">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:ring-1 focus:ring-gold/30"
                            />
                        </div>

                        <div className="form-element space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-cream-muted">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-gold hover:text-gold-light transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
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
                            className="form-element w-full btn-premium py-6 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <p className="form-element text-sm text-muted-foreground text-center">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-gold hover:text-gold-light font-medium transition-colors hover:underline underline-offset-4">
                                Register as a buyer
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
