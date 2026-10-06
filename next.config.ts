import type { NextConfig } from "next";

/** Set GITHUB_PAGES=true when building for GitHub Pages project site. */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "TheEcologicalNetwork";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["maplibre-gl"],
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  trailingSlash: true,
};

export default nextConfig;
