# Plan: Todo Manager with Natural Language Interface

## Metadata
- **ID**: plan-2026-02-17-todo-manager
- **Status**: draft
- **Specification**: codev/specs/0001-todo-manager.md
- **Created**: 2026-02-17

## Executive Summary

Implement a Next.js 14+ Todo Manager with localStorage persistence and a Gemini Flash-powered natural language interface. Using the approved Approach 1: client-side storage with a server-side API route proxy for Gemini. The implementation is broken into 5 phases: project scaffolding, core todo CRUD, UI with filtering, NL interface, and Railway deployment.

## Success Metrics
- [ ] All specification criteria met
- [ ] All tests pass
- [ ] Application compiles without errors
- [ ] NL interface correctly interprets and executes commands
- [ ] Deploy-ready for Railway

## Phases (Machine Readable)

```json
{
  "phases": [
    {"id": "phase_1", "title": "Project Scaffolding and Data Layer"},
    {"id": "phase_2", "title": "Core Todo CRUD UI"},
    {"id": "phase_3", "title": "Filtering and Polish"},
    {"id": "phase_4", "title": "Natural Language Interface"},
    {"id": "phase_5", "title": "Railway Deployment and Final Integration"}
  ]
}
```

## Phase Breakdown

### Phase 1: Project Scaffolding and Data Layer
**Dependencies**: None

#### Objectives
- Set up Next.js 14+ project with TypeScript, App Router, and Tailwind CSS
- Define the Todo data model and TypeScript types
- Implement localStorage persistence layer (hooks/utilities)
- Set up testing infrastructure (Vitest + React Testing Library)

#### Deliverables
- [ ] Next.js project initialized with TypeScript and Tailwind
- [ ] Todo TypeScript types defined
- [ ] `useTodos` hook with localStorage CRUD operations
- [ ] Vitest configured with jsdom environment and initial tests passing
- [ ] ESLint configured

#### Implementation Details

**Files to create:**
- `package.json` — project dependencies (includes `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`)
- `tsconfig.json` — TypeScript config
- `next.config.ts` — Next.js configuration
- `tailwind.config.ts` — Tailwind configuration
- `postcss.config.mjs` — PostCSS for Tailwind
- `src/app/layout.tsx` — Root layout
- `src/app/page.tsx` — Main page (placeholder, `"use client"` since it uses stateful hooks)
- `src/app/globals.css` — Global styles with Tailwind directives
- `src/types/todo.ts` — Todo interface, NL action types, priority/status enums
- `src/lib/storage.ts` — localStorage read/write utilities
- `src/hooks/useTodos.ts` — React hook for CRUD operations (add, update, delete, filter)
- `src/lib/__tests__/storage.test.ts` — Storage utility tests
- `src/hooks/__tests__/useTodos.test.ts` — Hook tests
- `vitest.config.ts` — Vitest configuration with jsdom environment
- `.eslintrc.json` — ESLint config
- `.env.example` — Template with `GEMINI_API_KEY=` and `GEMINI_MODEL=gemini-2.0-flash`

**Key types (src/types/todo.ts):**
- `Todo`: { id, title, description, priority, dueDate, status, createdAt }
- `Priority`: "low" | "medium" | "high"
- `Status`: "pending" | "completed"
- `NLAction`: { action: "add" | "update" | "delete" | "filter" | "error", ... }

**Hydration strategy**: The `useTodos` hook initializes with an empty array and loads from localStorage in a `useEffect` on mount. This avoids SSR/hydration mismatch since the server render shows an empty/loading state, then the client hydrates with localStorage data. All interactive components use `"use client"` directive.

**UUID generation**: Use `crypto.randomUUID()` (native, no external dependency).

#### Acceptance Criteria
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes all tests
- [ ] localStorage read/write works correctly
- [ ] CRUD operations create/read/update/delete todos with correct IDs
- [ ] No hydration mismatch warnings in console

#### Test Plan
- **Unit Tests**: storage.ts read/write/clear functions; useTodos hook CRUD operations; UUID generation uniqueness; default field values
- **Manual Testing**: Verify project starts with `npm run dev`, no hydration errors

#### Risks
- **Risk**: localStorage mock complexity in tests
  - **Mitigation**: Use jsdom environment in Vitest with localStorage polyfill
- **Risk**: SSR/hydration mismatch with localStorage
  - **Mitigation**: Initialize with empty state, load from localStorage in useEffect after mount

---

### Phase 2: Core Todo CRUD UI
**Dependencies**: Phase 1

#### Objectives
- Build the main todo list component with create/edit/delete functionality
- Implement todo form (add/edit) with priority and due date fields
- Display todos with status toggle, priority badges, and due dates
- Use raw Tailwind CSS for all styling (no component library)

#### Deliverables
- [ ] TodoList component displaying all todos
- [ ] TodoItem component with status toggle, delete, and inline edit
- [ ] AddTodoForm component with title, description, priority, due date
- [ ] Main page wired up with all components

#### Implementation Details

**Files to create:**
- `src/components/TodoList.tsx` — Renders list of TodoItem components
- `src/components/TodoItem.tsx` — Single todo display with actions (toggle status, delete, inline edit)
- `src/components/AddTodoForm.tsx` — Form for creating new todos
- `src/components/TodoItem.test.tsx` — Component tests
- `src/components/AddTodoForm.test.tsx` — Form tests

**Files to modify:**
- `src/app/page.tsx` — Wire up components with useTodos hook

All components use `"use client"` directive for interactivity.

#### Acceptance Criteria
- [ ] Can create a todo with title, priority, and optional due date
- [ ] Can toggle todo status (pending <-> completed)
- [ ] Can delete a todo
- [ ] Todos display priority as colored badge
- [ ] Todos display due date when set
- [ ] All tests pass

#### Test Plan
- **Unit Tests**: Component rendering with React Testing Library, form submission, status toggle, delete action
- **Manual Testing**: Full CRUD flow in browser

#### Risks
- **Risk**: Component state management complexity
  - **Mitigation**: Keep state in useTodos hook, components are purely presentational

---

### Phase 3: Filtering and Polish
**Dependencies**: Phase 2

#### Objectives
- Add filter controls for status and priority
- Add responsive styling and visual polish
- Handle empty states and edge cases

#### Deliverables
- [ ] FilterBar component with status and priority dropdowns
- [ ] Filtering logic in useTodos hook
- [ ] Responsive layout (mobile + desktop)
- [ ] Empty state messaging
- [ ] Visual polish (sorting, priority colors, overdue indicators)

#### Implementation Details

**Files to create:**
- `src/components/FilterBar.tsx` — Filter dropdowns for status and priority
- `src/components/FilterBar.test.tsx` — Filter component tests

**Files to modify:**
- `src/hooks/useTodos.ts` — Add filter state and filtered todo computation
- `src/app/page.tsx` — Integrate FilterBar
- `src/app/globals.css` — Additional responsive styles

#### Acceptance Criteria
- [ ] Filter by status (all/pending/completed) works
- [ ] Filter by priority (all/low/medium/high) works
- [ ] Combined filters work correctly
- [ ] Responsive on mobile viewports
- [ ] Empty state shown when no todos match filter

#### Test Plan
- **Unit Tests**: Filter logic in hook, FilterBar component interactions
- **Manual Testing**: Filter combinations, mobile viewport testing

#### Risks
- **Risk**: Filter state not syncing with URL or losing on refresh
  - **Mitigation**: Filters are transient UI state (not persisted), acceptable for v1

---

### Phase 4: Natural Language Interface
**Dependencies**: Phase 3

#### Objectives
- Create the Gemini API proxy route
- Build the NL chat input component with loading, error, and disabled states
- Implement NL response parsing and todo mutation execution
- Wire NL `filter` action to UI filter state
- Handle errors (API unavailable, malformed responses, timeouts)

#### Deliverables
- [ ] API route for Gemini proxy (`/api/chat`)
- [ ] NL input component with loading/error/disabled states
- [ ] Gemini system prompt engineering for structured JSON responses
- [ ] NL response parser and executor
- [ ] Error handling for all failure modes
- [ ] Toast/notification component for success/error feedback

#### Implementation Details

**Files to create:**
- `src/app/api/chat/route.ts` — Next.js API route: receives { message, todos, currentDate }, calls Gemini, returns structured JSON
- `src/lib/gemini.ts` — Gemini API client with model from `process.env.GEMINI_MODEL ?? "gemini-2.0-flash"`, system prompt, response parsing
- `src/lib/nl-executor.ts` — Executes parsed NL actions against todo state
- `src/components/NLInput.tsx` — Chat-style input with send button, loading spinner, response display. Shows "AI assistant unavailable" when disabled.
- `src/components/Toast.tsx` — Simple toast notification component for success/error messages
- `src/lib/__tests__/nl-executor.test.ts` — NL executor tests with mock responses
- `src/lib/__tests__/gemini.test.ts` — Gemini client tests (response parsing, error handling)

**Files to modify:**
- `src/app/page.tsx` — Integrate NLInput component and Toast
- `src/hooks/useTodos.ts` — Add `executeNLAction` method; wire `filter` action to update filter state in the UI

**Gemini system prompt design:**
- Instruct model to return JSON only
- Define action schema with examples
- Include current todos as context
- Include current date (ISO 8601 from client) for relative date resolution (e.g., "due tomorrow")
- Handle ambiguity with error action
- Use `GEMINI_MODEL` env var with default `gemini-2.0-flash`

**NL filter → UI integration:** When the NL executor receives a `filter` action, it updates the filter state in `useTodos` hook (same state FilterBar uses). This ensures "show me all high priority todos" visually filters the list.

**Offline/AI unavailable UX:** The NLInput component checks for API availability. On error (missing key, timeout, 500), it shows an error toast and re-enables the input. If the API key is not configured, the NL input displays "AI assistant unavailable — configure GEMINI_API_KEY to enable".

**Debounce:** NL input has a submit debounce (300ms) to prevent accidental double-sends during Gemini processing.

#### Acceptance Criteria
- [ ] "Add a todo to buy groceries with high priority" creates correct todo
- [ ] "Show me all high priority todos" updates UI filters to show only high priority
- [ ] "Mark the grocery todo as done" updates correct todo
- [ ] "Delete all completed todos" removes matching todos
- [ ] API key missing → "AI assistant unavailable" message
- [ ] Gemini timeout (10s) → error toast, input re-enabled
- [ ] Malformed response → error message, no data corruption
- [ ] Loading state shown during Gemini processing

#### Test Plan
- **Unit Tests**: NL executor with mock action payloads (including filter→state), Gemini response parser, response validation
- **Integration Tests**: Full NL flow: input → API route → parse → execute → state update (with mocked Gemini)
- **Manual Testing**: Various NL inputs for all action types

#### Risks
- **Risk**: Gemini returns unexpected JSON structure
  - **Mitigation**: Strict validation of response shape; fallback to error message
- **Risk**: Prompt injection via NL input
  - **Mitigation**: System prompt instructs JSON-only output; response validation prevents arbitrary execution

---

### Phase 5: Railway Deployment and Final Integration
**Dependencies**: Phase 4

#### Objectives
- Add Railway deployment configuration
- Final integration testing
- Add README with setup instructions
- Verify full build succeeds

#### Deliverables
- [ ] Dockerfile for Railway deployment
- [ ] Environment variable documentation
- [ ] README.md with setup and deployment instructions
- [ ] Final build verification

#### Implementation Details

**Files to create:**
- `Dockerfile` — Multi-stage build for Next.js standalone output
- `.dockerignore` — Exclude node_modules, .next, etc.
- `README.md` — Project overview, setup, environment variables (`GEMINI_API_KEY`, `GEMINI_MODEL`), deployment to Railway

**Files to modify:**
- `next.config.ts` — Add `output: "standalone"` for Docker deployment
- `.gitignore` — Ensure proper ignores

#### Acceptance Criteria
- [ ] `npm run build` succeeds
- [ ] `npm run test` all pass
- [ ] Dockerfile builds successfully
- [ ] Environment variables documented (GEMINI_API_KEY, GEMINI_MODEL with default)
- [ ] README covers local development and Railway deployment

#### Test Plan
- **Manual Testing**: Docker build, container run, full app smoke test
- **Verification**: `npm run build && npm run test` in clean environment

#### Risks
- **Risk**: Standalone output misconfiguration
  - **Mitigation**: Follow Next.js official Docker example

---

## Dependency Map
```
Phase 1 (Scaffolding) ──→ Phase 2 (CRUD UI) ──→ Phase 3 (Filtering) ──→ Phase 4 (NL Interface) ──→ Phase 5 (Deploy)
```

Linear dependency chain — each phase builds on the previous.

## Integration Points

### External Systems
- **Google Gemini API**
  - **Integration Type**: REST API via `generativelanguage.googleapis.com`
  - **Phase**: Phase 4
  - **Fallback**: Traditional UI works without Gemini; NL input shows "AI unavailable"

## Risk Analysis

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| SSR/hydration mismatch | Medium | Medium | Empty initial state, useEffect localStorage load |
| Gemini response format instability | Medium | Medium | Strict validation, fallback error messages |
| localStorage size limits | Low | Low | Warn at high todo count |
| Next.js standalone build issues | Low | Medium | Follow official Docker docs |

## Validation Checkpoints
1. **After Phase 1**: Project builds, tests pass, localStorage CRUD works, no hydration errors
2. **After Phase 2**: Can create/toggle/delete todos in browser
3. **After Phase 3**: Filtering works, responsive layout verified
4. **After Phase 4**: NL commands work end-to-end (with real Gemini API), filter action updates UI
5. **After Phase 5**: Docker build succeeds, deploy-ready

## Documentation Updates Required
- [ ] README.md with setup instructions
- [ ] Environment variable documentation
- [ ] `.env.example` file

## Expert Review
**Date**: 2026-02-17
**Models Consulted**: Gemini Pro, GPT-5 Codex, Claude Opus
**Key Feedback**:
- Gemini: APPROVE — noted hydration mismatch risk, crypto.randomUUID() suggestion
- Codex: REQUEST_CHANGES — GEMINI_MODEL usage, NL filter→UI wiring, offline UX
- Claude: COMMENT — hydration strategy, test deps, toast system, debounce

**Plan Adjustments**:
- Added hydration strategy (empty init + useEffect load) to Phase 1
- Added `@testing-library/react` and `@testing-library/jest-dom` to Phase 1 deps
- Added `GEMINI_MODEL` env var with default `gemini-2.0-flash` in Phase 4
- Added NL filter→UI filter state wiring in Phase 4
- Added Toast component and offline/disabled UX for NLInput in Phase 4
- Added `.env.example` file to Phase 1
- Added debounce for NL input in Phase 4
- Added `"use client"` directive notes throughout
- Added hydration mismatch to risk table

## Approval
- [ ] Technical Lead Review
- [x] Expert AI Consultation Complete

## Notes
- Phases are deliberately linear for simplicity — each builds directly on the previous
- Phase 4 (NL Interface) is the most complex and carries the most risk
- All phases target atomic commits with passing tests
- Raw Tailwind CSS used throughout (no component library) to keep dependencies minimal
