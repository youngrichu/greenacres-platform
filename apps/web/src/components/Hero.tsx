"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const beansContainerRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Timeline for text animations
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
                titleRef.current,
                { y: 80, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 1.2 }
            );

            tl.fromTo(
                subtitleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9 },
                "-=0.7"
            );

            tl.fromTo(
                ctaRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7 },
                "-=0.4"
            );

            tl.fromTo(
                scrollIndicatorRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                "-=0.2"
            );

            // Animate each coffee bean with unique properties
            if (beansContainerRef.current) {
                const beans = beansContainerRef.current.querySelectorAll(".coffee-bean-particle");

                beans.forEach((bean, index) => {
                    // Initial entrance animation
                    gsap.fromTo(
                        bean,
                        {
                            opacity: 0,
                            scale: 0,
                            rotation: gsap.utils.random(-180, 180)
                        },
                        {
                            opacity: gsap.utils.random(0.15, 0.4),
                            scale: 1,
                            rotation: gsap.utils.random(-30, 30),
                            duration: gsap.utils.random(0.8, 1.5),
                            delay: index * 0.1,
                            ease: "back.out(1.7)"
                        }
                    );

                    // Continuous floating animation
                    gsap.to(bean, {
                        y: `random(-60, 60)`,
                        x: `random(-40, 40)`,
                        rotation: `random(-25, 25)`,
                        scale: `random(0.8, 1.2)`,
                        duration: gsap.utils.random(4, 8),
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: gsap.utils.random(0, 2),
                    });
                });
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    // More coffee beans with varied sizes
    const beanConfigs = [
        { top: "8%", left: "5%", size: 40 },
        { top: "15%", right: "8%", size: 35 },
        { top: "25%", left: "12%", size: 28 },
        { top: "35%", right: "15%", size: 45 },
        { top: "50%", left: "3%", size: 32 },
        { top: "60%", right: "5%", size: 38 },
        { top: "70%", left: "10%", size: 30 },
        { top: "80%", right: "12%", size: 42 },
        { top: "20%", left: "85%", size: 25 },
        { top: "45%", left: "92%", size: 36 },
        { top: "75%", left: "88%", size: 33 },
        { top: "12%", left: "45%", size: 22 },
        { top: "85%", left: "50%", size: 28 },
    ];

    return (
        <section
            ref={heroRef}
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 gradient-hero" />

            {/* Animated grain texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Floating Coffee Beans */}
            <div ref={beansContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
                {beanConfigs.map((config, i) => (
                    <div
                        key={i}
                        className="coffee-bean-particle absolute opacity-0"
                        style={{
                            top: config.top,
                            left: config.left,
                            right: config.right,
                        }}
                    >
                        <svg
                            width={config.size}
                            height={config.size * 1.5}
                            viewBox="0 0 30 45"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <ellipse
                                cx="15"
                                cy="22.5"
                                rx="14"
                                ry="21"
                                fill="#8b5a2b"
                            />
                            <path
                                d="M15 5C15 5 13 22.5 15 40"
                                stroke="#3d2914"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                            {/* Highlight */}
                            <ellipse
                                cx="10"
                                cy="15"
                                rx="4"
                                ry="6"
                                fill="#a06830"
                                opacity="0.5"
                            />
                        </svg>
                    </div>
                ))}
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 md:pt-24 pb-16 md:pb-20">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full glass border border-gold/30">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-gold text-sm font-medium tracking-widest uppercase">
                        Established 2010 • Addis Ababa, Ethiopia
                    </span>
                </div>

                <h1
                    ref={titleRef}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight opacity-0"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    Premium Ethiopian
                    <br />
                    <span className="text-gradient-gold inline-block mt-1">Coffee Excellence</span>
                </h1>

                <p
                    ref={subtitleRef}
                    className="text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-8 leading-relaxed opacity-0"
                >
                    From the misty highlands of Sidama, Yirgacheffe, and Guji — we export the
                    world&apos;s finest single-origin specialty coffee with exceptional flavor profiles.
                </p>

                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center opacity-0">
                    <Button
                        size="lg"
                        className="h-14 px-10 bg-gold hover:bg-gold-light text-forest font-semibold text-base rounded-full shadow-xl shadow-gold/25 transition-all hover:scale-105"
                        asChild
                    >
                        <a href="#coffee">Explore Our Coffee</a>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-10 border-2 border-white/30 bg-transparent text-white font-semibold text-base rounded-full hover:bg-white/10 hover:border-gold transition-all"
                        asChild
                    >
                        <a href="#story">Our Story</a>
                    </Button>
                </div>
            </div>

            {/* Scroll indicator - positioned properly */}
            <div
                ref={scrollIndicatorRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 opacity-0"
            >
                <span className="text-white/50 text-xs tracking-[0.2em] uppercase font-medium">
                    Scroll to discover
                </span>
                <div className="w-7 h-12 border-2 border-white/40 rounded-full flex justify-center p-2">
                    <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
}
