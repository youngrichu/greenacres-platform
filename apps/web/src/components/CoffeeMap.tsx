"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, MapPin } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { CoffeeBranchImage, CoffeeLeafImage } from "./CoffeeDecorationsImage";

gsap.registerPlugin(ScrollTrigger);

interface CoffeeRegion {
    id: string;
    name: string;
    position: { top: string; left: string };
    altitude: string;
    process: string[];
    flavor: string[];
    description: string;
    labelPosition?: "top" | "bottom" | "left" | "right";
}

const coffeeRegions: CoffeeRegion[] = [
    {
        id: "yirgacheffe",
        name: "Yirgacheffe",
        position: { top: "68%", left: "45%" }, // Gedio zone — south of Sidama
        altitude: "1,750 - 2,200m",
        process: ["Washed", "Natural"],
        flavor: ["Floral", "Citrus", "Bergamot", "Tea-like"],
        description:
            "The birthplace of coffee. Yirgacheffe produces exceptionally clean, bright coffees with distinctive floral and citrus notes that have made Ethiopian coffee world-famous.",
        labelPosition: "right",
    },
    {
        id: "sidama",
        name: "Sidama",
        position: { top: "63%", left: "42%" }, // Sidama zone — south-central, west of Rift Valley
        altitude: "1,500 - 2,200m",
        process: ["Washed", "Natural", "Honey"],
        flavor: ["Berry", "Wine", "Chocolate", "Citrus"],
        description:
            "Known for complex, wine-like acidity and rich berry notes. Sidama coffees are prized for their balanced sweetness and velvety body.",
        labelPosition: "right",
    },
    {
        id: "guji",
        name: "Guji",
        position: { top: "70%", left: "52%" }, // Southern Oromiya — southeast of Sidama, within highland belt
        altitude: "1,800 - 2,300m",
        process: ["Natural", "Washed"],
        flavor: ["Stone Fruit", "Jasmine", "Honey", "Complex"],
        description:
            "A newer specialty region producing intensely fruity and complex coffees with exceptional cup quality that rivals Yirgacheffe.",
        labelPosition: "right",
    },
    {
        id: "jimma",
        name: "Jimma",
        position: { top: "55%", left: "32%" }, // Western Oromiya — Jimma zone
        altitude: "1,400 - 2,000m",
        process: ["Natural", "Washed"],
        flavor: ["Earthy", "Spicy", "Full-bodied", "Wild"],
        description:
            "The largest coffee-producing region in Ethiopia, known for wild forest coffees with earthy, spicy character and bold flavor.",
        labelPosition: "right",
    },
    {
        id: "kaffa",
        name: "Kaffa",
        position: { top: "62%", left: "27%" }, // Keficho Shekicho — south of Jimma in SNNPR
        altitude: "1,450 - 2,100m",
        process: ["Washed", "Natural"],
        flavor: ["Winey", "Chocolate", "Berry", "Spice"],
        description:
            "The historic home of Arabica coffee. Kaffa produce complex, winey coffees with rich chocolate undertones and deep spice notes.",
        labelPosition: "left",
    },
    {
        id: "teppi",
        name: "Teppi",
        position: { top: "52%", left: "22%" }, // Illubabor area — western Ethiopia
        altitude: "1,100 - 1,900m",
        process: ["Natural"],
        flavor: ["Wild", "Herbal", "Citrus", "Nutty"],
        description:
            "A distinct low-to-mid elevation region producing coffees with wild, herbal notes and a unique low-acidity profile.",
        labelPosition: "left",
    },
    {
        id: "andrecha",
        name: "Andrecha",
        position: { top: "66%", left: "20%" }, // Bench Maji — far southwest Ethiopia
        altitude: "1,500 - 2,000m",
        process: ["Natural"],
        flavor: ["Sweet", "Fruity", "Full body", "Spice"],
        description:
            "A emerging specialty region known for sweet, full-bodied natural coffees with intense fruity characteristics.",
        labelPosition: "left",
    },
    {
        id: "limmu",
        name: "Limmu",
        position: { top: "48%", left: "34%" }, // Western Oromiya — between Jimma and Wellega
        altitude: "1,400 - 2,200m",
        process: ["Washed"],
        flavor: ["Wine", "Spice", "Floral", "Sweet"],
        description:
            "Produces refined washed coffees with wine-like acidity and floral complexity. Highly sought after by specialty roasters.",
        labelPosition: "right",
    },
    {
        id: "lekempti",
        name: "Lekempti",
        position: { top: "38%", left: "24%" }, // East Wellega zone — northwestern Oromiya
        altitude: "1,500 - 2,100m",
        process: ["Natural", "Washed"],
        flavor: ["Fruity", "Blueberry", "Winey", "Bold"],
        description:
            "Known for distinctive fruity naturals with intense blueberry notes and bold, winey sweetness that stands out in any blend.",
        labelPosition: "right",
    },
];

export default function CoffeeMap() {
    const [activeRegion, setActiveRegion] = useState<CoffeeRegion | null>(null);
    const [pulsingIndex, setPulsingIndex] = useState(0);
    const [autoAdvance, setAutoAdvance] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Auto-advance pulsing hotspot
    useEffect(() => {
        if (!autoAdvance) return;

        const interval = setInterval(() => {
            setPulsingIndex((prev) => (prev + 1) % coffeeRegions.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [autoAdvance]);

    // Handle region click - advance to next pulsing hotspot
    const handleRegionClick = (region: CoffeeRegion, index: number) => {
        setActiveRegion(region);
        setAutoAdvance(false); // Stop auto-advance on first click
        setPulsingIndex(-1); // Stop pulsing effect completely on interaction
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                mapContainerRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="regions"
            className="section-padding bg-forest relative overflow-hidden"
        >
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,168,83,0.4) 1px, transparent 0)`,
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* Coffee branch — top-right */}
                <div className="absolute -top-16 -right-20 w-[420px] h-[420px] opacity-[0.08] rotate-[170deg] mix-blend-screen">
                    <CoffeeBranchImage className="w-full h-full" />
                </div>

                {/* Coffee leaf — bottom-left */}
                <div className="absolute -bottom-12 -left-16 w-[350px] h-[350px] opacity-[0.07] rotate-45 mix-blend-screen">
                    <CoffeeLeafImage className="w-full h-full" />
                </div>

                {/* Grain texture */}
                <div className="absolute inset-0 bg-[url('/assets/grain-texture.png')] opacity-[0.05] mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                        Coffee Origins
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Ethiopian Coffee Regions
                    </h2>
                    <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
                        Explore the legendary coffee-growing regions of Ethiopia,
                        each with its own unique terroir and flavor signature.
                    </p>
                </div>

                {/* Map and Info Container */}
                <div
                    ref={mapContainerRef}
                    className="grid lg:grid-cols-5 gap-8 items-start"
                >
                    {/* Interactive Map Wrapper - takes 3 columns */}
                    <div className="lg:col-span-3 relative px-0 sm:px-0">
                        {/* Map Container - CLIPPED */}
                        <div
                            className="relative aspect-square max-w-2xl mx-auto transition-all duration-1000 ease-in-out"
                            style={{
                                clipPath: "url(#coffee-bean-clip)"
                            }}
                        >
                            {/* Map Image */}
                            <Image
                                src="/images/ethiopia-map-original.png"
                                alt="Map of Ethiopian coffee growing regions"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Coffee Bean Split Overlay */}
                            <svg
                                className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30"
                                viewBox="0 0 512 512"
                                fill="none"
                            >
                                <path
                                    d="M453.18,110.065c-43.364,5.145-146.471,27.804-237.128,127.471C124.661,342.144,50.869,365.075,32.508,369.382"
                                    stroke="var(--color-forest)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M473.689,153.187c-27.653,1.993-140.558,16.529-237.128,121.878c-92.308,100.693-165.009,129.024-192.946,136.669"
                                    stroke="var(--color-forest)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Overlay for better marker visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent" />
                        </div>

                        {/* Markers Layer - UNCLIPPED (sits on top of clipped map) */}
                        <div className="absolute inset-0 aspect-square max-w-2xl mx-auto pointer-events-none">
                            {coffeeRegions.map((region, index) => {
                                const isPulsing = index === pulsingIndex;
                                const isActive = activeRegion?.id === region.id;
                                const labelPos = region.labelPosition || "top";

                                // Label positioning styles with more spacing
                                const labelClasses = {
                                    top: "left-1/2 -translate-x-1/2 -top-12 translate-y-2 group-hover:translate-y-0",
                                    bottom: "left-1/2 -translate-x-1/2 top-10 -translate-y-2 group-hover:translate-y-0",
                                    left: "right-10 top-1/2 -translate-y-1/2 translate-x-2 group-hover:translate-x-0",
                                    right: "left-10 top-1/2 -translate-y-1/2 -translate-x-2 group-hover:translate-x-0"
                                };

                                const activeLabelClasses = {
                                    top: "translate-y-0 opacity-100",
                                    bottom: "translate-y-0 opacity-100",
                                    left: "translate-x-0 opacity-100",
                                    right: "translate-x-0 opacity-100"
                                };

                                return (
                                    <button
                                        key={region.id}
                                        onClick={() => handleRegionClick(region, index)}
                                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-500 p-4 pointer-events-auto ${isActive ? "z-30 scale-110" : "z-20 hover:scale-110 touch-scale"
                                            }`}
                                        style={{
                                            top: region.position.top,
                                            left: region.position.left,
                                        }}
                                    >
                                        {/* Pulse ring */}
                                        {isPulsing && (
                                            <span className="absolute inset-0 w-full h-full rounded-full bg-gold/60 animate-ping duration-1000" />
                                        )}

                                        {/* Marker */}
                                        <span
                                            className={`relative block w-5 h-5 rounded-full border-2 transition-all duration-300 ${isActive
                                                ? "bg-gold border-white shadow-lg shadow-gold/50"
                                                : isPulsing
                                                    ? "bg-gold border-white shadow-md shadow-gold/30 scale-110"
                                                    : "bg-gold/80 border-white/80 group-hover:bg-gold group-hover:border-white"
                                                }`}
                                        />

                                        {/* Label */}
                                        <span
                                            className={`absolute whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-semibold shadow-md transition-all duration-300 pointer-events-none 
                                            ${labelClasses[labelPos]} 
                                            ${isActive
                                                    ? "bg-gold text-forest " + activeLabelClasses[labelPos]
                                                    : isPulsing
                                                        ? "bg-white/95 text-forest " + activeLabelClasses[labelPos]
                                                        : "bg-white/90 text-forest opacity-0 group-hover:opacity-100"
                                                }`}
                                        >
                                            {region.name}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>


                        {/* Mobile region buttons */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6 lg:hidden">
                            {coffeeRegions.map((region, index) => (
                                <button
                                    key={region.id}
                                    onClick={() => handleRegionClick(region, index)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeRegion?.id === region.id
                                        ? "bg-gold text-forest"
                                        : "bg-white/15 text-white hover:bg-white/25"
                                        }`}
                                >
                                    {region.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Region Info Panel - takes 2 columns */}
                    <div className="lg:col-span-2">
                        <div
                            className={`glass-dark rounded-2xl p-8 transition-all duration-500 sticky top-24 ${activeRegion ? "opacity-100" : "opacity-70"
                                }`}
                        >
                            {activeRegion ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-3 h-3 rounded-full bg-gold animate-pulse" />
                                        <h3
                                            className="text-2xl sm:text-3xl font-bold text-white"
                                            style={{ fontFamily: "var(--font-playfair)" }}
                                        >
                                            {activeRegion.name}
                                        </h3>
                                    </div>

                                    <p className="text-white/80 mb-8 leading-relaxed text-lg">
                                        {activeRegion.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                                                Altitude
                                            </span>
                                            <p className="text-white text-lg font-semibold mt-1">
                                                {activeRegion.altitude}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                                                Processing
                                            </span>
                                            <p className="text-white text-lg font-semibold mt-1">
                                                {activeRegion.process.join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                                            Flavor Profile
                                        </span>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {activeRegion.flavor.map((note) => (
                                                <Badge
                                                    key={note}
                                                    variant="outline"
                                                    className="border-gold/40 text-gold bg-gold/10 hover:bg-gold/20"
                                                >
                                                    {note}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10">
                                        <a
                                            href="#contact"
                                            className="inline-flex items-center gap-2 text-gold font-semibold hover:underline"
                                        >
                                            Request samples from {activeRegion.name}
                                            <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                                        <MapPin className="w-10 h-10 text-gold" />
                                    </div>
                                    <p className="text-white/60 text-lg">
                                        Click a region on the map to explore its unique coffee characteristics
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SVG Clip Path Definition for Coffee Bean Shape */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="coffee-bean-clip" clipPathUnits="objectBoundingBox">
                        {/* Outer silhouette of the coffee bean to show the full map inside */}
                        <path
                            transform="scale(0.001953125, 0.001953125)"
                            d="M491.646,119.951c-0.677-1.171-1.538-2.2-2.244-3.348c-0.598-2.454-1.983-4.487-3.968-5.92
                            c-27.978-41.05-75.195-66.953-134.765-72.953c-62.793-6.346-131.677,10.031-194.091,46.068
                            c-62.404,36.031-111.042,87.546-136.94,145.049c-26.429,58.674-26.174,116.638,0.716,163.206
                            c26.889,46.573,76.958,75.772,140.987,82.221c8.82,0.889,17.773,1.334,26.807,1.334c55.209,0,113.648-16.439,167.273-47.401
                            c62.414-36.031,111.042-87.546,136.94-145.05C518.791,224.483,518.535,166.525,491.646,119.951z"
                        />
                    </clipPath>
                </defs>
            </svg>
        </section>
    );
}
