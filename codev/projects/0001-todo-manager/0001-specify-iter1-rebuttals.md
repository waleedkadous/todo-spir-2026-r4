# Rebuttal: Spec 0001 - Todo Manager (Iteration 1)

## Gemini (APPROVE)

Gemini approved with suggestions. All addressed:

1. **Missing JSON Command Schema** → Added full "NL Command Schema" section with action types, payload fields, and ambiguity resolution rules.
2. **Todo ID Requirement** → Added UUID `id` field to the explicit "Todo Data Model" table.
3. **Multi-Tab Synchronization** → Not addressed. This is a v1 single-tab app. Multi-tab sync via `storage` event is a nice-to-have for a future iteration, not a spec requirement.

## Codex (REQUEST_CHANGES)

1. **API route ambiguity ("no API routes that store state" vs proxy)** → Clarified in Constraints: "API routes are permitted **only** for proxying Gemini requests (no server-side state storage)."
2. **NL command schema not defined** → Added full "NL Command Schema" section with supported operations table and payload fields.
3. **Ambiguity resolution for NL updates/deletes** → Added "Ambiguity Resolution" subsection: best-effort match using title similarity and recency, fallback to error action.
4. **Offline/error behavior** → Added new "Offline/Error Behavior" section defining disabled state, error toasts, and no request queuing.
5. **Testing layers and Gemini mocking** → Restructured test scenarios into Unit/Integration/Functional/Error layers. Integration tests specify mocked Gemini responses.

All Codex issues addressed.

## Claude (REQUEST_CHANGES)

1. **"Gemini 3.0 Flash" model name validity** → Changed to `gemini-2.0-flash` with configurable `GEMINI_MODEL` env var for future flexibility. The user's request said "Gemini 3.0 Flash" which we interpret as "use the Gemini Flash model" — pinned to the known model ID.
2. **NL interaction model (single vs conversational)** → Explicitly defined as **single-turn** in the NL Command Schema section. Each message is independent.
3. **NL command schema** → Added full section (same as Codex point).
4. **Missing test for localStorage unavailability** → Added error handling test #20 for localStorage quota exceeded.
5. **Missing test for Gemini timeout/error** → Added error handling tests #18 (timeout/500) and #19 (malformed JSON).
6. **Prompt injection risk** → Added to Security Considerations with mitigation (strict JSON-only output instruction).
7. **Missing References section** → Added with links to Gemini API docs and Next.js App Router docs.

All Claude issues addressed.
