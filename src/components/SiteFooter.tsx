import { Link } from "@tanstack/react-router";
import { Brain, ExternalLink } from "lucide-react";
import { stats } from "@/data/roadmaps";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/[0.07] bg-[#0a0a1a]/80 backdrop-blur-xl">
      {/* Gradient accent line */}
      <div className="h-px w-full bg-gradient-to-r from-indigo-500/0 via-cyan-400/50 to-indigo-500/0" />

      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)]">
                <Brain className="h-5 w-5 text-white" />
              </span>
              <div>
                <span className="font-display text-lg font-semibold tracking-tight">
                  AI Knowledge Atlas
                </span>
                <p className="text-xs text-cyan-300/70">
                  The visual encyclopedia of AI
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              A free, open, visual encyclopedia of Artificial Intelligence and
              Machine Learning — built for students, engineers, and the curious.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/60">
              {stats.roadmaps} roadmaps · {stats.topics} concepts · No ads · No
              tracking
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Explore
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { to: "/roadmaps", label: "Roadmaps" },
                { to: "/topics", label: "All topics" },
                { to: "/glossary", label: "Glossary" },
                { to: "/timeline", label: "AI Timeline" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground transition-colors duration-150 hover:text-indigo-300 hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About / Philosophy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Philosophy
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400">•</span>
                Original content, not a course marketplace.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400">•</span>
                No ads, no affiliate links, no distractions.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400">•</span>
                Knowledge should be free and beautiful.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} AI Knowledge Atlas — Built with care
            for the community.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-cyan-300"
          >
            Open source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
