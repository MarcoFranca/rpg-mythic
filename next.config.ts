// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.module = config.module || { rules: [] };
        config.module.rules.push({
            test: /\.svg$/i,
            oneOf: [
                { resourceQuery: /url/, type: "asset/resource" },
                {
                    issuer: /\.[jt]sx?$/,
                    use: [{
                        loader: "@svgr/webpack",
                        options: {
                            svgo: true,
                            svgoConfig: { plugins: [{ name: "preset-default" }] },
                            svgProps: { fill: "currentColor", stroke: "currentColor" },
                            // 🔽 troca preto por currentColor (a parte mais importante)
                            replaceAttrValues: {
                                "#000": "currentColor",
                                "#000000": "currentColor",
                                "black": "currentColor",
                            },
                            titleProp: true,
                            ref: true,
                        }
                    }]
                }
            ]
        });
        return config;
    },
};

export default nextConfig;
