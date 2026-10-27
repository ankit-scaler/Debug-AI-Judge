# User flows — Debugging Lab P1

Status: **awaiting approval**. Companion to [architecture.md](architecture.md).

---

## 1. Learner: pick a question and solve it

```mermaid
flowchart TD
    A[Land on app] --> B{Signed in?}
    B -->|No| C[Google login]
    C --> D[Question list]
    B -->|Yes| D
    D --> E[Filter by difficulty / tag / solved]
    E --> F[Open question]
    F --> G[Server creates attempt<br/>stamps started_at]
    G --> H[Solve screen loads<br/>editable + readonly files only]
    H --> I[Reproduce bug in preview]
    I --> J[Inspect: console, network,<br/>or right-click Inspect]
    J --> K[Edit code in Monaco]
    K --> L[Run: preview rebuilds]
    L --> M{Found it?}
    M -->|Not yet| N{Want a hint?}
    N -->|Yes| O[Unlock hint<br/>penalty recorded server-side]
    O --> J
    N -->|No| J
    M -->|Think so| P[Submit]
    P --> Q{Verdict}
    Q -->|All criteria pass| R[Points awarded<br/>explanation + reference fix unlock<br/>leaderboard updates]
    Q -->|Some fail| S[Per-criterion results shown<br/>code kept, timer runs]
    S --> J
    M -->|Give up| T[Explanation unlocks<br/>score 0]
```

Only the **first** full pass writes a score row. Later submits still run, so a
learner can keep improving a solution, but the score does not change.

## 2. Submit: what happens server-side

```mermaid
sequenceDiagram
    participant L as Learner (browser)
    participant S as Next.js route
    participant DB as Supabase
    participant OR as OpenRouter

    L->>S: POST /api/attempts/:id/submit { files }
    S->>S: hash = sha256(question_version + normalized files)
    S->>DB: grading_cache lookup by hash
    alt Cache hit
        DB-->>S: cached verdict
        S-->>L: verdict (free, identical to last time)
    else Cache miss
        S->>S: esbuild bundle check (no execution)
        alt Build fails
            S-->>L: fail + compiler error (no tokens spent)
        else Build succeeds
            S->>DB: month-to-date spend vs ceiling
            alt Ceiling breached
                S-->>L: grading_unavailable (code preserved)
            else Within ceiling
                S->>DB: load rubric + reference fix (service role)
                S->>OR: grade (structured output)
                OR-->>S: { criteria[], passed }
                S->>DB: write grading_cache
                S->>DB: write ai_usage
                S->>DB: update attempts
                opt First full pass
                    S->>DB: insert user_question_scores
                end
                S-->>L: verdict with per-criterion evidence
            end
        end
    end
```

Three gates stand before any token is spent: the cache, the build check, and the
spend ceiling.

## 3. Author: ZIP to published question

```mermaid
flowchart TD
    A[Author uploads ZIP<br/>max 5 MB] --> B[JSZip parses in browser]
    B --> C{debuglab.json valid?}
    C -->|No| D[Reject: manifest error shown inline]
    C -->|Yes| E{Deps within allowlist?}
    E -->|No| F[Reject: name the offending dep]
    E -->|Yes| G[Server esbuild build check]
    G -->|Fails| H[Reject: compiler error shown inline]
    G -->|Succeeds| I[File tree in Monaco]
    I --> J[Mark each file<br/>editable / readonly / hidden]
    J --> K[Add scenario, symptom,<br/>difficulty, tags, bug category]
    K --> L[AI draft via OpenRouter:<br/>rubric, reference fix, 3 hints, explanation]
    L --> M[Author edits everything]
    M --> N[Validation: grade 3x]
    N --> O{All 3 runs agree?<br/>reference passes all,<br/>buggy fails >= 1}
    O -->|No| P[Blocked: unstable verdicts<br/>means bad rubric or bad question]
    P --> M
    O -->|Yes| Q[Preview as learner]
    Q --> R[Submit for review]
    R --> S[Peer review by another<br/>team member]
    S -->|Changes needed| M
    S -->|Approved| T[Published]
```

Rejections happen at upload, not after the author has written a whole question.

## 4. Admin: cost centre

```mermaid
flowchart LR
    A[ai_usage rows] --> B[Spend by feature<br/>draft / qa / feedback / grade / validate]
    A --> C[Spend by author]
    A --> D[Spend by day]
    A --> E[Month-to-date vs ceiling]
    E --> F{Ceiling breached?}
    F -->|Yes| G[Hard cutoff:<br/>submits return grading_unavailable]
    F -->|No| H[Normal operation]
    G --> I[Admin alerted,<br/>can raise ceiling]
```

## 5. Theme and loading behaviour

Applies to every screen above.

```mermaid
flowchart TD
    A[Page load] --> B[Inline script reads<br/>stored preference]
    B --> C{Preference set?}
    C -->|Yes| D[Apply data-theme before paint<br/>no flash]
    C -->|No| E[Follow system setting]
    D --> F[Render]
    E --> F
    F --> G[Manual toggle available]
    G --> H[Choice persisted]
```

Every click, navigation, modal open and async call shows a loader; the triggering
control disables while busy. Submit is the longest wait in the product — it shows
progress through its stages (checking build → grading) rather than a bare spinner.
