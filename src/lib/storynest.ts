import pregnancyImg from "@/assets/page-pregnancy.jpg";
import bedtimeImg from "@/assets/page-bedtime.jpg";
import familyImg from "@/assets/page-family.jpg";
import coverImg from "@/assets/cover-mom-baby.jpg";

export type StoryPage = { text: string; image: string };
export type Story = {
  id: string;
  title: string;
  dedication: string;
  type: string;
  vibe: string;
  illustration: string;
  cover: string;
  pages: StoryPage[];
  createdAt: string;
};

export const STORY_TYPES = [
  { id: "pregnancy", title: "Pregnancy Journey", icon: "🤰", desc: "Document the magic of growing a tiny human." },
  { id: "newborn", title: "Newborn Story", icon: "🍼", desc: "Those first soft, sleepy, snuggly days." },
  { id: "milestone", title: "Baby Milestone", icon: "✨", desc: "First smiles, first steps, first everythings." },
  { id: "family", title: "Family Story", icon: "🏡", desc: "The little world you’re building together." },
  { id: "bedtime", title: "Bedtime Adventure", icon: "🌙", desc: "Turn real moments into a goodnight tale." },
  { id: "shower", title: "Baby Shower Gift", icon: "🎁", desc: "A keepsake for the mama-to-be." },
];

export const VIBES = [
  { id: "magical", title: "Magical bedtime", emoji: "🌙" },
  { id: "funny", title: "Funny & playful", emoji: "🎈" },
  { id: "soft", title: "Soft & emotional", emoji: "💗" },
  { id: "adventure", title: "Adventure story", emoji: "🗺️" },
  { id: "fairytale", title: "Fairytale", emoji: "🏰" },
  { id: "letter", title: "Letter to my baby", emoji: "💌" },
  { id: "mom-voice", title: "First-person mom voice", emoji: "🤍" },
  { id: "toddler", title: "Simple toddler story", emoji: "🧸" },
];

export const ILLUSTRATIONS = [
  { id: "pastel", title: "Pastel cartoon", swatch: "from-pink-200 via-rose-100 to-amber-100" },
  { id: "watercolor", title: "Watercolor storybook", swatch: "from-violet-200 via-pink-100 to-amber-100" },
  { id: "cozy", title: "Cozy bedtime", swatch: "from-indigo-200 via-purple-100 to-pink-100" },
  { id: "doodle", title: "Cute doodle", swatch: "from-amber-100 via-rose-100 to-pink-200" },
  { id: "soft3d", title: "Soft 3D cartoon", swatch: "from-rose-100 via-pink-200 to-violet-200" },
  { id: "classic", title: "Classic storybook", swatch: "from-emerald-100 via-amber-100 to-rose-100" },
];

export const FAMILY_TYPES = [
  "Mom and baby",
  "Mom, dad and baby",
  "Single mom family",
  "Grandparents included",
  "Adoptive family",
  "Two moms",
  "Two dads",
  "Blended family",
  "Custom family",
];

export const PHOTO_LABELS = [
  "Ultrasound", "Bump photo", "First smile", "Family moment", "Homecoming", "Birthday", "Other memory",
];

export const TEMPLATES = [
  { id: "announcement", title: "Pregnancy announcement", emoji: "💗", desc: "Share the happy news in a magical way." },
  { id: "shower", title: "Baby shower gift book", emoji: "🎀", desc: "A heartfelt keepsake for the mama-to-be." },
  { id: "first-mday", title: "First Mother’s Day story", emoji: "🌷", desc: "A love letter for her very first one." },
  { id: "nicu", title: "NICU strength story", emoji: "🌟", desc: "Honor the bravest tiny fighters." },
  { id: "rainbow", title: "Rainbow baby journey", emoji: "🌈", desc: "Hope, healing, and a tiny miracle." },
  { id: "first-bday", title: "First birthday memory book", emoji: "🎂", desc: "A whole year of firsts in one keepsake." },
  { id: "grandparents", title: "Grandparents’ love story", emoji: "👵", desc: "Generations of love, told gently." },
  { id: "sibling", title: "Sibling welcome story", emoji: "🧸", desc: "A sweet hello from big sister or brother." },
];

export const SAMPLE_PAGES: StoryPage[] = [
  { text: "Before you were in our arms, you were already in our hearts.", image: pregnancyImg },
  { text: "Mama smiled every time she imagined the little adventures waiting for us.", image: coverImg },
  { text: "Our family grew not just in size, but in love, laughter, and tiny dreams.", image: familyImg },
  { text: "And when you arrived, the whole world felt softer, brighter, and full of magic.", image: bedtimeImg },
  { text: "This is your story, little one — and it is only the beginning.", image: coverImg },
];

export const SAMPLE_COVER = coverImg;

const KEY = "storynest:stories";
const PROFILE_KEY = "storynest:profile";

export function getStories(): Story[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveStory(s: Story) {
  const all = getStories().filter((x) => x.id !== s.id);
  all.unshift(s);
  localStorage.setItem(KEY, JSON.stringify(all));
}
export function getStory(id: string): Story | null {
  return getStories().find((s) => s.id === id) || null;
}
export function deleteStory(id: string) {
  localStorage.setItem(KEY, JSON.stringify(getStories().filter((s) => s.id !== id)));
}

export type Profile = { name: string; childName?: string; partner?: string; email?: string };
export function getProfile(): Profile {
  if (typeof window === "undefined") return { name: "Mama" };
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") || { name: "Mama" }; } catch { return { name: "Mama" }; }
}
export function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function generateMockStory(input: {
  type: string; childName?: string; momName?: string; vibe: string; illustration: string; dedication?: string;
  prompts: { what: string; who: string; special: string; feeling: string; message: string };
}): Story {
  const child = input.childName?.trim() || "little one";
  const title = input.type === "pregnancy" ? `The Day You Became Our Little Star`
    : input.type === "bedtime" ? `Goodnight, Sweet ${child}`
    : input.type === "family" ? `Our Family’s Tiny Magic`
    : input.type === "milestone" ? `${child}’s Very First Wonder`
    : input.type === "shower" ? `A Little Wish for ${child}`
    : `The Story of ${child}`;

  const pages: StoryPage[] = [
    { text: input.prompts.what
        ? `It started like this — ${input.prompts.what.toLowerCase()}.`
        : `Before you were in our arms, you were already in our hearts.`,
      image: pregnancyImg },
    { text: input.prompts.special
        ? `What made it special was simple: ${input.prompts.special.toLowerCase()}.`
        : `Mama smiled every time she imagined the little adventures waiting for us.`,
      image: coverImg },
    { text: input.prompts.who
        ? `And there we were — ${input.prompts.who} — soft, silly, and full of love.`
        : `Our family grew not just in size, but in love, laughter, and tiny dreams.`,
      image: familyImg },
    { text: input.prompts.feeling
        ? `It felt ${input.prompts.feeling.toLowerCase()}, like the world had hushed just for us.`
        : `And when you arrived, the whole world felt softer, brighter, and full of magic.`,
      image: bedtimeImg },
    { text: input.prompts.message
        ? `Remember always, ${child}: ${input.prompts.message}`
        : `This is your story, little one — and it is only the beginning.`,
      image: coverImg },
  ];

  return {
    id: crypto.randomUUID(),
    title,
    dedication: input.dedication || `For ${child}, with all our love.`,
    type: input.type,
    vibe: input.vibe,
    illustration: input.illustration,
    cover: coverImg,
    pages,
    createdAt: new Date().toISOString(),
  };
}
