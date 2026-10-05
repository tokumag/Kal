# Kalcare — Voice-First Maternal & Newborn Health Navigator

**Positioning:** A voice-first maternal and newborn health navigation platform for expecting and new mothers in rural Ethiopia.

> *"Is this symptom something I can monitor, something I should raise with a health extension worker, or something requiring care right now?"*

---

## Technical Architecture

```text
Mother Speaks (English / Amharic)
        ↓
Voxide / Web Speech Layer (Speech-to-Text)
        ↓
Structured SymptomInput Payload
        ↓
POST /api/triage
        ↓
Pure Deterministic Triage Engine (lib/triage/)
        ↓
TriageResult Payload
        ↓
Visual Result Card & Spoken Voice Response
```

### Safety Principle: LLM / Voice Understands. Rules Decide.
- **Voice/Voxide**: Handles speech transcription, structured symptom extraction, and voice readout. Zero medical decisions.
- **Deterministic Engine (`lib/triage/`)**: Pure TypeScript evaluation of 7 frozen WHO & FMOH evidence-backed clinical danger signs.

---

## Quick Start & Installation

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test

# 3. Build for production
npm run build

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Team Ownership & Contracts

- **PERSON A (Voice + UI)**: `app/`, `components/`, `lib/voice/`.
- **PERSON B (Triage + Backend)**: `lib/triage/`, `app/api/triage/`, `tests/`.
- **PERSON C (Clinical Research & Docs)**: `research/`, `docs/`.
- **Shared Contract**: `lib/contracts/triage.ts`.

---

## 👥 Contributors

- **Tokuma Gebissa** ([@tokumag](https://github.com/tokumag)) — Project Lead & Architecture
- **Nardos Fekadu** ([@Nardos-12-Fekadu](https://github.com/Nardos-12-Fekadu)) — Deterministic Triage Engine, Next.js API & Voice UI

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for full contribution details.

---

## License & STARK Hackathon 2026
Built for the STARK Official Hackathon (Sep 09 - Oct 02, 2026).
Canonical Shared Repository: [https://github.com/tokumag/Kal](https://github.com/tokumag/Kal)