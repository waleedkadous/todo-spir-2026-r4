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
- Stores all todo data locally in the browser (no server-side database)
- Provides a traditional UI for CRUD operations on todos
- Offers a natural language chat interface powered by Gemini 3.0 Flash
- Supports filtering and complex queries through both UI and NL interface
- Is production-ready with proper error handling and responsive design

## Stakeholders
- **Primary Users**: Individual users managing personal todos
- **Technical Team**: Solo developer (user) with AI-assisted development
- **Business Owners**: The user

## Success Criteria
- [ ] Full CRUD operations on todos (create, read, update, delete)
- [ ] Each todo has: title, description (optional), priority (low/medium/high), due date (optional), status (pending/completed), created timestamp
- [ ] Filter todos by status (pending/completed/all) and priority (low/medium/high/all)
- [ ] Natural language interface powered by Gemini 3.0 Flash
- [ ] NL interface handles: creating todos, querying/filtering, updating status, deleting, complex multi-condition queries
- [ ] All data persists in browser localStorage
- [ ] Responsive design works on desktop and mobile
- [ ] Deploy-ready for Railway (Dockerfile or railway.json)
- [ ] Application compiles without errors
- [ ] All tests pass
- [ ] No backend database required

## Constraints

### Technical Constraints
- Next.js 14+ with App Router (not Pages Router)
- TypeScript required throughout
- Browser-only storage — no server-side database, no API routes that store state
- Gemini 3.0 Flash for NL processing (requires API key via environment variable)
- Must be deployable to Railway with zero additional infrastructure

### Business Constraints
- Single-user application (no auth required)
- Free-tier friendly where possible

## Assumptions
- User will provide a `GEMINI_API_KEY` environment variable for NL functionality
- The NL interface requires internet connectivity (Gemini API calls)
- localStorage is sufficient for the expected data volume (single user, hundreds of todos max)
- Modern browser support only (no IE11)

## Solution Approaches

### Approach 1: Client-Side with API Route Proxy (Recommended)

**Description**: Next.js app with client-side todo storage in localStorage. A thin Next.js API route proxies NL requests to Gemini 3.0 Flash to keep the API key server-side. The Gemini model receives the user's NL input along with the current todo list context and returns structured JSON commands (create, update, delete, filter) that the client executes.

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
- [ ] Should the NL interface support undo operations? (Assume: no, keep it simple)
- [ ] Should there be a limit on todo count for localStorage? (Assume: soft limit warning at 1000)

### Nice-to-Know (Optimization)
- [ ] Should todos support tags/categories? (Assume: not in v1, but architecture should allow future extension)

## Performance Requirements
- **Initial Load**: < 2s on broadband
- **UI Interactions**: < 100ms for CRUD operations (localStorage is fast)
- **NL Response**: < 3s for Gemini processing round-trip
- **Storage**: < 5MB localStorage usage

## Security Considerations
- Gemini API key stored server-side only (via environment variable, proxied through API route)
- No user authentication required (single-user local app)
- XSS prevention through React's built-in escaping and input sanitization
- No sensitive data stored (todos are personal, local-only)

## Test Scenarios

### Functional Tests
1. Create a todo with all fields (title, priority, due date) → appears in list
2. Update a todo's status from pending to completed → reflected in UI
3. Delete a todo → removed from list and localStorage
4. Filter by status (pending only) → only pending todos shown
5. Filter by priority (high only) → only high priority todos shown
6. NL: "Add a todo to buy groceries with high priority due tomorrow" → creates correct todo
7. NL: "Show me all high priority todos" → filters correctly
8. NL: "Mark the grocery todo as done" → updates status
9. NL: "Delete all completed todos" → removes matching todos
10. NL: Handles ambiguous input gracefully → asks for clarification or best-effort match

### Non-Functional Tests
1. Todos persist after page refresh (localStorage)
2. App renders correctly on mobile viewport
3. NL endpoint returns error gracefully when Gemini API key is missing

## Dependencies
- **External Services**: Google Gemini 3.0 Flash API
- **Libraries/Frameworks**: Next.js 14+, React 18+, TypeScript, Tailwind CSS (styling)
- **Development**: Jest/Vitest for testing, ESLint for linting

## Risks and Mitigation
| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|-------------------|
| Gemini API rate limits | Low | Medium | Debounce NL input, show loading states |
| localStorage data loss (browser clear) | Medium | Medium | Clearly communicate local-only storage to user |
| Gemini returns malformed JSON | Medium | Medium | Strict response validation, fallback error message |
| API key exposure | Low | High | Server-side proxy via Next.js API route |

## Expert Consultation
**Date**: 2026-02-17
**Models Consulted**: Pending (will be run via porch verify)
**Sections Updated**: TBD after consultation

## Approval
- [ ] Technical Lead Review
- [ ] Product Owner Review
- [ ] Stakeholder Sign-off
- [ ] Expert AI Consultation Complete

## Notes
- The NL interface is the differentiating feature of this app. It must feel natural and handle edge cases gracefully.
- Gemini 3.0 Flash is chosen for its speed and cost-effectiveness for real-time NL interactions.
- The app should degrade gracefully if Gemini API is unavailable (traditional UI still works).
