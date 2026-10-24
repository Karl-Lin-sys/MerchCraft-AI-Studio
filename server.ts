import { localApiOnly } from './local-api-guard.mjs';
import express, { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use('/api', localApiOnly(() => PORT));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware for parsing json with generous limit for image payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Status endpoint
app.get("/api/status", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(apiKey),
    supportedModels: {
      imageGeneration: "gemini-nano-banana-2.1",
      imageEditing: "gemini-nano-banana-2.1",
      textReasoning: "gemini-3.8-flash",
    },
  });
});

// Helper to extract base64 data and mimeType
function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return { mimeType: matches[1], data: matches[2] };
  }
  // Default fallback if raw base64
  return { mimeType: "image/png", data: dataUrl };
}

// Generate new mockup scene using Gemini Nano Banana 2.1
app.post("/api/ai/generate-mockup-scene", async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in secrets.",
    });
  }

  const {
    prompt,
    productType = "T-Shirt",
    garmentColor = "White",
    aspectRatio = "1:1",
    logoBase64,
  } = req.body;

  if (!prompt && !logoBase64) {
    return res.status(400).json({ error: "A prompt or logo reference is required." });
  }

  try {
    const parts: any[] = [];

    // If logo provided, attach it as visual reference
    if (logoBase64) {
      const parsed = parseDataUrl(logoBase64);
      parts.push({
        inlineData: {
          mimeType: parsed.mimeType,
          data: parsed.data,
        },
      });
    }

    const enhancedPrompt = `High quality commercial product photography of merchandise mockup:
Product: ${garmentColor} ${productType}.
Setting / Scene: ${prompt || "clean modern studio backdrop with soft natural lighting and subtle shadows"}.
${logoBase64 ? "Incorporate the provided logo graphic naturally printed on the apparel/product chest or front center surface with realistic fabric texture and draping." : ""}
Shot style: photorealistic 4k studio photography, crisp details, editorial catalog look, clean composition.`;

    parts.push({ text: enhancedPrompt });

    // Use gemini-nano-banana-2.1 for high-quality image generation
    const response = await ai.models.generateContent({
      model: "gemini-nano-banana-2.1",
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: (["1:1", "3:4", "4:3", "16:9", "9:16"].includes(aspectRatio)
            ? aspectRatio
            : "1:1") as any,
          imageSize: "1K",
        },
      },
    });

    // Iterate parts to locate generated image
    let generatedImageUrl = "";
    let captionText = "";

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(502).json({
        error: "No image was returned by the model.",
        details: captionText || "The model may have provided a text response instead of an image.",
      });
    }

    return res.json({
      imageUrl: generatedImageUrl,
      caption: captionText,
      modelUsed: "gemini-nano-banana-2.1",
    });
  } catch (err: any) {
    console.error("AI scene generation error:", err);
    return res.status(500).json({
      error: err?.message || "Failed to generate mockup scene with AI.",
    });
  }
});

// Edit existing mockup scene using Gemini Nano Banana 2.1
app.post("/api/ai/edit-mockup", async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key is not configured.",
    });
  }

  const { prompt, currentImageBase64 } = req.body;

  if (!prompt || !currentImageBase64) {
    return res.status(400).json({
      error: "Both prompt and currentImageBase64 are required to edit mockup.",
    });
  }

  try {
    const parsed = parseDataUrl(currentImageBase64);
    const parts = [
      {
        inlineData: {
          mimeType: parsed.mimeType,
          data: parsed.data,
        },
      },
      {
        text: `Edit this merchandise product shot according to instructions: ${prompt}. Preserve the overall product silhouette and printed logo positioning while updating the scene, lighting, background, or fabric color as requested. High commercial photography quality.`,
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-nano-banana-2.1",
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K",
        },
      },
    });

    let generatedImageUrl = "";
    let captionText = "";

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(502).json({
        error: "No image returned by the edit model.",
        details: captionText,
      });
    }

    return res.json({
      imageUrl: generatedImageUrl,
      caption: captionText,
      modelUsed: "gemini-nano-banana-2.1",
    });
  } catch (err: any) {
    console.error("AI edit error:", err);
    return res.status(500).json({
      error: err?.message || "Failed to edit mockup with AI.",
    });
  }
});

// Analyze uploaded logo for merch color matching, print technique, and aesthetic advice
app.post("/api/ai/analyze-logo", async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key is not configured.",
    });
  }

  const { logoBase64 } = req.body;
  if (!logoBase64) {
    return res.status(400).json({ error: "logoBase64 is required." });
  }

  try {
    const parsed = parseDataUrl(logoBase64);
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: parsed.mimeType,
              data: parsed.data,
            },
          },
          {
            text: `You are an expert master apparel production director and merchandise designer.
Analyze this logo artwork and respond with pure JSON only (no markdown code blocks, just JSON) conforming to this format:
{
  "genre": "e.g. Streetwear / Tech Startup / Heritage Outdoor / Minimalist Artisan / Y2K Cyberpunk",
  "dominantColors": ["#HEX1", "#HEX2", "#HEX3"],
  "recommendedGarmentColors": [
    {"name": "Washed Charcoal", "hex": "#27272a", "reason": "High contrast and premium drape"},
    {"name": "Vintage Sand", "hex": "#e7e5e4", "reason": "Organic earthy tone complementary to warm tones"},
    {"name": "Off-White Cream", "hex": "#f5f5f4", "reason": "Crisp, timeless gallery feel"}
  ],
  "recommendedPrintTechnique": "Direct to Garment (DTG) or Screen Print or Puff Print or High-Density Embroidery",
  "printTechniqueDetails": "1-2 sentences explaining why this method suits the artwork details",
  "recommendedPlacement": "Center Chest (10x12in) or Left Chest Pocket (3.5x3.5in) or Oversized Back Print",
  "designTips": ["Tip 1 for high print durability", "Tip 2 for merchandising success"],
  "creativeScenePrompts": [
    "Scene prompt 1 for product photoshoot",
    "Scene prompt 2 for lifestyle shoot",
    "Scene prompt 3 for e-commerce catalog"
  ]
}`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);

    return res.json(data);
  } catch (err: any) {
    console.error("Logo analysis error:", err);
    return res.status(500).json({
      error: err?.message || "Failed to analyze logo.",
    });
  }
});

// Scene prompt suggestions
app.post("/api/ai/suggest-prompts", async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key is not configured.",
    });
  }

  const { productType = "T-Shirt", mood = "Streetwear Studio" } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Provide 5 creative and realistic photoshoot setting prompts for an on-demand merchandise mockup of a ${productType} with a ${mood} vibe.
Respond strictly in JSON format as an array of objects:
[
  { "title": "Short title", "prompt": "Descriptive photoshoot environment prompt for image generation" }
]`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "[]";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const prompts = JSON.parse(cleaned);
    return res.json({ prompts });
  } catch (err: any) {
    console.error("Suggest prompts error:", err);
    return res.status(500).json({
      error: err?.message || "Failed to generate prompt suggestions.",
    });
  }
});

// Frontend Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`MerchCraft AI Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
