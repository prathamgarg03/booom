import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.booom.dev" }],
        destination: "https://booom.dev/:path*",
        permanent: true,
      },
      {
        // Old address: send pages to booom.dev, but keep /embed and /api answering
        // directly so scripts already pasted on other sites keep working.
        source: "/:path((?!embed/|api/).*)",
        has: [{ type: "host", value: "booom-www.vercel.app" }],
        destination: "https://booom.dev/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
