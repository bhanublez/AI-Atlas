import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Map,
  Network,
  Compass,
  Layers,
  Zap,
} from "lucide-react";
import { RoadmapCard } from "@/components/RoadmapCard";
import { roadmaps, topics, stats, topicBySlug } from "@/data/roadmaps";
import { NeuralBackground } from "@/components/NeuralBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "AI Knowledge Atlas — The Visual Map of Artificial Intelligence",
      },
      {
        name: "description",
        content:
          "Become an AI engineer. Explore roadmaps, concepts and architectures across Machine Learning, Deep Learning, LLMs, Generative AI and more.",
      },
      { property: "og:title", content: "AI Knowledge Atlas" },
      {
        property: "og:description",
        content: "An interactive visual encyclopedia of AI and ML.",
      },
    ],
  }),
  component: HomePage,
});

const featured = [
  "machine-learning",
  "deep-learning",
  "large-language-models",
  "generative-ai",
  "computer-vision",
  "ai-agents",
];

function HomePage() {
  const featuredRoadmaps = featured
    .map((s) => roadmaps.find((r) => r.slug === s)!)
    .filter(Boolean);
  const concept = topics[new Date().getDate() % topics.length];
  const popularAlgos = [
    "XGBoost",
    "Random Forest",
    "KMeans",
    "Logistic Regression",
    "PCA",
  ]
    .map((t) => topicBySlug[t.toLowerCase().replace(/\s+/g, "-")])
    .filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Grid overlay (optional, keep if you like) */}
        <div className="absolute inset-0 -z-20 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <NeuralBackground density={70} zIndex="-10" />
        <div className="relative z-10 mx-auto max-w-[90rem] px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>
              The visual encyclopedia of AI · {stats.topics}+ concepts
            </div>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Become an <span className="gradient-text">AI Engineer</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              An interactive atlas of artificial intelligence — every concept,
              every algorithm, every architecture, visually connected.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/roadmaps"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 text-sm font-medium text-white shadow-[0_0_40px_-8px_rgba(99,102,241,0.6)] transition-all hover:scale-[1.02]"
              >
                <span className="relative z-10">Explore roadmaps</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                to="/topics"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-white/[0.06]"
              >
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Browse concepts
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 mx-auto mt-20 max-w-5xl"
          >
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              }}
            >
              {[
                { k: stats.roadmaps, l: "Roadmaps", Icon: Map },
                { k: stats.topics, l: "Concepts", Icon: Sparkles },
                { k: stats.categories, l: "Domains", Icon: Layers },
                { k: `${stats.hours}h+`, l: "Of content", Icon: Zap },
              ].map((s) => (
                <div
                  key={s.l}
                  className="glass gradient-border rounded-2xl px-5 py-4 text-left"
                >
                  <s.Icon className="h-4 w-4 text-cyan-300/80" />
                  <div className="mt-3 font-display text-2xl font-semibold tracking-tight">
                    {s.k}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED ROADMAPS */}
      <Section
        eyebrow="AI roadmaps"
        title="Pick a path"
        subtitle="Curated learning sequences across every major area of AI."
        action={{ to: "/roadmaps", label: "All roadmaps" }}
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {featuredRoadmaps.map((r, i) => (
            <RoadmapCard key={r.slug} roadmap={r} index={i} />
          ))}
        </div>
      </Section>

      {/* CONCEPT OF THE DAY */}
      <section className="relative mx-auto max-w-[90rem] px-4 py-20 sm:px-6">
        <div className="gradient-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-[color:var(--surface)] to-cyan-500/10 p-8 sm:p-12">
          <NeuralBackground density={35} className="opacity-40" zIndex="0" />
          <div className="relative z-10">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
              Concept of the day
            </div>
            <h3 className="mt-2 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {concept.title}
            </h3>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {concept.definition}
            </p>
            <Link
              to="/topics/$slug"
              params={{ slug: concept.slug }}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm transition-colors hover:bg-white/[0.1]"
            >
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <Section
        eyebrow="Domains"
        title="Explore AI by area"
        subtitle="The full landscape, organized by what you build."
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          }}
        >
          {Array.from(new Set(roadmaps.map((r) => r.category))).map((cat) => {
            const count = roadmaps.filter((r) => r.category === cat).length;
            return (
              <Link
                key={cat}
                to="/roadmaps"
                hash={cat}
                className="glass gradient-border group rounded-2xl p-4 transition-colors hover:bg-white/[0.06]"
              >
                <Compass className="h-4 w-4 text-indigo-300" />
                <div className="mt-3 font-display text-base font-semibold">
                  {cat}
                </div>
                <div className="text-xs text-muted-foreground">
                  {count} roadmap{count > 1 ? "s" : ""}
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* POPULAR ALGORITHMS */}
      <Section
        eyebrow="Popular"
        title="Algorithms everyone uses"
        subtitle="The classical ML toolkit that still powers most production systems."
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          }}
        >
          {popularAlgos.map((t) => (
            <Link
              key={t.slug}
              to="/topics/$slug"
              params={{ slug: t.slug }}
              className="glass group rounded-xl p-4 transition-colors hover:bg-white/[0.06]"
            >
              <Network className="h-4 w-4 text-cyan-300" />
              <div className="mt-3 font-display font-semibold">{t.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {t.short}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* QUICK NAV */}
      <Section
        eyebrow="Recently added"
        title="Latest concepts"
        subtitle="Fresh entries in the atlas."
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {topics.slice(0, 6).map((t) => (
            <Link
              key={t.slug}
              to="/topics/$slug"
              params={{ slug: t.slug }}
              className="glass gradient-border group rounded-xl p-4 transition-colors hover:bg-white/[0.06]"
            >
              <div className="font-display font-semibold">{t.title}</div>
              <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {t.short}
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

function Section({
  eyebrow,
  title,
  subtitle,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="relative mx-auto max-w-[90rem] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/90">
            {eyebrow}
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <Link
            to={action.to}
            className="hidden shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            {action.label} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
