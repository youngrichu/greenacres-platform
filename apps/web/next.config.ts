import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@greenacres/ui", "@greenacres/db", "@greenacres/auth", "@greenacres/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
