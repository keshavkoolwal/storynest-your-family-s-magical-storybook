import { Link } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/inspiration", label: "Story Ideas" },
  { to: "/pricing", label: "Pricing" },
  { to: "/settings", label: "Settings" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center h-9 w-9 rounded-2xl bg-primary/15 text-primary group-hover:rotate-6 transition-transform">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold">StoryNest</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-3 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition" activeProps={{ className: "px-3 py-2 rounded-full text-sm bg-secondary text-foreground font-medium" }}>
              {l.label}
            </Link>
          ))}
          <Link to="/create" className="ml-2">
            <Button className="rounded-full">Create story</Button>
          </Link>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-full hover:bg-secondary" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl hover:bg-secondary text-sm">{l.label}</Link>
            ))}
            <Link to="/create" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full mt-1">Create story</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Made with love. Edited by you.</p>
        <p>© {new Date().getFullYear()} StoryNest — Tiny moments. Big memories.</p>
      </div>
    </footer>
  );
}
