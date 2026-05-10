import { createServerFn } from "@tanstack/react-start";

type Input = { imageDataUrl: string; prompt: string };

export const cartoonifyImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): Input => {
    const d = data as Input;
    if (!d?.imageDataUrl || !d?.prompt) throw new Error("Missing input");
    return d;
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: data.imageDataUrl } },
              { type: "text", text: data.prompt },
            ],
          },
        ],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`AI gateway ${resp.status}: ${t.slice(0, 200)}`);
    }
    const json = await resp.json();
    const url: string | undefined = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!url) throw new Error("No image returned");
    return { url };
  });
