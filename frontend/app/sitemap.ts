import type { MetadataRoute } from "next";

const SITE_URL = "https://mandarinworldwidevacations.com";

const ROUTES = [
  "",
  "about",
  "activities",
  "contact",
  "destination",
  "hotels",
  "join",
  "membership",
  "privacy-policy",
  "refund-policy",
  "stays",
  "terms-conditions",
  "travel-desk",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}`,
    lastModified: new Date(),
  }));
}
