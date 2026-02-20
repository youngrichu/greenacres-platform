"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CoffeeBeansScatteredImage,
  CoffeeLeafImage,
  CoffeeBranchImage,
} from "./CoffeeDecorationsImage";
import { Linkedin, Facebook, Instagram, Music2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">(
    "idle",
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulate form submission
    setTimeout(() => setFormStatus("sent"), 1500);
  };

  return (
    <footer ref={sectionRef} id="contact" className="relative">
      {/* Contact Section */}
      <section className="section-padding bg-forest relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Premium Decorations */}
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] pointer-events-none select-none opacity-10 mix-blend-screen -rotate-45">
          <CoffeeBranchImage className="w-full h-full" />
        </div>

        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] pointer-events-none select-none opacity-5 mix-blend-screen rotate-12">
          <CoffeeBranchImage className="w-full h-full flip-x" />
        </div>

        <div className="absolute top-1/2 left-20 w-48 h-48 pointer-events-none select-none opacity-[0.03] animate-float-delayed">
          <CoffeeLeafImage className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">
              Get in Touch
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Let&apos;s Start a Partnership
            </h2>
            <p className="text-white/70 mt-4 max-w-xl mx-auto">
              Interested in our premium Ethiopian coffee? Contact us for
              samples, pricing, or partnership opportunities.
            </p>
          </div>

          {/* Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 max-w-2xl mx-auto"
          >
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                  placeholder="ethiocof@greenacrescoffee.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/80 text-sm mb-2">
                Company
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                placeholder="Your company name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/80 text-sm mb-2">
                Inquiry Type
              </label>
              <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-gold transition-colors">
                <option value="samples" className="text-forest">
                  Request Samples
                </option>
                <option value="pricing" className="text-forest">
                  Pricing Information
                </option>
                <option value="partnership" className="text-forest">
                  Partnership Opportunity
                </option>
                <option value="other" className="text-forest">
                  Other
                </option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-white/80 text-sm mb-2">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Tell us about your requirements..."
              />
            </div>

            <button
              type="submit"
              disabled={formStatus !== "idle"}
              className="w-full py-4 bg-gold text-forest font-semibold rounded-lg hover:bg-gold-light transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {formStatus === "idle" && (
                <>
                  Send Inquiry
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
              {formStatus === "sending" && (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </>
              )}
              {formStatus === "sent" && (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Message Sent!
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer bottom */}
      <div className="bg-coffee-dark py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <Image
                src="/logo.svg"
                alt="Green Acres Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-white font-semibold">
                Green Acres Industrial PLC
              </span>
              <span className="block text-white/50 text-xs">
                ethiocof@greenacrescoffee.com
              </span>
              <span className="block text-white/50 text-xs">
                Addis Ababa, Ethiopia
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <a href="#home" className="hover:text-gold transition-colors">
              Home
            </a>
            <a href="#coffee" className="hover:text-gold transition-colors">
              Our Coffee
            </a>
            <a href="#regions" className="hover:text-gold transition-colors">
              Regions
            </a>
            <a href="#contact" className="hover:text-gold transition-colors">
              Contact
            </a>
          </div>

          {/* Social / Certifications */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Music2 className="w-5 h-5" />
              </a>
            </div>
            <div className="flex gap-2">
              {["ECX", "FT", "RA"].map((cert) => (
                <span
                  key={cert}
                  className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Green Acres Industrial PLC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
