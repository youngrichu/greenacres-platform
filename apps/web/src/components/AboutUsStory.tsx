"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CoffeeBranchImage, CoffeeLeafImage } from "./CoffeeDecorationsImage";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUsStory() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".story-fade-up", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="section-padding bg-cream relative overflow-hidden"
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none select-none opacity-5 -translate-y-1/3 translate-x-1/4">
                <CoffeeBranchImage className="w-full h-full rotate-90" />
            </div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none select-none opacity-5 translate-y-1/4 -translate-x-1/4">
                <CoffeeLeafImage className="w-full h-full -rotate-45" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="story-fade-up">
                        <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                            Our Story
                        </span>
                        <h2
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-forest mt-4 mb-8"
                            style={{ fontFamily: "var(--font-playfair)" }}
                        >
                            About Green Acres
                        </h2>

                        <div className="space-y-6 text-foreground-muted text-lg leading-relaxed">
                            <h3 className="text-2xl font-bold text-forest">
                                Connecting the World with Ethiopia&apos;s Finest Coffee
                            </h3>
                            <p>
                                Greenacres Industrial PLC is a licensed Ethiopian exporter of premium Arabica green coffee beans.
                                Headquartered in Addis Ababa, we source coffee from the country&apos;s most renowned origins,
                                including Sidama, Guji, Yirgacheffe, Limu, Kaffa, Jimma, Teppi, and Andrecha.
                            </p>
                            <p>
                                We supply international coffee roasters and traders across Europe, the Middle East, Asia, and North America.
                                Our company combines deep local sourcing knowledge with international trade expertise to deliver reliable,
                                traceable, and competitively priced Ethiopian coffees.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-10">
                            <Badge variant="outline" className="text-forest border-forest/20 bg-forest/5 px-4 py-2 text-sm gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Coffee & Tea Authority Registered
                            </Badge>
                            <Badge variant="outline" className="text-forest border-forest/20 bg-forest/5 px-4 py-2 text-sm gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Fully Licensed VAT & TIN
                            </Badge>
                            <Badge variant="outline" className="text-forest border-forest/20 bg-forest/5 px-4 py-2 text-sm gap-2">
                                <CheckCircle2 className="w-4 h-4" /> LC & Pre-shipment Eligible
                            </Badge>
                        </div>
                    </div>

                    <div className="relative story-fade-up">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                            <Image
                                src="/assets/story/warehouse-processing.png"
                                alt="Greenacres Coffee Processing Center"
                                fill
                                className="object-cover transition-transform duration-1000 hover:scale-110"
                            />
                            {/* Gradient Overlay for text potential */}
                            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-white text-xl font-playfair italic">
                                    &quot;Our mission is to source and export premium Ethiopian coffee with care, transparency, and integrity.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
