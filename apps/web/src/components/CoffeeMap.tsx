"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin, MousePointerClick } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { CoffeeBranchImage, CoffeeLeafImage } from "./CoffeeDecorationsImage";

gsap.registerPlugin(ScrollTrigger);

// ── Dynamically import the Leaflet component (client-only, never SSR) ──────────
const EthiopiaLeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl animate-pulse">
      <div className="text-gold/50 text-sm font-medium tracking-widest uppercase">
        Loading map…
      </div>
    </div>
  ),
});

// ── Region data ───────────────────────────────────────────────────────────────
interface CoffeeRegion {
  id: string;
  name: string;
  altitude: string;
  process: string[];
  flavor: string[];
  description: string;
}

const coffeeRegions: CoffeeRegion[] = [
  {
    id: "yirgacheffe",
    name: "Yirgacheffe",
    altitude: "1,750 – 2,200m",
    process: ["Washed", "Natural"],
    flavor: ["Floral", "Citrus", "Bergamot", "Tea-like"],
    description:
      "The birthplace of coffee. Yirgacheffe produces exceptionally clean, bright coffees with distinctive floral and citrus notes that have made Ethiopian coffee world-famous.",
  },
  {
    id: "sidama",
    name: "Sidama",
    altitude: "1,500 – 2,200m",
    process: ["Washed", "Natural", "Honey"],
    flavor: ["Berry", "Wine", "Chocolate", "Citrus"],
    description:
      "Known for complex, wine-like acidity and rich berry notes. Sidama coffees are prized for their balanced sweetness and velvety body.",
  },
  {
    id: "guji",
    name: "Guji",
    altitude: "1,800 – 2,300m",
    process: ["Natural", "Washed"],
    flavor: ["Stone Fruit", "Jasmine", "Honey", "Complex"],
    description:
      "A newer specialty region producing intensely fruity and complex coffees with exceptional cup quality that rivals Yirgacheffe.",
  },
  {
    id: "jimma",
    name: "Jimma",
    altitude: "1,400 – 2,000m",
    process: ["Natural", "Washed"],
    flavor: ["Earthy", "Spicy", "Full-bodied", "Wild"],
    description:
      "The largest coffee-producing region in Ethiopia, known for wild forest coffees with earthy, spicy character and bold flavor.",
  },
  {
    id: "kaffa",
    name: "Kaffa",
    altitude: "1,450 – 2,100m",
    process: ["Washed", "Natural"],
    flavor: ["Winey", "Chocolate", "Berry", "Spice"],
    description:
      "The historic home of Arabica coffee. Kaffa produces complex, winey coffees with rich chocolate undertones and deep spice notes.",
  },
  {
    id: "teppi",
    name: "Teppi",
    altitude: "1,100 – 1,900m",
    process: ["Natural"],
    flavor: ["Wild", "Herbal", "Citrus", "Nutty"],
    description:
      "A distinct low-to-mid elevation region producing coffees with wild, herbal notes and a unique low-acidity profile.",
  },
  {
    id: "andrecha",
    name: "Andrecha",
    altitude: "1,500 – 2,000m",
    process: ["Natural"],
    flavor: ["Sweet", "Fruity", "Full body", "Spice"],
    description:
      "An emerging specialty region known for sweet, full-bodied natural coffees with intense fruity characteristics.",
  },
  {
    id: "limmu",
    name: "Limmu",
    altitude: "1,400 – 2,200m",
    process: ["Washed"],
    flavor: ["Wine", "Spice", "Floral", "Sweet"],
    description:
      "Produces refined washed coffees with wine-like acidity and floral complexity. Highly sought after by specialty roasters.",
  },
  {
    id: "lekempti",
    name: "Lekempti",
    altitude: "1,500 – 2,100m",
    process: ["Natural", "Washed"],
    flavor: ["Fruity", "Blueberry", "Winey", "Bold"],
    description:
      "Known for distinctive fruity naturals with intense blueberry notes and bold, winey sweetness that stands out in any blend.",
  },
  {
    id: "harar",
    name: "Harar",
    altitude: "1,400 – 2,100m",
    process: ["Natural"],
    flavor: ["Blueberry", "Wine", "Mocha", "Exotic"],
    description:
      "One of Ethiopia's oldest and most legendary coffee regions. Harar naturals are prized worldwide for their distinctive wild blueberry, wine, and mocha character.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function CoffeeMap() {
  const [activeRegion, setActiveRegion] = useState<CoffeeRegion | null>(null);
  // Tracks whether the user has clicked yet — stops auto-cycling and hides hint
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const cycleIndexRef = useRef(0);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRegionClick = useCallback(
    (regionId: string) => {
      const region = coffeeRegions.find((r) => r.id === regionId) ?? null;
      setActiveRegion(region);

      // Stop auto-cycling and dismiss hint on first real click
      if (!hasInteracted) {
        setHasInteracted(true);
        setShowHint(false);
        if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
      }

      // On mobile, scroll so the info panel title is fully below the nav bar
      if (window.innerWidth < 1024 && infoPanelRef.current) {
        setTimeout(() => {
          const el = infoPanelRef.current!;
          const top = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top, behavior: "smooth" });
        }, 150);
      }
    },
    [hasInteracted],
  );

  // Auto-cycle through regions when section enters view (stops on first interaction)
  useEffect(() => {
    if (hasInteracted) return;

    const startCycle = () => {
      if (hasInteracted || cycleTimerRef.current) return;
      // Show the first region immediately
      setActiveRegion(coffeeRegions[0]);
      cycleIndexRef.current = 0;

      cycleTimerRef.current = setInterval(() => {
        if (hasInteracted) {
          if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
          return;
        }
        cycleIndexRef.current =
          (cycleIndexRef.current + 1) % coffeeRegions.length;
        setActiveRegion(coffeeRegions[cycleIndexRef.current]);
      }, 2500);
    };

    // Use IntersectionObserver so cycling only begins once visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Small delay so map tiles have time to render first
          setTimeout(startCycle, 800);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [hasInteracted]);

  // GSAP scroll entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mapContainerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="regions"
      className="section-padding bg-forest relative overflow-hidden"
    >
      {/* ── Background decorations ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,168,83,0.4) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-16 -right-20 w-[420px] h-[420px] opacity-[0.08] rotate-[170deg] mix-blend-screen">
          <CoffeeBranchImage className="w-full h-full" />
        </div>
        <div className="absolute -bottom-12 -left-16 w-[350px] h-[350px] opacity-[0.07] rotate-45 mix-blend-screen">
          <CoffeeLeafImage className="w-full h-full" />
        </div>
        <div className="absolute inset-0 grain-texture" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            Coffee Origins
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ethiopian Coffee Regions
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Explore the legendary coffee-growing regions of Ethiopia, each
            shaped by its own unique terroir and flavor signature.
          </p>
        </div>

        {/* ── Map + Info Grid ────────────────────────────────────────────── */}
        <div
          ref={mapContainerRef}
          className="flex flex-col lg:grid lg:grid-cols-5 gap-8 items-start"
        >
          {/* Map — full-width on mobile, 3/5 on desktop */}
          <div className="lg:col-span-3 w-full">
            {/* Map wrapper — position relative so hint badge can sit inside */}
            <div className="relative">
              {/* Fixed height on mobile so Ethiopia is fully visible */}
              <div
                className="w-full rounded-xl overflow-hidden"
                style={{ height: "clamp(420px, 50vh, 580px)" }}
              >
                <EthiopiaLeafletMap
                  activeRegionId={activeRegion?.id ?? null}
                  onRegionClick={handleRegionClick}
                />
              </div>

              {/* ── Hint badge ──────────────────────────────────────────────
                  Floats over the bottom-left of the map.
                  Pulses to draw attention, then fades out on first click.
              ── */}
              {showHint && (
                <div
                  className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2
                             bg-forest/90 border border-gold/40 backdrop-blur-sm
                             px-3 py-2 rounded-full shadow-lg
                             animate-fade-in pointer-events-none
                             transition-opacity duration-700"
                  style={{
                    animation: "hint-pulse 2s ease-in-out infinite",
                  }}
                >
                  <MousePointerClick className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span className="text-white/80 text-xs font-medium tracking-wide whitespace-nowrap">
                    Click a region to explore
                  </span>
                  {/* Pulsing ring behind the icon */}
                  <span className="absolute -left-1 -top-1 w-5 h-5 rounded-full bg-gold/20 animate-ping" />
                </div>
              )}
            </div>

            {/* Mobile region button strip */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 lg:hidden">
              {coffeeRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionClick(region.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    activeRegion?.id === region.id
                      ? "bg-gold text-forest"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info Panel — 2/5 on desktop, full-width stacked on mobile */}
          <div ref={infoPanelRef} className="lg:col-span-2 w-full scroll-mt-6">
            <div
              className={`glass-dark rounded-2xl p-6 sm:p-8 transition-all duration-500 lg:sticky lg:top-24 ${
                activeRegion ? "opacity-100" : "opacity-70"
              }`}
            >
              {activeRegion ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-3 h-3 rounded-full bg-gold animate-pulse" />
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-white"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {activeRegion.name}
                    </h3>
                  </div>

                  <p className="text-white/80 mb-8 leading-relaxed text-base sm:text-lg">
                    {activeRegion.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                        Altitude
                      </span>
                      <p className="text-white text-base sm:text-lg font-semibold mt-1">
                        {activeRegion.altitude}
                      </p>
                    </div>
                    <div>
                      <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                        Processing
                      </span>
                      <p className="text-white text-base sm:text-lg font-semibold mt-1">
                        {activeRegion.process.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                      Flavor Profile
                    </span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeRegion.flavor.map((note) => (
                        <Badge
                          key={note}
                          variant="outline"
                          className="border-gold/40 text-gold bg-gold/10 hover:bg-gold/20"
                        >
                          {note}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 text-gold font-semibold hover:underline"
                    >
                      Request samples from {activeRegion.name}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-gold" />
                  </div>
                  <p className="text-white/60 text-lg">
                    Click or tap a region on the map to explore its unique
                    coffee characteristics
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
