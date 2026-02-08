"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoffeeBranchImage, CoffeeBeansScatteredImage, CoffeeLeafImage } from "./CoffeeDecorationsImage";
import { ArrowRight, FileText, Lock } from "lucide-react";
import { useAuth } from "@greenacres/auth";

gsap.registerPlugin(ScrollTrigger);

interface CoffeeType {
    name: string;
    grade: string;
    process: string;
    notes: string[];
    description: string;
    accentColor: string;
    backgroundImage: string;
    gradientTheme: string;
    glowColor: string;
}

const coffeeTypes: CoffeeType[] = [
    {
        name: "Sidamo Nensebo Refisa",
        grade: "Grade 1",
        process: "Washed",
        notes: ["Floral", "Citrus", "Honey"],
        description: "Exquisite washed coffee from the Nensebo woreda in West Arsi, known for its high altitude and complex floral notes.",
        accentColor: "from-gold to-forest-light",
        backgroundImage: "/images/flavors/sidama.png",
        gradientTheme: "from-purple-200/80 via-rose-100/60 to-amber-100/40",
        glowColor: "rgba(139, 92, 246, 0.4)",
    },
    {
        name: "Guji Guduba Wet Mill",
        grade: "Grade 1",
        process: "Washed",
        notes: ["Jasmine", "Lemon", "Bergamot"],
        description: "Located in the heart of Hambella, Guduba station produces classic Guji profiles with intense aromatics.",
        accentColor: "from-gold-light to-gold",
        backgroundImage: "/images/flavors/guji.png",
        gradientTheme: "from-orange-100/80 via-amber-50/60 to-pink-100/40",
        glowColor: "rgba(251, 146, 60, 0.4)",
    },
    {
        name: "Guji Gotae Sodu",
        grade: "Grade 1",
        process: "Washed",
        notes: ["Peach", "Black Tea", "Floral"],
        description: "A standout micro-lot from the Gotae Sodu kebele, offering exceptional clarity and sweetness.",
        accentColor: "from-gold-light to-gold",
        backgroundImage: "/images/flavors/guji.png",
        gradientTheme: "from-amber-100/80 via-yellow-50/60 to-green-100/40",
        glowColor: "rgba(250, 204, 21, 0.4)",
    },
    {
        name: "Guji Haro Sorsa (Sisay Station)",
        grade: "Grade 1",
        process: "Washed",
        notes: ["Apricot", "Jasmine", "Sugar Cane"],
        description: "From the renowned deep red soils of Haro Sorsa, processed at the Sisay washing station.",
        accentColor: "from-gold to-forest-light",
        backgroundImage: "/images/flavors/guji.png",
        gradientTheme: "from-green-100/80 via-amber-50/60 to-yellow-100/40",
        glowColor: "rgba(132, 204, 22, 0.4)",
    },
    {
        name: "Yirgacheffe Banko Gotiti",
        grade: "Grade 1",
        process: "Natural",
        notes: ["Blueberry", "Strawberry", "Milk Chocolate"],
        description: "Classic Gedeb natural with intense berry notes and a creamy body.",
        accentColor: "from-gold-light to-gold",
        backgroundImage: "/images/flavors/yirgacheffe.png",
        gradientTheme: "from-rose-200/80 via-pink-50/60 to-amber-50/40",
        glowColor: "rgba(244, 114, 182, 0.4)",
    },
    {
        name: "Yirgacheffe Wurae (Halo Berti)",
        grade: "Grade 1",
        process: "Natural",
        notes: ["Tropical Fruit", "Winey", "Dried Fig"],
        description: "Complex and winey natural processed coffee from the Halo Berti kebele.",
        accentColor: "from-forest-light to-gold",
        backgroundImage: "/images/flavors/yirgacheffe.png",
        gradientTheme: "from-amber-200/80 via-rose-100/60 to-purple-100/40",
        glowColor: "rgba(120, 53, 15, 0.4)",
    },
    {
        name: "Jimma Agaro Genji Challa",
        grade: "Grade 1",
        process: "Natural",
        notes: ["Stone Fruit", "Spices", "Honey"],
        description: "Known for its clean cup and distinct spicy notes, Agaro coffees are gaining rapid recognition.",
        accentColor: "from-forest-light to-forest",
        backgroundImage: "/images/flavors/jimma.png",
        gradientTheme: "from-amber-200/80 via-orange-100/60 to-green-200/40",
        glowColor: "rgba(180, 83, 9, 0.4)",
    },
];

export default function CoffeeShowcase() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const { user, loading } = useAuth();
    const [coffeeIds, setCoffeeIds] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchCoffees = async () => {
            try {
                // Dynamically import getCoffees to avoid server-side issues if any
                const { getCoffees } = await import("@greenacres/db");
                const coffees = await getCoffees();
                console.log("☕️ Debug Showcase: Fetched coffees:", coffees.length, coffees.map(c => c.name));

                const idMap: Record<string, string> = {};

                coffees.forEach(coffee => {
                    // Create a normalized map key
                    idMap[coffee.name] = coffee.id;
                });

                console.log("☕️ Debug Showcase: Generated ID Map:", idMap);

                setCoffeeIds(idMap);
            } catch (error) {
                console.error("Failed to fetch coffees for showcase links:", error);
            }
        };

        fetchCoffees();

        const ctx = gsap.context(() => {
            if (cardsRef.current) {
                const cards = cardsRef.current.querySelectorAll(".coffee-card");

                cards.forEach((card, index) => {
                    gsap.fromTo(
                        card,
                        { y: 80, opacity: 0, rotateX: 10 },
                        {
                            y: 0,
                            opacity: 1,
                            rotateX: 0,
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%",
                            },
                        }
                    );
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="coffee"
            className="section-padding bg-cream-dark relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/5 to-transparent rounded-full blur-3xl opacity-60" />

            {/* New Organic Decorations */}
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] pointer-events-none select-none overflow-hidden opacity-10 rotate-180">
                <CoffeeBranchImage className="w-full h-full" />
            </div>

            <div className="absolute top-40 -left-20 w-[400px] h-[400px] pointer-events-none select-none opacity-5 -rotate-45">
                <CoffeeLeafImage className="w-full h-full" />
            </div>

            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none select-none translate-x-1/4 translate-y-1/4 opacity-10 -rotate-12">
                <CoffeeBranchImage className="w-full h-full" />
            </div>

            <div className="absolute bottom-20 left-10 w-64 h-64 pointer-events-none select-none animate-float-slow opacity-10">
                <CoffeeBeansScatteredImage className="w-full h-full rotate-12" />
            </div>

            <div className="absolute top-20 right-20 w-48 h-48 pointer-events-none select-none animate-float-delayed opacity-5">
                <CoffeeLeafImage className="w-full h-full -rotate-12" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                        Premium Selection
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest mt-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Our Coffee Collection
                    </h2>
                    <p className="text-foreground-muted mt-4 max-w-2xl mx-auto text-lg">
                        Handpicked specialty grades from Ethiopia&apos;s finest coffee-growing regions,
                        processed to perfection for discerning roasters worldwide.
                    </p>
                </div>

                {/* Coffee cards grid */}
                <div
                    ref={cardsRef}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {coffeeTypes.map((coffee) => (
                        <Card
                            key={coffee.name}
                            className="coffee-card group relative bg-white/60 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden rounded-2xl"
                            style={{
                                boxShadow: `0 4px 24px -4px rgba(0, 0, 0, 0.1)`,
                            }}
                        >
                            {/* ═══ FLAVOR BACKGROUND LAYER ═══ */}
                            <div
                                className="absolute inset-0 opacity-30 group-hover:opacity-50 touch-flavor-bg transition-opacity duration-700"
                                style={{
                                    backgroundImage: `url(${coffee.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    mixBlendMode: 'soft-light',
                                }}
                            />

                            {/* ═══ GRADIENT OVERLAY ═══ */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${coffee.gradientTheme} opacity-40 group-hover:opacity-60 touch-flavor-gradient transition-opacity duration-700`} />

                            {/* ═══ GLASS FROST LAYER ═══ */}
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

                            {/* ═══ ANIMATED GLOW ON HOVER ═══ */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 touch-flavor-glow transition-opacity duration-700 pointer-events-none"
                                style={{
                                    boxShadow: `inset 0 0 60px ${coffee.glowColor}`,
                                }}
                            />

                            {/* Decorative Underscore */}
                            <div className={`absolute top-0 left-0 h-1.5 w-0 bg-gradient-to-r ${coffee.accentColor} group-hover:w-full touch-expanded transition-all duration-700 ease-in-out z-20`} />

                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3
                                            className="text-2xl font-bold text-forest group-hover:text-forest-dark transition-colors duration-500 drop-shadow-sm"
                                            style={{ fontFamily: "var(--font-playfair)" }}
                                        >
                                            {coffee.name}
                                        </h3>
                                        <p className="text-coffee/80 text-xs font-semibold tracking-widest uppercase mt-1">
                                            {coffee.process}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="bg-forest/10 text-forest border border-forest/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter backdrop-blur-sm">
                                        {coffee.grade}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pb-6 relative z-10">
                                <p className="text-forest/70 leading-relaxed text-sm mb-6">
                                    {coffee.description}
                                </p>

                                {/* Flavor notes */}
                                <div className="flex flex-wrap gap-2">
                                    {coffee.notes.map((note) => (
                                        <Badge
                                            key={note}
                                            variant="outline"
                                            className="border-forest/20 text-forest bg-white/60 backdrop-blur-sm text-[11px] font-medium py-0.5 shadow-sm"
                                        >
                                            {note}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Flavor image peek in corner */}
                                <div
                                    className="absolute -bottom-4 -right-4 w-24 h-24 pointer-events-none select-none opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 rounded-full overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${coffee.backgroundImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                            </CardContent>

                            <CardFooter className="pt-4 border-t border-forest/5 bg-white/30 backdrop-blur-sm relative z-10">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-[11px] font-semibold text-forest/50 uppercase tracking-widest">
                                        Export Quality
                                    </span>
                                    {loading ? (
                                        <Button variant="ghost" size="sm" disabled className="text-forest/50">
                                            Loading...
                                        </Button>
                                    ) : user ? (
                                        <Link href={coffeeIds[coffee.name] ? `/portal/catalog/${coffeeIds[coffee.name]}` : "/portal/catalog"}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-forest hover:text-gold hover:bg-transparent font-bold text-xs uppercase tracking-wider gap-2 group/btn"
                                            >
                                                View In Portal
                                                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        coffeeIds[coffee.name] ? (
                                            <Link href={`/catalog/${coffeeIds[coffee.name]}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-forest hover:text-gold hover:bg-transparent font-bold text-xs uppercase tracking-wider gap-2 group/btn"
                                                >
                                                    View Details
                                                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled
                                                className="text-forest/40 cursor-not-allowed font-bold text-xs uppercase tracking-wider gap-2"
                                                title="Product not yet available in catalog"
                                            >
                                                Coming Soon
                                                <Lock className="w-3 h-3" />
                                            </Button>
                                        )
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* View more CTA */}
                <div className="text-center mt-16">
                    {loading ? (
                        <div className="h-14 w-48 mx-auto bg-forest/10 rounded-full animate-pulse" />
                    ) : user ? (
                        <Button
                            size="lg"
                            className="h-14 px-10 bg-forest hover:bg-forest-light text-white font-semibold rounded-full shadow-lg shadow-forest/20 transition-all hover:scale-105"
                            asChild
                        >
                            <Link href="/portal/catalog" className="inline-flex items-center gap-3">
                                Go To Buyer Portal
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="h-14 px-10 bg-forest hover:bg-forest-light text-white font-semibold rounded-full shadow-lg shadow-forest/20 transition-all hover:scale-105"
                            asChild
                        >
                            <Link href="/register" className="inline-flex items-center gap-3">
                                Become a Partner
                                <FileText className="w-5 h-5" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}
