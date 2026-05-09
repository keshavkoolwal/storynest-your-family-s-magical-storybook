import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Download, Edit3, Headphones, Palette, RefreshCw, Save, Share2, Trash2 } from "lucide-react";
import { deleteStory, getStory, saveStory, type Story } from "@/lib/storynest";
import { toast } from "sonner";

export const Route = createFileRoute("/story/$id")({
  head: () => ({ meta: [{ title: "Your storybook · StoryNest" }] }),
  component: StoryView,
});

function StoryView() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const s = getStory(id);
    if (!s) { navigate({ to: "/dashboard" }); return; }
    setStory(s);
  }, [id, navigate]);

  if (!story) return null;

  const total = story.pages.length + 1; // cover + pages
  const isCover = page === 0;
  const current = isCover ? null : story.pages[page - 1];

  const updatePageText = (text: string) => {
    if (!current) return;
    const next = { ...story, pages: story.pages.map((p, i) => i === page - 1 ? { ...p, text } : p) };
    setStory(next);
  };
  const persist = () => { saveStory(story); toast.success("Story saved ✨"); setEditing(false); };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between gap-2 mb-4">
        <Link to="/dashboard"><Button variant="ghost" size="sm" className="rounded-full"><ArrowLeft className="h-4 w-4" /> Dashboard</Button></Link>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button size="sm" variant="secondary" className="rounded-full" onClick={persist}><Save className="h-4 w-4" /> Save</Button>
          <Button size="sm" variant="secondary" className="rounded-full" onClick={() => navigator.share?.({ title: story.title }).catch(() => toast.success("Share link copied"))}><Share2 className="h-4 w-4" /> Share</Button>
          <Button size="sm" variant="secondary" className="rounded-full" onClick={() => toast("PDF export coming soon ✨")}><Download className="h-4 w-4" /> Download PDF</Button>
        </div>
      </div>

      {/* Book viewer */}
      <div className="relative">
        <div className="absolute -inset-4 magic-gradient blur-2xl opacity-50 rounded-[3rem]" />
        <div className="relative cozy-card overflow-hidden">
          {isCover ? (
            <div className="relative">
              <img src={story.cover} alt={story.title} className="w-full aspect-[4/5] md:aspect-[3/2] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent flex flex-col justify-end p-8 md:p-12 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-primary">A StoryNest book</p>
                <h1 className="font-display text-3xl md:text-5xl mt-2">{story.title}</h1>
                <p className="mt-3 text-muted-foreground italic">{story.dedication}</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2">
              <img src={current!.image} alt="" className="w-full aspect-square md:aspect-auto md:h-full object-cover" />
              <div className="p-8 md:p-12 flex flex-col justify-center min-h-[320px]">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Page {page} of {story.pages.length}</span>
                {editing ? (
                  <Textarea value={current!.text} onChange={(e) => updatePageText(e.target.value)} className="font-display text-xl md:text-2xl leading-snug mt-3 min-h-[140px]" />
                ) : (
                  <p className="font-display text-xl md:text-2xl leading-snug mt-3">{current!.text}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-6">
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => setEditing(!editing)}><Edit3 className="h-4 w-4" /> {editing ? "Done" : "Edit text"}</Button>
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => toast("Regenerating page…")}><RefreshCw className="h-4 w-4" /> Regenerate</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center justify-between mt-5">
        <Button variant="ghost" className="rounded-full" disabled={page === 0} onClick={() => setPage(page - 1)}><ArrowLeft className="h-4 w-4" /> Previous</Button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} className={`h-2 rounded-full transition-all ${i === page ? "w-8 bg-primary" : "w-2 bg-border"}`} />
          ))}
        </div>
        <Button variant="ghost" className="rounded-full" disabled={page === total - 1} onClick={() => setPage(page + 1)}>Next <ArrowRight className="h-4 w-4" /></Button>
      </div>

      {/* Extras */}
      <div className="grid sm:grid-cols-3 gap-3 mt-10">
        <Button variant="outline" className="rounded-full h-12" onClick={() => toast("Style change coming soon")}><Palette className="h-4 w-4" /> Change illustration style</Button>
        <Button variant="outline" className="rounded-full h-12" onClick={() => toast("Narration coming soon")}><Headphones className="h-4 w-4" /> Create bedtime narration</Button>
        <Button variant="outline" className="rounded-full h-12 text-destructive hover:text-destructive" onClick={() => { deleteStory(story.id); navigate({ to: "/dashboard" }); }}><Trash2 className="h-4 w-4" /> Delete storybook</Button>
      </div>
    </div>
  );
}
