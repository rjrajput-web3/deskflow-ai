import type { MetadataRoute } from "next";

const BASE = "https://deskflowai-tau.vercel.app";

// All 25 public routes (audit #11): 11 marketing pages, 9 dashboard pages,
// 5 admin pages.
const ROUTES = [
  "/",
  "/features",
  "/how-it-works",
  "/industries",
  "/demo",
  "/pricing",
  "/integrations",
  "/docs",
  "/contact",
  "/terms",
  "/privacy",
  "/dashboard",
  "/dashboard/setup",
  "/dashboard/knowledge",
  "/dashboard/sandbox",
  "/dashboard/conversations",
  "/dashboard/leads",
  "/dashboard/appointments",
  "/dashboard/analytics",
  "/dashboard/integrations",
  "/admin",
  "/admin/tenants",
  "/admin/plans",
  "/admin/logs",
  "/admin/revenue",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : route === "/demo" ? 0.9 : 0.7,
  }));
}
