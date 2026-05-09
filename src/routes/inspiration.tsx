import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/storynest";

export const Route = createFileRoute("/inspiration")({
  head: () => ({ meta: [{ title: "Story Ideas · StoryNest" }, { name: "description", content: "Beautiful story templates to inspire your next keepsake." }] }),
  component: Inspiration,
});

const palettes = [
  "from-[color:var(--blush)] to-[color:var(--peach)]",
  "from-[color:var(--lavender)] to-[color:var(--blush)]",
  "from-[color:var(--mint)] to-[color:var(--butter)]",
  "from-[color:var(--peach)] to-[color:var(--butter)]",
  "from-[color:var(--lavender)] to-[color:var(--cream)]",
  "from-[color:var(--blush)] to-[color:var(--lavender)]",
  "from-[color:var(--butter)] to-[color:var(--mint)]",
  "from-[color:var(--peach)] to-[color:var(--blush)]",
];

function Inspiration() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Story ideas</p>
      <h1 className="font-display text-3xl md:text-5xl mt-2">A little inspiration for your next story.</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">Pick a template to start with — we'll fill in a beautiful starting point.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {TEMPLATES.map((t, i) => (
          <div key={t.id} className="cozy-card overflow-hidden">
            <div className={`aspect-[5/3] bg-gradient-to-br ${palettes[i % palettes.length]} grid place-items-center text-5xl`}>
              <span>{t.emoji}</span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg">{t.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <Link to="/create" className="inline-block mt-4">
                <Button size="sm" className="rounded-full">Use this template</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
