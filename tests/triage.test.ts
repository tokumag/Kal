import { describe, it, expect } from "vitest";
import { evaluateTriage } from "../lib/triage/engine";
import { SymptomInput } from "../lib/contracts/triage";

describe("Deterministic Triage Engine", () => {
  it("evaluates severe headache during pregnancy as SEEK_CARE_NOW", () => {
    const input: SymptomInput = {
      symptom: "severe headache and blurred vision",
      stage: "PREGNANT",
      severity: "SEVERE",
      language: "en",
    };
    const result = evaluateTriage(input);
    expect(result.urgency).toBe("SEEK_CARE_NOW");
    expect(result.reason).toContain("preeclampsia");
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  it("evaluates vaginal bleeding as SEEK_CARE_NOW", () => {
    const input: SymptomInput = {
      symptom: "heavy vaginal bleeding",
      stage: "PREGNANT",
      language: "en",
    };
    const result = evaluateTriage(input);
    expect(result.urgency).toBe("SEEK_CARE_NOW");
  });

  it("evaluates high fever as SEEK_CARE_NOW", () => {
    const input: SymptomInput = {
      symptom: "high fever and chills",
      stage: "POSTPARTUM",
      language: "en",
    };
    const result = evaluateTriage(input);
    expect(result.urgency).toBe("SEEK_CARE_NOW");
  });

  it("evaluates newborn yellow skin as SEEK_CARE_NOW", () => {
    const input: SymptomInput = {
      symptom: "yellow skin and not feeding",
      stage: "NEWBORN",
      language: "en",
    };
    const result = evaluateTriage(input);
    expect(result.urgency).toBe("SEEK_CARE_NOW");
  });

  it("evaluates mild nausea as MONITOR", () => {
    const input: SymptomInput = {
      symptom: "morning sickness nausea",
      stage: "PREGNANT",
      severity: "MILD",
      language: "en",
    };
    const result = evaluateTriage(input);
    expect(result.urgency).toBe("MONITOR");
  });

  it("conservatively escalates unknown symptoms to CONTACT_HEALTH_WORKER", () => {
    const input: SymptomInput = {
      symptom: "mild itching on arm",
      stage: "PREGNANT",
      language: "en",
    };
    const result = evaluateTriage(input);
    expect(result.urgency).toBe("CONTACT_HEALTH_WORKER");
  });

  it("supports Amharic symptom evaluation and response", () => {
    const input: SymptomInput = {
      symptom: "ከፍተኛ ራስ ምታት",
      stage: "PREGNANT",
      language: "am",
    };
    const result = evaluateTriage(input);
    expect(result.urgency).toBe("SEEK_CARE_NOW");
    expect(result.reason).toContain("ራስ ምታት");
  });
});
