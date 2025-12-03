import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";
import crypto from "crypto";
import withBundleAnalyzer from "@next/bundle-analyzer";

interface WebpackModule {
  size: () => number;
  identifier: () => string;
}

interface WebpackChunk {
  name: string;
}

const config: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@tabler/icons-react",
    ],
  },
  webpack: (config, { dev, isServer }: WebpackConfigContext) => {
    // These are production optimizations only
    if (!dev && !isServer) {
      // we are enabling tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
      };
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: "framework",
            chunks: "all",
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module: WebpackModule) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier())
              );
            },
            name(module: WebpackModule) {
              const hash = crypto.createHash("sha1");
              hash.update(module.identifier());
              return hash.digest("hex").slice(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: "commons",
            chunks: "all",
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name(module: WebpackModule, chunks: WebpackChunk[]) {
              const hash = crypto.createHash("sha1");
              hash.update(
                chunks.reduce((acc: string, chunk) => acc + chunk.name, "")
              );
              return hash.digest("hex");
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(config);

export default nextConfig;
