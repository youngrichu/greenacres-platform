"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { CoffeeLeafImage, CoffeeBeansScatteredImage } from "./CoffeeDecorationsImage";
import { Sprout, MapPin, Search } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function EthiopiaCulture() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".culture-fade", {
                opacity: 0,
                y: 40,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="heritage"
            className="section-padding bg-forest relative overflow-hidden text-white"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm26 18c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="absolute top-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
                <CoffeeLeafImage className="w-full h-full -rotate-45" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    {/* Left Side: Images Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 gap-4 culture-fade">
                        <div className="space-y-4">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                                <Image
                                    src="/assets/heritage/coffee-ceremony-1.png"
                                    alt="Traditional Ethiopian Coffee Ceremony"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div className="aspect-square rounded-2xl overflow-hidden relative">
                                <Image
                                    src="/assets/heritage/coffee-origin-landscape.png"
                                    alt="Ethiopian Highlands Landscape"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                        </div>
                        <div className="pt-12 space-y-4">
                            <div className="aspect-square rounded-2xl overflow-hidden relative">
                                <Image
                                    src="/assets/heritage/coffee-beans-roasting.png"
                                    alt="Traditional Roasting"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                                <Image
                                    src="/assets/heritage/cultural-hands.png"
                                    alt="Coffee harvesting by hand"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div ref={contentRef} className="lg:col-span-5 culture-fade">
                        <span className="text-gold text-sm font-semibold tracking-widest uppercase mb-4 block">
                            Land of Origins
                        </span>
                        <h2
                            className="text-4xl sm:text-5xl font-bold mb-8 leading-tight"
                            style={{ fontFamily: "var(--font-playfair)" }}
                        >
                            The Heart of Coffee Culture
                        </h2>

                        <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                            <p>
                                Ethiopia is not just where coffee began; it is where coffee remains a sacred ritual.
                                In every village, the <strong>Abol, Tona, and Baraka</strong> — the three rounds of the traditional coffee ceremony —
                                bind families and communities together.
                            </p>
                            <p>
                                At Green Acres, we carry this heritage in every bean. We believe that exporting coffee is about
                                sharing a culture that has perfected the art of the bean for over a thousand years.
                            </p>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/10 flex items-start gap-6">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                <Sprout className="w-8 h-8 text-gold" />
                            </div>
                            <div>
                                <h4 className="text-gold text-xl font-bold mb-2">Preserving the Legacy</h4>
                                <p className="text-white/60 text-sm">
                                    Our sourcing practices ensure that the wild forest heritage of Kaffa
                                    and the highland traditions of Yirgacheffe are preserved for future generations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 w-48 h-48 opacity-10 pointer-events-none">
                <CoffeeBeansScatteredImage className="w-full h-full rotate-12" />
            </div>
        </section>
    );
}
