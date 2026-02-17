"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, MapPin, Sprout, Globe } from "lucide-react";
import { CoffeeBranchImage, CoffeeLeafImage } from "./CoffeeDecorationsImage";

gsap.registerPlugin(ScrollTrigger);

const values = [
    {
        title: "Quality Excellence",
        description: "Strict physical inspection and regular cupping ensure only the finest beans reach our partners.",
        icon: Sparkles,
        delay: 0,
    },
    {
        title: "Full Traceability",
        description: "Lot traceability from origin to export with transparent documentation and shipment consistency.",
        icon: MapPin,
        delay: 0.1,
    },
    {
        title: "Sustainable Growth",
        description: "Empowering farmers through fair trade practices and building long-term supplier relationships.",
        icon: Sprout,
        delay: 0.2,
    },
    {
        title: "Global Reach",
        description: "Flexible export solutions via FOB Djibouti, with CAD, LC, and repeat-buyer arrangements.",
        icon: Globe,
        delay: 0.3,
    },
];

export default function GreenAcresDifference() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (containerRef.current) {
                const cards = containerRef.current.querySelectorAll(".diff-card");
                gsap.fromTo(cards,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="section-padding bg-cream relative overflow-hidden"
        >
            {/* Background decorations — cream section style */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Radial gold glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/6 via-gold/2 to-transparent rounded-full blur-3xl" />

                {/* Branch illustrations */}
                <div className="absolute -top-20 -right-20 w-[450px] h-[450px] opacity-10 rotate-180">
                    <CoffeeBranchImage className="w-full h-full" />
                </div>
                <div className="absolute -bottom-16 -left-16 w-[350px] h-[350px] opacity-[0.08] rotate-45">
                    <CoffeeLeafImage className="w-full h-full" />
                </div>

                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #1B3D2F 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Grain */}
                <div className="absolute inset-0 bg-[url('/assets/grain-texture.png')] opacity-[0.04] mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        The Green Acres Difference
                    </h2>
                    <p className="text-foreground-muted max-w-2xl mx-auto text-lg">
                        Why international roasters choose us as their preferred Ethiopian partner.
                    </p>
                </div>

                <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((v, i) => (
                        <div
                            key={i}
                            className="diff-card group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-gold/30"
                        >
                            <div className="w-16 h-16 mb-6 bg-forest/5 rounded-2xl flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-gold transition-colors duration-300">
                                <v.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-forest mb-3 group-hover:text-forest-dark">{v.title}</h4>
                            <p className="text-foreground-muted leading-relaxed text-sm md:text-base">{v.description}</p>

                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
