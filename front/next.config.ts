import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	compress: true,
	poweredByHeader: false,
	images: {
		minimumCacheTTL: 60,
	},
	experimental: {
		scrollRestoration: true,
		optimizeCss: true,
	},
};

export default nextConfig;
