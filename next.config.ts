import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Environment variable configuration
  env: {
    // Ensure environment variables are available at build time
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Public runtime configuration for client-side access
  publicRuntimeConfig: {
    // These will be available on both server and client
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    environment: process.env.NODE_ENV,
  },

  // Server-only runtime configuration
  serverRuntimeConfig: {
    // These will only be available on the server-side
    internalApiKey: process.env.INTERNAL_API_KEY,
  },

  // Experimental features for better environment variable handling
  experimental: {
    // Enable runtime environment variables
    runtime: "nodejs",
  },
};

export default nextConfig;
