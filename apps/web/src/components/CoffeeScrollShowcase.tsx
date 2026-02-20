"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { COFFEE_DATA } from "./coffee-data";
import { getLenisInstance } from "./providers/smooth-scroller";
import { useCoffeeScrollStore } from "@/store/useCoffeeScrollStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@greenacres/auth";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── Aurora Mesh Gradient Builder ──────────────────────────────────
// 3 soft radial-gradient blobs positioned at different corners,
// creating a Monograph-style mesh gradient from tasting-note colors.
function buildMeshGradient(c1: string, c2: string, c3: string): string {
  return [
    // Three equal-weight blobs at corners so each tasting note is visible
    `radial-gradient(ellipse 90% 90% at 10% 15%, ${c1} 0%, transparent 55%)`,
    `radial-gradient(ellipse 90% 90% at 90% 85%, ${c2} 0%, transparent 55%)`,
    `radial-gradient(ellipse 80% 80% at 85% 10%, ${c3} 0%, transparent 50%)`,
    // Opaque base blend
    `linear-gradient(160deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
  ].join(", ");
}

// ─── Image Preloader ───────────────────────────────────────────────
function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  ).then(() => {});
}

export default function CoffeeScrollShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const bagContainerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const bgLeftRef = useRef<HTMLDivElement>(null);
  const bgRightRef = useRef<HTMLDivElement>(null);
  const flavorBgRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Mutable refs for scroll state
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isPinnedRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const touchStartYRef = useRef(0);

  const { user, loading } = useAuth();
  const [coffeeIds, setCoffeeIds] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { setCurrentIndex } = useCoffeeScrollStore();

  const coffees = COFFEE_DATA;
  const total = coffees.length;

  // Fetch catalog IDs for linking
  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const { getCoffees } = await import("@greenacres/db");
        const result = await getCoffees();
        const idMap: Record<string, string> = {};
        result.forEach((coffee) => {
          idMap[coffee.name] = coffee.id;
        });
        setCoffeeIds(idMap);
      } catch (error) {
        console.error("Failed to fetch coffees:", error);
      }
    };
    fetchCoffees();
  }, []);

  // Preload all images
  useEffect(() => {
    const allImages = [
      ...coffees.map((c) => c.juteBagImage),
      ...coffees.map((c) => c.flavorImage),
    ];
    preloadImages(allImages).then(() => {
      setImagesLoaded(true);
    });
  }, [coffees]);

  // ─── Animate to a specific index ───────────────────────────────
  const animateToIndex = useCallback(
    (index: number, force = false) => {
      if (index < 0 || index >= total) return;

      const prevIndex = activeIndexRef.current;
      if (index === prevIndex && !force) return;

      const coffee = coffees[index];
      const direction = prevIndex < 0 ? 1 : index > prevIndex ? 1 : -1;

      activeIndexRef.current = index;
      setActiveIndex(index);
      setCurrentIndex(index);

      // ── Aurora mesh gradient transition ──
      if (bgLeftRef.current) {
        const [c1, c2, c3] = coffee.gradientColors;
        const mesh = buildMeshGradient(c1, c2, c3);
        gsap.to(bgLeftRef.current, {
          backgroundImage: mesh,
          duration: 1,
          ease: "power2.inOut",
        });
      }
      if (bgRightRef.current) {
        gsap.to(bgRightRef.current, {
          backgroundColor: coffee.bgRight,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }

      // ── Flavor background image transition ──
      if (flavorBgRef.current) {
        const imgs = flavorBgRef.current.querySelectorAll(".flavor-bg-img");
        imgs.forEach((img, i) => {
          const el = img as HTMLElement;
          if (i === index) {
            gsap.to(el, {
              opacity: 0.05,
              scale: 1.05,
              duration: 1,
              ease: "power2.inOut",
            });
          } else {
            gsap.to(el, {
              opacity: 0,
              scale: 1,
              duration: 0.6,
              ease: "power2.in",
            });
          }
        });
      }

      // ── Jute bag image transition ──
      if (bagContainerRef.current) {
        const isMobile = window.innerWidth < 768;
        const enterOffset = isMobile ? 60 : 120;
        const exitOffset = isMobile ? -30 : -60;
        const bags = bagContainerRef.current.querySelectorAll(".jute-bag-img");
        bags.forEach((bag, i) => {
          const el = bag as HTMLElement;
          if (i === index) {
            gsap.fromTo(
              el,
              {
                y: direction * enterOffset,
                opacity: 0,
                scale: 0.9,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: isMobile ? 0.6 : 0.9,
                ease: "power3.out",
                display: "block",
              },
            );
          } else {
            gsap.to(el, {
              y: direction * exitOffset,
              opacity: 0,
              scale: 0.95,
              duration: isMobile ? 0.35 : 0.5,
              ease: "power2.in",
              onComplete: () => {
                gsap.set(el, { display: "none" });
              },
            });
          }
        });
      }

      // ── Staggered content entrance ──
      if (detailsRef.current) {
        const isMobile = window.innerWidth < 768;
        const panels = detailsRef.current.querySelectorAll(".detail-panel");
        panels.forEach((panel, i) => {
          const el = panel as HTMLElement;
          if (i === index) {
            el.style.display = "flex";
            const tl = gsap.timeline();
            const children = el.querySelectorAll(".stagger-item");
            tl.fromTo(
              children,
              { y: isMobile ? 20 : 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: isMobile ? 0.4 : 0.6,
                stagger: isMobile ? 0.04 : 0.08,
                ease: "power3.out",
              },
            );
          } else {
            gsap.to(el, {
              opacity: 0,
              duration: isMobile ? 0.2 : 0.3,
              onComplete: () => {
                el.style.display = "none";
                gsap.set(el, { opacity: 1 });
              },
            });
          }
        });
      }

      // ── Counter animation ──
      if (counterRef.current) {
        gsap.to(counterRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(index + 1).padStart(
                2,
                "0",
              );
              gsap.fromTo(
                counterRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3 },
              );
            }
          },
        });
      }

      // ── Dot navigation highlight ──
      if (dotsRef.current) {
        const dots = dotsRef.current.querySelectorAll(".nav-dot");
        dots.forEach((dot, i) => {
          const d = dot as HTMLElement;
          if (i === index) {
            d.classList.add("active");
            gsap.to(d, { scale: 1.4, opacity: 1, duration: 0.3 });
          } else {
            d.classList.remove("active");
            gsap.to(d, { scale: 1, opacity: 0.4, duration: 0.3 });
          }
        });
      }
    },
    [coffees, total, setCurrentIndex],
  );

  // ─── GoToSlide: animate + sync scroll position ─────────────────
  const goToSlide = useCallback(
    (index: number) => {
      const st = scrollTriggerRef.current;
      if (!st) return;

      const clamped = Math.max(0, Math.min(total - 1, index));
      animateToIndex(clamped);

      // Sync scroll position to match this index
      const targetProgress = clamped / (total - 1);
      const scrollY = st.start + targetProgress * (st.end - st.start);

      // Use instant scroll (no smoothing) to move the native scroll
      // without triggering additional onUpdate cycles
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
    },
    [total, animateToIndex],
  );

  // ─── WHEEL EVENT HIJACKING ─────────────────────────────────────
  useEffect(() => {
    if (!imagesLoaded || !sectionRef.current) return;

    // Set initial state
    activeIndexRef.current = -1;
    animateToIndex(0, true);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${total * 100}vh`,
        pin: true,
        pinSpacing: true,
        onEnter: () => {
          isPinnedRef.current = true;
          // Stop Lenis smooth scrolling to prevent momentum
          const lenis = getLenisInstance();
          if (lenis) lenis.stop();
        },
        onLeave: () => {
          isPinnedRef.current = false;
          const lenis = getLenisInstance();
          if (lenis) lenis.start();
        },
        onEnterBack: () => {
          isPinnedRef.current = true;
          const lenis = getLenisInstance();
          if (lenis) lenis.stop();
        },
        onLeaveBack: () => {
          isPinnedRef.current = false;
          const lenis = getLenisInstance();
          if (lenis) lenis.start();
        },
      });

      scrollTriggerRef.current = st;

      // Refresh downstream triggers after a frame
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, wrapperRef);

    // ── Direct wheel event handler ──
    const handleWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current || isAnimatingRef.current) return;

      const currentIdx = activeIndexRef.current;
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // At boundaries: let native scroll take over
      if (goingUp && currentIdx === 0) return;
      if (goingDown && currentIdx === total - 1) return;

      // Prevent default to stop Lenis and native scroll
      e.preventDefault();
      e.stopPropagation();

      isAnimatingRef.current = true;

      const nextIdx = goingDown
        ? Math.min(currentIdx + 1, total - 1)
        : Math.max(currentIdx - 1, 0);

      goToSlide(nextIdx);

      // Debounce: block next wheel event until animation settles
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 700);
    };

    // ── Touch event handlers for mobile swipe ──
    const SWIPE_THRESHOLD = 40; // minimum px to register a swipe

    const handleTouchStart = (e: TouchEvent) => {
      if (!isPinnedRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPinnedRef.current) return;
      const currentIdx = activeIndexRef.current;
      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      const goingDown = deltaY > 0;
      const goingUp = deltaY < 0;

      // At boundaries: let native scroll take over
      if (goingUp && currentIdx === 0) return;
      if (goingDown && currentIdx === total - 1) return;

      // Only prevent default when we're handling the swipe mid-carousel
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPinnedRef.current || isAnimatingRef.current) return;

      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

      const currentIdx = activeIndexRef.current;
      const goingDown = deltaY > 0;
      const goingUp = deltaY < 0;

      // At boundaries: let native scroll take over
      if (goingUp && currentIdx === 0) return;
      if (goingDown && currentIdx === total - 1) return;

      isAnimatingRef.current = true;

      const nextIdx = goingDown
        ? Math.min(currentIdx + 1, total - 1)
        : Math.max(currentIdx - 1, 0);

      goToSlide(nextIdx);

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 600);
    };

    // Attach to window to catch all events while pinned
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      ctx.revert();

      // Ensure Lenis is restarted on cleanup
      const lenis = getLenisInstance();
      if (lenis) lenis.start();
    };
  }, [imagesLoaded, total, animateToIndex, goToSlide]);

  // ─── Dot click handler ─────────────────────────────────────────
  const handleDotClick = (index: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    goToSlide(index);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 700);
  };

  return (
    <div ref={wrapperRef}>
      <section
        ref={sectionRef}
        id="coffee"
        className="relative z-20 w-full h-[100dvh] overflow-hidden bg-cream"
      >
        {/* ═══ SPLIT BACKGROUND ═══ */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
          <div
            ref={bgLeftRef}
            className="w-full h-[45%] md:w-1/2 md:h-full"
            style={{
              backgroundImage: buildMeshGradient(...coffees[0].gradientColors),
              backgroundSize: "100% 100%",
            }}
          />
          <div
            ref={bgRightRef}
            className="w-full h-[55%] md:w-1/2 md:h-full"
            style={{ backgroundColor: coffees[0].bgRight }}
          />
        </div>

        {/* ═══ FLAVOR BACKGROUND ON RIGHT PANEL ═══ */}
        <div
          ref={flavorBgRef}
          className="absolute bottom-0 md:top-0 right-0 w-full h-[55%] md:w-1/2 md:h-full overflow-hidden pointer-events-none z-[1]"
        >
          {coffees.map((coffee, i) => (
            <div
              key={coffee.name}
              className="flavor-bg-img absolute inset-0"
              style={{
                opacity: 0,
                backgroundImage: `url(${coffee.flavorImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                mixBlendMode: "multiply",
                transform: "scale(1)",
              }}
            />
          ))}
        </div>

        {/* ═══ GRAIN TEXTURE OVERLAY ═══ */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-[2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ═══ NAVIGATION DOTS ═══ */}
        <div
          ref={dotsRef}
          className="absolute left-4 top-1/2 -translate-y-1/2 md:left-10 md:top-1/2 md:-translate-y-1/2 z-30 flex flex-col gap-3"
        >
          {coffees.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`nav-dot w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border-2 border-white/60 transition-all duration-300 cursor-pointer hover:scale-150 ${
                i === activeIndex
                  ? "bg-white scale-[1.4] opacity-100"
                  : "bg-white/30 opacity-40"
              }`}
              aria-label={`Go to ${coffees[i].name}`}
            />
          ))}
        </div>

        {/* ═══ COUNTER ═══ */}
        <div className="absolute bottom-6 left-4 md:bottom-8 md:left-10 z-30 flex items-end gap-1">
          <span
            ref={counterRef}
            className="text-4xl md:text-7xl font-bold text-white/90 leading-none"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            01
          </span>
          <span className="text-white/40 text-sm md:text-xl font-light mb-1 md:mb-2">
            / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* ═══ MAIN CONTENT GRID ═══ */}
        <div className="relative z-10 h-full flex flex-col md:flex-row pt-[4dvh] pb-[4dvh] md:pt-0 md:pb-0">
          {/* TOP/LEFT: Jute Bag Image */}
          <div className="w-full h-[48%] md:w-1/2 md:h-full flex items-center justify-center relative px-8 md:px-4">
            {/* Shadow layer */}
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[60%] md:w-[45%] h-6 md:h-10 bg-black/25 rounded-[50%] blur-xl md:blur-2xl" />

            <div
              ref={bagContainerRef}
              className="relative h-[95%] md:h-[80%] aspect-square"
            >
              {coffees.map((coffee, i) => (
                <div
                  key={coffee.name}
                  className="jute-bag-img absolute inset-0"
                  style={{
                    display: i === 0 ? "block" : "none",
                    opacity: i === 0 ? 1 : 0,
                  }}
                >
                  <Image
                    src={coffee.juteBagImage}
                    alt={`${coffee.name} jute bag`}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM/RIGHT: Product Details */}
          <div className="w-full h-[52%] md:w-1/2 md:h-full flex items-center justify-center md:justify-start px-6 md:pl-16 md:pr-20 relative z-10">
            <div
              ref={detailsRef}
              className="relative w-full max-w-lg text-center md:text-left"
            >
              {coffees.map((coffee, i) => (
                <div
                  key={coffee.name}
                  className="detail-panel flex-col items-center md:items-start gap-3 md:gap-6"
                  style={{
                    display: i === 0 ? "flex" : "none",
                  }}
                >
                  {/* Process type */}
                  <div className="stagger-item">
                    <span
                      className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase"
                      style={{ color: coffee.accentColor }}
                    >
                      {coffee.process} Process
                    </span>
                  </div>

                  {/* Coffee Name */}
                  <h2
                    className="stagger-item text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] md:leading-[1.05]"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      color: "#1a2e1a",
                    }}
                  >
                    {coffee.name}
                  </h2>

                  {/* Description */}
                  <p
                    className="stagger-item text-sm md:text-base lg:text-lg leading-snug md:leading-relaxed max-w-[95%] md:max-w-md mx-auto md:mx-0"
                    style={{ color: "#3d5c3d" }}
                  >
                    {coffee.description}
                  </p>

                  {/* Tasting Notes Grid */}
                  <div className="stagger-item flex flex-col gap-2 md:gap-3 items-center md:items-start w-full">
                    <span
                      className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase"
                      style={{ color: "#5a7a5a" }}
                    >
                      Tasting Notes
                    </span>
                    <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2">
                      {coffee.notes.map((note) => (
                        <Badge
                          key={note}
                          variant="outline"
                          className="border-[#2d4a2d]/30 bg-white/70 backdrop-blur-sm text-xs md:text-sm font-medium px-2 py-0.5 md:px-3 md:py-1.5 shadow-sm"
                          style={{ color: "#1a2e1a" }}
                        >
                          {note}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Grade */}
                  <div className="stagger-item flex items-center justify-center md:justify-start gap-3 w-full">
                    <span
                      className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase"
                      style={{ color: "#5a7a5a" }}
                    >
                      Grade
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-[#1a2e1a]/10 border border-[#1a2e1a]/20 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#1a2e1a" }}
                    >
                      {coffee.grade}
                    </Badge>
                  </div>

                  {/* CTA */}
                  <div className="stagger-item pt-1 md:pt-2 w-full flex justify-center md:justify-start">
                    {loading ? (
                      <div className="h-10 md:h-12 w-32 md:w-40 bg-forest/10 rounded-full animate-pulse" />
                    ) : user ? (
                      <Link
                        href={
                          coffeeIds[coffee.name]
                            ? `/portal/catalog/${coffeeIds[coffee.name]}`
                            : "/portal/catalog"
                        }
                      >
                        <Button
                          size="lg"
                          className="h-10 md:h-12 px-6 md:px-8 text-sm md:text-base bg-forest hover:bg-forest-light text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all gap-2"
                        >
                          View In Portal
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </Link>
                    ) : coffeeIds[coffee.name] ? (
                      <Link href={`/catalog/${coffeeIds[coffee.name]}`}>
                        <Button
                          size="lg"
                          className="h-10 md:h-12 px-6 md:px-8 text-sm md:text-base bg-forest hover:bg-forest-light text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all gap-2"
                        >
                          View Details
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="lg"
                        disabled
                        className="h-10 md:h-12 px-6 md:px-8 text-sm md:text-base bg-forest/20 text-forest/40 font-semibold rounded-full cursor-not-allowed gap-2"
                      >
                        Coming Soon
                        <Lock className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ SECTION LABEL ═══ */}
        <div className="absolute top-4 right-4 md:top-8 md:right-12 z-30">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-forest/30">
            Our Collection
          </span>
        </div>

        {/* ═══ SCROLL INDICATOR (on first load) ═══ */}
        {activeIndex === 0 && (
          <div className="absolute bottom-8 right-8 md:right-12 z-30 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-forest/40 tracking-widest uppercase">
              Scroll
            </span>
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              className="text-forest/30"
            >
              <rect
                x="1"
                y="1"
                width="14"
                height="22"
                rx="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="8" r="2" fill="currentColor">
                <animate
                  attributeName="cy"
                  values="8;16;8"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
      </section>
    </div>
  );
}
