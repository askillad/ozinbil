import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake heavy packages so only used parts land in the bundle
    optimizePackageImports: ["framer-motion"],
  },
};

export default withNextIntl(nextConfig);
