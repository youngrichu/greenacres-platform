"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CoffeeBeansScatteredImage } from "./CoffeeDecorationsImage";
import { Copy, FileText, CheckSquare, Package, Truck, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Step {
    number: string;
    title: string;
    description: string;
    icon: React.ElementType;
    duration: string;
    deliverables: string[];
}

const steps: Step[] = [
    {
        number: "01",
        title: "Request an Offer",
        description: "Browse our current harvest menu and request a detailed offer. Specify your desired volume, grade (G1-G5), and processing method.",
        icon: FileText,
        duration: "24-48 Hours",
        deliverables: ["Custom Quote", "Stock Availability"]
    },
    {
        number: "02",
        title: "Sample Approval",
        description: "We ship 300g pre-shipment samples (PSS) via DHL/FedEx for your cupping and approval before finalizing the contract.",
        icon: Copy,
        duration: "3-5 Days",
        deliverables: ["Green Coffee Sample", "Roasted Sample (Optional)"]
    },
    {
        number: "03",
        title: "Contract & Payment",
        description: "Upon sample approval, we sign the Sales Contract. You arrange payment (LC, CAD, or TT) as per the agreed terms.",
        icon: CheckSquare,
        duration: "1 Week",
        deliverables: ["Proforma Invoice", "Sales Contract"]
    },
    {
        number: "04",
        title: "Processing & QC",
        description: "Your coffee is milled, color-sorted, and hand-picked at our Addis facility. Our Q-Graders perform final quality checks.",
        icon: Package,
        duration: "10-14 Days",
        deliverables: ["ICO Certificate", "Quality Report", "Weight Note"]
    },
    {
        number: "05",
        title: "Logistics & Export",
        description: "We handle all export documentation, load the container, and transport to Djibouti port for global shipping.",
        icon: Truck,
        duration: "Ongoing",
        deliverables: ["Bill of Lading", "Packing List", "Phytosanitary Cert"]
    },
];

export default function OrderingProcess() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title Animation
            gsap.fromTo(titleRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                    }
                }
            );

            // Staggered Cards Animation
            gsap.fromTo(".step-card",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".steps-container",
                        start: "top 70%",
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="how-to-order" className="section-padding bg-forest-dark relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                <CoffeeBeansScatteredImage className="absolute top-20 right-10 w-64 h-64 rotate-12" />
                <CoffeeBeansScatteredImage className="absolute bottom-40 left-10 w-48 h-48 -rotate-45" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-gold text-sm font-bold tracking-widest uppercase mb-3 block">
                        Seamless Export Journey
                    </span>
                    <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                        From Our Warehouse to Yours
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        A transparent, streamlined process designed for international roasters and importers.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="steps-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-[10%] right-[10%] h-1 bg-gradient-to-r from-gold/10 via-gold/60 to-gold/10 rounded-full" />

                    {steps.map((step, index) => (
                        <div key={index} className="step-card group relative">
                            {/* Card Content */}
                            <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:border-gold/30 flex flex-col">

                                {/* Icon Header */}
                                <div className="mb-6 relative">
                                    <div className="w-20 h-20 rounded-2xl bg-forest-darker border border-gold/20 flex items-center justify-center text-gold shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10 mx-auto lg:mx-0">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    {/* Number Badge */}
                                    <div className="absolute -top-3 -right-3 lg:left-14 lg:right-auto w-8 h-8 rounded-full bg-gold text-forest font-bold flex items-center justify-center z-20 shadow-md">
                                        {step.number}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="text-center lg:text-left flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Footer: Timing & Deliverables */}
                                <div className="mt-auto pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-gold mb-3 uppercase tracking-wide">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                        {step.duration}
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                        {step.deliverables?.map((item, i) => (
                                            <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/50 border border-white/5">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partnership / Trade Terms Section */}
                <div className="mt-24 pt-10 border-t border-white/10">
                    <div className="glass-dark p-8 md:p-12 rounded-3xl border border-gold/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                            {/* Column 1: Header & CTA */}
                            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
                                <h4 className="text-gold text-sm font-bold uppercase tracking-widest mb-2">For Importers & Roasters</h4>
                                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                    Partner with Green Acres
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-8">
                                    We build long-term relationships based on consistency, transparency, and mutual growth.
                                    Our flexible export terms are designed to meet the needs of international buyers.
                                </p>
                                <a
                                    href="#contact"
                                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-gold text-forest font-bold rounded-full hover:bg-gold-light transition-all hover:scale-105 shadow-xl group"
                                >
                                    Start a Partnership
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>

                            {/* Column 2: Logistics & Terms */}
                            <div>
                                <h5 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-gold" />
                                    Logistics & Terms
                                </h5>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                        <div className="text-sm">
                                            <strong className="block text-white">Incoterms</strong>
                                            <span className="text-white/60">FOB Djibouti (CFR/CIF upon request)</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                        <div className="text-sm">
                                            <strong className="block text-white">Payment Options</strong>
                                            <span className="text-white/60">CAD, LC at sight, TT (Deposit + Balance)</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                        <div className="text-sm">
                                            <strong className="block text-white">Shipping capacity</strong>
                                            <span className="text-white/60">From 10 bags microlots to FCL (Full Container Loads)</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 3: Quality & Compliance */}
                            <div>
                                <h5 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-gold" />
                                    Compliance & Quality
                                </h5>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                        <div className="text-sm">
                                            <strong className="block text-white">Documentation</strong>
                                            <span className="text-white/60">ICO Certificate of Origin, Phyto, Weight/Quality Cert, Invoice & Packing List</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                        <div className="text-sm">
                                            <strong className="block text-white">Sample Policy</strong>
                                            <span className="text-white/60">Pre-shipment samples sent via DHL/FedEx for final approval</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                        <div className="text-sm">
                                            <strong className="block text-white">Bagging</strong>
                                            <span className="text-white/60">60kg Jute bags with GrainPro lining for freshness</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
