import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RoadmapCard } from "@/components/RoadmapCard";
import { roadmaps } from "@/data/roadmaps";

export const Route = createFileRoute("/roadmaps/")({
  head: () => ({
    meta: [
      { title: "All AI Roadmaps — AI Knowledge Atlas" },
      {
        name: "description",
        content:
          "Every AI roadmap in one place: ML, Deep Learning, LLMs, Generative AI, MLOps, Computer Vision, NLP and more.",
      },
      { property: "og:title", content: "All AI Roadmaps — AI Knowledge Atlas" },
      { property: "og:description", content: "Browse every AI & ML roadmap." },
    ],
  }),
  component: RoadmapsIndex,
});

const categories = [
  "All",
  ...Array.from(new Set(roadmaps.map((r) => r.category))),
];

function RoadmapsIndex() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return roadmaps.filter((r) => {
      if (cat !== "All" && r.category !== cat) return false;
      if (
        q &&
        !`${r.title} ${r.tagline} ${r.description}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [cat, q]);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          The atlas
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          AI <span className="gradient-text">Roadmaps</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {roadmaps.length} curated learning paths across the entire field of
          AI.
        </p>
      </motion.div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                cat === c
                  ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-200"
                  : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter roadmaps…"
          className="w-full max-w-xs rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/20"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r, i) => (
          <RoadmapCard key={r.slug} roadmap={r} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-muted-foreground">
          No roadmaps match those filters.
        </div>
      )}
    </div>
  );
}
