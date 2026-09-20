import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const isRootPagesSite = process.env.GITHUB_REPOSITORY === "li-chenglin/li-chenglin.github.io";
const basePath = isGitHubPages && !isRootPagesSite ? "/chenglin-homepage" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
