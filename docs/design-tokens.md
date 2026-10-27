# Design tokens — Debugging Lab P1

Status: **awaiting approval**.

Direction **A. Dark IDE** was chosen in the PRD, so the three-option HTML
comparison is skipped. Five values come from the PRD; everything else is derived
from them and marked as such.

| From the PRD | Value |
|---|---|
| Dark background | `#0F1117` |
| Light background | `#F7F8FA` |
| Accent | `#F97316` |
| Light-mode accent text | `#C2410C` |
| Fonts | Inter (UI), JetBrains Mono (code) |

Dark is the default. Light mode follows the system setting unless the learner has
toggled it; the choice persists and is applied before first paint.

## Contrast — what I actually checked

I computed WCAG contrast ratios by hand for the three pairs that decide the
accent rules:

| Pair | Ratio | Verdict |
|---|---|---|
| `#F97316` on `#0F1117` | **6.7:1** | Passes AA for normal text |
| `#C2410C` on `#F7F8FA` | **4.9:1** | Passes AA for normal text |
| `#F97316` on `#F7F8FA` | **2.6:1** | Fails — fills and borders only, never text |

That last row is why the PRD specifies a different accent for light mode. The rule
that follows: **`#F97316` is text-safe on dark only. In light mode, accent text and
icons use `#C2410C`; `#F97316` may still be used as a fill or border.**

The remaining pairs below are derived and have **not** been individually verified.
A contrast pass over the built UI is part of the work, not a claim I am making now.

## Tokens

Defined on `:root`, redefined under `@media (prefers-color-scheme: dark)` guarded by
`:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.
No component hardcodes a color.

### Dark (default)

```
--bg                #0F1117   page
--surface           #161922   panels, cards
--surface-raised    #1E222D   editor chrome, tab bar, modals
--border            #2A2F3C   dividers, input borders
--border-strong     #3A4150   focused input, active tab
--text              #E6E9EF   body
--text-muted        #9AA3B2   labels, metadata
--text-faint        #6B7382   placeholders, disabled
--accent            #F97316   links, active tab, primary button fill
--accent-hover      #FB8A3C
--accent-fg         #0F1117   text on an accent fill
--success           #22C55E   criterion passed
--danger            #EF4444   criterion failed
--warning           #F59E0B   over time limit, hint penalty
--info              #60A5FA   network panel, informational
```

### Light

```
--bg                #F7F8FA
--surface           #FFFFFF
--surface-raised    #FFFFFF
--border            #E2E5EA
--border-strong     #C9CED6
--text              #171A21
--text-muted        #5B6472
--text-faint        #8A929F
--accent            #C2410C   text and icons (see contrast rule)
--accent-fill       #F97316   fills and borders only
--accent-hover      #9A3412
--accent-fg         #FFFFFF
--success           #15803D
--danger            #B91C1C
--warning           #B45309
--info              #1D4ED8
```

### Type

```
--font-ui     'Inter', system-ui, sans-serif
--font-code   'JetBrains Mono', ui-monospace, monospace

--text-xs     12px / 16px    metadata, token counts
--text-sm     13px / 20px    labels, panel headers
--text-base   14px / 22px    body, problem statement
--text-lg     16px / 24px    question title
--text-xl     20px / 28px    page heading
--text-2xl    28px / 36px    scores, leaderboard rank

--code-sm     12px / 18px    console, network rows
--code-base   13px / 20px    editor
```

14px body rather than 16px: this is an IDE, and density matters. Both fonts load
from Google Fonts.

### Spacing, radius, motion

```
--space-1  4px     --radius-sm   4px    inputs, small chips
--space-2  8px     --radius-md   6px    buttons, cards
--space-3  12px    --radius-lg   10px   modals, panels
--space-4  16px    --radius-full 999px  avatars, badges
--space-6  24px
--space-8  32px

--shadow-sm   0 1px 2px rgb(0 0 0 / 0.20)
--shadow-md   0 4px 12px rgb(0 0 0 / 0.28)

--ease        cubic-bezier(0.2, 0, 0.2, 1)
--dur-fast    120ms   hover, focus
--dur-base    200ms   panel open, tab switch
--dur-slow    320ms   modal
```

Shadow alphas are tuned for dark and are raised in light mode, where a shadow on
white needs more weight to read.

## Component rules

**Buttons.** Primary is an accent fill with `--accent-fg` text. Secondary is a
`--border` outline on `--surface`. Destructive uses `--danger`. Every button
disables while its action is in flight and shows an inline spinner in place of its
label — never alongside it, which causes width jump.

**Loaders.** Skeletons for content whose shape is known (question list, file tree,
problem statement). Spinners for actions whose duration is unknown (run, submit).
Submit is the longest wait in the product and shows its stages — "checking build",
then "grading" — rather than one undifferentiated spinner.

**Results tab.** One row per rubric criterion: `--success` check or `--danger`
cross, the criterion text, and the grader's evidence quote in `--font-code` on
`--surface-raised`. Never a bare pass/fail number.

**Hints.** Locked hints show their penalty before unlock, in `--warning`. An
unlocked hint cannot be re-locked, and the penalty is already recorded server-side.

**Timer.** `--text-muted` while within the limit, `--warning` once over it. It is
display only — the server owns elapsed time.

**Editor.** Monaco dark theme tuned to these tokens for dark, light theme for
light. Read-only files get a visible lock badge on the tab, not just a silent
rejection on keypress.

**Focus.** A 2px `--accent` ring at 2px offset on every interactive element. Never
removed without a replacement.
