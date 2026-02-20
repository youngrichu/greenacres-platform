"use client";

import { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  CoffeeLeafImage,
  CoffeeBeansScatteredImage,
} from "./CoffeeDecorationsImage";
import { Sprout } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// HoverVideoCard
// On mouseenter: video fades in and plays.
// On mouseleave: video fades out, pauses, and rewinds to start.
// forwardRef exposes the <video> element so parents can drive the intro sequence.
// ---------------------------------------------------------------------------
interface HoverVideoCardProps {
  src: string;
  alt: string;
  videoSrc?: string;
  className?: string;
}

const HoverVideoCard = forwardRef<HTMLVideoElement, HoverVideoCardProps>(
  function HoverVideoCard({ src, alt, videoSrc, className = "" }, ref) {
    const internalRef = useRef<HTMLVideoElement>(null);
    const videoRef = (ref as React.RefObject<HTMLVideoElement>) ?? internalRef;

    const handleMouseEnter = () => {
      const video = videoRef.current;
      if (!video) return;
      video.style.opacity = "1";
      video.playbackRate = 0.5;
      video.play().catch(() => {
        // Autoplay blocked – silently ignore
      });
    };

    const handleMouseLeave = () => {
      const video = videoRef.current;
      if (!video) return;
      video.style.opacity = "0";
      // Wait for the fade-out to finish before pausing / rewinding
      setTimeout(() => {
        video.pause();
        video.currentTime = 0;
      }, 500);
    };

    return (
      <div
        className={`rounded-2xl overflow-hidden relative group ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Static image (always present) */}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Video layer – crossfades over the image on hover (or intro sequence) */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            loop
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: 0,
              transition: "opacity 500ms ease",
            }}
          />
        )}

        {/* Overlay tint */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </div>
    );
  },
);

// ---------------------------------------------------------------------------
// EthiopiaCulture
// ---------------------------------------------------------------------------
export default function EthiopiaCulture() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Refs for each card's <video> element — used by the intro sequence
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Fade-in animation for text/grid ──────────────────────────────────
      gsap.from(".culture-fade", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      // ── Intro video sequence ─────────────────────────────────────────────
      // Fires once when the grid enters the viewport.
      // Each card's video plays for ~2.5 s then fades back out, staggered.
      const videos = [
        videoRef1.current,
        videoRef2.current,
        videoRef3.current,
        videoRef4.current,
      ];

      const PREVIEW_DURATION = 2.5; // seconds each video stays visible
      const STAGGER = 0.6; // seconds between each card starting
      const FADE = 0.5; // fade in/out duration (seconds)

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 55%",
        once: true,
        onEnter: () => {
          videos.forEach((video, i) => {
            if (!video) return;

            const delay = i * STAGGER;

            // Fade in + play
            setTimeout(() => {
              video.currentTime = 0;
              video.playbackRate = 0.6;
              video.play().catch(() => {});
              gsap.to(video, {
                opacity: 1,
                duration: FADE,
                ease: "power2.out",
              });
            }, delay * 1000);

            // Fade out + pause
            setTimeout(
              () => {
                gsap.to(video, {
                  opacity: 0,
                  duration: FADE,
                  ease: "power2.in",
                  onComplete: () => {
                    video.pause();
                    video.currentTime = 0;
                  },
                });
              },
              (delay + PREVIEW_DURATION) * 1000,
            );
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className="py-32 bg-forest relative overflow-hidden text-white"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm26 18c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
        <CoffeeLeafImage className="w-full h-full -rotate-45" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Image / Video Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 culture-fade">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Ceremony → roasting.mp4 */}
              <HoverVideoCard
                ref={videoRef1}
                src="/assets/heritage/coffee-ceremony-1.png"
                alt="Traditional Ethiopian Coffee Ceremony"
                videoSrc="https://greenacres-coffee.b-cdn.net/assets/videos/roasting.mp4"
                className="aspect-[3/4]"
              />
              {/* Landscape → coffee_highland.mp4 */}
              <HoverVideoCard
                ref={videoRef2}
                src="/assets/heritage/coffee-origin-landscape.png"
                alt="Ethiopian Highlands Landscape"
                videoSrc="https://greenacres-coffee.b-cdn.net/assets/videos/coffee_highland.mp4"
                className="aspect-square"
              />
            </div>

            {/* Column 2 (offset top) */}
            <div className="pt-12 space-y-4">
              {/* Roasting beans → coffee_roasting.mp4 */}
              <HoverVideoCard
                ref={videoRef3}
                src="/assets/heritage/coffee-beans-roasting.png"
                alt="Traditional Roasting"
                videoSrc="https://greenacres-coffee.b-cdn.net/assets/videos/coffee_roasting.mp4"
                className="aspect-square"
              />
              {/* Hands → coffee_hand.mp4 */}
              <HoverVideoCard
                ref={videoRef4}
                src="/assets/heritage/cultural-hands.png"
                alt="Coffee harvesting by hand"
                videoSrc="https://greenacres-coffee.b-cdn.net/assets/videos/coffee_hand.mp4"
                className="aspect-[3/4]"
              />
            </div>
          </div>

          {/* Right Side: Content */}
          <div ref={contentRef} className="lg:col-span-5 culture-fade">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-gold/50"></div>
              <span className="text-gold text-xs font-bold tracking-[0.25em] uppercase">
                Land of Origins
              </span>
            </div>

            <h2
              className="text-5xl md:text-6xl font-serif text-white mb-10 leading-[1.1]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              The Heart of <br />
              <span className="italic text-white/80">Coffee Culture</span>
            </h2>

            <div className="space-y-8 text-white/80 text-lg leading-relaxed font-light">
              <p>
                Ethiopia is not just where coffee began; it is where coffee
                remains a sacred ritual. In every village, the{" "}
                <strong className="text-white font-medium">
                  Abol, Tona, and Baraka
                </strong>{" "}
                — the three rounds of the traditional coffee ceremony — bind
                families and communities together.
              </p>
              <p>
                At Green Acres, we carry this heritage in every bean. We believe
                that exporting coffee is about sharing a culture that has
                perfected the art of the bean for over a thousand years.
              </p>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <Sprout className="w-8 h-8 text-gold group-hover:text-forest-dark transition-colors" />
                </div>
                <div>
                  <h4 className="text-white text-lg font-serif mb-1 group-hover:text-gold transition-colors">
                    Preserving the Legacy
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                    Sustainable sourcing from the wild forests of Kaffa and the
                    highlands of Yirgacheffe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 w-48 h-48 opacity-10 pointer-events-none">
        <CoffeeBeansScatteredImage className="w-full h-full rotate-12" />
      </div>
    </section>
  );
}
