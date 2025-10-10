// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config: any) => {
        (config.module ??= { rules: [] });
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [{ loader: "@svgr/webpack", options: { svgo: true, svgoConfig: { plugins: [{ name: "preset-default" }] } } }],
        });
        return config;
    },
};

export default nextConfig;
