# Specification: Todo Manager with Natural Language Interface

## Metadata
- **ID**: spec-2026-02-17-todo-manager
- **Status**: draft
- **Created**: 2026-02-17

## Clarifying Questions Asked

The user provided comprehensive requirements upfront. Key decisions already made:

1. **Q: What tech stack?** → Next.js 14+ with TypeScript, App Router
2. **Q: Where to deploy?** → Railway (deploy-ready)
3. **Q: Backend database?** → None. Browser-only storage (localStorage or IndexedDB)
4. **Q: What CRUD fields?** → Priority (low/medium/high), due dates, status (pending/completed)
5. **Q: What filtering?** → By status and priority
6. **Q: Natural language backend?** → Gemini 3.0 Flash — full NL understanding, NOT regex/grammar parsing
7. **Q: NL capabilities?** → Arbitrary phrasing, ambiguity handling, complex queries

## Problem Statement

Users need a lightweight, browser-based todo management application that combines traditional CRUD UI with an intelligent natural language interface. Current todo apps either lack NL capabilities entirely or use brittle regex-based parsing that fails on natural phrasing. The goal is to provide a modern, deploy-ready todo manager where users can interact with their todos conversationally — querying, creating, updating, and deleting items using plain English.

## Current State

No application exists. This is a greenfield project.

## Desired State

A fully functional Next.js application deployed on Railway that:
- Stores all todo data locally in the browser (no server-side database). **Note**: Data does not sync across devices and will be lost if browser data is cleared.
- Provides a traditional UI for CRUD operations on todos
- Offers a natural language chat interface powered by Gemini Flash
- Supports filtering and complex queries through both UI and NL interface
- Is production-ready with proper error handling and responsive design

## Stakeholders
- **Primary Users**: Individual users managing personal todos
- **Technical Team**: Solo developer (user) with AI-assisted development
- **Business Owners**: The user

## Success Criteria
- [ ] Full CRUD operations on todos (create, read, update, delete)
- [ ] Each todo has: id (UUID), title, description (optional), priority (low/medium/high), due date (optional), status (pending/completed), createdAt timestamp
- [ ] Filter todos by status (pending/completed/all) and priority (low/medium/high/all)
- [ ] Natural language interface powered by Gemini Flash (model: `gemini-2.0-flash`)
- [ ] NL interface handles: creating todos, querying/filtering, updating status, deleting, complex multi-condition queries
- [ ] All data persists in browser localStorage
- [ ] Responsive design works on desktop and mobile
- [ ] Deploy-ready for Railway (Dockerfile or railway.json)
- [ ] Application compiles without errors
- [ ] All tests pass
- [ ] No backend database required

## Todo Data Model

Each todo item has the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier, generated on creation |
| title | string | Yes | Short description of the task |
| description | string | No | Optional detailed description |
| priority | "low" \| "medium" \| "high" | Yes | Priority level, defaults to "medium" |
| dueDate | string (ISO 8601) \| null | No | Optional due date |
| status | "pending" \| "completed" | Yes | Current status, defaults to "pending" |
| createdAt | string (ISO 8601) | Yes | Creation timestamp |

## NL Command Schema

The NL interface is **single-turn** — each message is independent with no conversational context carried between messages. The Gemini API receives the user's message plus the current todo list, and returns a structured JSON response.

### Supported Operations

The Gemini model returns a JSON object with an `action` field and operation-specific payload:

| Action | Description | Key Payload Fields |
|--------|-------------|-------------------|
| `add` | Create a new todo | title, priority, dueDate, description |
| `update` | Modify existing todo(s) | todoIds, updates (status, priority, dueDate, title) |
| `delete` | Remove todo(s) | todoIds |
| `filter` | Query/display todos | status, priority, dateRange, searchText |
| `error` | Could not understand | message (explanation to user) |

### Ambiguity Resolution

When a user's NL input matches multiple todos (e.g., "mark the shopping todo as done" but there are two shopping-related todos):
- The model should attempt a **best-effort match** using the most relevant todo
- If truly ambiguous, return an `error` action with a message asking the user to be more specific
- Matching uses title similarity and recency as tiebreakers

### Batch Operations

A single NL message may produce multiple operations (e.g., "delete all completed todos"). The response supports returning an array of todo IDs for batch update/delete operations.

## Constraints

### Technical Constraints
- Next.js 14+ with App Router (not Pages Router)
- TypeScript required throughout
- Browser-only storage — no server-side database
- API routes are permitted **only** for proxying Gemini requests (no server-side state storage)
- Gemini Flash for NL processing (requires `GEMINI_API_KEY` environment variable)
- Model identifier: `gemini-2.0-flash` (configurable via environment variable `GEMINI_MODEL` to allow future model upgrades)
- Must be deployable to Railway with zero additional infrastructure

### Business Constraints
- Single-user application (no auth required)
- Free-tier friendly where possible

## Assumptions
- User will provide a `GEMINI_API_KEY` environment variable for NL functionality
- The NL interface requires internet connectivity (Gemini API calls)
- localStorage is sufficient for the expected data volume (single user, hundreds of todos max)
- Modern browser support only (no IE11)
- Date/time references in NL input (e.g., "due tomorrow") are interpreted relative to the user's local timezone, sent from the client

## Solution Approaches

### Approach 1: Client-Side with API Route Proxy (Recommended)

**Description**: Next.js app with client-side todo storage in localStorage. A thin Next.js API route proxies NL requests to Gemini Flash to keep the API key server-side. The Gemini model receives the user's NL input along with the current todo list context and returns structured JSON commands that the client executes.

**Pros**:
- API key stays on server (secure)
- Clean separation: UI manages todos, Gemini interprets NL intent
- Structured JSON responses from Gemini are reliable and type-safe
- No database needed on server

**Cons**:
- Requires sending todo context to Gemini on each NL request
- Slight latency for NL processing

**Complexity**: Medium
**Risk Level**: Low

### Approach 2: Fully Client-Side with Gemini Direct

**Description**: Everything runs client-side, including direct Gemini API calls from the browser.

**Pros**:
- Simpler architecture, no server logic at all

**Cons**:
- API key exposed in client bundle (security risk)
- CORS issues with direct Gemini API calls from browser

**Complexity**: Low
**Risk Level**: High (API key exposure)

### Approach 3: Full Server-Side State

**Description**: Store todos in a server-side database, full REST API.

**Pros**:
- Traditional architecture, data survives browser clear

**Cons**:
- Violates requirement of no backend database
- Requires database infrastructure on Railway

**Complexity**: High
**Risk Level**: Medium

**Selected Approach**: Approach 1 — Client-side storage with API route proxy for Gemini.

## Open Questions

### Critical (Blocks Progress)
- [x] All critical questions answered by user requirements

### Important (Affects Design)
- [x] NL interaction model: **Single-turn** (each message independent, no conversation history)
- [x] Ambiguity resolution: **Best-effort match** with fallback error message
- [x] Gemini model: Use `gemini-2.0-flash` (configurable via env var)

### Nice-to-Know (Optimization)
- [ ] Should todos support tags/categories? (Assume: not in v1)

## Performance Requirements
- **Initial Load**: < 2s on broadband
- **UI Interactions**: < 100ms for CRUD operations (localStorage is fast)
- **NL Response**: < 3s for Gemini processing round-trip
- **Storage**: < 5MB localStorage usage

## Security Considerations
- Gemini API key stored server-side only (via environment variable, proxied through API route). Client-side key usage is explicitly forbidden.
- No user authentication required (single-user local app)
- XSS prevention through React's built-in escaping and input sanitization
- NL output rendered as text only (no HTML rendering of Gemini responses)
- No sensitive data stored (todos are personal, local-only)
- Prompt injection risk: Low for personal todo app. Gemini system prompt instructs strict JSON-only output to mitigate.

## Test Scenarios

### Unit Tests
1. Todo CRUD functions: create, read, update, delete against localStorage
2. Filter logic: by status, by priority, combined filters
3. Todo data model validation (required fields, defaults)
4. NL response parsing and validation (valid JSON, known action types)

### Integration Tests
5. API route proxies request to Gemini correctly (mock Gemini responses)
6. NL command execution: parsed response → correct todo mutations
7. localStorage persistence: data survives simulated page refresh

### Functional/E2E Tests
8. Create a todo with all fields → appears in list
9. Update a todo's status from pending to completed → reflected in UI
10. Delete a todo → removed from list and localStorage
11. Filter by status (pending only) → only pending todos shown
12. Filter by priority (high only) → only high priority todos shown
13. NL: "Add a todo to buy groceries with high priority due tomorrow" → creates correct todo
14. NL: "Show me all high priority todos" → filters correctly
15. NL: "Mark the grocery todo as done" → updates status
16. NL: "Delete all completed todos" → removes matching todos

### Error Handling Tests
17. Gemini API key missing → graceful error message, traditional UI still works
18. Gemini API timeout/500 error → user-facing error toast, NL input re-enabled
19. Gemini returns malformed JSON → error message, no data corruption
20. localStorage quota exceeded → warning message to user

## Dependencies
- **External Services**: Google Gemini API (`gemini-2.0-flash`)
- **Libraries/Frameworks**: Next.js 14+, React 18+, TypeScript, Tailwind CSS (styling)
- **Development**: Vitest for unit/integration tests, ESLint for linting

## Offline/Error Behavior

When the Gemini API is unavailable (offline, rate-limited, errored):
- The NL input field shows a disabled state with message: "AI assistant unavailable"
- All traditional UI functionality continues to work normally
- On API error (timeout, 500, rate limit): show an error toast and re-enable the input for retry
- No queuing of failed NL requests

## Risks and Mitigation
| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|-------------------|
| Gemini API rate limits | Low | Medium | Debounce NL input, show loading states |
| localStorage data loss (browser clear) | Medium | Medium | Clearly communicate local-only storage to user |
| Gemini returns malformed JSON | Medium | Medium | Strict response validation, error toast to user |
| API key exposure | Low | High | Server-side proxy via Next.js API route |
| Gemini API timeout | Low | Medium | 10s timeout, error toast, input re-enabled |
| localStorage quota exceeded | Low | Low | Warning at high todo count |

## References
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)

## Expert Consultation
**Date**: 2026-02-17
**Models Consulted**: Gemini Pro, GPT-5 Codex, Claude Opus
**Sections Updated**:
- **Todo Data Model**: Added explicit data model table with UUID id field (Gemini, Codex)
- **NL Command Schema**: Added full section defining action types, payload fields, ambiguity resolution, and batch operations (all three)
- **Constraints**: Clarified API routes allowed only for Gemini proxying, not state storage (Codex)
- **Gemini Model**: Changed from "Gemini 3.0 Flash" to `gemini-2.0-flash` with configurable env var (Claude)
- **Security**: Added prompt injection acknowledgment and explicit client-side key prohibition (Claude, Codex)
- **Test Scenarios**: Restructured into unit/integration/functional/error layers with Gemini mock strategy (Codex, Claude)
- **Offline/Error Behavior**: Added new section defining behavior when Gemini is unavailable (Codex)
- **Desired State**: Added note about data not syncing across devices (Claude)
- **NL Interaction Model**: Defined as single-turn with no conversation history (Claude)

## Approval
- [ ] Technical Lead Review
- [ ] Product Owner Review
- [ ] Stakeholder Sign-off
- [x] Expert AI Consultation Complete

## Notes
- The NL interface is the differentiating feature of this app. It must feel natural and handle edge cases gracefully.
- Gemini Flash is chosen for its speed and cost-effectiveness for real-time NL interactions.
- The app should degrade gracefully if Gemini API is unavailable (traditional UI still works).
