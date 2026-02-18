"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CoffeeBranchImage,
  CoffeeLeafImage,
  CoffeeBeansScatteredImage,
} from "./CoffeeDecorationsImage";

gsap.registerPlugin(ScrollTrigger);

export default function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="introduction"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-cream py-24 md:py-32"
    >
      {/* ─── Background: artistic illustrations matching site-wide style ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Coffee branch — top-left corner */}
        <div className="absolute -top-16 -left-16 w-[400px] h-[400px] opacity-[0.08] -rotate-12">
          <CoffeeBranchImage className="w-full h-full" />
        </div>

        {/* Coffee leaf — bottom-right corner */}
        <div className="absolute -bottom-12 -right-12 w-[350px] h-[350px] opacity-[0.07] rotate-[160deg]">
          <CoffeeLeafImage className="w-full h-full" />
        </div>

        {/* Scattered beans — subtle mid-right accent */}
        <div className="absolute top-1/3 -right-8 w-[200px] h-[200px] opacity-[0.05] rotate-45">
          <CoffeeBeansScatteredImage className="w-full h-full" />
        </div>

        {/* Radial gold glow — centered warmth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-gold/5 via-gold/2 to-transparent rounded-full blur-3xl" />

        {/* Dot grid — consistent with other cream sections */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #1B3D2F 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Grain texture */}
        <div className="absolute inset-0 grain-texture" />
      </div>

      <div
        className="relative z-10 max-w-4xl mx-auto text-center px-6"
        ref={textRef}
      >
        <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light mb-10">
          From the misty highlands of Yirgacheffe to the wild forests of Kaffa,
          we source and export the finest Arabica beans that define the true
          essence of Ethiopian coffee culture.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Button
            asChild
            size="lg"
            className="bg-forest hover:bg-forest-dark text-white rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Link href="/portal/catalog">Explore Premium Collections</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-forest/30 text-forest hover:bg-forest/5 rounded-full px-8 h-12 text-lg"
          >
            <Link
              href="/portal/inquiries"
              className="group flex items-center gap-2"
            >
              Inquire Now{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
