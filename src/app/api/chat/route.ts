import { NextRequest, NextResponse } from "next/server";
import { callGemini, isGeminiConfigured } from "@/lib/gemini";
import { Todo } from "@/types/todo";

export async function POST(request: NextRequest) {
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 503 }
    );
  }

  let body: { message: string; todos: Todo[]; currentDate: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!body.message || typeof body.message !== "string") {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  try {
    const action = await callGemini(
      body.message,
      body.todos ?? [],
      body.currentDate ?? new Date().toISOString().split("T")[0]
    );

    return NextResponse.json({ action });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (message.includes("aborted") || message.includes("abort")) {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
