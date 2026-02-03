import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/dashboard/", "/settings/", "/onboarding/", "/apply/"],
    },
    sitemap: "https://waitlist.example.com/sitemap.xml",
  };
}
