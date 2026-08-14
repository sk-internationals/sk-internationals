import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback. The source photography here is large
    // JPEG and PNG — the contact hero alone is a 2.4 MB PNG — and most of this
    // traffic arrives on a phone, where the transfer is the whole cost of the
    // image. Next only re-encodes on request and caches the result, so this
    // buys the saving without adding a build step.
    formats: ["image/avif", "image/webp"],
    // The photography is static and versioned with the deploy, so an optimized
    // variant stays valid far longer than the 60-second default. A year keeps
    // repeat visits off the optimizer entirely.
    minimumCacheTTL: 31_536_000,
  },
  // Removes the `X-Powered-By: Next.js` response header — one fewer byte of
  // stack disclosure on every request, and nothing depends on it.
  poweredByHeader: false,
};

export default nextConfig;
