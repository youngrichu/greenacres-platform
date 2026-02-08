import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@greenacres/ui", "@greenacres/db", "@greenacres/auth", "@greenacres/types"],
};

export default nextConfig;
