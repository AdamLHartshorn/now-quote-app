import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOW Field Desk",
    short_name: "Field Desk",
    description: "NOW Courier sales quoting, routing, and reference workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f8f9",
    theme_color: "#007f94",
    icons: [
      { src: "/field-desk-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/field-desk-icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
