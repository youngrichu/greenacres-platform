"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StatItemProps {
    value: number;
    suffix?: string;
    label: string;
    delay?: number;
}

function StatItem({ value, suffix = "", label, delay = 0 }: StatItemProps) {
    const [count, setCount] = useState(0);
    const itemRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = itemRef.current;
        if (!element) return;

        const trigger = ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            onEnter: () => {
                if (hasAnimated.current) return;
                hasAnimated.current = true;

                // Animate the counter
                gsap.to(
                    { val: 0 },
                    {
                        val: value,
                        duration: 2,
                        delay,
                        ease: "power2.out",
                        onUpdate: function () {
                            setCount(Math.floor(this.targets()[0].val));
                        },
                    }
                );

                // Animate the element appearance
                gsap.fromTo(
                    element,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, delay, ease: "power3.out" }
                );
            },
        });

        return () => trigger.kill();
    }, [value, delay]);

    return (
        <div
            ref={itemRef}
            className="text-center opacity-0"
        >
            <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-forest mb-2">
                {count.toLocaleString()}
                <span className="text-gold">{suffix}</span>
            </div>
            <div className="text-foreground-muted text-sm sm:text-base uppercase tracking-widest">
                {label}
            </div>
        </div>
    );
}

export default function Statistics() {
    const sectionRef = useRef<HTMLElement>(null);

    const stats = [
        { value: 4, suffix: "", label: "Coffee Regions" },
        { value: 7, suffix: "", label: "Processing Stations" },
        { value: 25, suffix: "+", label: "Export Destinations" },
        { value: 10560, suffix: "+", label: "Tons Exported Yearly" },
    ];

    return (
        <section
            ref={sectionRef}
            className="section-padding bg-cream relative overflow-hidden"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a3a2a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                        Our Impact
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest mt-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Numbers That Matter
                    </h2>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <StatItem
                            key={stat.label}
                            value={stat.value}
                            suffix={stat.suffix}
                            label={stat.label}
                            delay={index * 0.15}
                        />
                    ))}
                </div>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-4 mt-16">
                    <div className="h-px w-20 bg-gold/30" />
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <div className="h-px w-20 bg-gold/30" />
                </div>
            </div>
        </section>
    );
}
