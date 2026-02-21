"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@greenacres/auth";
import { useLenis } from "@/components/providers/smooth-scroller";
import { User, LogOut, LayoutDashboard } from "lucide-react";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#heritage", label: "Heritage" },
  { href: "#about", label: "About" },
  { href: "#regions", label: "Regions" },
  { href: "#coffee", label: "Our Coffee" },
  { href: "/how-to-order", label: "How to Order", isPage: true },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const lenis = useLenis();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();

      if (href === "#hero") {
        if (lenis) {
          lenis.scrollTo(0, { offset: 0 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        const target = document.querySelector(href);
        if (target) {
          if (lenis) {
            lenis.scrollTo(target as HTMLElement, { offset: 0 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-forest/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              if (lenis) lenis.scrollTo(0, { offset: 0 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
              setIsMobileMenuOpen(false);
            }
          }}
          className="flex items-center gap-3 md:gap-4 group"
        >
          <div
            className={`relative transition-all duration-500 group-hover:scale-105 shrink-0 ${
              isScrolled
                ? "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                : "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
            }`}
          >
            <Image
              src="/logo_golden.svg"
              alt="Green Acres Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-semibold text-lg tracking-tight">
              Green Acres
            </span>
            <span className="block text-gold text-xs tracking-widest uppercase">
              Premium Coffee
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const href =
              link.href.startsWith("#") && pathname !== "/"
                ? `/${link.href}`
                : link.href;

            return (
              <Link
                key={link.label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="text-white/80 hover:text-gold transition-colors text-sm font-semibold tracking-wide uppercase"
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth buttons */}
          {!loading &&
            (user ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 text-gold rounded-full hover:bg-gold/20 transition-all text-sm font-semibold"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">
                    {user.companyName || user.email}
                  </span>
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-forest-dark border border-gold/20 rounded-xl shadow-xl overflow-hidden">
                    {user.status === "approved" && (
                      <Link
                        href="/portal"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Buyer Portal
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-white/80 hover:text-gold transition-colors text-sm font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-gold text-forest font-bold text-sm rounded-full hover:bg-gold-light transition-all hover:scale-105 shadow-lg"
                >
                  Register
                </Link>
              </div>
            ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-gold p-2 transition-colors"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`w-full h-0.5 bg-current transition-all ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-full h-0.5 bg-current transition-all ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-full h-0.5 bg-current transition-all ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-forest/98 backdrop-blur-md transition-all overflow-hidden ${
          isMobileMenuOpen ? "max-h-[500px] py-6" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 px-6">
          {navLinks.map((link) => {
            const href =
              link.href.startsWith("#") && pathname !== "/"
                ? `/${link.href}`
                : link.href;

            return (
              <Link
                key={link.label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="text-white/90 hover:text-gold transition-colors text-base font-medium"
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile Auth */}
          <div className="w-full border-t border-white/10 pt-4 mt-2">
            {!loading &&
              (user ? (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-gold text-sm font-medium">
                    {user.companyName || user.email}
                  </span>
                  {user.status === "approved" && (
                    <Link
                      href="/portal"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-6 py-3 bg-gold text-forest font-semibold rounded-full"
                    >
                      Buyer Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-white/60 hover:text-red-400 text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/90 hover:text-gold transition-colors text-base font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-3 bg-gold text-forest font-semibold rounded-full"
                  >
                    Register
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
