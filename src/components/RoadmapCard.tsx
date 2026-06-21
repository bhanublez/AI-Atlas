import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Layers } from "lucide-react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import type { Roadmap } from "@/data/roadmaps";
import { accentClasses } from "@/data/roadmaps";

/* Separate the gradient part from the accentClasses for cleaner usage */
const accentGradients: Record<Roadmap["accent"], string> = {
  indigo: "from-indigo-500/30 to-indigo-500/0",
  cyan: "from-cyan-500/30 to-cyan-500/0",
  violet: "from-violet-500/30 to-violet-500/0",
  emerald: "from-emerald-500/30 to-emerald-500/0",
  amber: "from-amber-500/30 to-amber-500/0",
  rose: "from-rose-500/30 to-rose-500/0",
};

const accentBorderGlow: Record<Roadmap["accent"], string> = {
  indigo: "shadow-[0_20px_60px_-20px_rgba(99,102,241,0.4)]",
  cyan: "shadow-[0_20px_60px_-20px_rgba(34,211,238,0.4)]",
  violet: "shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)]",
  emerald: "shadow-[0_20px_60px_-20px_rgba(16,185,129,0.4)]",
  amber: "shadow-[0_20px_60px_-20px_rgba(245,158,11,0.4)]",
  rose: "shadow-[0_20px_60px_-20px_rgba(244,63,94,0.4)]",
};

export function RoadmapCard({
  roadmap,
  index = 0,
}: {
  roadmap: Roadmap;
  index?: number;
}) {
  const Icon =
    (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }>
      >
    )[roadmap.icon] ?? Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        to="/roadmaps/$slug"
        params={{ slug: roadmap.slug }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--surface)]/40 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-white/10 hover:bg-[color:var(--surface)]/70 hover:shadow-2xl"
        style={
          {
            "--accent-glow": accentBorderGlow[roadmap.accent],
          } as React.CSSProperties
        }
      >
        {/* Animated gradient border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentGradients[roadmap.accent]} blur-sm`}
          />
          <div className="absolute inset-[1px] rounded-2xl bg-[color:var(--surface)]" />
        </div>

        {/* Corner accent glow */}
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-80 bg-gradient-to-br ${accentGradients[roadmap.accent]}`}
        />

        {/* Top row: icon + arrow */}
        <div className="relative flex items-start justify-between">
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${accentClasses[roadmap.accent]} ring-1 ring-inset ring-white/10 shadow-lg shadow-current/10`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <span className="rounded-full p-1.5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground group-hover:bg-white/5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {/* Content */}
        <div className="relative mt-5 flex-1">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-300/80">
            {roadmap.category}
          </div>
          <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight tracking-tight text-white/90">
            {roadmap.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {roadmap.tagline}
          </p>
        </div>

        {/* Stats row */}
        <div className="relative mt-5 flex items-center gap-4 border-t border-white/5 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            {roadmap.topics.length} topics
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {roadmap.hours}h
          </span>
        </div>

        {/* Hover overlay: subtle "View roadmap" text */}
        <div className="absolute bottom-5 right-5 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-xs font-medium text-cyan-300">
            Explore roadmap →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
