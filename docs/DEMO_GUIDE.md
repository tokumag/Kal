# KALCARE HACKATHON DEMO GUIDE

This guide provides step-by-step instructions for demonstrating Kalcare during the STARK hackathon evaluation.

---

## Key Demo Principle
> **"Voxide understands. Our deterministic rules decide. Evidence explains why."**

---

## Persona 1: Aster (Severe Headache in Pregnancy - English Flow)

1. Open Kalcare in the browser.
2. Click **"Load Demo Persona: Aster"** or click **"Talk to Kalcare"**.
3. Speak or type:
   > *"I am 34 weeks pregnant and I have a severe headache and facial swelling."*
4. Click **"Submit Symptom"**.
5. **Observed Outcome**:
   - Urgency Badge: `SEEK CARE NOW` (Red Emergency)
   - Clinical Reason: Preeclampsia danger sign indicator.
   - Recommended Action: Proceed immediately to the nearest health center.
   - Click **"🔊 Listen to Recommendation"** to hear voice playback.
   - Click **"▶ View Sourced Clinical Evidence"** to inspect WHO IMPAC & Ethiopian FMOH references.

---

## Persona 2: Amharic Maternal Bleeding Flow (አማርኛ)

1. Switch language to **አማርኛ** at the top right.
2. Click **"ለካልኬር ይናገሩ (Talk to Kalcare)"** or type:
   > *"ከፍተኛ የደም መፍሰስ አለብኝ"*
3. Click **"ምርመራ ይመልከቱ"**.
4. **Observed Outcome**:
   - Urgency Badge: `ወዲያውኑ የህክምና እርዳታ ያግኙ (SEEK CARE NOW)`
   - Reason in Amharic explaining obstetric hemorrhage danger.
   - Immediate instruction in Amharic for health facility transit.

---

## Key Technical Callouts to Highlight

1. **Safety Boundary**: Point out that the frontend and Voxide contain zero medical logic.
2. **API Isolation**: Show the Network tab executing `POST /api/triage`.
3. **Deterministic Testing**: Mention `npm test` verifying 100% predictable rule outputs.
