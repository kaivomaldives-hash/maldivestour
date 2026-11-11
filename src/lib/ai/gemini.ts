import "server-only";

/**
 * Minimal Google Gemini client for small JSON-returning tasks (writing a
 * listing's name and description, reading a partner's pasted product
 * details). Uses the REST API directly, so there is no extra dependency.
 *
 * Configure with GEMINI_API_KEY (from Google AI Studio; the free tier is
 * enough to start) and optionally GEMINI_MODEL. Without a key every AI
 * feature hides itself and the forms work as before.
 */

const DEFAULT_MODEL = "gemini-flash-lite-latest";
const TIMEOUT_MS = 30_000;

export function isAiEnabled(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/** Gemini's response schema: an OpenAPI subset with upper-case type names. */
export interface GeminiSchema {
  type: "OBJECT" | "STRING" | "NUMBER" | "INTEGER" | "BOOLEAN" | "ARRAY";
  description?: string;
  nullable?: boolean;
  enum?: string[];
  properties?: Record<string, GeminiSchema>;
  required?: string[];
  items?: GeminiSchema;
}

export type GeminiResult<T> = { ok: true; data: T } | { ok: false; error: string };

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { code?: number; message?: string; status?: string };
}

export async function generateJson<T>({ system, prompt, schema, temperature = 0.4 }: { system: string; prompt: string; schema: GeminiSchema; temperature?: number }): Promise<GeminiResult<T>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { ok: false, error: "AI isn't set up yet." };
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  let response: Response;
  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "The AI didn't answer in time. Please try again." };
  }

  const body = (await response.json().catch(() => ({}))) as GeminiResponse;
  if (!response.ok) {
    console.error("Gemini error", response.status, body.error?.status, body.error?.message);
    if (response.status === 429) return { ok: false, error: "The AI is busy right now (daily limit reached). Please try again later." };
    return { ok: false, error: "The AI couldn't help with this right now. Please try again later." };
  }
  if (body.promptFeedback?.blockReason) return { ok: false, error: "The AI couldn't work with this text." };

  const text = (body.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, error: "The AI's answer couldn't be read. Please try again." };
  }
}

// One container serves the site, so a simple in-memory limit per user is
// enough to stop one account using up the shared free daily quota.
const usage = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 30;

export function takeAiQuota(userId: string): boolean {
  const now = Date.now();
  const recent = (usage.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    usage.set(userId, recent);
    return false;
  }
  recent.push(now);
  usage.set(userId, recent);
  return true;
}
