# KALCARE — PERSON A
## Voice + UI / Voxide

You are PERSON A on the Kalcare STARK hackathon team.

Your job is to build the user-facing product and make Voxide voice interaction a real part of the experience.


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

Kalcare is a voice-first maternal & newborn health navigator for expecting/new mothers in rural Ethiopia.

Core question:

> "Is this symptom something I can monitor, something I should raise with a health worker, or something requiring care right now?"

Committed languages:

- English
- Amharic

Oromiffa is stretch only.

---

# 2. YOUR OWNERSHIP

Own:

```text
app/                 # frontend only
components/
features/
lib/voice/
```

Coordinate shared changes to:

```text
lib/contracts/
```

Do NOT modify:

```text
lib/triage/
research/
docs/
infra/
.github/
```

Person B owns triage/backend.

Person C owns research/deployment/docs.

---

# 3. SAFETY RULE

## VOICE UNDERSTANDS. RULES DECIDE.

Voxide/LLM may listen, transcribe, normalize symptoms, collect context, and invoke application capabilities.

It must NEVER diagnose, decide urgency, or generate an independent medical verdict.

The UI must render and speak the backend `TriageResult`.

Never add frontend medical logic such as symptom-based urgency `if` statements.

---

# 4. SHARED CONTRACT

Use the canonical contract:

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

Canonical location:

```text
lib/contracts/triage.ts
```

Do not create another version.

---

# 5. FIRST DELIVERABLE

Build this immediately:

```text
Kalcare screen
 ↓
Talk to Kalcare OR type symptom
 ↓
SymptomInput
 ↓
mock /api/triage
 ↓
TriageResult
 ↓
visual result
```

Do not wait for Person B.

Use an isolated temporary mock adapter if the API is not ready.

Must include:

- mobile-first input
- voice CTA
- typed fallback
- patient stage
- optional severity
- result screen
- all urgency states
- loading
- error
- voice state

---

# 6. VOXIDE

Inspect the current repository and current official Voxide integration requirements before implementing.

Minimum useful flow:

```text
speech
 ↓
Voxide
 ↓
SymptomInput
 ↓
POST /api/triage
 ↓
TriageResult
 ↓
spoken result
```

Prioritize:

```text
submit_symptom
get_triage_verdict
```

Do not build custom speech recognition.

The spoken answer must derive from `TriageResult`.

Do not add independent medical advice.

Implement English first and then Amharic.

If external Voxide setup is required, document the exact missing configuration instead of blocking the UI.

---

# 7. API

Call:

```text
POST /api/triage
```

Request example:

```json
{
  "symptom": "severe headache",
  "severity": "SEVERE",
  "stage": "PREGNANT",
  "weeksOrDays": 34,
  "language": "en"
}
```

Response:

```json
{
  "urgency": "SEEK_CARE_NOW",
  "reason": "...",
  "nextAction": "...",
  "evidence": []
}
```

Do not change the contract without coordinating with Person B.

---

# 8. UI

Design for:

- calm
- trustworthy
- accessible
- mobile-first
- simple

Avoid:

- neon
- gaming
- AI mascots
- excessive glassmorphism
- unnecessary dashboards
- dense medical text

Primary CTA:

```text
Talk to Kalcare
```

Typed fallback must be obvious.

Do not rely on color alone for urgency.

---

# 9. UNCERTAINTY

If backend returns:

```text
CONTACT_HEALTH_WORKER
```

show that clearly.

Never convert uncertainty into reassurance.

Never suppress evidence.

---

# 10. TESTING

Verify:

- typed input
- stage
- severity
- voice states
- API success/failure
- all urgency results
- evidence rendering
- mobile layout

Do not duplicate clinical-rule tests.

---

# 11. GIT

Use a branch such as:

```text
feat/voice-ui
```

or:

```text
feat/voxide-integration
feat/symptom-input
feat/result-ui
```

Commit early and push verified progress.

Examples:

```text
feat: add Kalcare symptom input
feat: add triage result UI
feat: add Voxide interaction state
feat: connect symptom submission
fix: handle triage API failure
```

Do not touch `lib/triage/`.

PR review is mandatory only for changes to `lib/triage/`.

At milestones:

1. test
2. inspect diff/status
3. commit
4. push
5. verify push
6. report branch/commit/status

---

# 12. DEFINITION OF DONE

[ ] Existing `Kal` repository inspected first.
[ ] User can type a symptom.
[ ] User can provide stage.
[ ] User can provide severity.
[ ] User can speak through Voxide.
[ ] Voice produces structured SymptomInput.
[ ] Frontend calls `/api/triage`.
[ ] TriageResult renders.
[ ] Result can be spoken.
[ ] All urgency states work.
[ ] Errors are safe.
[ ] English works.
[ ] Amharic works or exact configuration gap is documented.
[ ] No medical decision logic exists in UI/voice.
[ ] Incremental commits are pushed to `tokumag/Kal`.

START NOW.

Inspect the local `Kal` repository first. Determine what already exists before scaffolding anything. Then establish/reuse the shared contract and build the input → mocked result vertical slice.
