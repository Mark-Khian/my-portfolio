import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/ai-knowledge";

// ── In-memory rate limiter (per-IP, resets on cold start) ─────────────────────
// For production, replace with Redis/KV store (e.g. Vercel KV)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;        // max requests
const RATE_WINDOW_MS = 60_000; // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { code: "AI_UNAVAILABLE", message: "Portfolio Assistant is temporarily unavailable." },
      { status: 503 },
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Cap conversation history to last 10 messages to control token usage
  const trimmedMessages = messages.slice(-10);

  // Gemini expects alternating user/model roles — map "assistant" -> "model"
  const geminiContents = trimmedMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Gemini error:", JSON.stringify(err, null, 2));
      
      const isApiKeyError = response.status === 400 && err?.error?.details?.[0]?.reason === "API_KEY_INVALID";

      // Map credential, quota, and service unavailability to the maintenance state
      if (isApiKeyError || [401, 403, 404, 429, 503].includes(response.status)) {
        return NextResponse.json(
          { code: "AI_UNAVAILABLE", message: "Portfolio Assistant is temporarily unavailable." },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: "The AI assistant encountered an error. Please try again." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const content: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
