import { Link, useRouterState } from "@tanstack/react-router";
import {
  Brain,
  Search,
  Map as MapIcon,
  Sparkles,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SearchDialog } from "./SearchDialog";

const nav = [
  { to: "/roadmaps", label: "Roadmaps", icon: MapIcon },
  { to: "/topics", label: "Topics", icon: Sparkles },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
  { to: "/timeline", label: "Timeline", icon: BookOpen },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "glass-strong shadow-lg shadow-indigo-500/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-6 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2 shrink-0">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_24px_-4px_rgba(99,102,241,0.6)] transition-transform group-hover:scale-105">
              <Brain className="h-5 w-5 text-white" />
              <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 opacity-50 blur-lg" />
            </span>
            <div className="leading-tight hidden sm:block">
              <div className="font-display text-[15px] font-semibold tracking-tight">
                AI Atlas
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Knowledge Map
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-white/[0.06] text-foreground"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 opacity-70" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                ⌘K
              </kbd>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenu ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="border-t border-white/10 bg-[#0a0a1a]/95 backdrop-blur-xl md:hidden">
            <nav className="mx-auto max-w-[90rem] px-4 py-4 flex flex-col gap-1">
              {nav.map(({ to, label, icon: Icon }) => {
                const active = pathname === to || pathname.startsWith(to + "/");
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                      active
                        ? "bg-white/[0.06] text-foreground"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
