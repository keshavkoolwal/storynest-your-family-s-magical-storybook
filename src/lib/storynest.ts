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
  images?: string[];
}): Story {
  const child = input.childName?.trim() || "little one";
  const title = input.type === "pregnancy" ? `The Day You Became Our Little Star`
    : input.type === "bedtime" ? `Goodnight, Sweet ${child}`
    : input.type === "family" ? `Our Family’s Tiny Magic`
    : input.type === "milestone" ? `${child}’s Very First Wonder`
    : input.type === "shower" ? `A Little Wish for ${child}`
    : `The Story of ${child}`;

  const mom = input.momName?.trim() || "Mama";
  const lc = (s?: string) => (s ? s.trim().replace(/[.!?]+$/, "").toLowerCase() : "");
  const what = lc(input.prompts.what);
  const who = lc(input.prompts.who);
  const special = lc(input.prompts.special);
  const feeling = lc(input.prompts.feeling);
  const message = input.prompts.message?.trim();

  const pages: StoryPage[] = [
    { text: `Once, in a quiet little corner of the world, a wish curled up beside ${mom}'s heart and decided to stay. ${
        what ? `It began the day ${what} — a moment so small, and yet, somehow, big enough to change everything.` :
        `Long before ${child} could be held, ${child} was already loved, already imagined, already humming softly inside every one of ${mom}'s dreams.`
      }`,
      image: pregnancyImg },
    { text: `The days grew slower and sweeter, the way honey moves in winter. ${mom} would rest a hand on her heart and whisper hello to the tiny soul who hadn't arrived yet, but already felt like home. ${
        feeling ? `It all felt ${feeling} — a kind of soft, glowing hush only love knows how to make.` :
        `Every sunrise felt like a small promise, and every quiet evening felt like a lullaby waiting to be sung.`
      }`,
      image: coverImg },
    { text: `${
        special ? `What made it most magical was simply this: ${special}. Such a little thing, and yet it sparkled like starlight tucked into an ordinary day.` :
        `There was magic in the ordinary — in warm tea, in folded tiny socks, in the hush of a hand resting on a growing belly. The whole world seemed to lean a little closer, listening for ${child}.`
      }`,
      image: pregnancyImg },
    { text: `${
        who ? `And then there were the people who loved ${child} first — ${input.prompts.who}. They gathered like soft lanterns, each one carrying a different shade of love, all of them glowing for the same little soul.` :
        `Family gathered like soft lanterns around the wish — each one carrying a different shade of love, all of them glowing for the same little soul.`
      } Together, they built a nest out of laughter, late-night talks, and quietly folded baby clothes.`,
      image: familyImg },
    { text: `When the day finally came, the whole world seemed to tiptoe. The clocks slowed. The light went golden. And in one breath-held moment, the wish became a person — small, perfect, and impossibly real. ${
        feeling ? `It felt ${feeling}, the way only the very best moments can.` :
        `Everything that had ever been hoped for fit, somehow, into one tiny pair of hands.`
      }`,
      image: bedtimeImg },
    { text: `From that night on, the house was never quite the same. There were sleepy songs at 3am, and tiny toes that curled like little question marks. There were yawns and giggles and the soft, surprised sound of new love learning its own name. And ${mom} — oh, ${mom} — she had never felt more tired, or more whole.`,
      image: familyImg },
    { text: `${
        message ? `So remember, sweet ${child}, what ${mom} wants you to carry always: ${message}` :
        `So remember, sweet ${child}: you were wanted before you were known, loved before you were held, and woven into this family by a thousand small, shining moments.`
      } This story is yours now — a little keepsake of where you began. And the rest of it, my love, is only just unfolding.`,
      image: coverImg },
  ];

  // If custom cartoon images were provided (from user's photos), override the stock images.
  if (input.images && input.images.length > 0) {
    const imgs = input.images;
    pages.forEach((p, i) => { p.image = imgs[i % imgs.length]; });
  }


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
