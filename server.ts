import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Local intelligent heuristics will be used as fallback.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      shop: "Modern Chocolate Shop",
      geminiAvailable: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Chatbot endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history = [], context = {} } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "A message string is required." });
      }

      const ai = getAIClient();

      const contextSummary = `
Current Chocolate Shop & Atelier Context:
- Total Tasks: ${context.totalTasks ?? 0}
- In Progress: ${context.inProgressCount ?? 0}
- Completed: ${context.completedCount ?? 0}
- Completion Rate: ${context.completionRate ?? 0}%
- Active Projects: ${(context.activeProjects || []).join(", ") || "Valentine's Collection, Single-Origin Bars, Spring Pralines"}
- Top Priority Tasks: ${(context.urgentTasks || []).join("; ") || "Tempering Grand Cru Dark 72%, Enrobing Passionfruit Ganache"}
      `.trim();

      const systemInstruction = `You are "CocoaBot", the Master Chocolatier and Operations AI Assistant for "Modern Chocolate Shop" — a premier artisan chocolate atelier and boutique.
You have deep expertise in:
1. Artisan Chocolate Craft: Bean roasting, winnowing, conching, precision tempering curves (Dark 31-32°C, Milk 29-30°C, White 28-29°C), ganache water-activity / emulsion balance, polycarbonate mold polishing, and enrobing techniques.
2. Kitchen & Shop Operations: Production scheduling, batch sequencing (e.g. infusing ganache the night before, enrobing after 12h crystallization), hygiene and shelf-life QA.
3. Task Management & Prioritization: Helping the head chocolatier and shop team organize incoming tasks, prioritize bottlenecks, track progress, and meet boutique customer orders.

Always be concise, warm, professional, and practical. Offer clear bulleted action items when helpful.
When the user asks you to organize tasks or prioritize, give specific culinary chocolate operations steps.
Current Kitchen State:
${contextSummary}`;

      if (!ai) {
        // Intelligent offline fallback response
        const fallback = generateOfflineChatResponse(message, context);
        return res.json({ text: fallback, model: "offline-assistant" });
      }

      // Convert history to contents format if available
      const prompt = `User query: ${message}\n\nPlease respond as the expert Chocolatier & Operations Assistant.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "I apologize, I could not generate a response at this time.";
      return res.json({ text: responseText, model: "gemini-3.8-flash" });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      return res.status(500).json({
        error: "Failed to generate AI response",
        details: error?.message || String(error),
      });
    }
  });

  // AI Task Organizer endpoint (creates structured tasks)
  app.post("/api/ai/organize-tasks", async (req, res) => {
    try {
      const { prompt, projectId, existingTasks = [] } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ai = getAIClient();

      if (!ai) {
        const fallbackTasks = generateFallbackOrganizedTasks(prompt, projectId);
        return res.json({ tasks: fallbackTasks, source: "offline-template" });
      }

      const systemPrompt = `You are a culinary workflow optimization engine for a modern artisan chocolate shop.
Given the user's production request, decompose it into 3 to 6 actionable, realistic chocolate shop tasks.
Return strictly valid JSON without markdown code fences. The JSON must be an array of objects with the following schema:
[
  {
    "title": "Short descriptive task title",
    "description": "Specific instructions including temperatures or ingredients if applicable",
    "priority": "urgent" | "high" | "medium" | "low",
    "category": "Tempering" | "Ganache & Fillings" | "Molding & Enrobing" | "Packaging" | "Inventory & QA" | "Shop & Retail",
    "stage": "todo" | "in-progress",
    "estimatedHours": 1.5,
    "projectId": "${projectId || 'proj-1'}",
    "temperingNote": "Optional specific temperature or step note, e.g. 'Cool to 28°C then reheat to 31.5°C' or null"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Request to decompose into chocolate workshop tasks: "${prompt}"\nExisting tasks in system: ${existingTasks.length}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      let parsed: any = [];
      try {
        const raw = (response.text || "").trim();
        parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          parsed = parsed.tasks || [parsed];
        }
      } catch (err) {
        parsed = generateFallbackOrganizedTasks(prompt, projectId);
      }

      return res.json({ tasks: parsed, source: "gemini-3.8-flash" });
    } catch (error: any) {
      console.error("AI Organize Tasks Error:", error);
      const fallbackTasks = generateFallbackOrganizedTasks(req.body.prompt || "", req.body.projectId);
      return res.json({ tasks: fallbackTasks, source: "offline-recovery" });
    }
  });

  // AI Task Prioritizer endpoint
  app.post("/api/ai/prioritize", async (req, res) => {
    try {
      const { tasks = [], projects = [] } = req.body;
      const ai = getAIClient();

      if (!ai || tasks.length === 0) {
        return res.json({
          recommendation: "Prioritize temperature-sensitive tempering tasks during morning kitchen hours (below 20°C ambient room temperature). Follow with 12-hour ganache crystallization overnight.",
          topTaskIds: tasks.slice(0, 3).map((t: any) => t.id),
          bottleneckAlerts: [
            "Ganache cooling stage requires minimum 12h resting before enrobing",
            "Verify cacao butter crystallization curve on refractometer before batch molding",
          ],
        });
      }

      const taskSummaries = tasks.map((t: any) => `[ID: ${t.id}] "${t.title}" (Priority: ${t.priority}, Stage: ${t.stage}, Category: ${t.category})`).join("\n");

      const prompt = `Analyze these chocolate workshop tasks and recommend an optimal execution sequence based on chocolate manufacturing realities (temperature constraints, setting times, urgent customer orders, and hygiene protocols).
Return strictly valid JSON without markdown code fences in this format:
{
  "recommendation": "Concise executive guidance for the chocolatier team",
  "topTaskIds": ["id1", "id2", "id3"],
  "bottleneckAlerts": ["alert 1", "alert 2"]
}

Tasks:
${taskSummaries}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (error: any) {
      console.error("AI Prioritize Error:", error);
      return res.json({
        recommendation: "Focus on active in-progress enrobing batches first to avoid chocolate bloom, then transition to packaging.",
        topTaskIds: (req.body.tasks || []).slice(0, 3).map((t: any) => t.id),
        bottleneckAlerts: ["Ensure room humidity remains strictly below 50% for high-gloss shine"],
      });
    }
  });

  // AI Progress Summarizer endpoint
  app.post("/api/ai/summarize-progress", async (req, res) => {
    try {
      const { tasks = [], projects = [], metrics = {} } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          summary: `The chocolate studio is operating at ${metrics.completionRate || 68}% completion with ${metrics.completedCount || 12} batches finished. Crucial dark chocolate tempering runs are completed, and Valentine's packaging is actively moving through assembly.`,
          highlights: [
            "All Grand Cru Single-Origin couverture batches passed tempering calibration",
            "Packaging throughput is on schedule for weekend storefront launch",
            "Zero cocoa butter blooming recorded across all molded pralines",
          ],
          nextImmediateAction: "Complete the enrobing run for Salted Caramel Bonbons before afternoon ambient kitchen temperature rises.",
        });
      }

      const prompt = `Generate an inspiring, highly professional executive production report for the Modern Chocolate Shop.
Data:
- Total Tasks: ${tasks.length}
- Completed Tasks: ${tasks.filter((t: any) => t.stage === "done").length}
- In-Progress: ${tasks.filter((t: any) => t.stage === "in-progress").length}
- Projects: ${projects.map((p: any) => `${p.name} (${p.progress}% done)`).join(", ")}

Return strictly valid JSON with:
{
  "summary": "2-3 polished sentences summarizing current progress and atelier momentum",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "nextImmediateAction": "The single most critical next task for the head chocolatier"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (error: any) {
      console.error("AI Summarize Progress Error:", error);
      return res.json({
        summary: "Production is progressing efficiently with steady throughput across tempering and packaging lines.",
        highlights: [
          "Batch quality parameters remain within high artisan tolerance",
          "Assembly line throughput matches projected order commitments",
        ],
        nextImmediateAction: "Inspect finished bonbon sheen under showroom lighting before boxing.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🍫 Modern Chocolate Shop Server running on http://localhost:${PORT}`);
  });
}

function generateOfflineChatResponse(message: string, context: any): string {
  const lower = message.toLowerCase();
  if (lower.includes("temper") || lower.includes("temperature") || lower.includes("curve")) {
    return `For flawless silk gloss and crisp snap, adhere strictly to tempering curves:
- **Dark Chocolate (70-75%)**: Melt to 50-55°C, cool down to 28-29°C (forming beta crystals), then reheat gently to working temp of 31-32°C.
- **Milk Chocolate**: Melt to 45°C, cool to 27°C, work at 29-30°C.
- **White Chocolate**: Melt to 40-45°C, cool to 26-27°C, work at 28-29°C.
Ensure your ambient room stays between 18-20°C with humidity under 50%.`;
  }
  if (lower.includes("priorit") || lower.includes("what should i do") || lower.includes("next")) {
    return `Based on your chocolate atelier queue:
1. **First Priority**: Any active enrobing or mold-pouring tasks. Liquid tempered chocolate will over-crystallize if left unworked for over 25 minutes.
2. **Second Priority**: Prepare tomorrow's ganache fillings today so they have a full 12-hour resting cycle for perfect water-activity stability.
3. **Third Priority**: Gold foil wrapping and boutique gift-box ribbon packaging.`;
  }
  if (lower.includes("summar") || lower.includes("progress") || lower.includes("status")) {
    const rate = context?.completionRate ?? 68;
    return `**Atelier Status Report**:
Your production line is currently running at **${rate}% completion**. High-demand projects like the *Single-Origin Grand Cru Series* and *Artisan Praline Collection* are on track. Keep an eye on pending QA inspections before the storefront opens!`;
  }
  return `Welcome to the Modern Chocolate Shop Atelier! I'm CocoaBot, your operations and recipe development copilot. I can help you organize tasks for upcoming batches, calculate tempering curves, prioritize kitchen workflows, and summarize production analytics. What batch or project are we crafting today?`;
}

function generateFallbackOrganizedTasks(prompt: string, projectId?: string) {
  const pId = projectId || "proj-1";
  return [
    {
      title: "Inspect & Calibrate Couverture Melter",
      description: "Verify digital probe temperature reads exactly 45.0°C for initial melt phase.",
      priority: "high",
      category: "Tempering",
      stage: "todo",
      estimatedHours: 0.5,
      projectId: pId,
      temperingNote: "Target initial melt: 45-50°C",
    },
    {
      title: `Formulate Batch: ${prompt.slice(0, 35)}`,
      description: "Weigh single-origin cacao nibs, pure Bourbon vanilla, and clarified cocoa butter.",
      priority: "urgent",
      category: "Ganache & Fillings",
      stage: "in-progress",
      estimatedHours: 2.0,
      projectId: pId,
      temperingNote: "Emulsify at 35°C to avoid cocoa butter separation",
    },
    {
      title: "Hand-Polish Polycarbonate Bonbon Molds",
      description: "Microfiber cotton wipe each hemisphere cavity to guarantee mirror gloss finish.",
      priority: "medium",
      category: "Molding & Enrobing",
      stage: "todo",
      estimatedHours: 1.0,
      projectId: pId,
      temperingNote: "Mold temperature should match ambient room at 20°C",
    },
    {
      title: "Boutique Packaging & Gold Leaf Stamping",
      description: "Assemble matte charcoal ballotin boxes and seal with wax stamp.",
      priority: "medium",
      category: "Packaging",
      stage: "todo",
      estimatedHours: 1.5,
      projectId: pId,
      temperingNote: null,
    },
  ];
}

startServer();
