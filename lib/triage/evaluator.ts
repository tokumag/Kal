// lib/triage/evaluator.ts
// Pure deterministic triage evaluator for Kalcare.
// Responsibility: PERSON B
// Safety principle: Medical urgency decisions are 100% deterministic rules.

import { SymptomInput, TriageResult } from "../contracts/triage";
import { TRIAGE_RULES } from "./rules";
import { getFallbackResult } from "./fallback";

/**
 * Validates whether an input conforms safely to SymptomInput expectations.
 */
function isValidInput(input: unknown): input is SymptomInput {
  if (!input || typeof input !== "object") return false;
  const candidate = input as Record<string, unknown>;

  if (typeof candidate.symptom !== "string" || candidate.symptom.trim().length === 0) {
    return false;
  }

  const validStages = ["PREGNANT", "POSTPARTUM", "NEWBORN"];
  if (typeof candidate.stage !== "string" || !validStages.includes(candidate.stage)) {
    return false;
  }

  if (
    candidate.severity !== undefined &&
    !["MILD", "MODERATE", "SEVERE", "UNKNOWN"].includes(candidate.severity as string)
  ) {
    return false;
  }

  if (
    candidate.language !== undefined &&
    candidate.language !== "en" &&
    candidate.language !== "am"
  ) {
    return false;
  }

  return true;
}

/**
 * Pure deterministic evaluation of patient symptoms.
 * Given identical inputs, evaluateTriage ALWAYS produces identical results.
 */
export function evaluateTriage(input: SymptomInput): TriageResult {
  const lang = input?.language === "am" ? "am" : "en";

  // Safety check: malformed or empty inputs immediately escalate toward human care
  if (!isValidInput(input)) {
    return getFallbackResult(lang);
  }

  const normalizedInput: SymptomInput = {
    ...input,
    symptom: input.symptom.trim(),
  };

  // Evaluate rules deterministically in priority order
  for (const rule of TRIAGE_RULES) {
    if (rule.matches(normalizedInput)) {
      const reason =
        lang === "am" && rule.amharicReason ? rule.amharicReason : rule.reason;
      const nextAction =
        lang === "am" && rule.amharicNextAction
          ? rule.amharicNextAction
          : rule.nextAction;

      return {
        urgency: rule.urgency,
        reason,
        nextAction,
        evidence: [...rule.evidence],
      };
    }
  }

  // No rule matched — safe escalation to human health worker (never guess or default to MONITOR)
  return getFallbackResult(lang);
}
