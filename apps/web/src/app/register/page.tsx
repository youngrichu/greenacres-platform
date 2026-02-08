'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@greenacres/auth';
import type { CompanyType } from '@greenacres/types';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@greenacres/ui';
import { Loader2, Coffee, AlertCircle, CheckCircle } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CoffeeLeafImage, CoffeeBeansScatteredImage, CoffeeBranchImage } from '@/components/CoffeeDecorationsImage';

const COUNTRIES = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Netherlands',
    'Belgium', 'Spain', 'Portugal', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Switzerland', 'Austria', 'Poland', 'Japan', 'South Korea', 'Australia',
    'Canada', 'Brazil', 'Mexico', 'UAE', 'Saudi Arabia', 'Turkey', 'Russia',
    'China', 'India', 'South Africa', 'Egypt', 'Ethiopia', 'Kenya', 'Other'
].sort();

const COMPANY_TYPES: { value: CompanyType; label: string }[] = [
    { value: 'roaster', label: 'Coffee Roaster' },
    { value: 'importer', label: 'Green Coffee Importer' },
    { value: 'trader', label: 'Coffee Trader' },
    { value: 'other', label: 'Other' },
];

export default function RegisterPage() {
    const router = useRouter();
    const { signUp, loading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        contactPerson: '',
        phone: '',
        country: '',
        companyType: '' as CompanyType | '',
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (success) {
            tl.fromTo('.success-card',
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6 }
            ).fromTo('.success-item',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
                '-=0.3'
            );
        } else {
            tl.fromTo('.register-card',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 }
            )
                .fromTo('.form-section',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.2 },
                    '-=0.5'
                );
        }
    }, { scope: containerRef, dependencies: [success] });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!formData.companyType) {
            setError('Please select your company type');
            return;
        }

        if (!formData.country) {
            setError('Please select your country');
            return;
        }

        setIsSubmitting(true);

        const result = await signUp({
            email: formData.email,
            password: formData.password,
            companyName: formData.companyName,
            contactPerson: formData.contactPerson,
            phone: formData.phone,
            country: formData.country,
            companyType: formData.companyType as CompanyType,
        });

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Failed to register');
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-forest-deep px-4 py-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />

                    {/* Subtle Celebration frame */}
                    <div className="absolute top-0 right-0 z-0 opacity-10 rotate-180 pointer-events-none">
                        <CoffeeBranchImage className="w-80 h-80" />
                    </div>
                    <div className="absolute bottom-0 left-0 z-0 opacity-10 pointer-events-none">
                        <CoffeeLeafImage className="w-64 h-64 rotate-45" />
                    </div>
                </div>

                <Card className="success-card w-full max-w-md glass-card border-none relative z-10">
                    <CardContent className="pt-10 pb-10 text-center space-y-6">
                        <div className="success-item mx-auto w-20 h-20 bg-gradient-to-br from-primary to-forest-light rounded-full flex items-center justify-center shadow-glow">
                            <CheckCircle className="w-10 h-10 text-cream" />
                        </div>
                        <div className="success-item space-y-2">
                            <h2 className="text-3xl font-serif text-cream">Registration Submitted!</h2>
                            <p className="text-muted-foreground">
                                Thank you for registering with Green Acres Coffee Trading. Your application is now under review.
                            </p>
                        </div>
                        <div className="success-item bg-forest/40 border border-gold/10 rounded-xl p-6 text-left backdrop-blur-md">
                            <h3 className="font-medium text-gold mb-3 flex items-center gap-2">
                                <Coffee className="w-4 h-4" />
                                What happens next?
                            </h3>
                            <ul className="text-sm text-muted-foreground space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-gold">•</span>
                                    Our team will review your application within 24-48 hours
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gold">•</span>
                                    You'll receive an email once your account is approved
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gold">•</span>
                                    After approval, you can access live pricing and submit inquiries
                                </li>
                            </ul>
                        </div>
                        <Button
                            onClick={() => router.push('/login')}
                            className="success-item w-full btn-premium py-6 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-forest-deep px-4 py-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl opacity-50" />

                <div className="absolute top-0 right-0 z-0 pointer-events-none select-none opacity-[0.1] grayscale">
                    <CoffeeLeafImage className="w-80 h-80 rotate-45 transform translate-x-20 -translate-y-10 filter invert" />
                </div>

                <div className="absolute bottom-0 left-0 z-0 pointer-events-none select-none opacity-[0.15] grayscale">
                    <CoffeeBranchImage className="w-96 h-96 -rotate-90 transform -translate-x-20 translate-y-20 filter invert" />
                </div>
            </div>

            <Card className="register-card w-full max-w-lg relative glass-card border-none z-10 mx-2 sm:mx-0">
                <CardHeader className="text-center space-y-4 pb-2 p-6 sm:p-8">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-forest-light rounded-full flex items-center justify-center shadow-glow mb-2">
                        <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-cream" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl sm:text-3xl font-serif text-cream">Register as a Buyer</CardTitle>
                        <CardDescription className="text-muted-foreground mt-2 font-light text-sm sm:text-base">
                            Get access to premium Ethiopian coffee with live pricing
                        </CardDescription>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 sm:space-y-8 p-6 sm:p-8">
                        {error && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Company Information */}
                        <div className="form-section space-y-5">
                            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase border-b border-gold/10 pb-2">
                                Company Information
                            </h3>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="companyName" className="text-cream-muted">Company Name *</Label>
                                    <Input
                                        id="companyName"
                                        placeholder="Your Coffee Company"
                                        value={formData.companyName}
                                        onChange={(e) => handleChange('companyName', e.target.value)}
                                        required
                                        className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="companyType" className="text-cream-muted">Company Type *</Label>
                                    <Select
                                        value={formData.companyType}
                                        onValueChange={(value) => handleChange('companyType', value)}
                                    >
                                        <SelectTrigger className="input-premium bg-forest/50 border-gold/20 text-cream focus:ring-gold/30 focus:border-gold">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forest-dark border-gold/20 text-cream backdrop-blur-xl">
                                            {COMPANY_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value} className="text-cream focus:bg-gold/20 focus:text-gold cursor-pointer">
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-cream-muted">Country *</Label>
                                    <Select
                                        value={formData.country}
                                        onValueChange={(value) => handleChange('country', value)}
                                    >
                                        <SelectTrigger className="input-premium bg-forest/50 border-gold/20 text-cream focus:ring-gold/30 focus:border-gold">
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-forest-dark border-gold/20 text-cream backdrop-blur-xl max-h-60">
                                            {COUNTRIES.map((country) => (
                                                <SelectItem key={country} value={country} className="text-cream focus:bg-gold/20 focus:text-gold cursor-pointer">
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="form-section space-y-5">
                            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase border-b border-gold/10 pb-2">
                                Contact Information
                            </h3>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson" className="text-cream-muted">Contact Person *</Label>
                                    <Input
                                        id="contactPerson"
                                        placeholder="John Smith"
                                        value={formData.contactPerson}
                                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                                        required
                                        className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-cream-muted">Phone / WhatsApp *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        required
                                        className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Credentials */}
                        <div className="form-section space-y-5">
                            <h3 className="text-sm font-semibold text-gold tracking-wider uppercase border-b border-gold/10 pb-2">
                                Account Credentials
                            </h3>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-cream-muted">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                    className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold"
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-cream-muted">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        required
                                        minLength={6}
                                        className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-cream-muted">Confirm Password *</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        required
                                        className="input-premium bg-forest/50 border-gold/20 text-cream placeholder:text-muted-foreground/50 focus:border-gold"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic">Password must be at least 6 characters</p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-5 pt-4 p-6 sm:p-8">
                        <Button
                            type="submit"
                            className="form-section w-full btn-premium py-6 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        <p className="form-section text-sm text-neutral-400 text-center">
                            Already have an account?{' '}
                            <Link href="/login" className="text-gold hover:text-gold-light font-medium transition-colors hover:underline underline-offset-4">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
