"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 4, suffix: "", label: "Coffee Regions" },
  { value: 7, suffix: "", label: "Processing Stations" },
  { value: 25, suffix: "+", label: "Export Destinations" },
  { value: 10560, suffix: "+", label: "Tons Exported Yearly" },
];

export default function Statistics() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

  // Slow video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  // Sequential animation triggered from the section
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        invalidateOnRefresh: true,
        refreshPriority: -1,
        onEnter: () => {
          circleRefs.current.forEach((el, i) => {
            if (!el) return;

            // Scale + fade in with stagger
            gsap.to(el, {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "back.out(1.7)",
              delay: i * 0.25,
            });

            // Count up with matching stagger
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stats[i].value,
              duration: 2,
              ease: "power2.out",
              delay: i * 0.25,
              onUpdate: () => {
                setCounts((prev) => {
                  const next = [...prev];
                  next[i] = Math.ceil(counter.val);
                  return next;
                });
              },
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/videos/coffe_for_numbers.mp4" type="video/mp4" />
      </video>

      {/* Cinematic overlay layers */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Impact by the Numbers
          </h2>
          <p className="text-white/70 text-lg">
            Our scale allows us to deliver consistency, while our local roots
            ensure we never lose touch with the community.
          </p>
        </div>

        {/* Circular/Cluster Layout */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-0">
          {stats.map((s, i) => (
            <div
              key={i}
              className={cn(
                "transform transition-transform lg:-ml-6 first:ml-0",
                i % 2 === 0 ? "md:translate-y-6" : "md:-translate-y-6",
              )}
            >
              <div
                ref={(el) => {
                  circleRefs.current[i] = el;
                }}
                className={cn(
                  "relative group flex flex-col items-center justify-center text-center rounded-full transition-all duration-500",
                  "w-56 h-56 md:w-64 md:h-64",
                  "bg-white/90 backdrop-blur-md hover:bg-forest hover:text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-white/30 hover:border-gold/50",
                  "mx-auto",
                )}
                style={{ opacity: 0, transform: "scale(0.5)" }}
              >
                <div className="relative z-10 p-6 flex flex-col items-center">
                  <span
                    className="text-4xl md:text-5xl font-bold mb-2 text-forest group-hover:text-gold transition-colors duration-300"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {counts[i].toLocaleString()}
                    {s.suffix}
                  </span>
                  <span className="text-xs tracking-widest uppercase font-semibold text-gold group-hover:text-white/80 transition-colors">
                    {s.label}
                  </span>
                </div>

                {/* Decorative ring */}
                <div className="absolute inset-2 border border-dashed border-black/10 rounded-full group-hover:border-white/20 transition-colors duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
