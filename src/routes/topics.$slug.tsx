import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Gauge,
  Map,
  Sparkles,
  BookOpen,
  Layers,
} from "lucide-react";
import { getTopicDetail, topicBySlug } from "@/data/roadmaps";
import type { Topic, TopicRef, Roadmap } from "@/data/roadmaps";

type Detail = {
  slug: string;
  topic: Topic | null;
  refs: (TopicRef & { roadmap: Roadmap })[];
};

export const Route = createFileRoute("/topics/$slug")({
  loader: ({ params }): Detail => {
    const { topic, refs } = getTopicDetail(params.slug);
    // Allow rendering even without a rich topic entry — synthesize from refs.
    if (!topic && refs.length === 0) throw notFound();
    return { slug: params.slug, topic, refs };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const title =
      loaderData.topic?.title ?? loaderData.refs[0]?.title ?? "Topic";
    const desc =
      loaderData.topic?.definition ?? `${title} in the AI Knowledge Atlas.`;
    return {
      meta: [
        { title: `${title} — AI Knowledge Atlas` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl">Topic not found</h1>
      <Link
        to="/topics"
        className="mt-6 inline-block text-cyan-300 hover:underline"
      >
        All topics →
      </Link>
    </div>
  ),
  component: TopicPage,
});

function TopicPage() {
  const { topic, refs, slug } = Route.useLoaderData() as Detail;
  const title = topic?.title ?? refs[0]?.title ?? slug;
  const definition =
    topic?.definition ??
    `${title} is a concept in ${refs[0]?.roadmap.title ?? "AI"}. A detailed entry is being prepared — meanwhile, see the roadmaps where this topic appears.`;
  const purpose =
    topic?.purpose ??
    `It plays a role across the ${refs.map((r) => r.roadmap.title).join(", ")} curriculum.`;
  const related = (topic?.related ?? [])
    .map((title) => ({
      title,
      slug: title
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }))
    .filter((r) => topicBySlug[r.slug] || true);
  const prereq = topic?.prerequisites ?? [];
  const apps = topic?.applications ?? [];
  const difficulty = topic?.difficulty ?? 2;
  const hours = topic?.hours ?? 3;

  return (
    <div className="relative">
      <section className="relative isolate overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <Link
            to="/topics"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All topics
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
              Concept
            </div>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            {topic?.short && (
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                {topic.short}
              </p>
            )}
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Pill icon={<Gauge className="h-3.5 w-3.5" />}>
              Difficulty {"●".repeat(difficulty)}
              {"○".repeat(5 - difficulty)}
            </Pill>
            <Pill icon={<Clock className="h-3.5 w-3.5" />}>
              {hours}h estimated
            </Pill>
            {refs[0] && (
              <Pill icon={<Map className="h-3.5 w-3.5" />}>
                {refs[0].level}
              </Pill>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card icon={<BookOpen className="h-4 w-4" />} title="Definition">
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {definition}
            </p>
          </Card>

          <Card icon={<Sparkles className="h-4 w-4" />} title="Why it matters">
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {purpose}
            </p>
          </Card>

          {topic?.intuition && (
            <Card
              icon={<Sparkles className="h-4 w-4" />}
              title="Core intuition"
            >
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {topic.intuition}
              </p>
            </Card>
          )}

          {apps.length > 0 && (
            <Card
              icon={<Layers className="h-4 w-4" />}
              title="Real-world applications"
            >
              <ul className="grid gap-2 sm:grid-cols-2">
                {apps.map((a) => (
                  <li
                    key={a}
                    className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {prereq.length > 0 && (
            <Card
              icon={<ArrowLeft className="h-4 w-4" />}
              title="Prerequisites"
            >
              <div className="flex flex-wrap gap-2">
                {prereq.map((p) => {
                  const ps = p.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  return (
                    <Link
                      key={p}
                      to="/topics/$slug"
                      params={{ slug: ps }}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs hover:bg-white/[0.08]"
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            </Card>
          )}

          {related.length > 0 && (
            <Card
              icon={<ArrowRight className="h-4 w-4" />}
              title="Related concepts"
            >
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/topics/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200 hover:bg-indigo-500/20"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card icon={<Map className="h-4 w-4" />} title="Appears in">
            <div className="space-y-2">
              {refs.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Standalone concept.
                </div>
              )}
              {refs.map((r) => (
                <Link
                  key={r.roadmap.slug + r.level}
                  to="/roadmaps/$slug"
                  params={{ slug: r.roadmap.slug }}
                  className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 hover:bg-white/[0.05]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {r.roadmap.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.level}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-border rounded-2xl bg-[color:var(--surface)]/70 p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-cyan-300/90">
        {icon} {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Pill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
      {icon} {children}
    </span>
  );
}
