# Question Authoring Standard: Real-Reference Fidelity

Applies going forward, to new questions and to finishing flipkart-cart-lab. Not applied
retroactively to the 5 existing LLM-graded questions — those weren't built from a real
reference app the way flipkart-cart-lab was, so "fidelity gap" means something
different there; auditing them is a separate, later task if it's ever done.

## Why this exists

flipkart-cart-lab was ported from a real standalone lab
(`questions/Standard Flipkart Question/flipkart-cart-lab/`, kept locally as reference,
gitignored). Comparing the shipped question against that reference's own README
(2026-11-03) turned up five silent gaps: no deterministic way to reproduce the two
timing-dependent bugs (the reference's own README calls manual tapping unreliable and
ships `npm run repro` specifically to fix that), no visibility into the simulated
database (the reference leads its own README with a literal table printout), a missing
order-history page and endpoint, a missing product-detail page, and a missing way to
demonstrate the reference author's actual teaching point (`PRICING_MS=0 JITTER=off`
makes the bug vanish — "that is exactly why bugs like these slip through on a fast
laptop"). None of these were deliberate, scoped-out decisions — they were just things
that didn't make it into the port. This standard exists so the next one doesn't repeat
that.

## The process

1. **Read the reference's own docs in full before writing `question.json`.** Treat the
   reference's README (and any linked docs, like a `database/README.md`) as the actual
   spec for what the question needs to cover — not just the scenario/symptom text.

2. **Build a parity checklist before porting anything.** List every page, route, test,
   and documented "good to know, not a bug" callout the reference has. For each one,
   mark it:
   - **Included** — ported as-is or adapted.
   - **Deliberately dropped** — one line saying why, written into the question's
     `notes/author-notes.md`. "Not relevant to this question's bug class" is a valid
     reason; silence is not.
   - **Gap** — should be included, isn't yet. Nothing ships with an open Gap; it either
     gets included or reclassified as deliberately dropped, with a reason, before the
     question is considered done.

3. **Match fidelity on the specific thing the question teaches, exactly.** Timing
   values, exact error codes/messages, exact edge-case behavior the reference calls out
   as "not a bug" — these are frequently the whole pedagogical point, not flavor text.
   flipkart-cart-lab's `BURST_DELAYS_MS = [800, 450, 100]` matching the reference's
   `LATENCY=lab` values exactly is the right level of care; a plausible-looking but
   different set of numbers would not be.

4. **When the reference's own tooling can't be reproduced 1:1 inside the sandbox
   (no real DB, no real network, no CLI), replace it with a platform-native
   equivalent — don't just drop the capability.** The reference's `npm run repro` and
   `npm run db:inspect` exist because manual reproduction and black-box debugging are
   genuinely harder without them; the platform's own DevTools panel is where their
   substitutes belong (see `docs/superpowers/specs/2026-11-03-devtools-expansion-design.md`
   for the first case of this: Conditions ~ `repro`, Data tab ~ `db:inspect`).

5. **Verify end-to-end against the reference's own documented repro steps and expected
   test-failure list.** Not "roughly similar" — the exact failing-test names and the
   exact described symptom, reproduced live in the browser, the same way
   flipkart-cart-lab's six failing tests were checked against the reference README's
   own table before considering that work done.

6. **`notes/author-notes.md` records the paper trail**: what reference (if any) the
   question was built from, every deliberately-dropped item and its reason, and which
   platform-native feature replaced which reference-specific tool.
