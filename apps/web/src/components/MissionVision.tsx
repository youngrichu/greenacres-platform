"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Target, Handshake, Award, Truck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CulturalPatternImage, CoffeeBranchImage, CoffeeLeafImage } from "./CoffeeDecorationsImage";

gsap.registerPlugin(ScrollTrigger);

const VideoRef = ({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) => (
    <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
    >
        <source src="/assets/videos/green-beans-machine.mp4" type="video/mp4" />
    </video>
);

const WaveDivider = ({ className, fill = "#faf6f0", flip = false }: { className?: string; fill?: string; flip?: boolean }) => (
    <svg
        className={cn("w-full h-auto", flip && "scale-y-[-1]", className)}
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill={fill}>
            <path d="M0 0v99.7C62 69 122.4 48.7 205 66c83.8 17.6 160.5 20.4 240-12 54-22 110-26 173-10a392.2 392.2 0 0 0 222-5c55-17 110.3-36.9 160-27.2V0H0Z" opacity=".5" />
            <path d="M0 0v74.7C62 44 122.4 28.7 205 46c83.8 17.6 160.5 25.4 240-7 54-22 110-21 173-5 76.5 19.4 146.5 23.3 222 0 55-17 110.3-31.9 160-22.2V0H0Z" />
        </g>
    </svg>
);

const missionPoints = [
    {
        icon: Handshake,
        title: "Fair Trade Practices",
        description: "Empower farmers and local suppliers through equitable partnerships and transparent pricing.",
    },
    {
        icon: Award,
        title: "Rigorous Quality Standards",
        description: "Ensure consistent quality through expert cupping, grading standards, and meticulous processing.",
    },
    {
        icon: Truck,
        title: "Reliable Global Logistics",
        description: "Meet global demand with dependable logistics, timely delivery, and exceptional customer service.",
    },
];


export default function MissionVision() {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".mv-fade",
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.3,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Slow video playback
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
        }
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden">

            {/* ─── 1. VISION SECTION ─── */}
            <div className="relative py-24 md:py-32 bg-cream text-forest overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="opacity-[0.04]">
                        <CulturalPatternImage className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -top-16 -right-16 w-[380px] h-[380px] opacity-[0.07] rotate-[175deg]">
                        <CoffeeBranchImage className="w-full h-full" />
                    </div>
                    <div className="absolute -bottom-12 -left-12 w-[300px] h-[300px] opacity-[0.06] rotate-[40deg]">
                        <CoffeeLeafImage className="w-full h-full" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-gold/5 via-gold/2 to-transparent rounded-full blur-3xl" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `radial-gradient(circle, #1B3D2F 1px, transparent 1px)`,
                            backgroundSize: '32px 32px',
                        }}
                    />
                    <div className="absolute inset-0 bg-[url('/assets/grain-texture.png')] opacity-[0.04] mix-blend-overlay" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 mv-fade">
                        <div className="w-16 h-16 rounded-full bg-forest text-gold flex items-center justify-center mb-6">
                            <Eye className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-forest" style={{ fontFamily: "var(--font-playfair)" }}>
                            Our Vision
                        </h2>
                        <p className="text-lg md:text-xl text-foreground-muted leading-relaxed">
                            To become one of Ethiopia&apos;s most trusted and innovative coffee exporters,
                            recognized globally for quality excellence, integrity, and sustainable partnerships.
                            We envision a future where every cup tells the story of its origin.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 relative h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden shadow-2xl mv-fade rotate-3 hover:rotate-0 transition-transform duration-700">
                        <Image
                            src="/assets/heritage/coffee-vision-highlands.png"
                            alt="Ethiopian Highlands"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-forest/10 mix-blend-multiply" />
                    </div>
                </div>

            </div>

            {/* ─── 2. VIDEO DIVIDER ─── */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <VideoRef videoRef={videoRef} />
                {/* Cinematic overlay layers */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)' }} />

                {/* Wave: cream fills down into video divider (top edge) */}
                <div className="absolute top-0 left-0 w-full z-20 -translate-y-[1px]">
                    <WaveDivider fill="#faf6f0" className="h-16 md:h-24 lg:h-32" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <p className="text-white text-2xl md:text-4xl font-playfair italic px-4 text-center max-w-4xl leading-tight opacity-90 tracking-wide drop-shadow-lg">
                        &quot;Cultivating excellence from the soil to the cup.&quot;
                    </p>
                </div>

                {/* Wave: cream fills up into video divider (bottom edge, flipped) */}
                <div className="absolute bottom-0 left-0 w-full z-20 translate-y-[1px]">
                    <WaveDivider fill="#faf6f0" flip className="h-16 md:h-24 lg:h-32" />
                </div>
            </div>

            {/* ─── 3. MISSION SECTION ─── */}
            <div className="relative py-24 md:py-32 bg-cream text-forest overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="opacity-[0.05]">
                        <CulturalPatternImage className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -top-12 -left-16 w-[380px] h-[380px] opacity-[0.07] -rotate-12">
                        <CoffeeBranchImage className="w-full h-full" />
                    </div>
                    <div className="absolute -bottom-16 -right-12 w-[320px] h-[320px] opacity-[0.06] rotate-[130deg]">
                        <CoffeeLeafImage className="w-full h-full" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-gold/5 via-gold/2 to-transparent rounded-full blur-3xl" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `radial-gradient(circle, #1B3D2F 1px, transparent 1px)`,
                            backgroundSize: '32px 32px',
                        }}
                    />
                    <div className="absolute inset-0 bg-[url('/assets/grain-texture.png')] opacity-[0.04] mix-blend-overlay" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="mv-fade">
                        <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-700">
                            <Image
                                src="/assets/heritage/cultural-hands.png"
                                alt="Harvesting Coffee"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="mv-fade">
                        <div className="w-16 h-16 rounded-full bg-forest text-gold flex items-center justify-center mb-6">
                            <Target className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-10" style={{ fontFamily: "var(--font-playfair)" }}>
                            Our Mission
                        </h2>

                        {/* Premium mission cards instead of bullets */}
                        <div className="space-y-6">
                            {missionPoints.map((point, i) => (
                                <div
                                    key={i}
                                    className="group flex gap-5 items-start p-5 rounded-2xl bg-white shadow-md border border-cream-dark hover:shadow-xl hover:border-gold/30 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-forest flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors duration-300">
                                        <point.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-forest mb-1">{point.title}</h4>
                                        <p className="text-foreground-muted text-sm leading-relaxed">{point.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
