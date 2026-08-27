import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOW Sales Workspace",
    short_name: "NOW Sales",
    description: "NOW Courier sales quoting and prospect planning workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f8f9",
    theme_color: "#007f94",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
