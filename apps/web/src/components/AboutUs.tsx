"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CoffeeBranchImage, CoffeeLeafImage } from "./CoffeeDecorationsImage";
import { Badge } from "@/components/ui/badge";
import { Eye, Target, Sparkles, MapPin, Sprout, Globe, User, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
    name: string;
    role: string;
    bio: string;
}

const team: TeamMember[] = [
    {
        name: "Sisay Abebe Mulugeta",
        role: "Chief Executive Officer",
        bio: "Steering the company with strategic vision and global insight.",
    },
    {
        name: "Tesfaye Teka",
        role: "Head of Logistics",
        bio: "Overseeing efficient supply chain and logistics operations worldwide.",
    },
    {
        name: "Birhanu Abeje",
        role: "Coffee Quality Grader",
        bio: "Conducting professional coffee cuppings for green and roasted beans.",
    },
    {
        name: "Tsedeniya",
        role: "Documentation Officer",
        bio: "Preparing and organizing shipping documents, invoices, and certificates.",
    },
    {
        name: "Genet Nekatibeb",
        role: "Account Head",
        bio: "Preparing, reviewing, and analyzing financial statements and budgets.",
    },
];

const values = [
    {
        title: "Quality Excellence",
        description: "Strict physical inspection and regular cupping ensure only the finest beans reach our partners.",
        icon: Sparkles,
    },
    {
        title: "Full Traceability",
        description: "Lot traceability from origin to export with transparent documentation and shipment consistency.",
        icon: MapPin,
    },
    {
        title: "Sustainable Growth",
        description: "Empowering farmers through fair trade practices and building long-term supplier relationships.",
        icon: Sprout,
    },
    {
        title: "Global Reach",
        description: "Flexible export solutions via FOB Djibouti, with CAD, LC, and repeat-buyer arrangements.",
        icon: Globe,
    },
];

export default function AboutUs() {
    const sectionRef = useRef<HTMLElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate headers visibility
            gsap.from(".about-header-item", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            // Animate team cards
            const cards = teamRef.current?.querySelectorAll(".team-card");
            if (cards) {
                cards.forEach((card, index) => {
                    gsap.fromTo(
                        card,
                        { scale: 0.9, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: "back.out(1.7)",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 90%",
                            }
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
            id="about"
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
                {/* Introduction */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="about-header-item">
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

                    <div className="relative about-header-item">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                            <Image
                                src="/assets/story/warehouse-processing.png" // Placeholder for high-quality image
                                alt="Greenacres Coffee Processing Center"
                                fill
                                className="object-cover transition-transform duration-1000 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-white text-xl font-playfair italic">
                                    &quot;Our mission is to source and export premium Ethiopian coffee with care, transparency, and integrity.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <div className="glass-cream p-12 rounded-3xl border border-gold/10 about-header-item">
                        <div className="w-12 h-12 rounded-full bg-gold text-forest flex items-center justify-center mb-6">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-forest mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Our Vision</h3>
                        <p className="text-foreground-muted leading-relaxed">
                            To become one of Ethiopia&apos;s most trusted and innovative coffee exporters,
                            recognized globally for quality excellence, integrity, and sustainable partnerships.
                        </p>
                    </div>
                    <div className="glass-cream p-12 rounded-3xl border border-forest/10 about-header-item">
                        <div className="w-12 h-12 rounded-full bg-forest text-gold flex items-center justify-center mb-6">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-forest mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Our Mission</h3>
                        <ul className="space-y-3 text-foreground-muted">
                            <li className="flex gap-2"><span className="text-gold">•</span> Empower farmers and local suppliers through fair trade practices.</li>
                            <li className="flex gap-2"><span className="text-gold">•</span> Ensure consistent quality through rigorous cupping and grading standards.</li>
                            <li className="flex gap-2"><span className="text-gold">•</span> Meet global demand with reliable logistics and exceptional service.</li>
                        </ul>
                    </div>
                </div>

                {/* Values / Why Partner */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        The Green Acres Difference
                    </h2>
                    <p className="text-foreground-muted max-w-2xl mx-auto">
                        Why international roasters choose us as their preferred Ethiopian partner.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                    {values.map((v, i) => (
                        <div key={i} className="about-header-item text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-forest">
                                <v.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-forest mb-2">{v.title}</h4>
                            <p className="text-sm text-foreground-muted leading-relaxed">{v.description}</p>
                        </div>
                    ))}
                </div>

                {/* Team */}
                <div className="text-center mb-20">
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                        The People
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest mt-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Meet Our Experts
                    </h2>
                    <p className="text-foreground-muted mt-4 max-w-2xl mx-auto">
                        A dedicated team of professionals committed to delivering the spirit of Ethiopian coffee to your cup.
                    </p>
                </div>

                <div ref={teamRef} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {team.map((member, i) => (
                        <div key={member.name} className="team-card group relative bg-white rounded-3xl p-6 shadow-xl shadow-forest/5 border border-cream-dark transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-square rounded-2xl bg-cream-dark mb-6 overflow-hidden relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-forest/5 group-hover:bg-gold/10 transition-colors" />
                                <User className="w-16 h-16 text-forest/20 group-hover:text-forest/40 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-forest group-hover:text-gold transition-colors duration-300">
                                {member.name}
                            </h4>
                            <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">
                                {member.role}
                            </p>
                            <p className="text-foreground-muted text-xs leading-relaxed opacity-0 group-hover:opacity-100 touch-visible transition-opacity duration-500">
                                {member.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// I need to import Image from next/image, but I skipped the import to keep the code snippet compact. Adding it here.
import Image from "next/image";
