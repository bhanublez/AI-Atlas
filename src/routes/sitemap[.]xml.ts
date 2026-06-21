import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { roadmaps, allTopicRefs } from "@/data/roadmaps";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/roadmaps", changefreq: "weekly", priority: "0.9" },
          { path: "/topics", changefreq: "weekly", priority: "0.9" },
          { path: "/glossary", changefreq: "monthly", priority: "0.6" },
          { path: "/timeline", changefreq: "monthly", priority: "0.6" },
          ...roadmaps.map((r) => ({
            path: `/roadmaps/${r.slug}`,
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...Array.from(new Set(allTopicRefs.map((t) => t.slug))).map((s) => ({
            path: `/topics/${s}`,
            changefreq: "monthly",
            priority: "0.7",
          })),
        ];

        const urls = entries.map((e) =>
          [
            "  <url>",
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            "  </url>",
          ].join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
