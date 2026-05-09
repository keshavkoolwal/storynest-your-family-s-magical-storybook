import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing · StoryNest" }, { name: "description", content: "Simple plans for every mama. Free to start." }] }),
  component: Pricing,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    sub: "To try the magic.",
    cta: "Start free",
    features: ["1 storybook", "Basic illustration styles", "Watermark on pages"],
    highlight: false,
  },
  {
    name: "Premium",
    price: "$9",
    sub: "/ month",
    cta: "Become Premium",
    features: [
      "Unlimited storybooks",
      "Premium illustration styles",
      "HD downloads",
      "PDF export",
      "No watermark",
      "Voice-to-story",
      "Private memory timeline",
    ],
    highlight: true,
  },
  {
    name: "Keepsake add-ons",
    price: "From $19",
    sub: "One-time",
    cta: "Explore keepsakes",
    features: ["Printed storybook", "Framed illustrated page", "Baby shower gift edition"],
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Pricing</p>
        <h1 className="font-display text-3xl md:text-5xl mt-2">Simple, sweet, and made for mamas.</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Start free. Upgrade when you want unlimited stories and beautiful printable keepsakes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-12">
        {plans.map((p) => (
          <div key={p.name} className={`cozy-card p-7 relative ${p.highlight ? "ring-2 ring-primary" : ""}`}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full"><Sparkles className="h-3 w-3" /> Most loved</span>}
            <h3 className="font-display text-2xl">{p.name}</h3>
            <p className="mt-2"><span className="text-3xl font-display">{p.price}</span> <span className="text-muted-foreground text-sm">{p.sub}</span></p>
            <ul className="mt-5 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/create" className="block mt-6">
              <Button className="w-full rounded-full" variant={p.highlight ? "default" : "secondary"}>{p.cta}</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
