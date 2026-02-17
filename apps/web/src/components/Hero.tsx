"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(contentRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.3 }
            );

            // Scroll indicator animation
            gsap.fromTo(".scroll-indicator",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power2.out" }
            );

            gsap.to(".scroll-chevron", {
                y: 6,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "power1.inOut"
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.7;
            videoRef.current.play().catch(() => { });
        }
    }, []);

    return (
        <section
            id="hero"
            ref={heroRef}
            className="relative h-screen w-full flex items-end overflow-hidden bg-forest-dark"
        >
            {/* Background Video — slow cinematic */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/assets/videos/drone-footage.mp4" type="video/mp4" />
                </video>
                {/* Layer 1: overall tint for nav readability */}
                <div className="absolute inset-0 bg-black/30" />
                {/* Layer 2: strong bottom gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Layer 3: top gradient for nav readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent h-[200px]" />
                {/* Layer 4: cinematic radial vignette */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
            </div>

            {/* Content — bottom-left, minimal like niatero */}
            <div ref={contentRef} className="relative z-10 w-full px-8 md:px-16 pb-24 md:pb-32 max-w-4xl">
                <p className="text-sm md:text-base uppercase tracking-[0.3em] text-white/60 font-light mb-6">
                    Ethiopian Premium Coffee
                </p>
                <h1
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.05]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    From Highland
                    <br />
                    Origins to the
                    <br />
                    <span className="text-gold italic">World&apos;s Cup</span>
                </h1>

                <Link
                    href="/portal/catalog"
                    className="group inline-flex items-center gap-3 text-white/80 hover:text-white text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 border-b border-white/30 hover:border-white pb-2"
                >
                    Explore Our Coffee
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
            </div>
            {/* Scroll Indicator */}
            <div
                className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer opacity-0"
                onClick={() => {
                    const intro = document.getElementById('introduction');
                    if (intro) intro.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-light">Scroll</span>
                <ChevronDown className="w-4 h-4 text-white/50 scroll-chevron" />
            </div>
        </section>
    );
}
