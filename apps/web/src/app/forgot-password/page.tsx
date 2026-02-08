'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@greenacres/auth';
import {
    Button,
    Input,
    Label,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@greenacres/ui';
import { Loader2, Coffee, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CoffeeLeafImage, CoffeeBranchImage } from '@/components/CoffeeDecorationsImage';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.forgot-card',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 }
        )
            .fromTo('.card-element',
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                '-=0.4'
            );
    }, { scope: containerRef, dependencies: [success] });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = await resetPassword(email);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to send reset email');
        }

        setIsSubmitting(false);
    };

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-forest-deep px-4 py-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl opacity-50" />

                <div className="absolute bottom-0 right-0 z-0 pointer-events-none select-none opacity-[0.1] grayscale">
                    <CoffeeBranchImage className="w-[400px] h-[400px] translate-y-1/3 translate-x-1/4 -rotate-12 filter invert" />
                </div>
            </div>

            <Card className="forgot-card w-full max-w-md relative glass-card border-none mx-2 sm:mx-0">
                <CardHeader className="text-center space-y-4 p-6 sm:p-8">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-forest-light rounded-full flex items-center justify-center shadow-glow mb-2">
                        {success ? (
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-cream" />
                        ) : (
                            <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-cream" />
                        )}
                    </div>
                    <div>
                        <CardTitle className="text-2xl sm:text-3xl font-serif text-cream">
                            {success ? 'Check Your Email' : 'Reset Password'}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mt-2 font-light text-sm sm:text-base">
                            {success
                                ? 'We\'ve sent you a link to reset your password'
                                : 'Enter your email and we\'ll send you a reset link'
                            }
                        </CardDescription>
                    </div>
                </CardHeader>

                {success ? (
                    <CardContent className="space-y-6 pb-8">
                        <div className="card-element bg-forest/40 border border-gold/10 rounded-xl p-6 text-center backdrop-blur-md">
                            <p className="text-cream-muted text-sm leading-relaxed">
                                If an account exists for <span className="font-medium text-cream">{email}</span>, you will receive a password reset email shortly.
                            </p>
                        </div>

                        <div className="card-element text-center">
                            <p className="text-muted-foreground text-sm mb-4">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setSuccess(false)}
                                className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold-light hover:border-gold transition-all"
                            >
                                Try Again
                            </Button>
                        </div>

                        <div className="card-element text-center pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-medium transition-colors hover:gap-3"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="card-element flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-shake">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="card-element space-y-2">
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
                        </CardContent>

                        <CardFooter className="flex flex-col gap-6 pt-2">
                            <Button
                                type="submit"
                                className="card-element w-full btn-premium py-6 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>

                            <Link
                                href="/login"
                                className="card-element inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-cream transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
}
