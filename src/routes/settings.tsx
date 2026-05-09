import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getProfile, getStories, saveProfile, type Profile } from "@/lib/storynest";
import { Lock, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · StoryNest" }] }),
  component: Settings,
});

function Settings() {
  const [profile, setProfile] = useState<Profile>({ name: "Mama" });
  const [privatePhotos, setPrivatePhotos] = useState(true);
  const [shareGrandparents, setShareGrandparents] = useState(false);

  useEffect(() => { setProfile(getProfile()); }, []);

  const save = () => { saveProfile(profile); toast.success("Saved ✨"); };

  const exportStories = () => {
    const blob = new Blob([JSON.stringify(getStories(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "storynest-stories.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Settings</p>
        <h1 className="font-display text-3xl md:text-4xl mt-2">Your StoryNest</h1>
      </div>

      <Section title="Profile">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Your name"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
          <Field label="Email"><Input value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="you@email.com" /></Field>
          <Field label="Child's name"><Input value={profile.childName || ""} onChange={(e) => setProfile({ ...profile, childName: e.target.value })} /></Field>
          <Field label="Partner / family"><Input value={profile.partner || ""} onChange={(e) => setProfile({ ...profile, partner: e.target.value })} /></Field>
        </div>
        <Button onClick={save} className="rounded-full mt-2">Save profile</Button>
      </Section>

      <Section title="Privacy">
        <div className="rounded-2xl bg-secondary/50 p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-primary mt-0.5" />
          <p className="text-sm text-muted-foreground">Your baby and family photos are private by default. You decide what to save, share, or delete.</p>
        </div>
        <Toggle label="Keep all photos private" checked={privatePhotos} onCheckedChange={setPrivatePhotos} />
        <Toggle label="Allow sharing with grandparents (link only)" checked={shareGrandparents} onCheckedChange={setShareGrandparents} />
        <Button variant="outline" className="rounded-full" onClick={() => toast.success("All uploaded photos cleared")}><Trash2 className="h-4 w-4" /> Delete all uploaded photos</Button>
      </Section>

      <Section title="Your data">
        <Button variant="secondary" className="rounded-full" onClick={exportStories}><Download className="h-4 w-4" /> Export my stories</Button>
        <Button variant="outline" className="rounded-full text-destructive hover:text-destructive" onClick={() => toast("Account deletion is coming soon")}><Trash2 className="h-4 w-4" /> Delete my account</Button>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cozy-card p-6 space-y-4">
      <h2 className="font-display text-xl">{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-sm">{label}</Label><div className="mt-1.5">{children}</div></div>;
}
function Toggle({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-card border border-border px-4 py-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
