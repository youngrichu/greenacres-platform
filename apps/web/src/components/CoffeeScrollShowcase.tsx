"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { CldImage, getCldImageUrl } from "next-cloudinary";
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

export default function CoffeeScrollShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const bagContainerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);

  const counterRef = useRef<HTMLSpanElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);

  // Mutable refs for scroll state
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isPinnedRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const touchStartYRef = useRef(0);

  const { user, loading } = useAuth();
  const [coffeeIds, setCoffeeIds] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState(true);
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

  // Using native Next.js loading logic instead of manual preloader

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

      // ── Background Color Blocks Sliding Transition (Bennett style) ──
      if (bgContainerRef.current) {
        const layers = bgContainerRef.current.querySelectorAll(".bg-layer");
        const isMobile = window.innerWidth < 768;

        // Kill existing layer tweens to prevent clashes
        layers.forEach((layer) => {
          const rightPanel = layer.querySelector(".bg-right-panel");
          const blocks = layer.querySelectorAll(".bg-block");
          if (rightPanel) gsap.killTweensOf(rightPanel);
          if (blocks) gsap.killTweensOf(blocks);
        });

        const animSets = [
          // Index 0: combinations of up/down/left/right
          {
            top: { axis: "y", dir: -1 },
            bl: { axis: "x", dir: -1 },
            br: { axis: "y", dir: 1 },
            right: { axis: "x", dir: 1 },
          },
          // Index 1
          {
            top: { axis: "y", dir: 1 },
            bl: { axis: "y", dir: 1 },
            br: { axis: "x", dir: -1 },
            right: { axis: "y", dir: -1 },
          },
          // Index 2
          {
            top: { axis: "x", dir: -1 },
            bl: { axis: "y", dir: -1 },
            br: { axis: "x", dir: 1 },
            right: { axis: "x", dir: 1 },
          },
          // Index 3
          {
            top: { axis: "y", dir: -1 },
            bl: { axis: "x", dir: 1 },
            br: { axis: "y", dir: -1 },
            right: { axis: "y", dir: 1 },
          },
        ];

        const getAnim = (idx: number) => animSets[idx % animSets.length];

        layers.forEach((layer, i) => {
          const el = layer as HTMLElement;
          const rightPanel = el.querySelector(".bg-right-panel");
          const topBlock = el.querySelector(".top-block");
          const blBlock = el.querySelector(".bottom-left-block");
          const brBlock = el.querySelector(".bottom-right-block");

          // Ensure starting clean state on other elements
          if (i !== index && i !== prevIndex) {
            gsap.set(el, { visibility: "hidden", zIndex: 1 });
          }

          if (i === index) {
            // Incoming layer
            gsap.set(el, { visibility: "visible", zIndex: 2 });
            const incomeAnim = getAnim(index);
            const dur = isMobile ? 0.7 : 0.9;

            if (topBlock) {
              gsap.fromTo(
                topBlock,
                {
                  xPercent: 0,
                  yPercent: 0,
                  [`${incomeAnim.top.axis}Percent`]:
                    incomeAnim.top.dir * 100 * direction,
                },
                {
                  [`${incomeAnim.top.axis}Percent`]: 0,
                  duration: dur,
                  ease: "power3.out",
                },
              );
            }
            if (blBlock) {
              gsap.fromTo(
                blBlock,
                {
                  xPercent: 0,
                  yPercent: 0,
                  [`${incomeAnim.bl.axis}Percent`]:
                    incomeAnim.bl.dir * 100 * direction,
                },
                {
                  [`${incomeAnim.bl.axis}Percent`]: 0,
                  duration: dur + 0.1,
                  ease: "power3.out",
                },
              );
            }
            if (brBlock) {
              gsap.fromTo(
                brBlock,
                {
                  xPercent: 0,
                  yPercent: 0,
                  [`${incomeAnim.br.axis}Percent`]:
                    incomeAnim.br.dir * 100 * direction,
                },
                {
                  [`${incomeAnim.br.axis}Percent`]: 0,
                  duration: dur + 0.05,
                  ease: "power3.out",
                },
              );
            }
            if (rightPanel) {
              gsap.fromTo(
                rightPanel,
                {
                  xPercent: 0,
                  yPercent: 0,
                  [`${incomeAnim.right.axis}Percent`]:
                    incomeAnim.right.dir * 100 * direction,
                },
                {
                  [`${incomeAnim.right.axis}Percent`]: 0,
                  duration: dur,
                  ease: "power3.out",
                },
              );
            }
          } else if (i === prevIndex && el.style.visibility !== "hidden") {
            // Outgoing layer
            const outgoAnim = getAnim(prevIndex < 0 ? 0 : prevIndex);
            const dur = isMobile ? 0.6 : 0.8;

            if (topBlock) {
              gsap.to(topBlock, {
                [`${outgoAnim.top.axis}Percent`]:
                  outgoAnim.top.dir * -100 * direction,
                duration: dur,
                ease: "power2.inOut",
              });
            }
            if (blBlock) {
              gsap.to(blBlock, {
                [`${outgoAnim.bl.axis}Percent`]:
                  outgoAnim.bl.dir * -100 * direction,
                duration: dur + 0.05,
                ease: "power2.inOut",
              });
            }
            if (brBlock) {
              gsap.to(brBlock, {
                [`${outgoAnim.br.axis}Percent`]:
                  outgoAnim.br.dir * -100 * direction,
                duration: dur - 0.05,
                ease: "power2.inOut",
              });
            }
            if (rightPanel) {
              gsap.to(rightPanel, {
                [`${outgoAnim.right.axis}Percent`]:
                  outgoAnim.right.dir * -100 * direction,
                duration: dur,
                ease: "power2.inOut",
                onComplete: () => {
                  gsap.set(el, { visibility: "hidden", zIndex: 1 });
                  // Reset transforms so they are ready for next time
                  gsap.set([topBlock, blBlock, brBlock, rightPanel], {
                    xPercent: 0,
                    yPercent: 0,
                  });
                },
              });
            }
          }
        });
      }

      // ── Jute bag image pulling transition (Bennett style) ──
      if (bagContainerRef.current) {
        const isMobile = window.innerWidth < 768;
        const bags = bagContainerRef.current.querySelectorAll(".jute-bag-img");

        // Kill all competing bag tweens first
        bags.forEach((bag) => gsap.killTweensOf(bag));

        bags.forEach((bag, i) => {
          const el = bag as HTMLElement;
          if (i === index) {
            // Incoming bag: starts off-screen (bottom if scrolling down, top if scrolling up)
            // and slides into the center. Wait for the outgoing bag to mostly clear.
            const delay = isMobile ? 0.4 : 0.6;
            gsap.set(el, { visibility: "visible", zIndex: 2 });
            gsap.fromTo(
              el,
              {
                yPercent: direction === 1 ? 100 : -100,
                opacity: 0,
              },
              {
                yPercent: 0,
                opacity: 1,
                duration: isMobile ? 0.7 : 0.9,
                delay: delay,
                ease: "power3.out",
              },
            );
          } else if (el.style.visibility !== "hidden") {
            // Outgoing bag: slides off-screen (top if scrolling down, bottom if scrolling up)
            // matching the natural pull of the scroll.
            gsap.to(el, {
              yPercent: direction === 1 ? -100 : 100,
              opacity: 0,
              duration: isMobile ? 0.6 : 0.8,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(el, { visibility: "hidden", zIndex: 1, yPercent: 0 });
              },
            });
          }
        });
      }

      // ── Staggered content entrance (Bennett style pulling) ──
      if (detailsRef.current) {
        const isMobile = window.innerWidth < 768;
        const panels = detailsRef.current.querySelectorAll(".detail-panel");

        // Kill competing panel tweens
        panels.forEach((panel) => {
          gsap.killTweensOf(panel);
          const children = panel.querySelectorAll(".stagger-item");
          children.forEach((child) => gsap.killTweensOf(child));
        });

        panels.forEach((panel, i) => {
          const el = panel as HTMLElement;
          if (i === index) {
            gsap.set(el, { visibility: "visible", opacity: 1 });
            el.style.display = "flex";
            const children = el.querySelectorAll(".stagger-item");
            // Text staggers in from the direction of scroll, delayed to clear old text
            const delay = isMobile ? 0.3 : 0.5;
            gsap.fromTo(
              children,
              { yPercent: direction === 1 ? 80 : -80, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: isMobile ? 0.5 : 0.7,
                delay: delay,
                stagger: isMobile ? 0.04 : 0.08,
                ease: "power3.out",
              },
            );
          } else if (el.style.visibility !== "hidden") {
            const children = el.querySelectorAll(".stagger-item");
            // Text pulls out in the direction of scroll
            gsap.to(children, {
              yPercent: direction === 1 ? -80 : 80,
              opacity: 0,
              duration: isMobile ? 0.4 : 0.6,
              stagger: isMobile ? 0.02 : 0.04,
              ease: "power2.in",
              onComplete: () => {
                el.style.display = "none";
                gsap.set(el, { visibility: "hidden", opacity: 1 });
                gsap.set(children, { yPercent: 0, opacity: 1 }); // reset for next entry
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
          gsap.killTweensOf(innerContentRef.current);
          gsap.to(innerContentRef.current, {
            yPercent: 0,
            duration: 0.6,
            ease: "power2.out",
          });
          const lenis = getLenisInstance();
          if (lenis) lenis.stop();
        },
        onLeave: () => {
          // ── Bennett Tea-style exit ──
          // As the user scrolls past the final slide the entire inner content
          // gently glides upward — same slow elegance as bennett-tea.com.
          isPinnedRef.current = false;
          gsap.killTweensOf(innerContentRef.current);
          gsap.to(innerContentRef.current, {
            yPercent: -22,
            duration: 1.8,
            ease: "power2.inOut",
          });
          const lenis = getLenisInstance();
          if (lenis) lenis.start();
        },
        onEnterBack: () => {
          // Smoothly glide back when scrolling back into the section
          isPinnedRef.current = true;
          gsap.killTweensOf(innerContentRef.current);
          gsap.to(innerContentRef.current, {
            yPercent: 0,
            duration: 1.0,
            ease: "power3.out",
          });
          const lenis = getLenisInstance();
          if (lenis) lenis.stop();
        },
        onLeaveBack: () => {
          isPinnedRef.current = false;
          gsap.killTweensOf(innerContentRef.current);
          gsap.set(innerContentRef.current, { yPercent: 0 });
          const lenis = getLenisInstance();
          if (lenis) lenis.start();
        },
      });

      scrollTriggerRef.current = st;

      // True parallax for the background images
      gsap.to(".flavor-bg-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: `+=${total * 100}vh`,
          scrub: true,
        },
      });

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
    <div ref={wrapperRef} className="relative z-20 bg-cream">
      <section
        ref={sectionRef}
        id="coffee"
        className="relative z-20 w-full h-[100dvh] overflow-hidden bg-cream"
      >
        {/* ── All interior content wrapped for parallax exit ── */}
        <div ref={innerContentRef} className="absolute inset-0">
          {/* ═══ SPLIT BACKGROUND (Bennett Style Blocks) ═══ */}
          <div
            ref={bgContainerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            {coffees.map((coffee, i) => (
              <div
                key={coffee.name}
                className="bg-layer absolute inset-0 flex flex-col md:flex-row"
                style={{
                  visibility: i === 0 ? "visible" : "hidden",
                  zIndex: i === 0 ? 2 : 1,
                }}
              >
                {/* Left Panel: 1 Top Block, 2 Bottom Square-ish Blocks + Flavor Overlay */}
                <div className="w-full h-[50%] md:w-1/2 md:h-full flex flex-col relative overflow-hidden">
                  <div
                    className="bg-block top-block absolute top-0 left-0 w-full h-[65%]"
                    style={{ backgroundColor: coffee.gradientColors[0] }}
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[35%] flex flex-row">
                    <div
                      className="bg-block bottom-left-block flex-1 h-full"
                      style={{ backgroundColor: coffee.gradientColors[1] }}
                    />
                    <div
                      className="bg-block bottom-right-block flex-1 h-full"
                      style={{ backgroundColor: coffee.gradientColors[2] }}
                    />
                  </div>
                  {/* Flavor image overlaid on the color blocks */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${getCldImageUrl({ src: coffee.flavorImage })})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.08,
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>

                {/* Right Panel: Solid Color */}
                <div
                  className="bg-right-panel w-full h-[50%] md:w-1/2 md:h-full"
                  style={{ backgroundColor: coffee.bgRight }}
                />
              </div>
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
          <div className="absolute bottom-[3%] left-4 md:bottom-8 md:left-10 z-30 flex items-end gap-1">
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
          <div className="relative z-10 h-full flex flex-col md:flex-row">
            {/* TOP/LEFT: Jute Bag Image */}
            <div className="w-full h-[50%] md:w-1/2 md:h-full flex items-center justify-center relative px-8 md:px-4 pt-[72px] md:pt-0">
              {/* Shadow layer */}
              <div className="absolute bottom-[4%] md:bottom-[12%] left-1/2 -translate-x-1/2 w-[50%] md:w-[45%] h-4 md:h-10 bg-black/25 rounded-[50%] blur-xl md:blur-2xl" />

              <div
                ref={bagContainerRef}
                className="relative h-[95%] md:h-[80%] aspect-square"
              >
                {coffees.map((coffee, i) => (
                  <div
                    key={coffee.name}
                    className="jute-bag-img absolute inset-0"
                    style={{
                      visibility: i === 0 ? "visible" : "hidden",
                      opacity: i === 0 ? 1 : 0,
                      willChange: "transform, opacity",
                      zIndex: i === 0 ? 2 : 1,
                    }}
                  >
                    <CldImage
                      src={coffee.juteBagImage}
                      alt={`${coffee.name} jute bag`}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM/RIGHT: Product Details */}
            <div className="w-full h-[50%] md:w-1/2 md:h-full flex items-center justify-center md:justify-start px-6 md:pl-16 md:pr-20 relative z-10">
              <div
                ref={detailsRef}
                className="relative w-full max-w-[95%] sm:max-w-md text-center md:text-left"
              >
                {coffees.map((coffee, i) => (
                  <div
                    key={coffee.name}
                    className="detail-panel flex-col items-center md:items-start gap-2 md:gap-6"
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
          <div className="absolute top-[72px] left-0 right-0 md:top-20 md:right-10 md:left-auto z-30 flex flex-col items-center md:items-end pointer-events-none px-4 md:px-0">
            <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.4em] uppercase text-forest/50 mb-0.5">
              Curated For You
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-forest/90 leading-none"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Collection
            </h2>
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
        </div>
        {/* end parallax wrapper */}
      </section>
    </div>
  );
}
