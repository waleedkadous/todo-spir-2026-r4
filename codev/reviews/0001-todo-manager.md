# Review: Todo Manager with Natural Language Interface

## Summary

Implemented a complete Todo Manager application using Next.js 14, TypeScript, and Tailwind CSS with a Gemini Flash-powered natural language interface. The app stores todos in browser localStorage, supports full CRUD operations, filtering by status/priority, and natural language commands for all operations. Deployed via multi-stage Docker build for Railway.

## Spec Compliance

- [x] Full CRUD operations on todos (create, read, update, delete)
- [x] Todo model: id (UUID), title, description (optional), priority (low/medium/high), due date (optional), status (pending/completed), createdAt
- [x] Filter by status (pending/completed/all) and priority (low/medium/high/all)
- [x] Natural language interface powered by Gemini Flash (`gemini-2.0-flash`)
- [x] NL handles: creating todos, querying/filtering, updating status, deleting, batch operations
- [x] All data persists in browser localStorage
- [x] Responsive design (Tailwind CSS)
- [x] Deploy-ready for Railway (Dockerfile with standalone output)
- [x] Application compiles without errors
- [x] All 72 tests pass
- [x] No backend database — API route only proxies Gemini requests
- [x] Single-turn NL interaction (no conversation history)
- [x] API key server-side only (via API route proxy)
- [x] Graceful degradation when Gemini unavailable
- [x] 10s Gemini timeout with error handling
- [x] Debounced NL input (300ms)
- [x] Error/success toast notifications

## Deviations from Plan

- **next.config.ts → next.config.mjs**: Next.js 14 does not support `.ts` config files. Switched to `.mjs` with JSDoc type annotation.
- **consult --type impl**: Protocol consultation type requires a PR to exist. Used `--prompt` general mode for all implementation phase consultations instead.
- **localStorage mock**: Vitest 2.x jsdom doesn't provide a working localStorage. Added `src/test-setup.ts` with a manual mock.
- **searchText/dateRange in FilterState**: Spec mentions these in the NL command schema, but they were left as forward-compatibility type fields. The v1 filter UI only supports status and priority, matching the spec's UI requirements.

## Lessons Learned

### What Went Well
- **Hydration strategy**: Empty array init + useEffect load completely avoided SSR/hydration mismatch issues. No console warnings throughout development.
- **Discriminated union for NLAction**: TypeScript's exhaustive switch checking caught issues early. Each action type has a clearly defined payload.
- **3-way consultation value**: Codex consistently found edge cases (missing update guard, UTC date, invalid filter values) that would have been bugs in production. The consultation cycle caught real issues.
- **Phased implementation**: Linear 5-phase approach kept each step manageable. Tests accumulated naturally and caught regressions.
- **crypto.randomUUID()**: Using the native API eliminated an external dependency while providing proper UUIDs.

### Challenges Encountered
- **next.config.ts not supported**: Next.js 14 errored on TypeScript config. Resolved by switching to `.mjs` — discovered early in Phase 1.
- **localStorage in tests**: jsdom's localStorage mock in Vitest 2.x had issues (`.clear()` not a function). Resolved with a custom mock in test-setup.ts.
- **consult CLI context**: The `--type impl` and `--type phase` consultation types require a PR or builder worktree. Worked around by using general `--prompt` mode with explicit review instructions.
- **Gemini response parsing**: Gemini sometimes wraps JSON in markdown code fences (```json...```). The parser needed to strip these before JSON.parse.

### What Would Be Done Differently
- **Start with .mjs config**: Would use `.mjs` for Next.js config from the start rather than discovering the `.ts` incompatibility.
- **Test setup earlier**: Would create the localStorage mock setup file before writing any tests, not after the first test failure.
- **Filter type scope**: Would define the FilterState type with only status/priority from the start rather than including forward-compatible fields that aren't used.

### Methodology Improvements
- **consult in non-PR context**: The `--type impl` consultation mode should work without requiring a PR. Many projects do implementation review before creating the PR. The `--prompt` workaround is functional but loses the structured review format.
- **Phase verification**: Porch's build/test checks at each phase are valuable. The automatic verification loop caught issues before they compounded.

## Technical Debt

- **No integration test for API route**: The `/api/chat` route is a thin proxy. Testing it requires either a real Gemini API key or significant mocking of the Next.js request/response objects. The parser and executor have thorough unit tests.
- **searchText field in NLAction type**: Exists in the type definition for forward compatibility but is not used anywhere in v1. Could be removed for clarity.
- **Toast onDismiss callback**: Creates a new function reference on each render. Not an issue at current re-render frequency but could be stabilized with useCallback if parent re-renders more frequently in the future.

## Follow-up Items

- E2E tests with Playwright for full browser integration testing
- localStorage quota monitoring/warning at high todo count
- Potential IndexedDB migration for larger data volumes
- Multi-device sync (would require a backend — out of v1 scope)
- Conversation history for NL interface (multi-turn interactions)
