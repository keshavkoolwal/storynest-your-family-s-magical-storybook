import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Image as ImageIcon, Wand2, BookHeart, Lock, Sparkles, Star } from "lucide-react";
import heroImg from "@/assets/hero-storybook.jpg";
import coverImg from "@/assets/cover-mom-baby.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StoryNest — Turn motherhood memories into magical storybooks" },
      { name: "description", content: "Upload your favorite pregnancy, baby, or family photos. Add a few memories. StoryNest turns them into a personalized illustrated storybook." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Sparkle className="top-12 left-6 text-primary" />
        <Sparkle className="top-32 right-10 text-accent" />
        <Sparkle className="top-64 left-1/3 text-[color:var(--peach)]" />
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-1 text-xs text-secondary-foreground">
              <Heart className="h-3.5 w-3.5 text-primary" /> For moms-to-be & new mamas
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              Turn your motherhood memories into{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[color:var(--lavender)] to-[color:var(--peach)]">magical storybooks.</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
              Upload your favorite pregnancy, baby, or family photos. Add a few memories. StoryNest turns them into a
              personalized illustrated storybook you can save, share, or read at bedtime.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link to="/create">
                <Button size="lg" className="rounded-full h-12 px-6 text-base shadow-[var(--shadow-soft)]">
                  Create my first story <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="secondary" className="rounded-full h-12 px-6 text-base">
                  See how it works
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3 w-3" /> Your family photos stay private. Always.
            </p>
          </div>

          {/* Mock storybook preview */}
          <div className="relative">
            <div className="absolute -inset-6 magic-gradient blur-2xl opacity-60 rounded-[3rem]" />
            <div className="relative cozy-card p-3 md:p-4 rotate-[-2deg] animate-float max-w-md mx-auto">
              <img src={coverImg} alt="Storybook cover" width={768} height={768}
                className="rounded-3xl aspect-square object-cover" />
              <div className="px-3 py-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">A StoryNest book</p>
                <h3 className="font-display text-2xl mt-1">The Day You Became Our Little Star</h3>
                <p className="text-sm text-muted-foreground mt-1">For our little one, with all our love.</p>
              </div>
            </div>
            <div className="hidden md:block absolute -bottom-6 -right-2 cozy-card p-3 w-48 rotate-[6deg]">
              <img src={heroImg} alt="" width={400} height={320} className="rounded-2xl aspect-[5/4] object-cover" loading="lazy" />
              <p className="text-xs mt-2 px-1 font-medium">Page 1 · "Before you were in our arms…"</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="How it works" title="From your camera roll to a keepsake — in minutes." />
        <div className="grid md:grid-cols-4 gap-4 mt-10">
          {[
            { icon: ImageIcon, title: "Upload photos", desc: "Bump pics, ultrasounds, baby smiles." },
            { icon: Heart, title: "Add memories", desc: "A few warm prompts. No writing skills needed." },
            { icon: Wand2, title: "Choose a style", desc: "Pastel, watercolor, cozy bedtime, more." },
            { icon: BookHeart, title: "Get your storybook", desc: "Save, share, or read at bedtime." },
          ].map((s, i) => (
            <div key={s.title} className="cozy-card p-6 relative">
              <span className="absolute top-4 right-4 text-xs font-medium text-muted-foreground">0{i + 1}</span>
              <div className="h-12 w-12 grid place-items-center rounded-2xl bg-primary/15 text-primary mb-4">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular story types */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeading eyebrow="Popular stories" title="What memory will you turn into magic?" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {[
            { e: "🤰", t: "Pregnancy Journey", c: "from-[color:var(--blush)] to-[color:var(--peach)]" },
            { e: "🍼", t: "Baby's First Year", c: "from-[color:var(--lavender)] to-[color:var(--blush)]" },
            { e: "🏡", t: "Our Family Story", c: "from-[color:var(--mint)] to-[color:var(--butter)]" },
            { e: "🌙", t: "Bedtime Adventure", c: "from-[color:var(--lavender)] to-[color:var(--cream)]" },
            { e: "🎁", t: "Baby Shower Gift", c: "from-[color:var(--peach)] to-[color:var(--butter)]" },
            { e: "🎂", t: "First Birthday Book", c: "from-[color:var(--blush)] to-[color:var(--lavender)]" },
          ].map((x) => (
            <Link to="/create" key={x.t} className="group">
              <div className={`rounded-3xl p-6 h-full bg-gradient-to-br ${x.c} shadow-[var(--shadow-card)] hover:scale-[1.02] transition-transform`}>
                <div className="text-4xl">{x.e}</div>
                <p className="font-display text-lg mt-3">{x.t}</p>
                <p className="text-sm text-foreground/70 mt-1 group-hover:underline">Start this story →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why moms love it */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Why moms love it" title="Made for tired mamas with full hearts." />
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {[
            { t: "Keepsake-worthy", d: "Pages that feel like a memory book — not a generic AI output." },
            { t: "Personalized bedtime", d: "Stories starring your child, your family, your moments." },
            { t: "Family bonding", d: "Read together. Send to grandparents. Print as a gift." },
            { t: "Easy on tired moms", d: "A few taps, a few prompts — that's it. Truly." },
          ].map((x) => (
            <div key={x.t} className="cozy-card p-6 flex items-start gap-4">
              <div className="h-10 w-10 grid place-items-center rounded-2xl bg-accent/40 text-accent-foreground"><Star className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display text-lg">{x.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="cozy-card p-8 text-center">
          <Lock className="h-6 w-6 text-primary mx-auto" />
          <h3 className="font-display text-2xl mt-2">Your family stays your family.</h3>
          <p className="text-muted-foreground mt-2">Your baby and family photos are private by default. You decide what to save, share, or delete — anytime.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="relative overflow-hidden rounded-[3rem] magic-gradient p-10 md:p-16 text-center">
          <Sparkle className="top-6 left-8" />
          <Sparkle className="bottom-8 right-10" />
          <h2 className="font-display text-3xl md:text-5xl">Start your first magical story today.</h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">Tiny moments. Big memories. Let's make something beautiful.</p>
          <Link to="/create" className="inline-block mt-6">
            <Button size="lg" className="rounded-full h-12 px-7 text-base shadow-[var(--shadow-soft)]">Create my first story <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">{eyebrow}</p>
      <h2 className="font-display text-3xl md:text-4xl mt-2">{title}</h2>
    </div>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <span className={`absolute pointer-events-none animate-sparkle ${className}`}>
      <Sparkles className="h-4 w-4" />
    </span>
  );
}
