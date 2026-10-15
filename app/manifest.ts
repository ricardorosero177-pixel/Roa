import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.legalName,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1eb",
    theme_color: "#b08a5a",
    lang: "es-CL",
    icons: [
      { src: "/icon", sizes: "256x256", type: "image/png" },
    ],
  };
}
