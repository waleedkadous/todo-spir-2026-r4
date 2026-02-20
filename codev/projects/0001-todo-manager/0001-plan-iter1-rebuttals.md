# Rebuttal: Plan 0001 - Todo Manager (Iteration 1)

## Gemini (APPROVE)

All suggestions incorporated:
1. **Hydration mismatch** → Added explicit hydration strategy to Phase 1: empty init + useEffect load
2. **Client components / "use client"** → Added notes throughout plan about `"use client"` directives
3. **crypto.randomUUID()** → Specified in Phase 1, no external UUID dependency needed

## Codex (REQUEST_CHANGES)

1. **Missing `GEMINI_MODEL` configuration** → Added explicit step in Phase 4: `process.env.GEMINI_MODEL ?? "gemini-2.0-flash"` in `src/lib/gemini.ts`. Added `.env.example` file in Phase 1.
2. **NL filter action not wired to UI** → Added explicit note in Phase 4: filter action updates the same filter state used by FilterBar in `useTodos` hook. Added to acceptance criteria.
3. **Offline/AI unavailable UX** → Added concrete implementation in Phase 4: NLInput shows "AI assistant unavailable — configure GEMINI_API_KEY to enable" when disabled. Error toast on timeout/500.

All Codex issues addressed.

## Claude (COMMENT)

1. **Hydration mismatch** → Added to Phase 1 with explicit strategy and risk table entry
2. **Component testing dependencies** → Added `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` to Phase 1 package.json deps
3. **Toast/notification system** → Added `src/components/Toast.tsx` to Phase 4 deliverables
4. **GEMINI_MODEL default** → Explicit in Phase 4 implementation details
5. **`.env.example`** → Added to Phase 1 files
6. **UUID generation** → Specified `crypto.randomUUID()` in Phase 1
7. **"use client" directives** → Noted throughout plan
8. **Date handling** → Phase 4 specifies `currentDate` as ISO 8601 from client for timezone handling
9. **NL debounce** → Added 300ms submit debounce in Phase 4
10. **No component library** → Explicitly stated: raw Tailwind CSS throughout

All Claude comments addressed.
