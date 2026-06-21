import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { allTopicRefs, levelOrder, levelMeta } from "@/data/roadmaps";
import type { Level } from "@/data/roadmaps";

export const Route = createFileRoute("/topics/")({
  head: () => ({
    meta: [
      { title: "All AI Concepts — AI Knowledge Atlas" },
      {
        name: "description",
        content:
          "Browse every AI and Machine Learning concept in the atlas — by level, by domain, by name.",
      },
      { property: "og:title", content: "All AI Concepts" },
      {
        property: "og:description",
        content: "Every AI concept, algorithm and architecture.",
      },
    ],
  }),
  component: TopicsIndex,
});

function TopicsIndex() {
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState<Level | "All">("All");

  const dedup = useMemo(() => {
    const map = new Map<string, (typeof allTopicRefs)[number]>();
    for (const r of allTopicRefs) if (!map.has(r.slug)) map.set(r.slug, r);
    return Array.from(map.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }, []);

  const filtered = useMemo(() => {
    return dedup.filter((t) => {
      if (lvl !== "All" && t.level !== lvl) return false;
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [dedup, q, lvl]);

  return (
    <div className="relative mx-auto max-w-[90rem] px-4 py-16 sm:px-6 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          Catalog
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          AI <span className="gradient-text">Concepts</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {dedup.length} unique concepts across the atlas.
        </p>
      </motion.div>

      {/* Filters & search */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["All", ...levelOrder] as const).map((c) => (
            <button
              key={c}
              onClick={() => setLvl(c)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                lvl === c
                  ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-200"
                  : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search concepts…"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/20"
        />
      </div>

      {/* Auto‑fill grid that adapts to any zoom level */}
      <div
        className="mt-8 grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {filtered.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.01, 0.3) }}
          >
            <Link
              to="/topics/$slug"
              params={{ slug: t.slug }}
              className="group glass gradient-border block h-full rounded-xl p-4 transition-colors hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ring-1 ${levelMeta[t.level].color}`}
                >
                  {t.level}
                </span>
              </div>
              <div className="mt-3 font-display font-semibold leading-tight">
                {t.title}
              </div>
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {t.roadmap.title}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-muted-foreground">
          No concepts match those filters.
        </div>
      )}
    </div>
  );
}
