# SCHOLARXIV IDEATION & TECHNICAL SPECIFICATION

**Project Name:** Kalcare  
**Category:** Maternal & Newborn Health Navigation  
**Target Environment:** Rural Ethiopia (Primary Care & Community Health Extension Workers)  
**Hackathon:** STARK Official Hackathon 2026  

---

## 1. Executive Summary & Problem Context

In rural Ethiopia, pregnant and postpartum women face significant maternal and infant mortality risks due to the "Three Delays":
1. Delay in decision to seek care (lack of symptom severity awareness).
2. Delay in reaching a healthcare facility (geographical and transport barriers).
3. Delay in receiving adequate care upon arrival.

Kalcare directly addresses **Delay 1**. The central question Kalcare answers is:
> *"Is this symptom something I can monitor at home, something I should raise with my Health Extension Worker (HEW), or something requiring emergency care right now?"*

---

## 2. Core Architecture: LLM/Voice Understands. Rules Decide.

A key technical failure mode in early AI medical prototypes is allowing Large Language Models (LLMs) to independently generate diagnostic or urgency verdicts. LLMs are non-deterministic, prone to hallucination, and clinically unsafe for safety-critical health navigation.

### Kalcare Core Paradigm:
```text
Mother Speaks (English / Amharic)
        ↓
Voxide / Voice Layer (Transcribes & extracts structured payload)
        ↓
SymptomInput ({ symptom, stage, severity, language })
        ↓
POST /api/triage
        ↓
Pure Deterministic Triage Engine (lib/triage/)
        ↓
TriageResult ({ urgency, reason, nextAction, evidence })
        ↓
Visual UI & Spoken Voice Response
```

- **Voxide / Speech Layer**: Speech-to-text recognition and text-to-speech rendering. Zero clinical urgency logic.
- **Deterministic Triage Engine**: 100% testable, versioned, evidence-backed rules built from WHO and Ethiopian Federal Ministry of Health (FMOH) guidelines.
- **Evidence Registry**: Every decision links to explicit, traceable clinical guidelines.

---

## 3. Rejected Alternatives & Architectural Trade-offs

1. **Rejected: Direct LLM Medical Diagnosis Chatbot**
   - *Reason*: Hallucination risks and inconsistent urgency verdicts violate medical safety principles.
2. **Rejected: Microservices / Monorepo Architecture**
   - *Reason*: Unnecessary complexity for a 3-day sprint. One clean Next.js app provides ideal agility and hosting compatibility.
3. **Rejected: Custom In-house Speech Model**
   - *Reason*: Re-inventing voice models under sprint pressure is high-risk. Voxide and Web Speech APIs provide proven multilingual capability.

---

## 4. Clinical Rule Scope & Evidence

The prototype enforces **7 frozen danger-sign rules**:
1. Preeclampsia / Eclampsia indicators (Severe headache, visual blurring, sudden facial edema) → `SEEK_CARE_NOW`
2. Obstetric Bleeding (Pregnancy or postpartum hemorrhage) → `SEEK_CARE_NOW`
3. Maternal or Neonatal Sepsis / High Fever → `SEEK_CARE_NOW`
4. Severe Abdominal Pain → `SEEK_CARE_NOW`
5. Decreased / Absent Fetal Movement → `SEEK_CARE_NOW`
6. Newborn Danger Signs (Jaundice, lethargy, refusal to feed) → `SEEK_CARE_NOW`
7. Mild Pregnancy Symptoms (Nausea, ankle edema without headache) → `MONITOR` / `CONTACT_HEALTH_WORKER`

---

## 5. Limitations & Future Roadmap

- **Voice Support**: Amharic speech-to-text requires modern browser Web Speech API or active Voxide API connection.
- **Offline Capabilities**: Future work includes PWA offline caching for remote health posts without cellular connection.
- **Dialect Expansion**: Future expansion to Afaan Oromo and Tigrinya.
