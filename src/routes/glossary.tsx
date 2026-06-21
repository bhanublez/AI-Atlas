import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { topics } from "@/data/roadmaps";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "AI Glossary — AI Knowledge Atlas" },
      {
        name: "description",
        content:
          "Quick definitions for the most important terms in AI and Machine Learning.",
      },
      { property: "og:title", content: "AI Glossary" },
      { property: "og:description", content: "AI terms, defined." },
    ],
  }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const [q, setQ] = useState("");

  const sorted = useMemo(
    () => [...topics].sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  const filtered = useMemo(() => {
    if (!q.trim()) return sorted;
    const query = q.toLowerCase();
    return sorted.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.short.toLowerCase().includes(query),
    );
  }, [sorted, q]);

  const groups = useMemo(() => {
    return filtered.reduce<Record<string, typeof filtered>>((acc, t) => {
      const k = t.title[0].toUpperCase();
      (acc[k] ||= []).push(t);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div className="relative mx-auto max-w-[90rem] px-4 py-16 sm:px-6 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          Reference
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          AI <span className="gradient-text">Glossary</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Short, accurate definitions for the terms that matter most.
        </p>
        <div className="mt-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search glossary…"
            className="w-full max-w-sm rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/20"
          />
        </div>
      </motion.div>

      <div className="mt-12 space-y-16">
        {Object.entries(groups).map(([letter, entries]) => (
          <section key={letter}>
            <div className="sticky top-16 z-10 -mx-2 mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 font-display text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)]">
              {letter}
            </div>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {entries.map((t) => (
                <Link
                  key={t.slug}
                  to="/topics/$slug"
                  params={{ slug: t.slug }}
                  className="group glass gradient-border block rounded-xl p-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="font-display text-base font-semibold">
                    {t.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {t.short}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {Object.keys(groups).length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-muted-foreground">
            No terms match your search.
          </div>
        )}
      </div>
    </div>
  );
}
