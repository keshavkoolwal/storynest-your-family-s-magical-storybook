import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile, getStories, type Story, TEMPLATES } from "@/lib/storynest";
import coverImg from "@/assets/cover-mom-baby.jpg";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Your StoryNest dashboard" }, { name: "description", content: "Your saved storybooks and quick templates." }] }),
  component: Dashboard,
});

const QUICK = [
  { id: "pregnancy", t: "My Pregnancy Story", e: "🤰" },
  { id: "milestone", t: "Baby's First Smile", e: "😊" },
  { id: "newborn", t: "The Day We Met You", e: "🍼" },
  { id: "family", t: "Our Family Adventure", e: "🏡" },
  { id: "bedtime", t: "Bedtime Story from Photos", e: "🌙" },
  { id: "milestone", t: "First Birthday Book", e: "🎂" },
];

function Dashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [name, setName] = useState("Mama");
  useEffect(() => {
    setStories(getStories());
    setName(getProfile().name || "Mama");
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Welcome back</p>
          <h1 className="font-display text-3xl md:text-4xl mt-1">Hi {name}, what memory are we turning into a story today?</h1>
        </div>
        <Link to="/create"><Button size="lg" className="rounded-full"><Plus className="h-4 w-4" /> Create new story</Button></Link>
      </div>

      <h2 className="font-display text-xl mt-12 mb-4">Quick templates</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {QUICK.map((q, i) => (
          <Link key={i} to="/create" search={{ type: q.id } as never} className="cozy-card p-5 hover:scale-[1.02] transition-transform">
            <div className="text-3xl">{q.e}</div>
            <p className="font-display text-lg mt-2">{q.t}</p>
            <p className="text-xs text-muted-foreground mt-1">Tap to start →</p>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-xl mt-12 mb-4">Your storybooks</h2>
      {stories.length === 0 ? (
        <div className="cozy-card p-10 text-center">
          <p className="text-muted-foreground">No storybooks yet. Let's make your first one ✨</p>
          <Link to="/create" className="inline-block mt-4"><Button className="rounded-full">Create your first story</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => (
            <div key={s.id} className="cozy-card overflow-hidden">
              <img src={s.cover || coverImg} alt={s.title} className="aspect-[4/3] object-cover w-full" />
              <div className="p-5">
                <h3 className="font-display text-lg">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-4">
                  <Link to="/story/$id" params={{ id: s.id }}><Button size="sm" variant="secondary" className="rounded-full"><Eye className="h-4 w-4" />View</Button></Link>
                  <Link to="/story/$id" params={{ id: s.id }}><Button size="sm" variant="secondary" className="rounded-full"><Edit className="h-4 w-4" />Edit</Button></Link>
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => navigator.share?.({ title: s.title, text: "Read our StoryNest book" }).catch(() => {})}><Share2 className="h-4 w-4" />Share</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl mt-14 mb-4">More ideas to try</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TEMPLATES.slice(0, 4).map((t) => (
          <Link key={t.id} to="/inspiration" className="cozy-card p-4">
            <div className="text-2xl">{t.emoji}</div>
            <p className="font-display mt-2">{t.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
