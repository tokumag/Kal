# Kalcare — Project Contributors

Kalcare is a voice-first maternal and newborn health navigation platform built for expecting and new mothers in rural Ethiopia as part of the STARK Hackathon 2026.

---

## 👥 Core Contributors

| Contributor | GitHub | Role | Key Contributions |
|---|---|---|---|
| **Tokuma Gebissa** | [@tokumag](https://github.com/tokumag) | Project Lead & Architecture | Repository owner, foundational architecture, product ideation, and STARK submission |
| **Nardos Fekadu** | [@Nardos-12-Fekadu](https://github.com/Nardos-12-Fekadu) | Full-Stack & Clinical Engine | Deterministic clinical triage engine, shared TypeScript contracts, Next.js `/api/triage` API, Voice UI integration, and automated test suites |

---

## 🏥 Clinical Evidence & Guidance
Sourced from official clinical danger signs guidelines:
- **World Health Organization (WHO)** — Integrated Management of Pregnancy and Childbirth (IMPAC), PCPNC, Sepsis Protocol, and IMCI.
- **Ethiopian Federal Ministry of Health (FMOH)** — Community Maternal & Newborn Danger Signs Guidelines, Obstetric Hemorrhage Protocol, and Antenatal Care Protocols.

---

## 🤝 Contributing
Contributions to Kalcare are welcome! Please ensure:
1. All clinical decisions remain inside the pure, deterministic triage engine in `lib/triage/`.
2. Any new rule has verified WHO/FMOH clinical evidence attached.
3. Automated tests pass (`npm test` and `npm run typecheck`).
