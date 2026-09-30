# KALCARE — MASTER PROJECT PROMPT

## ANTIGRAVITY EXECUTION INSTRUCTION

You are the primary engineering agent for the Kalcare hackathon project.

This file is the project-wide source of truth. Read it completely before modifying the repository.

Kalcare is being built by a 3-person team in a compressed 2–3 day sprint. Optimize for a small, reliable, demonstrable product rather than architectural breadth.

Do not wait for perfect requirements. Inspect the existing repository, preserve useful existing work, and begin implementation immediately.


## EXISTING SHARED GITHUB REPOSITORY — MANDATORY

The canonical shared repository for this project is:

https://github.com/tokumag/Kal

The repository is currently public and its GitHub page shows the `main` branch with only the initial repository files and one commit. Therefore, treat the local Antigravity workspace as potentially containing newer unpushed work and inspect BOTH the local working tree and Git history before scaffolding or deleting anything. citeturn0view0

Before doing implementation work:

1. Inspect the current repository contents.
2. Inspect `README.md`, `.gitignore`, package/config files, and all existing source files.
3. Run `git status`.
4. Run `git branch -a`.
5. Run `git remote -v`.
6. Inspect recent `git log --oneline --decorate --all`.
7. Confirm the current branch and remote.
8. Do NOT run `git init`.
9. Do NOT create a second repository.
10. Do NOT replace existing code with a new scaffold before understanding what is already present.
11. Preserve useful local work, including work that has not yet been pushed.
12. Keep the canonical remote pointed at the Kal repository unless the team explicitly changes it.
13. Commit meaningful progress incrementally.
14. Push verified work regularly.
15. Never force-push or rewrite shared history.
16. Never commit secrets, credentials, API keys, or unrelated files.

All teammates are working in this same repository. Coordinate shared-contract changes instead of creating competing implementations.


---

# 1. PROJECT

**Name:** Kalcare

**Positioning:** A voice-first maternal & newborn health navigator for expecting and new mothers in rural Ethiopia.

**Core question:**

> "Is this symptom something I can monitor, something I should raise with a health worker, or something requiring care right now?"

Kalcare is NOT a general pregnancy chatbot and NOT a diagnostic system.

Core experience:

```text
Mother speaks or types a symptom
        ↓
Voxide / input parsing
        ↓
Structured SymptomInput
        ↓
Next.js API
        ↓
Pure deterministic triage engine
        ↓
TriageResult
        ↓
Visual result + spoken response
```

---

# 2. HACKATHON CONTEXT

STARK Official Hackathon:

- Kickoff: Sep 09
- Build window: Sep 09 → Oct 02
- Announcement day: Oct 02 at ALX
- Project must be built from scratch after kickoff
- GitHub history is continuously inspected
- STARK Changelogs are part of the public development record
- Scholarxiv ideation documentation is mandatory
- Voxide voice interaction is mandatory
- EthioDeploy hosting is optional but strongly advantageous
- Links.et is required only for products taking payments; Kalcare takes no payments

Judging criteria:

1. Ideation
2. Implementation strategy
3. Teamwork
4. Creativity
5. Building under pressure

The repository history should visibly demonstrate incremental work rather than one final dump.

---

# 3. ABSOLUTE ARCHITECTURAL SAFETY RULE

## LLM / VOICE UNDERSTANDS. RULES DECIDE.

Voxide or an LLM may:

- listen to speech
- transcribe speech
- identify/normalize symptoms
- collect stage/severity/context
- invoke application capabilities

It must NEVER independently:

- diagnose
- decide medical urgency
- invent a clinical recommendation
- override the deterministic triage engine

Medical decision-making exists only in:

```text
lib/triage/
```

The triage engine must be deterministic, versioned, testable, and independent of React, Voxide, LLMs, and databases.

If uncertain/cannot safely classify, escalate toward human care rather than provide an unfounded reassuring answer.

---

# 4. SPRINT ARCHITECTURE

Use:

- ONE Next.js application
- Next.js API routes
- TypeScript
- React/Next.js
- pure `lib/triage/`
- simple static rule data
- simple API validation
- tests

Do NOT introduce:

- NestJS
- a separate backend server
- a monorepo
- Redis
- BullMQ
- Kubernetes
- unnecessary microservices
- a general medical knowledge engine
- custom speech recognition

If check-ins are implemented, use the simplest mock/local/scheduled implementation possible.

Committed languages:

- English
- Amharic

Oromiffa is stretch only.

---

# 5. FROZEN CLINICAL SCOPE

The danger-sign rule set is frozen at **5–8 rules**.

Person C sources and freezes the rules.

Person B encodes them.

Person A consumes their results.

Do not expand the rule count under sprint pressure.

Do not invent clinical rules.

Every implemented rule must be traceable to explicit evidence.

Kalcare is a navigation/decision-support prototype and is not a replacement for professional medical care.

---

# 6. SHARED CONTRACT

Create/reuse:

```text
lib/contracts/triage.ts
```

```ts
export type PatientStage =
  | "PREGNANT"
  | "POSTPARTUM"
  | "NEWBORN";

export type Urgency =
  | "MONITOR"
  | "CONTACT_HEALTH_WORKER"
  | "SEEK_CARE_NOW";

export interface SymptomInput {
  symptom: string;
  severity?: "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN";
  stage: PatientStage;
  weeksOrDays?: number;
  language?: "en" | "am";
}

export interface EvidenceReference {
  source: string;
  version: string;
  reference: string;
}

export interface TriageResult {
  urgency: Urgency;
  reason: string;
  nextAction: string;
  evidence: EvidenceReference[];
}
```

Do not create competing versions.

API:

```text
POST /api/triage
```

The API validates input, invokes the pure triage engine, and returns `TriageResult`.

---

# 7. RECOMMENDED REPOSITORY STRUCTURE

Adapt to the actual repository rather than blindly creating this structure:

```text
kal/
├── app/
├── components/
├── features/
├── lib/
│   ├── contracts/
│   ├── triage/
│   └── voice/
├── research/
├── docs/
├── infra/
├── tests/
├── public/
├── package.json
└── README.md
```

Do not create a monorepo.

---

# 8. TEAM OWNERSHIP

## PERSON A — Voice + UI

Owns:

```text
app/                 # frontend only
components/
features/
lib/voice/
```

May coordinate:

```text
lib/contracts/
```

Must not modify:

```text
lib/triage/
research/
docs/
infra/
.github/
```

Deliverable:

```text
Voxide/type symptom
→ SymptomInput
→ /api/triage
→ TriageResult
→ visual + spoken result
```

---

## PERSON B — Triage + Backend

Owns:

```text
lib/triage/
app/api/triage/
lib/contracts/
```

May add tests.

Must not modify:

```text
components/
features/
lib/voice/
research/
docs/
infra/
.github/
```

Deliverable:

```ts
evaluateTriage(input: SymptomInput): TriageResult
```

plus API and tests.

---

## PERSON C — Clinical Research + Scholarxiv + Deployment

Owns:

```text
research/
docs/
infra/
.github/
```

May configure root deployment files.

Must not directly implement:

```text
lib/triage/
```

Deliverables:

- 5–8 sourced rules
- evidence registry
- Scholarxiv ideation
- EthioDeploy
- demo script
- hackathon evidence

---

# 9. INTEGRATION RULES

All teammates use the same `SymptomInput` and `TriageResult`.

Person A may mock `/api/triage`.

Person B implements the real API.

Person C supplies the clinical specification.

Anything touching:

```text
lib/triage/
```

requires PR review.

Person C verifies evidence/rule alignment.

Person A verifies API output compatibility.

Other work can merge quickly after basic testing.

---

# 10. GIT / HACKATHON HISTORY

Because `https://github.com/tokumag/Kal` is the shared repository, every meaningful phase must leave a clear Git trail.

Use branches such as:

```text
feat/voice-ui
feat/voxide-integration
feat/triage-engine
docs/clinical-rules
docs/scholarxiv-ideation
chore/ethiodeploy
```

Commit early and often.

Never:

- force-push
- rewrite history
- commit secrets
- commit broken code knowingly
- create a second repository

At each verified milestone:

1. run tests
2. run build/type checks where applicable
3. inspect `git diff`
4. inspect `git status`
5. make a clean descriptive commit
6. push the verified commit
7. verify the push
8. report commit hash/message, remote, branch, push status, and working-tree status

---

# 11. UI PRINCIPLES

Kalcare should feel:

- calm
- trustworthy
- accessible
- mobile-first
- simple
- human

Avoid:

- neon AI aesthetics
- AI mascots
- excessive glassmorphism
- gaming UI
- unnecessary dashboards
- dense medical text

Primary CTA:

```text
Talk to Kalcare
```

Typed fallback must be equally discoverable.

Urgency must not rely on color alone.

---

# 12. CORE USER FLOW

```text
OPEN KALCARE
     ↓
TALK TO KALCARE
     ↓
Speak in English or Amharic
     ↓
Voxide extracts structured symptom
     ↓
POST /api/triage
     ↓
lib/triage/
     ↓
TriageResult
     ↓
Show result
     ↓
Speak result
```

Voice failure:

```text
Typed symptom
     ↓
same API
     ↓
same triage engine
     ↓
same result
```

---

# 13. UNCERTAINTY

If the system cannot safely classify an input:

Do not guess.

Do not return reassuring `MONITOR` merely because information is insufficient.

Return a conservative human-escalation result consistent with the clinical specification.

---

# 14. VOXIDE

Voxide is central, not decorative.

Minimum useful capability:

1. Voice symptom submission
2. Structured symptom extraction
3. API call
4. Spoken result

Potential capabilities:

```text
submit_symptom
get_triage_verdict
start_checkin
```

Prioritize the first two.

Do not build custom speech recognition.

---

# 15. SCHOLARXIV

Document:

- problem
- target users
- alternatives
- rejected alternatives
- final architecture
- why LLM-only medical decision was rejected
- why voice matters
- limitations

Do not fabricate sources or publication status.

---

# 16. ETHIODEPLOY

If practical, deploy the single Next.js app.

Verify:

- homepage
- `/api/triage`
- frontend/API communication
- production build

Never commit secrets.

---

# 17. CHECK-INS

Secondary feature only.

Do not let check-ins delay the core:

```text
symptom → decision → next action
```

No Redis/BullMQ.

---

# 18. DEMO

Use one mother/persona and one symptom scenario:

1. symptom occurs
2. open Kalcare
3. speak
4. Voxide understands
5. structured input
6. deterministic engine
7. urgency
8. next action
9. evidence
10. optional check-in
11. show Scholarxiv/GitHub/deployment

Key statement:

> Voxide understands. Our deterministic rules decide. Evidence explains why.

---

# 19. DEFINITION OF DONE

Product:

- [ ] English voice
- [ ] Amharic voice
- [ ] typed fallback
- [ ] 5–8 sourced rules
- [ ] triage result
- [ ] spoken result
- [ ] uncertainty escalation
- [ ] mobile UI
- [ ] deployment if practical

Engineering:

- [ ] one Next.js app
- [ ] `/api/triage`
- [ ] pure `lib/triage/`
- [ ] canonical shared types
- [ ] deterministic tests
- [ ] evidence metadata
- [ ] no LLM medical verdict
- [ ] no unnecessary infrastructure

Hackathon:

- [ ] Scholarxiv ideation
- [ ] sourced rules
- [ ] incremental Git history
- [ ] STARK Changelog
- [ ] deployment
- [ ] demo script
- [ ] limitations

---

# 20. ANTIGRAVITY OPERATING MODE

When starting:

1. Inspect `https://github.com/tokumag/Kal` locally and its Git configuration.
2. Inspect the current working tree before creating files.
3. Preserve useful existing work.
4. Establish/reuse the shared contract.
5. Respect ownership boundaries.
6. Build the smallest demoable vertical slice.
7. Test frequently.
8. Commit frequently.
9. Push verified progress.
10. Never hide failures.
11. Never fabricate clinical sources.
12. Never move medical decisions into Voxide/LLM code.
13. Avoid scope creep.

If a requirement belongs to another teammate, create the necessary interface/documentation and continue with your own work.

The finished system must preserve:

```text
VOICE / LLM
    =
UNDERSTANDING

DETERMINISTIC TRIAGE ENGINE
    =
DECISION

SCHOLARXIV / SOURCES
    =
EVIDENCE

NEXT.JS
    =
PRODUCT + API

VOXIDE
    =
VOICE INTERACTION

ETHIODEPLOY
    =
HOSTING
```

Build small. Build honestly. Keep the GitHub history visible. Make the core decision flow work end-to-end first.
