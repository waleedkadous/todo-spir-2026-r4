import { Todo, NLAction } from "@/types/todo";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function buildSystemPrompt(todos: Todo[], currentDate: string): string {
  const todoList =
    todos.length === 0
      ? "No todos exist yet."
      : todos
          .map(
            (t) =>
              `- [${t.id}] "${t.title}" (priority: ${t.priority}, status: ${t.status}, due: ${t.dueDate ?? "none"}, description: "${t.description}")`
          )
          .join("\n");

  return `You are a todo manager assistant. The user will ask you to manage their todos using natural language. You MUST respond with ONLY a valid JSON object — no markdown, no explanation, no text before or after the JSON.

Current date: ${currentDate}

Current todos:
${todoList}

You must respond with exactly one JSON object matching one of these action schemas:

1. Add a todo:
{"action": "add", "title": "string", "description": "string or omit", "priority": "low|medium|high", "dueDate": "YYYY-MM-DD or null"}

2. Update todo(s):
{"action": "update", "todoIds": ["id1"], "updates": {"status": "pending|completed", "title": "string", "priority": "low|medium|high", "dueDate": "YYYY-MM-DD or null"}}
Only include fields that should change in "updates".

3. Delete todo(s):
{"action": "delete", "todoIds": ["id1", "id2"]}

4. Filter/query todos:
{"action": "filter", "status": "all|pending|completed", "priority": "all|low|medium|high"}
Use this when the user wants to see/show/find/list todos.

5. Error (when you can't understand or the request is ambiguous):
{"action": "error", "message": "Explanation of what went wrong"}

Rules:
- Use todo IDs from the list above for update/delete operations.
- For ambiguous references (e.g., "the shopping todo" when multiple match), pick the most relevant one by title similarity and recency.
- If truly ambiguous, return an error action asking the user to be more specific.
- For relative dates like "tomorrow", calculate from the current date.
- Always respond with valid JSON only. No other text.`;
}

export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}

export async function callGemini(
  message: string,
  todos: Todo[],
  currentDate: string
): Promise<NLAction> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const systemPrompt = buildSystemPrompt(todos, currentDate);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return parseGeminiResponse(text);
  } finally {
    clearTimeout(timeout);
  }
}

export function parseGeminiResponse(text: string): NLAction {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse Gemini response as JSON");
  }

  if (!parsed || typeof parsed !== "object" || !("action" in parsed)) {
    throw new Error("Invalid response: missing 'action' field");
  }

  const action = (parsed as Record<string, unknown>).action;

  if (!["add", "update", "delete", "filter", "error"].includes(action as string)) {
    throw new Error(`Invalid action type: ${action}`);
  }

  return parsed as NLAction;
}
