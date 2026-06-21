import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, Map as MapIcon, Sparkles } from "lucide-react";
import { allTopicRefs, roadmaps } from "@/data/roadmaps";

type Item =
  | { kind: "roadmap"; slug: string; title: string; sub: string }
  | { kind: "topic"; slug: string; title: string; sub: string };

const allItems: Item[] = [
  ...roadmaps.map<Item>((r) => ({
    kind: "roadmap",
    slug: r.slug,
    title: r.title,
    sub: r.tagline,
  })),
  ...Array.from(
    new Map(
      allTopicRefs.map((t) => [
        t.slug,
        {
          kind: "topic" as const,
          slug: t.slug,
          title: t.title,
          sub: `${t.level} · ${t.roadmap.title}`,
        },
      ]),
    ).values(),
  ),
];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const pool = needle
      ? allItems.filter(
          (i) =>
            i.title.toLowerCase().includes(needle) ||
            i.sub.toLowerCase().includes(needle),
        )
      : allItems.slice(0, 12);
    return pool.slice(0, 30);
  }, [q]);

  useEffect(() => {
    setCursor(0);
  }, [q]);
  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter") {
        const it = results[cursor];
        if (it) {
          onOpenChange(false);
          if (it.kind === "roadmap")
            navigate({ to: "/roadmaps/$slug", params: { slug: it.slug } });
          else navigate({ to: "/topics/$slug", params: { slug: it.slug } });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, cursor, navigate, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] backdrop-blur-md"
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-background/70" />
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface)] shadow-2xl ring-1 ring-white/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search roadmaps, concepts, algorithms…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="rounded border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No results for "{q}"
            </div>
          )}
          {results.map((it, i) => {
            const Icon = it.kind === "roadmap" ? MapIcon : Sparkles;
            const active = i === cursor;
            return (
              <button
                key={`${it.kind}-${it.slug}`}
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  onOpenChange(false);
                  if (it.kind === "roadmap")
                    navigate({
                      to: "/roadmaps/$slug",
                      params: { slug: it.slug },
                    });
                  else
                    navigate({
                      to: "/topics/$slug",
                      params: { slug: it.slug },
                    });
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-md ${it.kind === "roadmap" ? "bg-indigo-500/15 text-indigo-300" : "bg-cyan-500/15 text-cyan-300"}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{it.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {it.sub}
                  </div>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {it.kind}
                </span>
                <ArrowRight
                  className={`h-3.5 w-3.5 ${active ? "text-foreground" : "text-muted-foreground/40"}`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
