"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoffeeLeafImage, CoffeeBranchImage } from "./CoffeeDecorationsImage";

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

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = teamRef.current?.querySelectorAll(".team-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-forest-dark relative overflow-hidden text-white"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute -top-12 -left-12 w-[350px] h-[350px] opacity-[0.08]">
          <CoffeeLeafImage
            className="w-full h-full -rotate-45"
            variant="light-ink"
          />
        </div>
        <div className="absolute -bottom-16 -right-16 w-[400px] h-[400px] opacity-[0.06] rotate-180">
          <CoffeeBranchImage className="w-full h-full" variant="light-ink" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,168,83,0.4) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 grain-texture" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            The People
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Meet Our Experts
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto text-lg">
            A dedicated team of professionals committed to delivering the spirit
            of Ethiopian coffee to your cup.
          </p>
        </div>

        <div ref={teamRef} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="team-card group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10"
            >
              <div className="aspect-square rounded-2xl bg-black/20 mb-6 overflow-hidden relative flex items-center justify-center">
                <User className="w-16 h-16 text-white/20 group-hover:text-gold/80 transition-colors" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-300">
                {member.name}
              </h4>
              <p className="text-gold/80 text-xs font-semibold tracking-widest uppercase mb-4 mt-1">
                {member.role}
              </p>
              <p className="text-white/60 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
