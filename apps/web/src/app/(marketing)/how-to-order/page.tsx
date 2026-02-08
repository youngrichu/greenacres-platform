'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Coffee, UserPlus, Clock, Package, FileText, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@greenacres/ui';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CoffeeBeansScatteredImage, CoffeeBranchImage, CoffeeLeafImage, JebenaImage, CulturalPatternImage } from '@/components/CoffeeDecorationsImage';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        icon: UserPlus,
        title: 'Register Your Company',
        description: 'Create an account with your company details. We verify all buyers to ensure a trusted trading environment.',
    },
    {
        icon: Clock,
        title: 'Wait for Approval',
        description: 'Our team reviews your application within 24-48 hours. You\'ll receive an email once approved.',
    },
    {
        icon: Package,
        title: 'Browse Our Offerings',
        description: 'Access our complete catalog with live pricing, stock availability, and detailed coffee profiles.',
    },
    {
        icon: FileText,
        title: 'Submit an Inquiry',
        description: 'Found something you like? Submit an inquiry with your quantity requirements and preferred delivery location.',
    },
    {
        icon: Send,
        title: 'Receive a Quote',
        description: 'Our team prepares a detailed quote including shipping, terms, and availability timeline.',
    },
    {
        icon: CheckCircle,
        title: 'Close the Deal',
        description: 'Once terms are agreed, we handle the logistics and ensure your coffee arrives in perfect condition.',
    },
];

export default function HowToOrderPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Hero Animation
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.hero-content',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
        )
            .fromTo('.hero-decoration',
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.inOut' },
                '-=1'
            );

        // Steps Animation
        gsap.fromTo('.step-card',
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.steps-grid',
                    start: 'top 80%',
                }
            }
        );

        // Simple fade ups for other sections
        const sections = ['.requirements-section', '.locations-section', '.cta-section'];
        sections.forEach(section => {
            gsap.fromTo(section,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 75%',
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-forest-deep overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-24 px-4 overflow-hidden">
                {/* Subtle Cultural Pattern Background - Simplified */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm26 18c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                    }}
                />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Soft ambient glows without harsh borders */}
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] translate-x-1/3 translate-y-1/3" />

                    {/* Integration: Inverted Jebena as a ghostly background element */}
                    <JebenaImage className="absolute top-10 left-10 w-[400px] h-[400px] !opacity-[0.08] grayscale pointer-events-none" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="hero-content inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/40 border border-gold/20 text-gold text-sm mb-6 backdrop-blur-sm shadow-sm">
                        <Coffee className="w-4 h-4" />
                        <span className="font-medium tracking-wide">B2B Coffee Trading</span>
                    </div>

                    <h1 className="hero-content text-3xl sm:text-4xl md:text-6xl font-serif text-cream mb-6 leading-tight">
                        How to Order Ethiopian<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">Premium Coffee</span>
                    </h1>

                    <p className="hero-content text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Join our network of coffee professionals and get direct access to Ethiopia's finest green coffee
                        with transparent pricing and reliable logistics.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 px-4 relative z-10">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl rounded-full pointer-events-none"></div>


                <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6">
                    <div className="steps-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="step-card group relative glass-card p-8 hover:bg-forest/60 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-forest-light flex items-center justify-center text-cream text-sm font-bold shadow-lg border border-gold/20 group-hover:scale-110 transition-transform">
                                    {index + 1}
                                </div>

                                <div className="mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-forest/40 flex items-center justify-center border border-white/5 group-hover:border-gold/20 transition-colors">
                                        <step.icon className="w-7 h-7 text-gold group-hover:text-gold-light transition-colors" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-serif text-cream mb-3 group-hover:text-gold transition-colors">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="requirements-section pt-14 pb-20 px-4 bg-forest/20 border-y border-white/5 backdrop-blur-sm relative overflow-hidden">
                {/* Integrated Pattern Decoration at the top */}
                <div className="absolute top-0 left-0 w-full h-40 overflow-hidden pointer-events-none opacity-[0.05] grayscale brightness-200">
                    <div className="absolute inset-0 bg-gradient-to-b from-forest-deep via-transparent to-transparent z-10" />
                    <CulturalPatternImage className="w-full h-full object-cover" />
                </div>

                <div className="absolute -left-20 top-0 bottom-0 w-80 opacity-[0.07] grayscale pointer-events-none">
                    <CoffeeBranchImage className="w-full h-full object-contain filter invert" />
                </div>
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.05] rotate-45 pointer-events-none">
                    <CoffeeLeafImage className="w-full h-full filter invert" />
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">Who Can Buy From Us?</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto"></div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="glass-card p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <UserPlus className="w-24 h-24 text-gold" />
                            </div>
                            <h3 className="text-xl font-serif text-gold mb-6 flex items-center gap-2">
                                We Work With
                            </h3>
                            <ul className="space-y-4 text-cream-muted">
                                {[
                                    'Coffee Roasters (Specialty & Commercial)',
                                    'Green Coffee Importers',
                                    'Coffee Trading Companies',
                                    'Private Label Buyers'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 group/item">
                                        <CheckCircle className="w-5 h-5 text-primary group-hover/item:text-gold transition-colors" />
                                        <span className="group-hover/item:text-cream transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="glass-card p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText className="w-24 h-24 text-gold" />
                            </div>
                            <h3 className="text-xl font-serif text-gold mb-6">Minimum Requirements</h3>
                            <ul className="space-y-4 text-cream-muted">
                                <li className="flex items-start gap-4 group/item">
                                    <div className="w-6 h-6 rounded bg-forest/50 flex items-center justify-center text-gold text-xs font-bold mt-0.5 border border-gold/20 group-hover/item:border-gold transition-colors">1</div>
                                    <div>
                                        <span className="block text-cream font-medium mb-1">Registered Business</span>
                                        <span className="text-sm text-muted-foreground">Must provide valid business registration or tax ID</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 group/item">
                                    <div className="w-6 h-6 rounded bg-forest/50 flex items-center justify-center text-gold text-xs font-bold mt-0.5 border border-gold/20 group-hover/item:border-gold transition-colors">2</div>
                                    <div>
                                        <span className="block text-cream font-medium mb-1">Minimum Order Volume</span>
                                        <span className="text-sm text-muted-foreground">1 Container (approx. 275-320 bags / 19.2 MT)</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 group/item">
                                    <div className="w-6 h-6 rounded bg-forest/50 flex items-center justify-center text-gold text-xs font-bold mt-0.5 border border-gold/20 group-hover/item:border-gold transition-colors">3</div>
                                    <div>
                                        <span className="block text-cream font-medium mb-1">Payment Terms</span>
                                        <span className="text-sm text-muted-foreground">Letter of Credit (LC) or Cash Against Documents (CAD)</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Delivery Locations */}
            <section className="locations-section py-20 px-4 relative overflow-hidden">
                {/* Background Decorations for Locations - Reduced Opacity */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 -translate-x-1/2 pointer-events-none blur-sm select-none">
                    <CoffeeBeansScatteredImage variant="light-ink" className="w-full h-full !opacity-[0.06]" />
                </div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rotate-12 pointer-events-none select-none">
                    <CoffeeBranchImage variant="light-ink" className="w-full h-full !opacity-[0.07]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl font-serif text-cream mb-4">
                        Delivery Locations
                    </h2>
                    <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
                        We maintain stock at strategic locations globally to ensure fast and reliable delivery to your roastery.
                    </p>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { flag: '🇪🇹', city: 'Addis Ababa', type: 'FOB Djibouti' },
                            { flag: '🇮🇹', city: 'Port Trieste', type: 'EXW Italy' },
                            { flag: '🇮🇹', city: 'Port Genoa', type: 'EXW Italy' },
                        ].map((loc, i) => (
                            <div key={i} className="glass-card p-6 hover:bg-forest/50 transition-colors group">
                                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{loc.flag}</div>
                                <h3 className="text-lg font-serif text-gold mb-1">{loc.city}</h3>
                                <p className="text-sm text-muted-foreground">{loc.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-24 px-4 relative overflow-hidden bg-forest/10 border-t border-white/5">
                {/* Subtle Organic & Cultural Texture - Inverted for dark theme */}
                <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] !opacity-[0.1] grayscale pointer-events-none">
                    <JebenaImage className="w-full h-full" />
                </div>
                <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] pointer-events-none select-none">
                    <CoffeeBeansScatteredImage variant="light-ink" className="w-full h-full !opacity-[0.05]" />
                </div>

                <div className="max-w-3xl mx-auto text-center relative z-10 glass-card p-6 sm:p-12 border-gold/10 shadow-3xl bg-forest/10 mx-4 sm:mx-auto">
                    <h2 className="text-4xl font-serif text-cream mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-10 font-light">
                        Create your account today and start exploring our premium Ethiopian coffee collection with full pricing transparency.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Button
                            asChild
                            className="btn-premium py-6 px-8 text-lg min-w-[200px] group"
                        >
                            <Link href="/register">
                                Register Now
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="py-6 px-8 text-lg min-w-[200px] border-gold/30 text-gold hover:bg-gold/10 hover:text-gold-light hover:border-gold transition-all"
                        >
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground/60 mt-10">
                        Questions? Contact us at{' '}
                        <a href="mailto:ethiocof@greenacrescoffee.com" className="text-gold hover:text-gold-light transition-colors hover:underline">
                            ethiocof@greenacrescoffee.com
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
}
