import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import { AuthProvider } from "@greenacres/auth";
import { Toaster } from "@/components/ui/toaster";
import SmoothScroller from "@/components/providers/smooth-scroller";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Green Acres Industrial PLC | Ethiopian Premium Coffee Exporter",
  description:
    "Experience the finest Ethiopian specialty coffee. From the highlands of Sidama, Yirgacheffe, and Guji to your cup. Premium single-origin beans with exceptional flavor profiles.",
  keywords: [
    "Ethiopian coffee",
    "specialty coffee",
    "coffee exporter",
    "Sidama",
    "Yirgacheffe",
    "Guji",
    "green coffee beans",
  ],
  openGraph: {
    title: "Green Acres Industrial PLC | Ethiopian Premium Coffee",
    description: "Experience the finest Ethiopian specialty coffee",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${outfit.variable}`}
    >
      <body className="font-sans antialiased bg-cream text-forest-dark overflow-x-hidden">
        <SmoothScroller />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
