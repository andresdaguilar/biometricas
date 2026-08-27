import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Biométricas",
    short_name: "Biométricas",
    description: "Seguimiento diario de métricas corporales",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "es",
    background_color: "#fafafa",
    theme_color: "#0F766E",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
