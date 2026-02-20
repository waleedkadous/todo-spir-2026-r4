import { describe, it, expect } from "vitest";
import { parseGeminiResponse } from "@/lib/gemini";

describe("parseGeminiResponse", () => {
  it("parses a valid add action", () => {
    const response = JSON.stringify({
      action: "add",
      title: "Buy milk",
      priority: "high",
    });

    const result = parseGeminiResponse(response);
    expect(result.action).toBe("add");
    if (result.action === "add") {
      expect(result.title).toBe("Buy milk");
      expect(result.priority).toBe("high");
    }
  });

  it("parses a valid update action", () => {
    const response = JSON.stringify({
      action: "update",
      todoIds: ["id-1"],
      updates: { status: "completed" },
    });

    const result = parseGeminiResponse(response);
    expect(result.action).toBe("update");
  });

  it("parses a valid delete action", () => {
    const response = JSON.stringify({
      action: "delete",
      todoIds: ["id-1", "id-2"],
    });

    const result = parseGeminiResponse(response);
    expect(result.action).toBe("delete");
  });

  it("parses a valid filter action", () => {
    const response = JSON.stringify({
      action: "filter",
      status: "completed",
      priority: "high",
    });

    const result = parseGeminiResponse(response);
    expect(result.action).toBe("filter");
  });

  it("parses an error action", () => {
    const response = JSON.stringify({
      action: "error",
      message: "Could not understand",
    });

    const result = parseGeminiResponse(response);
    expect(result.action).toBe("error");
    if (result.action === "error") {
      expect(result.message).toBe("Could not understand");
    }
  });

  it("handles markdown code fences", () => {
    const response = '```json\n{"action": "add", "title": "Test"}\n```';

    const result = parseGeminiResponse(response);
    expect(result.action).toBe("add");
  });

  it("throws on invalid JSON", () => {
    expect(() => parseGeminiResponse("not json")).toThrow(
      "Failed to parse Gemini response as JSON"
    );
  });

  it("throws on missing action field", () => {
    expect(() => parseGeminiResponse('{"title": "test"}')).toThrow(
      "Invalid response: missing 'action' field"
    );
  });

  it("throws on unknown action type", () => {
    expect(() =>
      parseGeminiResponse('{"action": "unknown"}')
    ).toThrow("Invalid action type: unknown");
  });

  it("handles extra whitespace", () => {
    const response = `  \n  {"action": "filter", "status": "all", "priority": "all"}  \n  `;
    const result = parseGeminiResponse(response);
    expect(result.action).toBe("filter");
  });
});
