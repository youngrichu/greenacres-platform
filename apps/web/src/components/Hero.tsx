"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial load animation
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          videoRef.current,
          { scale: 1.1 },
          { scale: 1, duration: 2, ease: "power2.inOut" },
        )
        .fromTo(
          contentRef.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          "-=1.5",
        )
        .fromTo(
          ".hero-line",
          { y: "100%", rotate: 2, opacity: 0 },
          { y: "0%", rotate: 0, opacity: 1, duration: 1, stagger: 0.15 },
          "-=1",
        );

      // Scroll Parallax
      gsap.to(contentRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(videoRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll indicator animation
      gsap.fromTo(
        ".scroll-indicator",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 2, ease: "power2.out" },
      );

      gsap.to(".scroll-chevron", {
        y: 6,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="sticky top-0 z-0 h-screen w-full flex items-center overflow-hidden bg-forest-dark"
    >
      {/* Background Video with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[120%] object-cover -mt-[10%]" // Made taller for parallax movement
        >
          <source src="/assets/videos/drone-footage.mp4" type="video/mp4" />
        </video>
        {/* Layer 1: cinematic tint */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Layer 2: gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Content — Centered Editorial Layout */}
      <div
        ref={contentRef}
        className="relative z-10 w-full px-8 md:px-16 max-w-7xl mx-auto flex flex-col justify-center h-full"
      >
        <div className="overflow-hidden mb-6">
          <p className="hero-line text-sm md:text-base uppercase tracking-[0.3em] text-white/70 font-light border-l-2 border-gold pl-4">
            Ethiopian Premium Coffee
          </p>
        </div>

        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-[7rem] font-bold text-white mb-10 leading-[0.9] tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <div className="overflow-hidden">
            <span className="hero-line block">From Highland</span>
          </div>
          <div className="overflow-hidden">
            <span className="hero-line block">Origins to the</span>
          </div>
          <div className="overflow-hidden">
            <span className="hero-line block text-gold italic">
              World&apos;s Cup
            </span>
          </div>
        </h1>

        <div className="overflow-hidden">
          <Link
            href="#coffee"
            className="hero-line inline-flex items-center gap-4 text-white hover:text-gold transition-colors duration-300 group"
          >
            <span className="text-xl md:text-2xl font-light border-b border-white/30 hover:border-gold pb-1 transition-all">
              Explore Collections
            </span>
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
              <ArrowRight className="w-5 h-5 group-hover:text-forest-dark transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer"
        style={{ opacity: 0 }}
        onClick={() => {
          const intro = document.getElementById("introduction");
          if (intro) intro.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-light">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-white/50 scroll-chevron" />
      </div>
    </section>
  );
}
