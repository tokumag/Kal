// tests/triage.test.ts
// Automated test suite for Kalcare Deterministic Triage Engine.
// Verified against Person C Clinical Evidence Registry (research/clinical_evidence.md).
// Requirements:
// 1. Every frozen clinical rule (all 7 rules)
// 2. Positive rule match
// 3. Non-match
// 4. Patient stage behavior
// 5. Severity behavior
// 6. Unknown symptom
// 7. Ambiguous input
// 8. Missing input
// 9. Invalid stage
// 10. Invalid severity
// 11. Invalid language
// 12. Evidence propagation
// 13. Deterministic repeated calls

import { describe, it, expect } from "vitest";
import { evaluateTriage } from "../lib/triage/engine";
import { SymptomInput } from "../lib/contracts/triage";
import { TRIAGE_RULES } from "../lib/triage/rules";

describe("Deterministic Triage Engine — Pure Unit Tests", () => {
  // 1. Verification of Rule Inventory
  it("contains exactly 7 clinically sourced rules from Person C registry", () => {
    expect(TRIAGE_RULES).toHaveLength(7);
    const ruleIds = TRIAGE_RULES.map((r) => r.id);
    expect(ruleIds).toEqual([
      "RULE_PREECLAMPSIA",
      "RULE_BLEEDING",
      "RULE_FEVER",
      "RULE_ABDOMINAL_PAIN",
      "RULE_FETAL_MOVEMENT",
      "RULE_NEWBORN_DANGER",
      "RULE_MILD_SYMPTOMS",
    ]);
  });

  // 2. RULE 1: RULE_PREECLAMPSIA
  describe("RULE_PREECLAMPSIA", () => {
    it("matches severe headache and blurred vision in pregnancy as SEEK_CARE_NOW", () => {
      const input: SymptomInput = {
        symptom: "severe headache and blurred vision",
        stage: "PREGNANT",
        severity: "SEVERE",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("preeclampsia");
      expect(result.nextAction).toContain("emergency");
      expect(result.evidence.length).toBeGreaterThan(0);
      expect(result.evidence[0].source).toContain("WHO");
    });

    it("matches facial swelling in pregnancy", () => {
      const input: SymptomInput = {
        symptom: "sudden facial swelling and headache",
        stage: "PREGNANT",
        severity: "MODERATE",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
    });

    it("matches Amharic preeclampsia danger signs", () => {
      const input: SymptomInput = {
        symptom: "ከፍተኛ ራስ ምታት እና የእይታ ብዥታ",
        stage: "PREGNANT",
        language: "am",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("ፕሪኤክላምፕሺያ");
      expect(result.nextAction).toContain("ወዲያውኑ");
    });
  });

  // 3. RULE 2: RULE_BLEEDING
  describe("RULE_BLEEDING", () => {
    it("matches vaginal bleeding in PREGNANT stage", () => {
      const input: SymptomInput = {
        symptom: "heavy vaginal bleeding",
        stage: "PREGNANT",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("hemorrhage");
      expect(result.evidence.some((e) => e.reference.includes("Hemorrhage"))).toBe(true);
    });

    it("matches vaginal bleeding in POSTPARTUM stage", () => {
      const input: SymptomInput = {
        symptom: "continuous bleeding after birth",
        stage: "POSTPARTUM",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
    });

    it("matches Amharic bleeding symptoms", () => {
      const input: SymptomInput = {
        symptom: "ከባድ ደም መፍሰስ",
        stage: "POSTPARTUM",
        language: "am",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("ደም መፍሰስ");
    });
  });

  // 4. RULE 3: RULE_FEVER
  describe("RULE_FEVER", () => {
    it("matches high fever across PREGNANT, POSTPARTUM, and NEWBORN stages", () => {
      const stages: SymptomInput["stage"][] = ["PREGNANT", "POSTPARTUM", "NEWBORN"];
      for (const stage of stages) {
        const result = evaluateTriage({
          symptom: "high fever with chills",
          stage,
          language: "en",
        });
        expect(result.urgency).toBe("SEEK_CARE_NOW");
        expect(result.reason).toContain("sepsis");
      }
    });

    it("matches Amharic fever signs", () => {
      const result = evaluateTriage({
        symptom: "ከፍተኛ ትኩሳት እና ብርድ ብርድ",
        stage: "PREGNANT",
        language: "am",
      });
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("ትኩሳት");
    });
  });

  // 5. RULE 4: RULE_ABDOMINAL_PAIN
  describe("RULE_ABDOMINAL_PAIN", () => {
    it("matches severe abdominal pain during pregnancy", () => {
      const input: SymptomInput = {
        symptom: "severe abdominal pain and uterine tenderness",
        stage: "PREGNANT",
        severity: "SEVERE",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.evidence[0].source).toContain("WHO");
      expect(result.evidence[0].source).toContain("IMPAC");
    });

    it("matches Amharic severe abdominal pain", () => {
      const input: SymptomInput = {
        symptom: "ከባድ የሆድ ህመም",
        stage: "PREGNANT",
        language: "am",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("የሆድ ህመም");
    });
  });

  // 6. RULE 5: RULE_FETAL_MOVEMENT
  describe("RULE_FETAL_MOVEMENT", () => {
    it("matches absent fetal movement in third trimester (>= 28 weeks)", () => {
      const input: SymptomInput = {
        symptom: "baby stopped moving, no fetal movement",
        stage: "PREGNANT",
        weeksOrDays: 32,
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("fetal distress");
      expect(result.evidence[0].source).toContain("FMOH");
    });

    it("matches decreased fetal movement when weeks not explicitly provided", () => {
      const input: SymptomInput = {
        symptom: "decreased fetal movement and no kicks",
        stage: "PREGNANT",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
    });

    it("does not match fetal movement rule if gestation is early (< 28 weeks)", () => {
      const input: SymptomInput = {
        symptom: "decreased fetal movement",
        stage: "PREGNANT",
        weeksOrDays: 16,
        language: "en",
      };
      const result = evaluateTriage(input);
      // Under 28 weeks, fetal movement rule does not fire; escalates safely to CONTACT_HEALTH_WORKER
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });
  });

  // 7. RULE 6: RULE_NEWBORN_DANGER
  describe("RULE_NEWBORN_DANGER", () => {
    it("matches newborn jaundice and refusal to feed", () => {
      const input: SymptomInput = {
        symptom: "baby has yellow skin and not feeding",
        stage: "NEWBORN",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("neonatal");
      expect(result.evidence[0].source).toContain("IMCI");
    });

    it("matches newborn lethargy", () => {
      const input: SymptomInput = {
        symptom: "baby is very lethargic and limp",
        stage: "NEWBORN",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
    });

    it("matches Amharic newborn danger signs", () => {
      const input: SymptomInput = {
        symptom: "ቢጫ ቆዳ እና ጡት አለመጥባት",
        stage: "NEWBORN",
        language: "am",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
      expect(result.reason).toContain("አዲስ ተወላጅ");
    });
  });

  // 8. RULE 7: RULE_MILD_SYMPTOMS
  describe("RULE_MILD_SYMPTOMS", () => {
    it("evaluates mild nausea as MONITOR", () => {
      const input: SymptomInput = {
        symptom: "morning sickness nausea",
        stage: "PREGNANT",
        severity: "MILD",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("MONITOR");
      expect(result.evidence[0].source).toContain("FMOH");
    });

    it("evaluates mild ankle swelling as MONITOR", () => {
      const input: SymptomInput = {
        symptom: "mild ankle swelling after walking",
        stage: "PREGNANT",
        severity: "MILD",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("MONITOR");
    });

    it("does NOT evaluate mild symptoms as MONITOR if severity is marked SEVERE", () => {
      const input: SymptomInput = {
        symptom: "morning sickness nausea",
        stage: "PREGNANT",
        severity: "SEVERE",
        language: "en",
      };
      const result = evaluateTriage(input);
      // Severe nausea cannot be safely triaged as MONITOR -> escalates to CONTACT_HEALTH_WORKER
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });

    it("does NOT evaluate as MONITOR if dangerous symptom is present alongside mild symptom", () => {
      const input: SymptomInput = {
        symptom: "morning sickness nausea with severe headache",
        stage: "PREGNANT",
        severity: "MILD",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("SEEK_CARE_NOW");
    });
  });

  // 9. Stage-specific isolation
  describe("Patient stage enforcement", () => {
    it("does not apply pregnancy-specific rule (preeclampsia) to NEWBORN", () => {
      const input: SymptomInput = {
        symptom: "severe headache",
        stage: "NEWBORN",
        language: "en",
      };
      const result = evaluateTriage(input);
      // Not a valid stage for preeclampsia -> safe escalation
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });

    it("does not apply newborn danger signs to PREGNANT stage", () => {
      const input: SymptomInput = {
        symptom: "refusal to feed",
        stage: "PREGNANT",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });
  });

  // 10. Unknown, Ambiguous, and Missing Inputs
  describe("Uncertainty and safe escalation", () => {
    it("escalates completely unknown symptoms to CONTACT_HEALTH_WORKER", () => {
      const input: SymptomInput = {
        symptom: "itchy left elbow",
        stage: "PREGNANT",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
      expect(result.reason).toContain("could not safely determine");
      expect(result.nextAction).toContain("Health Extension Worker");
    });

    it("escalates ambiguous input to CONTACT_HEALTH_WORKER", () => {
      const input: SymptomInput = {
        symptom: "I just feel a bit weird today",
        stage: "POSTPARTUM",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });

    it("escalates missing/empty symptom string to CONTACT_HEALTH_WORKER", () => {
      const input: SymptomInput = {
        symptom: "   ",
        stage: "PREGNANT",
        language: "en",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });

    it("escalates invalid stage input to CONTACT_HEALTH_WORKER", () => {
      const input = {
        symptom: "severe headache",
        stage: "TODDLER",
        language: "en",
      } as unknown as SymptomInput;
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });

    it("escalates invalid severity input to CONTACT_HEALTH_WORKER", () => {
      const input = {
        symptom: "nausea",
        stage: "PREGNANT",
        severity: "CRITICAL",
        language: "en",
      } as unknown as SymptomInput;
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
    });

    it("provides Amharic fallback when language is am", () => {
      const input: SymptomInput = {
        symptom: "ያልታወቀ ህመም",
        stage: "PREGNANT",
        language: "am",
      };
      const result = evaluateTriage(input);
      expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
      expect(result.reason).toContain("ካልኬር");
    });
  });

  // 11. Evidence Propagation
  describe("Evidence propagation integrity", () => {
    it("ensures every matched danger rule has valid non-empty evidence citations", () => {
      for (const rule of TRIAGE_RULES) {
        expect(rule.evidence.length).toBeGreaterThan(0);
        for (const ev of rule.evidence) {
          expect(ev.source).toBeTruthy();
          expect(ev.version).toBeTruthy();
          expect(ev.reference).toBeTruthy();
        }
      }
    });
  });

  // 12. Determinism Verification
  describe("Strict Determinism", () => {
    it("guarantees identical repeated calls produce identical results", () => {
      const inputs: SymptomInput[] = [
        {
          symptom: "severe headache and blurred vision",
          stage: "PREGNANT",
          severity: "SEVERE",
          language: "en",
        },
        {
          symptom: "heavy vaginal bleeding",
          stage: "POSTPARTUM",
          language: "en",
        },
        {
          symptom: "morning sickness nausea",
          stage: "PREGNANT",
          severity: "MILD",
          language: "en",
        },
        {
          symptom: "ከፍተኛ ራስ ምታት",
          stage: "PREGNANT",
          language: "am",
        },
        {
          symptom: "unrecognized symptom test",
          stage: "PREGNANT",
          language: "en",
        },
      ];

      for (const input of inputs) {
        const result1 = evaluateTriage(input);
        const result2 = evaluateTriage(input);
        expect(result1).toEqual(result2);
      }
    });
  });
});
