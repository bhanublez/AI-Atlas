import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowLeft, ArrowRight, Clock, Layers, Sparkles } from "lucide-react";
import {
  roadmapBySlug,
  levelOrder,
  levelMeta,
  accentClasses,
} from "@/data/roadmaps";
import type { Roadmap, TopicRef } from "@/data/roadmaps";

export const Route = createFileRoute("/roadmaps/$slug")({
  loader: ({ params }): { roadmap: Roadmap } => {
    const roadmap = roadmapBySlug[params.slug];
    if (!roadmap) throw notFound();
    return { roadmap };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.roadmap.title} Roadmap — AI Knowledge Atlas` },
          { name: "description", content: loaderData.roadmap.description },
          {
            property: "og:title",
            content: `${loaderData.roadmap.title} Roadmap`,
          },
          {
            property: "og:description",
            content: loaderData.roadmap.description,
          },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl">Roadmap not found</h1>
      <Link
        to="/roadmaps"
        className="mt-6 inline-block text-cyan-300 hover:underline"
      >
        All roadmaps →
      </Link>
    </div>
  ),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { roadmap } = Route.useLoaderData() as { roadmap: Roadmap };
  const Icon =
    (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }>
      >
    )[roadmap.icon] ?? Icons.Sparkles;

  const byLevel = levelOrder
    .map((lvl) => ({
      level: lvl,
      items: roadmap.topics.filter((t: TopicRef) => t.level === lvl),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="relative">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All roadmaps
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 flex items-start gap-5"
          >
            <span
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ring-1 bg-gradient-to-br ${accentClasses[roadmap.accent]}`}
            >
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {roadmap.category}
              </div>
              <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {roadmap.title}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {roadmap.tagline}
              </p>
            </div>
          </motion.div>

          <p className="mt-6 max-w-3xl text-muted-foreground">
            {roadmap.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-4 w-4" /> {roadmap.topics.length} topics
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {roadmap.hours} hours
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> {byLevel.length} levels
            </span>
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="relative space-y-12">
          {/* Spine */}
          <div className="absolute left-[15px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-indigo-500/40 via-cyan-400/30 to-transparent sm:block" />

          {byLevel.map((group, gi) => (
            <motion.div
              key={group.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.45, delay: gi * 0.05 }}
              className="relative sm:pl-12"
            >
              <div className="absolute left-0 top-1 hidden h-8 w-8 place-items-center rounded-full border border-white/10 bg-[color:var(--surface)] text-xs font-medium sm:grid">
                {gi + 1}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${levelMeta[group.level].color}`}
                >
                  {group.level}
                </span>
                <span className="text-xs text-muted-foreground">
                  {levelMeta[group.level].description}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {group.items.map((t: TopicRef, i: number) => (
                  <motion.div
                    key={t.slug + i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <Link
                      to="/topics/$slug"
                      params={{ slug: t.slug }}
                      className="group glass gradient-border flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{t.title}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
