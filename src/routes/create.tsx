import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Upload, X, Mic, Sparkles, Check } from "lucide-react";
import {
  STORY_TYPES,
  VIBES,
  ILLUSTRATIONS,
  FAMILY_TYPES,
  PHOTO_LABELS,
  generateMockStory,
  saveStory,
} from "@/lib/storynest";
import { cartoonifyImage } from "@/lib/cartoonify.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

type Search = { type?: string };

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create your storybook · StoryNest" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: typeof s.type === "string" ? s.type : undefined,
  }),
  component: Create,
});

const STEPS = ["Story type", "Photos", "Memory", "Family", "Vibe", "Style", "Generate"];

function Create() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>(search.type || "");
  const [coverPhoto, setCoverPhoto] = useState<
    { url: string; name: string; file: File } | null
  >(null);
  const [photos, setPhotos] = useState<
    { url: string; label?: string; name: string; file?: File }[]
  >([]);
  const [prompts, setPrompts] = useState({
    what: "",
    who: "",
    special: "",
    feeling: "",
    message: "",
  });
  const [family, setFamily] = useState("");
  const [childName, setChildName] = useState("");
  const [momName, setMomName] = useState("");
  const [partner, setPartner] = useState("");
  const [dedication, setDedication] = useState("");
  const [vibe, setVibe] = useState("");
  const [illustration, setIllustration] = useState("");
  const [generating, setGenerating] = useState(false);

  const canNext = useMemo(() => {
    if (step === 0) return !!type;
    if (step === 1) return !!coverPhoto && photos.length > 0;
    if (step === 4) return !!vibe;
    if (step === 5) return !!illustration;
    return true;
  }, [step, type, coverPhoto, photos, vibe, illustration]);

  const goNext = () => {
    if (step === STEPS.length - 1) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const cartoonify = useServerFn(cartoonifyImage);

  const generate = async () => {
    setGenerating(true);
    try {
      const styleMap: Record<string, string> = {
        pastel: "soft pastel cartoon illustration, gentle pinks and creams, picture-book style",
        watercolor: "dreamy watercolor storybook illustration, soft washes, hand-painted feel",
        cozy: "cozy bedtime storybook illustration, warm lamplight, indigo and lavender tones",
        doodle: "cute hand-drawn doodle illustration, simple ink lines, warm cream background",
        soft3d: "soft 3D cartoon render, rounded shapes, plush pixar-like styling",
        classic: "classic storybook illustration, vintage children's book art, gentle earth tones",
      };
      const style = styleMap[illustration] || styleMap.pastel;
      const sceneHints = [
        "tender opening scene, glowing warm light",
        "quiet contemplative moment, soft morning light",
        "magical everyday detail, sparkles, cozy interior",
        "family gathered together with love and warmth",
        "golden hour, joyful arrival, soft confetti of light",
        "sleepy nighttime scene, stars and lullaby mood",
        "closing keepsake scene, dreamy and hopeful",
      ];

      const fileToDataUrl = (f: File) =>
        new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.onerror = rej;
          r.readAsDataURL(f);
        });

      const downscale = (dataUrl: string, maxW = 720, quality = 0.82) =>
        new Promise<string>((res) => {
          const img = new Image();
          img.onload = () => {
            const scale = Math.min(1, maxW / img.width);
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            const ctx = c.getContext("2d")!;
            ctx.drawImage(img, 0, 0, w, h);
            res(c.toDataURL("image/jpeg", quality));
          };
          img.onerror = () => res(dataUrl);
          img.src = dataUrl;
        });

      const sources = photos.filter((p) => p.file);
      let images: string[] = [];
      let coverImage: string | undefined;

      if (coverPhoto) {
        const coverData = await fileToDataUrl(coverPhoto.file);
        const compactCover = await downscale(coverData, 1024, 0.86);
        coverImage = compactCover;
        const coverPrompt = `Transform the attached photograph into a beautiful storybook COVER in ${style}. CRITICAL: keep the SAME people from the photo — preserve faces, hair, skin tone, body shape, clothing colors, and overall composition/pose. Do NOT invent new characters. Re-render this exact photo as a tender, magical book-cover illustration with soft glowing light, dreamy background, family-friendly. No text, no title, no logos, no watermarks.`;
        try {
          const { url } = await cartoonify({
            data: { imageDataUrl: compactCover, prompt: coverPrompt },
          });
          coverImage = await downscale(url, 1024, 0.86);
        } catch (e) {
          console.error("cover cartoonify failed", e);
        }
      }

      if (sources.length > 0) {
        const dataUrls = await Promise.all(sources.map((p) => fileToDataUrl(p.file!)));
        const compactUploads = await Promise.all(dataUrls.map((url) => downscale(url, 960, 0.84)));

        // Always personalize the story with the uploaded photos. AI cartoonification is an enhancement,
        // but if it fails or times out, the book must still use the family's real pictures — never stock art.
        images = sceneHints.map((_, i) => compactUploads[i % compactUploads.length]);

        const cartoonImages: string[] = [];
        for (let i = 0; i < sceneHints.length; i += 1) {
          const hint = sceneHints[i];
          const src = compactUploads[i % compactUploads.length];
          const prompt = `Transform the attached photograph into a ${style}. CRITICAL: keep the SAME people from the photo — preserve their faces, hair, skin tone, body shape, clothing colors, and the overall composition/pose of the original photo. Do NOT invent new characters. Re-render the existing photo in cartoon form, like a stylized illustration of THIS exact image. Mood: ${hint}. Family-friendly, warm, tender, no text, no logos, no watermarks.`;
          try {
            const { url } = await cartoonify({ data: { imageDataUrl: src, prompt } });
            cartoonImages.push(await downscale(url));
          } catch (e) {
            console.error("cartoonify failed", e);
          }
        }

        if (cartoonImages.length > 0)
          images = sceneHints.map((_, i) => cartoonImages[i % cartoonImages.length]);
      }

      const story = generateMockStory({
        type,
        vibe,
        illustration,
        childName,
        momName,
        dedication,
        prompts,
        images,
        coverImage,
      });
      saveStory(story);
      toast.success("Your storybook is ready ✨");
      navigate({ to: "/story/$id", params: { id: story.id } });
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong creating your storybook.");
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-[color:var(--lavender)] to-[color:var(--peach)] transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="cozy-card p-6 md:p-10 min-h-[420px]">
        {step === 0 && (
          <Step title="Choose your story type" subtitle="What kind of memory are we capturing?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STORY_TYPES.map((s) => (
                <SelectCard key={s.id} active={type === s.id} onClick={() => setType(s.id)}>
                  <div className="text-3xl">{s.icon}</div>
                  <p className="font-display text-lg mt-2">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </SelectCard>
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step
            title="Upload your photos"
            subtitle="Start with one special cover photo, then add 3–8 more memories."
          >
            <div className="mb-6">
              <Label className="text-sm font-medium">
                ✨ Your storybook cover photo
              </Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Pick one extra-special picture — this becomes the first page of your book.
              </p>
              <CoverUploader cover={coverPhoto} setCover={setCoverPhoto} />
            </div>
            <Label className="text-sm font-medium">More memory photos</Label>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              These become the inside pages of your story.
            </p>
            <PhotoUploader photos={photos} setPhotos={setPhotos} />
          </Step>
        )}

        {step === 2 && (
          <Step
            title="Tell us the memory"
            subtitle="No writing skills needed — just your memories."
          >
            <div className="grid gap-4">
              <Field label="What happened in these photos?">
                <Textarea
                  rows={2}
                  value={prompts.what}
                  onChange={(e) => setPrompts({ ...prompts, what: e.target.value })}
                  placeholder="The day we found out, the first kick, our hospital morning…"
                />
              </Field>
              <Field label="Who is in this story?">
                <Input
                  value={prompts.who}
                  onChange={(e) => setPrompts({ ...prompts, who: e.target.value })}
                  placeholder="Mama, Papa, baby Sienna and her bunny"
                />
              </Field>
              <Field label="What made this moment special?">
                <Textarea
                  rows={2}
                  value={prompts.special}
                  onChange={(e) => setPrompts({ ...prompts, special: e.target.value })}
                  placeholder="The way she smiled when she heard your voice…"
                />
              </Field>
              <Field label="What feeling should the story have?">
                <Input
                  value={prompts.feeling}
                  onChange={(e) => setPrompts({ ...prompts, feeling: e.target.value })}
                  placeholder="Cozy, magical, brave, tender…"
                />
              </Field>
              <Field label="What message should your child remember?">
                <Textarea
                  rows={2}
                  value={prompts.message}
                  onChange={(e) => setPrompts({ ...prompts, message: e.target.value })}
                  placeholder="You were wished for, loved, and so very wanted."
                />
              </Field>
              <button
                type="button"
                className="self-start inline-flex items-center gap-2 rounded-full bg-secondary/70 hover:bg-secondary px-4 py-2 text-sm"
              >
                <Mic className="h-4 w-4" /> Record a memory instead
              </button>
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="Your family" subtitle="Every family story is welcome here.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FAMILY_TYPES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFamily(f)}
                  className={`rounded-2xl px-3 py-3 text-sm border transition ${family === f ? "bg-primary text-primary-foreground border-transparent" : "bg-card hover:bg-secondary border-border"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Field label="Child's name">
                <Input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Sienna"
                />
              </Field>
              <Field label="Mom's name">
                <Input
                  value={momName}
                  onChange={(e) => setMomName(e.target.value)}
                  placeholder="Maya"
                />
              </Field>
              <Field label="Partner / family names (optional)">
                <Input
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  placeholder="Sam, Grandma Rose…"
                />
              </Field>
              <Field label="Dedication line">
                <Input
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="For our little star, with all our love."
                />
              </Field>
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step title="Choose your story vibe" subtitle="How should it feel to read?">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VIBES.map((v) => (
                <SelectCard key={v.id} active={vibe === v.id} onClick={() => setVibe(v.id)}>
                  <div className="text-2xl">{v.emoji}</div>
                  <p className="font-display mt-1">{v.title}</p>
                </SelectCard>
              ))}
            </div>
          </Step>
        )}

        {step === 5 && (
          <Step
            title="Choose an illustration style"
            subtitle="We'll turn your photos into family-friendly cartoon illustrations."
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ILLUSTRATIONS.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setIllustration(i.id)}
                  className={`rounded-3xl overflow-hidden text-left border-2 transition ${illustration === i.id ? "border-primary shadow-[var(--shadow-soft)]" : "border-transparent hover:border-border"}`}
                >
                  <div className={`aspect-[4/3] bg-gradient-to-br ${i.swatch}`} />
                  <div className="p-3 bg-card">
                    <p className="font-display">{i.title}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Photos are transformed into cozy, family-friendly cartoon illustrations — never used
              for anything else.
            </p>
          </Step>
        )}

        {step === 6 && (
          <Step
            title={generating ? "Sprinkling story magic…" : "Ready to create your storybook"}
            subtitle={
              generating
                ? undefined
                : "We'll turn your memories into a beautiful illustrated keepsake."
            }
          >
            {generating ? (
              <GeneratingAnimation />
            ) : (
              <div className="grid gap-3">
                <Summary k="Story type" v={STORY_TYPES.find((x) => x.id === type)?.title || "—"} />
                <Summary k="Photos" v={`${photos.length} uploaded`} />
                <Summary k="Family" v={family || "—"} />
                <Summary k="For" v={childName || "your little one"} />
                <Summary k="Vibe" v={VIBES.find((x) => x.id === vibe)?.title || "—"} />
                <Summary
                  k="Illustration"
                  v={ILLUSTRATIONS.find((x) => x.id === illustration)?.title || "—"}
                />
                <Button size="lg" className="rounded-full mt-4 h-12" onClick={generate}>
                  <Sparkles className="h-4 w-4" /> Generate my storybook
                </Button>
              </div>
            )}
          </Step>
        )}
      </div>

      {!generating && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" className="rounded-full" onClick={goBack} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button className="rounded-full" disabled={!canNext} onClick={goNext}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function SelectCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-3xl p-4 border-2 transition ${active ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]" : "border-border bg-card hover:bg-secondary/50"}`}
    >
      {children}
      {active && (
        <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary">
          <Check className="h-3 w-3" /> Selected
        </span>
      )}
    </button>
  );
}

function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-center bg-secondary/40 rounded-2xl px-4 py-3">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="font-medium text-sm">{v}</span>
    </div>
  );
}

function GeneratingAnimation() {
  const messages = [
    "Sprinkling story magic…",
    "Turning memories into pages…",
    "Painting your little moments…",
    "Writing something beautiful…",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % messages.length), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="py-10 text-center">
      <div className="relative h-32 w-32 mx-auto">
        <div className="absolute inset-0 rounded-full magic-gradient blur-xl opacity-70 animate-pulse" />
        <div className="relative h-full w-full rounded-full magic-gradient grid place-items-center">
          <Sparkles className="h-10 w-10 text-foreground/80 animate-sparkle" />
        </div>
      </div>
      <p className="mt-6 font-display text-xl">{messages[i]}</p>
      <p className="text-sm text-muted-foreground mt-1">This usually takes a few moments.</p>
    </div>
  );
}

function PhotoUploader({
  photos,
  setPhotos,
}: {
  photos: { url: string; label?: string; name: string; file?: File }[];
  setPhotos: (p: { url: string; label?: string; name: string; file?: File }[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 8 - photos.length);
    const next = arr.map((f) => ({ url: URL.createObjectURL(f), name: f.name, file: f }));
    setPhotos([...photos, ...next]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition ${drag ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40"}`}
      >
        <Upload className="h-7 w-7 mx-auto text-primary" />
        <p className="font-display text-lg mt-2">Drag & drop your photos</p>
        <p className="text-sm text-muted-foreground">or tap to browse — JPG / PNG / HEIC</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
          {photos.map((p, idx) => (
            <div key={idx} className="cozy-card p-2 relative">
              <button
                onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-background/90 grid place-items-center shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <img src={p.url} alt="" className="aspect-square object-cover rounded-2xl w-full" />
              <select
                value={p.label || ""}
                onChange={(e) => {
                  const n = [...photos];
                  n[idx] = { ...p, label: e.target.value };
                  setPhotos(n);
                }}
                className="mt-2 w-full text-xs rounded-full bg-secondary px-3 py-1.5 outline-none"
              >
                <option value="">Add label (optional)</option>
                {PHOTO_LABELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        {photos.length}/8 photos · we recommend 3–8
      </p>
    </div>
  );
}

function CoverUploader({
  cover,
  setCover,
}: {
  cover: { url: string; name: string; file: File } | null;
  setCover: (c: { url: string; name: string; file: File } | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onPick = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setCover({ url: URL.createObjectURL(f), name: f.name, file: f });
  };
  if (cover) {
    return (
      <div className="cozy-card p-3 flex items-center gap-3">
        <img
          src={cover.url}
          alt="Cover"
          className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/40"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm truncate">{cover.name}</p>
          <p className="text-xs text-muted-foreground">Your storybook cover ✨</p>
        </div>
        <button
          onClick={() => setCover(null)}
          className="h-8 w-8 rounded-full bg-secondary grid place-items-center shrink-0"
          aria-label="Remove cover photo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center cursor-pointer hover:bg-primary/10 transition"
    >
      <Sparkles className="h-6 w-6 mx-auto text-primary" />
      <p className="font-display mt-2">Tap to upload your cover photo</p>
      <p className="text-xs text-muted-foreground">One special picture for the front page</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files)}
      />
    </div>
  );
}
